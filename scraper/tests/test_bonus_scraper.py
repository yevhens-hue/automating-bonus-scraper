"""
Tests for bonus_scraper.py module.
"""

import json
import sqlite3
import tempfile
import os
from pathlib import Path
import pytest
from unittest.mock import patch, MagicMock

# Import the module under test
import sys
sys.path.insert(0, str(Path(__file__).parent.parent))


class TestInitDB:
    """Tests for init_db function."""

    def test_init_db_creates_table(self, tmp_path):
        """Test that init_db creates the bonuses table."""
        # Create a temporary database
        db_path = tmp_path / "test.db"
        
        # Patch the DB_PATH before importing
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db
            init_db()
            
            # Verify table exists
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='bonuses'
            """)
            result = cursor.fetchone()
            conn.close()
            
            assert result is not None, "bonuses table should be created"
            assert result[0] == "bonuses"

    def test_init_db_creates_columns(self, tmp_path):
        """Test that init_db creates all required columns."""
        db_path = tmp_path / "test.db"
        
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db
            init_db()
            
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(bonuses)")
            columns = {row[1] for row in cursor.fetchall()}
            conn.close()
            
            # Check for required columns
            required_columns = {
                'id', 'geo', 'type', 'brand_id', 'brand_name',
                'bonus_title', 'bonus_amount', 'bonus_type',
                'wagering', 'conditions', 'affiliate_url',
                'logo_url', 'rating', 'is_active', 'scraped_at',
                'expires_at', 'featured_providers', 'extra_data'
            }
            assert required_columns.issubset(columns), f"Missing columns: {required_columns - columns}"


class TestSaveBonuses:
    """Tests for save_bonuses function."""

    def test_save_bonuses_empty_list(self, tmp_path):
        """Test that save_bonuses handles empty list gracefully."""
        db_path = tmp_path / "test.db"
        
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db, save_bonuses
            init_db()
            
            # Should not raise an error
            save_bonuses([])
            
            # Verify no rows were inserted
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM bonuses")
            count = cursor.fetchone()[0]
            conn.close()
            
            assert count == 0

    def test_save_bonuses_inserts_data(self, tmp_path):
        """Test that save_bonuses inserts data correctly."""
        db_path = tmp_path / "test.db"
        
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db, save_bonuses
            init_db()
            
            bonuses = [
                {
                    "geo": "IN",
                    "type": "casino",
                    "brand_id": "brand1",
                    "brand_name": "Test Brand",
                    "bonus_title": "Welcome Bonus",
                    "bonus_amount": "100% up to $1000",
                    "bonus_type": "welcome",
                    "wagering": "30x",
                    "conditions": "Min deposit $10",
                    "affiliate_url": "http://example.com",
                    "logo_url": "http://logo.com/logo.png",
                    "rating": 4.5
                }
            ]
            
            save_bonuses(bonuses)
            
            # Verify data was inserted
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT brand_name, bonus_title, rating FROM bonuses")
            row = cursor.fetchone()
            conn.close()
            
            assert row is not None
            assert row[0] == "Test Brand"
            assert row[1] == "Welcome Bonus"
            assert row[2] == 4.5

    def test_save_bonuses_replaces_existing(self, tmp_path):
        """Test that save_bonuses replaces existing data for same brand+geo."""
        db_path = tmp_path / "test.db"
        
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db, save_bonuses
            init_db()
            
            # Insert first bonus
            bonuses1 = [
                {
                    "geo": "IN",
                    "type": "casino",
                    "brand_id": "brand1",
                    "brand_name": "Test Brand",
                    "bonus_title": "Old Bonus",
                    "bonus_amount": "$100",
                    "bonus_type": "welcome",
                    "wagering": "20x",
                    "conditions": "T&C1",
                    "affiliate_url": "http://example.com",
                    "logo_url": "http://logo.com",
                    "rating": 4.0
                }
            ]
            save_bonuses(bonuses1)
            
            # Insert second bonus with same brand_id, geo, type
            bonuses2 = [
                {
                    "geo": "IN",
                    "type": "casino",
                    "brand_id": "brand1",
                    "brand_name": "Test Brand",
                    "bonus_title": "New Bonus",
                    "bonus_amount": "$200",
                    "bonus_type": "welcome",
                    "wagering": "30x",
                    "conditions": "T&C2",
                    "affiliate_url": "http://example.com",
                    "logo_url": "http://logo.com",
                    "rating": 4.5
                }
            ]
            save_bonuses(bonuses2)
            
            # Verify only one record exists with new data
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM bonuses WHERE brand_id='brand1'")
            count = cursor.fetchone()[0]
            cursor.execute("SELECT bonus_title FROM bonuses WHERE brand_id='brand1'")
            title = cursor.fetchone()[0]
            conn.close()
            
            assert count == 1
            assert title == "New Bonus"


class TestParseBonusAmount:
    """Tests for bonus amount parsing."""

    def test_parse_percentage(self):
        """Test parsing percentage bonus amounts."""
        # Import the function
        from bonus_scraper import parse_bonus_amount
        
        # Test percentage parsing
        assert parse_bonus_amount("100% up to $500") == "100% up to $500"
        assert parse_bonus_amount("200%") == "200%"

    def test_parse_fixed_amount(self):
        """Test parsing fixed bonus amounts."""
        from bonus_scraper import parse_bonus_amount
        
        assert parse_bonus_amount("$100 Free") == "$100 Free"
        assert parse_bonus_amount("₹10,000") == "₹10,000"


class TestScrapeLogic:
    """Tests for scraping logic functions."""

    def test_selector_loading(self):
        """Test that bonus selectors are loaded correctly."""
        from bonus_scraper import BONUS_SELECTORS
        
        assert isinstance(BONUS_SELECTORS, dict)
        assert 'bonus_amount' in BONUS_SELECTORS
        assert 'bonus_title' in BONUS_SELECTORS

    def test_sites_by_geo_loading(self):
        """Test that sites by GEO are loaded correctly."""
        from bonus_scraper import SITES_BY_GEO
        
        assert isinstance(SITES_BY_GEO, dict)
        # Should have at least some GEOs configured
        assert len(SITES_BY_GEO) > 0


class TestExportJSON:
    """Tests for JSON export functionality."""

    def test_export_json_format(self, tmp_path):
        """Test that export produces valid JSON format."""
        db_path = tmp_path / "test.db"
        output_path = tmp_path / "output.json"
        
        with patch('bonus_scraper.DB_PATH', db_path):
            from bonus_scraper import init_db, save_bonuses, export_json
            init_db()
            
            bonuses = [
                {
                    "geo": "IN",
                    "type": "casino",
                    "brand_id": "brand1",
                    "brand_name": "Test Brand",
                    "bonus_title": "Welcome Bonus",
                    "bonus_amount": "$1000",
                    "bonus_type": "welcome",
                    "wagering": "30x",
                    "conditions": "T&C",
                    "affiliate_url": "http://test.com",
                    "logo_url": "http://logo.com",
                    "rating": 4.5
                }
            ]
            save_bonuses(bonuses)
            
            export_json(str(output_path))
            
            # Verify JSON is valid
            with open(output_path, 'r') as f:
                data = json.load(f)
            
            assert 'bonuses' in data
            assert len(data['bonuses']) > 0
            assert data['bonuses'][0]['brand_name'] == "Test Brand"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])