import os
import sys
import json
import random
import sqlite3
import requests
import re
from datetime import datetime, timezone
from dotenv import load_dotenv

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

ODDS_API_KEY = os.getenv("ODDS_API_KEY")
DB_PATH = os.path.join(os.path.dirname(__file__), "bonuses.db")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "frontend", "data", "odds.json")

# Define the sports we want to track
# Format: id from the-odds-api
SPORTS_TO_TRACK = {
    "soccer_uefa_champs_league": {
        "sport_label": "Football",
        "tournament_label": "UEFA Champions League"
    },
    "cricket_ipl": {
        "sport_label": "Cricket",
        "tournament_label": "Indian Premier League"
    },
    "esports_csgo_major": {
        "sport_label": "Esports CS2",
        "tournament_label": "CS2 Major"
    },
    "basketball_nba": {
        "sport_label": "Basketball",
        "tournament_label": "NBA"
    }
}

def generate_slug(home_team, away_team, sport_label):
    """Generate a clean, URL-friendly slug based on teams and sport."""
    raw = f"{home_team} vs {away_team} {sport_label}"
    # Convert to lowercase and replace non-alphanumeric with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', raw.lower()).strip('-')
    return slug

def get_active_affiliate_brands():
    """Fetch all unique active brands and their affiliate URLs from the database."""
    if not os.path.exists(DB_PATH):
        print(f"❌ Database not found at {DB_PATH}")
        return []
        
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    # We group by brand_name to avoid duplicates if a brand is in multiple geos
    c.execute("""
        SELECT brand_id, brand_name, affiliate_url 
        FROM bonuses 
        WHERE is_active = 1 
        GROUP BY brand_name
        HAVING affiliate_url IS NOT NULL
             AND affiliate_url != ''
    """)
    brands = [dict(row) for row in c.fetchall()]
    conn.close()
    return brands


def fetch_odds_for_sport(sport_key, config):
    """Fetch matches and odds for a specific sport from The-Odds-API."""
    print(f"📡 Fetching {sport_key}...")
    url = f"https://api.the-odds-api.com/v4/sports/{sport_key}/odds"
    
    params = {
        "apiKey": ODDS_API_KEY,
        "regions": "eu,uk", # Fetching from EU and UK for good baseline odds
        "markets": "h2h",   # Head to head (Match Winner / 1X2)
        "oddsFormat": "decimal"
    }
    
    response = requests.get(url, params=params)
    
    if response.status_code != 200:
        print(f"⚠️ Failed to fetch {sport_key}: {response.text}")
        return []
        
    data = response.json()
    events = []
    
    # Process each match
    for match in data:
        start_time = match.get("commence_time")
        
        if not match.get("bookmakers"):
            continue
            
        home_team = match.get("home_team")
        away_team = match.get("away_team")
        slug = generate_slug(home_team, away_team, config["sport_label"])
        
        # Track both the ABSOLUTE best odds (for the main card) 
        # and ALL bookmakers (for the match page table)
        best_odds_map = {}
        all_bookmakers = []

        for bookmaker in match["bookmakers"]:
            bookmaker_name = bookmaker.get("title")
            bm_odds = {}

            for market in bookmaker.get("markets", []):
                if market["key"] == "h2h":
                    for outcome in market.get("outcomes", []):
                        name = outcome["name"]
                        price = outcome["price"]
                        
                        # Map outcome name to '1', 'X', '2'
                        label = name
                        if name == home_team:
                            label = "1"
                        elif name == away_team:
                            label = "2"
                        elif name.lower() == "draw":
                            label = "X"
                        else:
                            label = "1" if name == home_team else "2"
                            
                        bm_odds[label] = price

                        # Keep track of the highest price found globally
                        if label not in best_odds_map or price > best_odds_map[label]["best_odd"]:
                            best_odds_map[label] = {
                                "label": label,
                                "best_odd": price
                            }
            
            # If this bookmaker offered h2h odds, add them to our comprehensive list
            if bm_odds:
                implied_prob = sum([1.0/price for price in bm_odds.values()])
                
                all_bookmakers.append({
                    "brand_id": bookmaker_name, # Temporary, replaced later
                    "brand_name": bookmaker_name,
                    "affiliate_url": "",
                    "odds": bm_odds,
                    "implied_probability": implied_prob
                })
        
        if not best_odds_map or not all_bookmakers:
            continue
            
        # Compile top outcomes
        outcomes = []
        for label, details in best_odds_map.items():
            outcomes.append(details)
            
        # Sort outcomes logically: 1, X, 2
        sort_order = {"1": 0, "X": 1, "2": 2}
        outcomes.sort(key=lambda x: sort_order.get(x["label"], 99))
        
        event = {
            "id": match["id"],
            "slug": slug,
            "sport": config["sport_label"],
            "tournament": config["tournament_label"],
            "team_home": home_team,
            "team_away": away_team,
            "start_time": start_time,
            "is_live": False, 
            "markets": [
                {
                    "type": "Match Winner (1X2)" if "X" in best_odds_map else "Match Winner",
                    "outcomes": outcomes,
                    "bookmakers": all_bookmakers
                }
            ]
        }
        events.append(event)
        
        if len(events) >= 5: # Limit to 5 top matches per sport
            break
            
    return events


