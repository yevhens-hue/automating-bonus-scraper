"""
Tests for odds_scraper.py module.
"""

import json
import pytest
from unittest.mock import patch, MagicMock
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent))


class TestGenerateSlug:
    """Tests for generate_slug function."""

    def test_generate_slug_simple(self):
        """Test generating slug from simple team names."""
        from odds_scraper import generate_slug
        
        slug = generate_slug("Mumbai Indians", "Chennai Super Kings", "Cricket")
        assert "mumbai-indians" in slug
        assert "chennai-super-kings" in slug

    def test_generate_slug_special_chars(self):
        """Test slug generation with special characters."""
        from odds_scraper import generate_slug
        
        slug = generate_slug("Team A & B", "Team C", "Football")
        assert "team-a-b" in slug
        assert "team-c" in slug

    def test_generate_slug_sport_included(self):
        """Test that sport is included in slug."""
        from odds_scraper import generate_slug
        
        slug = generate_slug("Team A", "Team B", "Tennis")
        assert "tennis" in slug


class TestGetActiveAffiliateBrands:
    """Tests for get_active_affiliate_brands function."""

    @patch('odds_scraper.DB_PATH', ':memory:')
    def test_get_brands_empty_db(self):
        """Test that function handles empty database."""
        # Create in-memory database and table
        import sqlite3
        conn = sqlite3.connect(':memory:')
        conn.execute('''
            CREATE TABLE bonuses (
                id INTEGER PRIMARY KEY,
                brand_id TEXT,
                brand_name TEXT,
                affiliate_url TEXT,
                is_active INTEGER DEFAULT 1
            )
        ''')
        
        from odds_scraper import get_active_affiliate_brands
        with patch('sqlite3.connect') as mock_conn:
            mock_conn.return_value = conn
            brands = get_active_affiliate_brands()
            assert isinstance(brands, list)
        conn.close()

    @patch('odds_scraper.DB_PATH', ':memory:')
    def test_get_brands_returns_active_only(self):
        """Test that only active brands are returned."""
        import sqlite3
        conn = sqlite3.connect(':memory:')
        conn.execute('''
            CREATE TABLE bonuses (
                id INTEGER PRIMARY KEY,
                brand_id TEXT,
                brand_name TEXT,
                affiliate_url TEXT,
                is_active INTEGER DEFAULT 1
            )
        ''')
        # Insert test data
        conn.execute('''
            INSERT INTO bonuses (brand_id, brand_name, affiliate_url, is_active)
            VALUES ('brand1', 'Brand 1', 'http://brand1.com', 1)
        ''')
        conn.execute('''
            INSERT INTO bonuses (brand_id, brand_name, affiliate_url, is_active)
            VALUES ('brand2', 'Brand 2', 'http://brand2.com', 0)
        ''')
        conn.commit()
        
        from odds_scraper import get_active_affiliate_brands
        with patch('sqlite3.connect') as mock_conn:
            mock_conn.return_value = conn
            brands = get_active_affiliate_brands()
            # Only active brand should be returned
            assert len(brands) == 1
            assert brands[0]['brand_id'] == 'brand1'
        conn.close()


class TestSportsConfiguration:
    """Tests for sports configuration."""

    def test_sports_to_track_defined(self):
        """Test that SPORTS_TO_TRACK is properly defined."""
        from odds_scraper import SPORTS_TO_TRACK
        
        assert isinstance(SPORTS_TO_TRACK, dict)
        assert len(SPORTS_TO_TRACK) > 0

    def test_cricket_sports_configured(self):
        """Test that cricket sports are properly configured."""
        from odds_scraper import SPORTS_TO_TRACK
        
        # Check for IPL cricket
        assert 'cricket_ipl' in SPORTS_TO_TRACK
        assert SPORTS_TO_TRACK['cricket_ipl']['sport_label'] == 'Cricket'
        assert SPORTS_TO_TRACK['cricket_ipl']['tournament_label'] == 'Indian Premier League'

    def test_soccer_sports_configured(self):
        """Test that soccer sports are properly configured."""
        from odds_scraper import SPORTS_TO_TRACK
        
        assert 'soccer_epl' in SPORTS_TO_TRACK
        assert SPORTS_TO_TRACK['soccer_epl']['sport_label'] == 'Football'
        assert SPORTS_TO_TRACK['soccer_epl']['tournament_label'] == 'Premier League'


class TestOddsAPI:
    """Tests for odds API integration."""

    def test_api_key_loading(self):
        """Test that ODDS_API_KEY can be loaded from environment."""
        # Just check that the variable exists and is a string or None
        from odds_scraper import ODDS_API_KEY
        assert ODDS_API_KEY is None or isinstance(ODDS_API_KEY, str)


class TestFetchOddsForSport:
    """Tests for fetch_odds_for_sport function."""

    @patch('odds_scraper.requests.get')
    def test_fetch_odds_handles_no_api_key(self, mock_get):
        """Test that function handles missing API key gracefully."""
        from odds_scraper import fetch_odds_for_sport
        
        with patch('odds_scraper.ODDS_API_KEY', None):
            result = fetch_odds_for_sport('cricket_ipl', {'sport_label': 'Cricket', 'tournament_label': 'IPL'})
            
            # Should return empty list when no API key
            assert result == []

    @patch('odds_scraper.requests.get')
    def test_fetch_odds_handles_api_error(self, mock_get):
        """Test that function handles API errors gracefully."""
        from odds_scraper import fetch_odds_for_sport
        
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.json.return_value = {'error': 'Server error'}
        mock_get.return_value = mock_response
        
        with patch('odds_scraper.ODDS_API_KEY', 'test_key'):
            result = fetch_odds_for_sport('cricket_ipl', {'sport_label': 'Cricket', 'tournament_label': 'IPL'})
            
            # Should handle error and return empty list
            assert isinstance(result, list)


class TestMapOurBrandsToOdds:
    """Tests for map_our_brands_to_odds function."""

    def test_mapping_with_empty_brands(self):
        """Test mapping with empty brand list."""
        from odds_scraper import map_our_brands_to_odds
        
        events = [
            {
                'id': '1',
                'team_home': 'Team A',
                'team_away': 'Team B',
                'markets': [
                    {
                        'type': 'h2h',
                        'bookmakers': [
                            {'bookmaker_name': 'Bet365', 'odds': {'1': 1.5, '2': 2.5}}
                        ],
                        'outcomes': [{'label': '2', 'best_odd': 2.5, 'brand_name': 'Bet365'}]
                    }
                ]
            }
        ]
        
        result = map_our_brands_to_odds(events, [])
        
        # Should return events unchanged when no brands
        assert len(result) == 1
        assert result[0]['markets'][0]['outcomes'][0]['best_odd'] == 2.5

    def test_mapping_calculates_implied_probability(self):
        """Test that implied probability is calculated."""
        from odds_scraper import map_our_brands_to_odds
        
        events = [
            {
                'id': '1',
                'team_home': 'Team A',
                'team_away': 'Team B',
                'markets': [
                    {
                        'type': 'h2h',
                        'bookmakers': [
                            {'bookmaker_name': 'Bet365', 'odds': {'1': 2.0, '2': 2.0}}
                        ]
                    }
                ]
            }
        ]
        
        result = map_our_brands_to_odds(events, [])
        
        # Implied probability for 2.0/2.0 odds is 100% total
        market = result[0]['markets'][0]
        assert market['bookmakers'][0]['implied_probability'] == 100.0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])