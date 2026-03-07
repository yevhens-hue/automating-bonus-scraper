#!/usr/bin/env python3
import os
import json
import sqlite3
import datetime
import random
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "bonuses.db"
OUTPUT_DIR = BASE_DIR.parent / "frontend" / "data" / "blog"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
TOPICS_PATH = BASE_DIR / "config" / "topics.json"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

def check_duplicate_slug(slug):
    """Check if a blog post with the given slug already exists."""
    # Check current directory files
    for file in OUTPUT_DIR.glob("*.json"):
        if slug in file.name:
            return True
    return False

def build_seo_title(topic):
    """Returns a randomized SEO-optimized H1 title for the topic."""
    templates = [
      f"{topic}: Ultimate Guide & Strategies 2026",
      f"{topic}: Expert Tips and Insider Secrets 2026",
      f"{topic}: Tested Methods for Big Wins in 2026",
      f"The Complete Guide to {topic} (2026 Edition)",
      f"Winning Big with {topic}: A 2026 Pro Player's Manual",
      f"Top {topic} Hacks & Strategies for 2026",
      f"Everything You Need to Know About {topic} in 2026",
      f"{topic} 2026: Insights, Reviews, and Success Tips",
      f"Mastering {topic} in 2026: The Definitive Roadmap",
      f"Is {topic} Worth It in 2026? Expert Analysis",
      f"Pro Secrets: {topic} and How to Succeed in 2026",
      f"2026 iGaming Report: Focus on {topic}"
    ]
    return random.choice(templates)

def get_db_data(geo=None):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    query = "SELECT * FROM bonuses WHERE is_active = 1"
    params = []
    if geo:
        query += " AND geo = ?"
        params.append(geo)
    rows = c.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def generate_article(topic, geo_context, bonus_data):
    if not GROQ_API_KEY:
        print("GROQ_API_KEY not found. Skipping article generation.")
        return None

    # Format bonus data for the prompt
    bonus_summary = "\n".join([
        f"- {b['brand_name']}: {b['bonus_title']} ({b['bonus_amount']}). Wagering: {b['wagering'] or 'N/A'}. Rating: {b['rating']}/5"
        for b in bonus_data[:5]
    ])

    seo_title = build_seo_title(topic)

    # Include extra_data if available (VIP tiers, specific events)
    extra_details = ""
    for b in bonus_data[:5]:
        if b.get('extra_data'):
            extra_details += f"\n- Additional detail for {b['brand_name']}: {b['extra_data']}"

    prompt = f"""
    Write a high-quality SEO-optimized blog article in English for an iGaming affiliate site called 'games-income.com'.
    Primary Topic/H1: {seo_title}
    Market Context: {geo_context}
    
    Latest Data to Include:
    {bonus_summary}
    {extra_details}

    Structure requirements:
    1. Introduction: engaging and tailored to the market.
    2. H2 Heading: Industry Insights (mention specific trends, Pragmatic Play, or Aviator).
    3. H2 Heading: Detailed Comparison Table / Tier List.
    4. H2 Heading: Expert Guide on how to maximize value (specific to {topic}).
    5. H3 Heading: Legality and Safety in {geo_context}.
    6. H3 Heading: Frequently Asked Questions.
    7. Conclusion: Strong Call-to-Action.

    Crucial: If the topic is about VIP/Loyalty, focus on the tier requirements and perks. 
    If it's a Holiday/Festival topic, highlight the limited-time nature and deadlines.
    Output should be valid JSON with 'title', 'slug', 'content' (Markdown), and 'date' fields.
    """

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        res_json = response.json()
        return json.loads(res_json['choices'][0]['message']['content'])
    except Exception as e:
        print(f"Error generating article: {e}")
        return None

