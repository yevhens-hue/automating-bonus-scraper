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
        └── bonus_selectors.json ← CSS selectors ruleset parsing multiple DOM structures
```

## Quick Start
 
**1. Install Dependencies**
```bash
pip3 install -r requirements.txt
```

**2. Configure Environment**
```bash
cp .env.template .env
# Insert your environment keys into .env
```

**3. Test Run (Dry-run mode, no DB write)**
```bash
python3 bonus_scraper.py --geo IN --type casino --dry-run
```

**4. Production Run (Writes to SQLite)**
```bash
python3 bonus_scraper.py --geo IN --type all
```

**5. Export Structured JSON for Frontend**
```bash
python3 bonus_scraper.py --geo IN --export --output output/bonuses_india.json
```

## Scheduler (Automated Pipeline)

**One-time execution for all GEOs:**
```bash
python3 scheduler.py
```

**Continuous loop every 6 hours (for server environments):**
```bash
python3 scheduler.py --loop --export
```

## Managing Target Sources

To add new target providers, edit `config/sites_by_geo.json`:

```json
"DE": {
  "name": "Germany",
  "currency": "EUR",
  "language": "de",
  "casino": [
    {
      "name": "ProviderName",
      "brand_id": "provider_de",
      "bonus_url": "https://www.target-source.de/data",
      "affiliate_url": "https://tracking-link",
      "logo": "https://target-source.de/favicon.ico",
      "rating": 4.5
    }
  ],
  "betting": []
}
```

## Cron Integration (Linux/Mac)

Add to crontab to automate the pipeline without keeping the terminal alive:
```bash
# Run every 6 hours
0 */6 * * * /usr/bin/python3 /path/to/scraper/scheduler.py --export
```

## Downstream API Integration

After exporting `output/bonuses_IN.json`, the payload can be automatically pushed to a REST API or any external webhook:

```python
import requests, json

with open("output/bonuses_IN.json") as f:
    data = json.load(f)

for target in data["bonuses"]:
    requests.post(
        "https://domain.com/wp-json/wp/v2/posts",
        auth=("admin", "your_app_password"),
        json={
            "title": f"{target['brand_name']}: {target['bonus_title']}",
            "content": f"<p>Amount: {target['bonus_amount']}</p>",
            "status": "publish"
        }
    )
```


<!-- activity-sync: 2026-08-28 -->


<!-- activity-sync: 2026-08-28 -->
