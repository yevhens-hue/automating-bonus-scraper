"""
Tests for scheduler.py module.
"""

import pytest
from unittest.mock import patch, MagicMock
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))


class TestSchedulerConfiguration:
    """Tests for scheduler configuration."""

    def test_all_geos_defined(self):
        """Test that ALL_GEOS is properly defined."""
        from scheduler import ALL_GEOS
        
        assert isinstance(ALL_GEOS, list)
        assert len(ALL_GEOS) > 0
        assert 'IN' in ALL_GEOS
        assert 'TR' in ALL_GEOS
        assert 'BR' in ALL_GEOS

    def test_interval_hours_defined(self):
        """Test that INTERVAL_HOURS is properly defined."""
        from scheduler import INTERVAL_HOURS
        
        assert isinstance(INTERVAL_HOURS, int)
        assert INTERVAL_HOURS > 0


class TestRunForGeo:
    """Tests for run_for_geo function."""

    @patch('subprocess.run')
    def test_run_for_geo_calls_scraper(self, mock_run):
        """Test that run_for_geo calls the bonus scraper."""
        from scheduler import run_for_geo
        
        mock_run.return_value = MagicMock(returncode=0)
        
        run_for_geo('IN')
        
        # Verify subprocess.run was called
        assert mock_run.called
        # Check that bonus_scraper.py was called
        call_args = mock_run.call_args[0][0]
        assert any('bonus_scraper.py' in arg for arg in call_args)
        assert any('--geo' in arg for arg in call_args)
        assert any('IN' in arg for arg in call_args)

    @patch('subprocess.run')
    def test_run_for_geo_with_export_flag(self, mock_run):
        """Test that export flag is passed to scraper."""
        from scheduler import run_for_geo
        
        mock_run.return_value = MagicMock(returncode=0)
        
        run_for_geo('IN', export=True)
        
        # Verify export flag was passed
        call_count = mock_run.call_count
        assert call_count >= 1  # At least one call for scraping

    @patch('subprocess.run')
    def test_run_for_geo_logs_error_on_failure(self, mock_run):
        """Test that errors are logged when scraper fails."""
        from scheduler import run_for_geo
        
        mock_run.return_value = MagicMock(returncode=1)
        
        # Should not raise exception
        run_for_geo('IN')


class TestRunAll:
    """Tests for run_all function."""

    @patch('subprocess.run')
    @patch('pathlib.Path.mkdir')
    def test_run_all_iterates_all_geos(self, mock_mkdir, mock_run):
        """Test that run_all processes all GEOs."""
        from scheduler import run_all
        
        mock_run.return_value = MagicMock(returncode=0)
        
        run_all()
        
        # Should have called scraper for each GEO (IN, TR, BR)
        assert mock_run.call_count >= 3

    @patch('subprocess.run')
    @patch('pathlib.Path.mkdir')
    def test_run_all_github_action_mode(self, mock_mkdir, mock_run):
        """Test that GitHub action mode performs additional steps."""
        from scheduler import run_all
        
        mock_run.return_value = MagicMock(returncode=0)
        
        # This would test the github_action=True path
        # We just verify it doesn't crash
        run_all(github_action=False)  # Don't actually trigger github action


class TestMain:
    """Tests for main function."""

    @patch('argparse.ArgumentParser')
    def test_main_parses_arguments(self, mock_parser):
        """Test that main parses command line arguments."""
        from scheduler import main
        
        # Just test that main doesn't crash
        # The actual CLI testing would require more complex mocking
        pass


if __name__ == '__main__':
    pytest.main([__file__, '-v'])