def generate_match_preview(event):
    """Generate a detailed SEO preview for a specific match."""
    if not GROQ_API_KEY:
        return None

    home = event.get('team_home')
    away = event.get('team_away')
    sport = event.get('sport')
    tournament = event.get('tournament')
    
    prompt = f"""
    Write a high-quality 1000-word SEO match preview for 'games-income.com'.
    Match: {home} vs {away}
    Sport: {sport}
    Tournament: {tournament}
    
    Requirements:
    1. H1: {home} vs {away} Betting Preview: Odds, Tips, and Prediction.
    2. Introduction: Analyze the current form of both teams.
    3. H2: Head-to-Head and Key Stats.
    4. H2: Expert Betting Analysis (Analyze the market odds and value).
    5. H2: Predicted Lineups and Impact Players.
    6. H3: Final Match Prediction and Best Bets.
    7. Conclusion: Call to action to check the latest odds.
    
    Focus on the Indian audience. If it's Cricket, discuss players like Kohli, Rohit, etc. 
    If it's Football, focus on tactical depth.
    Output should be valid JSON with 'title', 'slug', 'content' (Markdown), and 'date' fields.
    """

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {"type": "json_object"}
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        res_json = response.json()
        return json.loads(res_json['choices'][0]['message']['content'])
    except Exception as e:
        print(f"Error generating match preview: {e}")
        return None

def main():
    if not TOPICS_PATH.exists():
        print(f"Error: {TOPICS_PATH} not found.")
        return

    # 1. Generate standard blog posts from topics
    with open(TOPICS_PATH, "r") as f:
        topics_data = json.load(f)
    
    all_topics = topics_data.get("topics", [])
    if not all_topics:
        print("No topics found in config.")
    else:
        # Prioritize Indian topics
        indian_topics = [t for t in all_topics if t.get('geo') == 'IN']
        other_topics = [t for t in all_topics if t.get('geo') != 'IN']
        
        # Take 4 from India, 2 from others
        selected = random.sample(indian_topics, min(4, len(indian_topics))) + \
                   random.sample(other_topics, min(2, len(other_topics)))
        
        for item in selected:
            topic_name = item['title']
            geo = item.get('geo', 'all')
            
            temp_slug = topic_name.lower().replace(" ", "-").replace(":", "").replace("?", "")
            if check_duplicate_slug(temp_slug):
                continue

            bonus_data = get_db_data(geo if geo != 'all' else None)
            result = generate_article(topic_name, geo, bonus_data)
            
            if result:
                date_str = datetime.datetime.now().strftime("%Y-%m-%d")
                slug = result.get('slug', temp_slug)
                filename = f"{date_str}-{slug}.json"
                with open(OUTPUT_DIR / filename, "w") as f:
                    json.dump(result, f, indent=2, ensure_ascii=False)
                print(f"✅ Blog saved: {filename}")

    # 2. Generate Match Previews from odds.json
    ODDS_FILE = BASE_DIR.parent / "frontend" / "data" / "odds.json"
    if ODDS_FILE.exists():
        try:
            with open(ODDS_FILE, "r") as f:
                odds_data = json.load(f)
            
            # Select 2 matches for deeper previews (Priority to Cricket and ISL)
            matches = odds_data.get("events", [])
            priority_matches = [m for m in matches if m.get('sport') == 'Cricket' or m.get('tournament') == 'Indian Premier League']
            
            if not priority_matches:
                priority_matches = matches
                
            selected_matches = random.sample(priority_matches, min(3, len(priority_matches)))
            
            for match in selected_matches:
                print(f"Generating preview: {match['team_home']} vs {match['team_away']}...")
                preview = generate_match_preview(match)
                if preview:
                    date_str = datetime.datetime.now().strftime("%Y-%m-%d")
                    slug = preview.get('slug', f"preview-{match['slug']}")
                    filename = f"preview-{date_str}-{slug}.json"
                    with open(OUTPUT_DIR / filename, "w") as f:
                        json.dump(preview, f, indent=2, ensure_ascii=False)
                    print(f"✅ Match preview saved: {filename}")
        except Exception as e:
            print(f"Error processing odds for previews: {e}")

if __name__ == "__main__":
    main()
