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
pip3 install -r requirements.txt
cp .env.template .env
# Insert your environment keys into .env
python3 bonus_scraper.py --geo IN --type casino --dry-run
python3 bonus_scraper.py --geo IN --type all
python3 bonus_scraper.py --geo IN --export --output output/bonuses_india.json
python3 scheduler.py
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
# Run every 6 hours
0 */6 * * * /usr/bin/python3 /path/to/scraper/scheduler.py --export
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
