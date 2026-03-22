#!/usr/bin/env python3
"""
Scheduler for games-income.com bonus scraper.
Runs the scraper for all configured GEOs every N hours.

Usage:
    python scheduler.py              # Run once for all GEOs
    python scheduler.py --loop       # Run in loop every 6 hours
    python scheduler.py --export     # Export JSON after scraping
"""

import time
import argparse
import subprocess
import sys
from pathlib import Path
import logging

# Настроить логирование
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# All GEOs to scrape
ALL_GEOS = ["IN", "TR", "BR"]
INTERVAL_HOURS = 6


def run_for_geo(geo: str, export: bool = False, sheets: bool = False, clear_sheets: bool = False):
    """Run the scraper for a given GEO."""
    logger.info(f"\n{'='*50}")
    logger.info(f"🌍 Starting scrape for GEO: {geo}")
    logger.info(f"{'='*50}")
    cmd = [sys.executable, str(Path(__file__).parent / "bonus_scraper.py"),
           "--geo", geo, "--type", "all"]
    if sheets:
        cmd.append("--sheets")
    if clear_sheets:
        cmd.append("--clear-sheets")
        
    result = subprocess.run(cmd, capture_output=False)
    if result.returncode != 0:
        logger.error(f"❌ Scraper failed for {geo}")
        return

    if export:
        # Export casino bonuses
        export_cmd = [sys.executable, str(Path(__file__).parent / "bonus_scraper.py"),
                      "--geo", geo, "--export",
                      "--output", f"output/bonuses_{geo.lower()}.json"]
        subprocess.run(export_cmd, capture_output=False)

    logger.info(f"✅ GEO {geo} complete.")


def run_all(export: bool = False, sheets: bool = False, clear_sheets: bool = False, github_action: bool = False):
    """Run scraper for all GEOs sequentially."""
    from pathlib import Path
    Path("output").mkdir(exist_ok=True)

    all_collected = []
    
    for geo in ALL_GEOS:
        try:
            run_for_geo(geo, export=export, sheets=sheets, clear_sheets=clear_sheets)
        except Exception as e:
            logger.warning(f"⚠️ Error processing {geo}: {e}")
        time.sleep(2)  # Brief pause between GEOs
        
    if github_action:
        logger.info("\n🚀 GitHub Action Mode: Consolidating data...")
        # Import bonus_scraper here to avoid circular imports if any
        from bonus_scraper import get_bonuses, export_json_api
        
        # Consolidated export for the frontend
        frontend_data_path = Path(__file__).parent.parent / "frontend" / "data" / "bonuses.json"
        export_json_api(output_file=str(frontend_data_path))
        logger.info(f"✨ Consolidated data exported to {frontend_data_path}")

        # Update Top Odds
        logger.info("\n📈 Fetching Live Odds from The-Odds-API...")
        odds_cmd = [sys.executable, str(Path(__file__).parent / "odds_scraper.py")]
        subprocess.run(odds_cmd, capture_output=False, check=True)
        logger.info("✨ Odds updated.")

        # Run SEO content generator
        logger.info("\n✍️ Generating AI Blog Content...")
        gen_cmd = [sys.executable, str(Path(__file__).parent / "content_generator.py")]
        subprocess.run(gen_cmd, capture_output=False, check=True)
        logger.info("✨ Blog articles generated.")

        # Submit new articles to Google Indexing API
        logger.info("\n🔎 Submitting new blog posts to Google Indexing API...")
        idx_cmd = [sys.executable, str(Path(__file__).parent / "indexing_api.py"), "--all"]
        subprocess.run(idx_cmd, capture_output=False, check=True)
        logger.info("✨ Indexing requests sent.")

    logger.info(f"\n🎉 All GEOs scraped successfully!")


def main():
    parser = argparse.ArgumentParser(description="Bonus Scraper Scheduler")
    parser.add_argument("--loop",   action="store_true", help=f"Loop every {INTERVAL_HOURS} hours")
    parser.add_argument("--export", action="store_true", help="Export JSON after each run")
    parser.add_argument("--sheets", action="store_true", help="Export to Google Sheets")
    parser.add_argument("--clear-sheets", action="store_true", help="Clear sheets before export")
    parser.add_argument("--github-action", action="store_true", help="Run full cycle for GitHub Actions")
    parser.add_argument("--geo",    default=None, help="Single GEO to run (default: all)")
    args = parser.parse_args()

    if args.github_action:
        run_all(export=False, github_action=True)
    elif args.loop:
        logger.info(f"⏰ Scheduler started. Running every {INTERVAL_HOURS} hours.")
        while True:
            if args.geo:
                run_for_geo(args.geo.upper(), export=args.export, sheets=args.sheets, clear_sheets=args.clear_sheets)
            else:
                run_all(export=args.export, sheets=args.sheets, clear_sheets=args.clear_sheets)
                
            # Run odds scraper in the background loop too
            logger.info("\n📈 Fetching Live Odds...")
            subprocess.run([sys.executable, str(Path(__file__).parent / "odds_scraper.py")], capture_output=False)
            logger.info(f"\n💤 Next run in {INTERVAL_HOURS} hours...")
            time.sleep(INTERVAL_HOURS * 3600)
    else:
        if args.geo:
            run_for_geo(args.geo.upper(), export=args.export, sheets=args.sheets, clear_sheets=args.clear_sheets)
        else:
            run_all(export=args.export, sheets=args.sheets, clear_sheets=args.clear_sheets)


if __name__ == "__main__":
    main()