def map_our_brands_to_odds(events, our_brands):
    """
    Takes the real odds data, and replaces the bookmaker names 
    with OUR tracked affiliate brands to monetize the traffic.
    """
    if not our_brands:
        print("⚠️ No brands found in database. Using placeholder brands.")
        our_brands = [
            {"brand_id": "1", "brand_name": "DemoCasino", "affiliate_url": "#"},
            {"brand_id": "2", "brand_name": "TestBet", "affiliate_url": "#"}
        ]
        
    for event in events:
        for market in event.get("markets", []):
            available_brands = list(our_brands)
            random.shuffle(available_brands)
            
            # Map top outcomes (for the summary card)
            for outcome in market.get("outcomes", []):
                selected_brand = available_brands.pop(0) if available_brands else random.choice(our_brands)
                outcome["brand_id"] = selected_brand["brand_id"]
                outcome["brand_name"] = selected_brand["brand_name"]
                outcome["affiliate_url"] = selected_brand["affiliate_url"]
            
            # Re-shuffle for the full bookmaker list so it looks varied
            available_brands = list(our_brands)
            random.shuffle(available_brands)

            # Map the comprehensive bookmaker list (for the tables)
            for bm in market.get("bookmakers", []):
                selected_brand = available_brands.pop(0) if available_brands else random.choice(our_brands)
                bm["brand_id"] = selected_brand["brand_id"]
                bm["brand_name"] = selected_brand["brand_name"]
                bm["affiliate_url"] = selected_brand["affiliate_url"]
                
    return events


def main():
    print("🚀 Starting Automated Odds Scraper...")
    
    if not ODDS_API_KEY:
        print("❌ ERROR: ODDS_API_KEY is not set in scraper/.env")
        print("Please register at https://the-odds-api.com/ to get a free API key.")
        print("Add it to scraper/.env like: ODDS_API_KEY=your_key")
        sys.exit(1)
        
    our_brands = get_active_affiliate_brands()
    print(f"✅ Found {len(our_brands)} active affiliate brands in DB.")
    
    all_events = []
    
    for sport_key, config in SPORTS_TO_TRACK.items():
        events = fetch_odds_for_sport(sport_key, config)
        if events:
            all_events.extend(events)
            
    if not all_events:
        print("⚠️ No events found across any tracked sports.")
        sys.exit(0)
        
    print(f"✅ Fetched {len(all_events)} total matches.")
    
    # Map to our brands
    mapped_events = map_our_brands_to_odds(all_events, our_brands)
    
    # Build final JSON
    output_data = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "events": mapped_events
    }
    
    # Save to frontend
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
        
    print(f"🎉 Success! Wrote {len(mapped_events)} events to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
