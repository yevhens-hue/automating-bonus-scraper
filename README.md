# Geo-Targeted Data Aggregation Pipeline

A robust, geo-targeted web scraping and data aggregation engine built to extract, normalize, and export structured data from various external public providers.

## Project Structure

```text
games-income/
└── scraper/
    ├── bonus_scraper.py     ← Core engine: parses external data, stores in SQLite
    ├── scheduler.py         ← Task Manager: triggers extraction on a schedule
    ├── requirements.txt     ← Python dependencies
    ├── .env.template        ← Config template (copy to .env)
    ├── bonuses.db           ← Main SQLite database (auto-generated)
    ├── output/              ← Structured JSON exports (auto-generated)
    └── config/
        ├── sites_by_geo.json    ← Target sources categorized by GEO (IN, TR, BR, etc.)
        └── bonus_selectors.json ← CSS selectors ruleset for parsing multiple DOM structures
