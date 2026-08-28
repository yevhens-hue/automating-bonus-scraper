"""
Tests for indexing_api.py module.
"""

import pytest
from unittest.mock import patch, MagicMock, mock_open
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))


class TestStaticPages:
    """Tests for static pages configuration."""

    def test_static_pages_defined(self):
        """Test that STATIC_PAGES is properly defined."""
        from indexing_api import STATIC_PAGES
        
        assert isinstance(STATIC_PAGES, list)
        assert len(STATIC_PAGES) > 0
        assert '' in STATIC_PAGES  # Home page
        assert '/all-bonuses' in STATIC_PAGES
        assert '/vip-bonuses' in STATIC_PAGES


class TestGetCredentials:
    """Tests for get_credentials function."""

    @patch('os.getenv')
    def test_get_credentials_no_env_var(self, mock_getenv):
        """Test that credentials returns None when env var is missing."""
        mock_getenv.return_value = None
        
        from indexing_api import get_credentials
        result = get_credentials()
        
        assert result is None

    @patch('os.getenv')
    def test_get_credentials_missing_file(self, mock_getenv):
        """Test handling of missing credentials file."""
        mock_getenv.return_value = '/nonexistent/path.json'
        
        from indexing_api import get_credentials
        result = get_credentials()
        
        # Should return None when file doesn't exist
        assert result is None


class TestIndexUrl:
    """Tests for index_url function."""

    @patch('google.auth.transport.requests.Request')
    @patch('urllib.request.urlopen')
    def test_index_url_success(self, mock_urlopen, mock_request):
        """Test successful URL indexing."""
        mock_creds = MagicMock()
        mock_creds.valid = True
        mock_creds.token = 'test_token'
        
        mock_response = MagicMock()
        mock_response.read.return_value = b'{}'
        mock_urlopen.return_value.__enter__ = MagicMock(return_value=mock_response)
        mock_urlopen.return_value.__exit__ = MagicMock(return_value=False)
        
        from indexing_api import index_url
        result = index_url('http://test.com', mock_creds)
        
        assert result is True

    @patch('google.auth.transport.requests.Request')
    @patch('urllib.request.urlopen')
    def test_index_url_http_error(self, mock_urlopen, mock_request):
        """Test handling of HTTP errors."""
        import urllib.error
        
        mock_creds = MagicMock()
        mock_creds.valid = True
        mock_creds.token = 'test_token'
        
        mock_error = urllib.error.HTTPError(
            url='http://test.com',
            code=403,
            msg='Forbidden',
            hdrs={},
            fp=MagicMock()
        )
        mock_error.read = MagicMock(return_value=b'{"error": "Forbidden"}')
        mock_urlopen.side_effect = mock_error
        
        from indexing_api import index_url
        result = index_url('http://test.com', mock_creds)
        
        assert result is False


class TestGetAllBlogUrls:
    """Tests for get_all_blog_urls function."""

    @patch('pathlib.Path.exists')
    def test_get_all_blog_urls_no_directory(self, mock_exists):
        """Test handling when blog directory doesn't exist."""
        mock_exists.return_value = False
        
        from indexing_api import get_all_blog_urls
        result = get_all_blog_urls()
        
        assert result == []

    @patch('pathlib.Path.glob')
    @patch('pathlib.Path.exists')
    def test_get_all_blog_urls_with_files(self, mock_exists, mock_glob):
        """Test getting URLs from blog files."""
        mock_exists.return_value = True
        
        # Mock glob to return a list of Path objects
        mock_file = MagicMock()
        mock_file.read_text.return_value = '{"slug": "test-post"}'
        mock_glob.return_value = [mock_file]
        
        from indexing_api import get_all_blog_urls
        result = get_all_blog_urls()
        
        assert isinstance(result, list)
        assert len(result) == 1
        assert "test-post" in result[0]


class TestGetAllStaticUrls:
    """Tests for get_all_static_urls function."""

    def test_get_all_static_urls_returns_list(self):
        """Test that get_all_static_urls returns a list of URLs."""
        from indexing_api import get_all_static_urls, SITE_URL
        
        urls = get_all_static_urls()
        
        assert isinstance(urls, list)
        assert len(urls) > 0
        
        # All URLs should start with SITE_URL
        for url in urls:
            assert url.startswith(SITE_URL)


class TestSiteUrl:
    """Tests for SITE_URL configuration."""

    def test_site_url_default(self):
        """Test that SITE_URL has a default value."""
        from indexing_api import SITE_URL
        
        assert isinstance(SITE_URL, str)
        assert 'games-income.com' in SITE_URL


if __name__ == '__main__':
    pytest.main([__file__, '-v'])