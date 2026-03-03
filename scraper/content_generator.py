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

    prompt = f"""
    Write a high-quality SEO-optimized blog article in English for an iGaming affiliate site called 'games-income.com'.
    Primary Topic/H1: {seo_title}
    Market Context: {geo_context}
    Latest Bonuses to include in a table:
    {bonus_summary}

    Structure requirements (Similar to luckybetvip.com):
    1. Introduction: engaging, keyword-rich, and tailored to the market.
    2. H2 Heading: Industry Insights (mention Pragmatic Play or Aviator as popular choices based on @igaming_inside findings).
    3. H2 Heading: Comparative Bonus Table. (Represented as Markdown table).
    4. H2 Heading: Expert Guide on how to claim and use these bonuses effectively.
    5. H3 Heading: Legality and Safety (mention specific {geo_context} context and licensing).
    6. H3 Heading: Frequently Asked Questions.
    7. Conclusion: Strong Call-to-Action.

    Tone: Professional, expert, data-driven.
    Output should be valid JSON with 'title', 'slug', 'content' (Markdown), and 'date' fields.
    Crucial: The 'slug' should be concise and SEO-friendly (lowercase, no special chars).
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

def main():
    if not TOPICS_PATH.exists():
        print(f"Error: {TOPICS_PATH} not found.")
        return

    with open(TOPICS_PATH, "r") as f:
        topics_data = json.load(f)
    
    all_topics = topics_data.get("topics", [])
    if not all_topics:
        print("No topics found in config.")
        return

    # Pick 2 random topics for today
    selected = random.sample(all_topics, 2)
    
    for item in selected:
        topic_name = item['title']
        geo = item.get('geo', 'all')
        
        # Pre-slug check
        temp_slug = topic_name.lower().replace(" ", "-").replace(":", "").replace("?", "")
        if check_duplicate_slug(temp_slug):
            print(f"⏩ Skipping duplicate: {topic_name}")
            continue

        if geo == 'all':
            geo_name = "Global"
            bonus_data = get_db_data()
        else:
            geo_name = geo
            bonus_data = get_db_data(geo)
            
        print(f"Generating article: {topic_name}...")
        result = generate_article(topic_name, geo_name, bonus_data)
        
        if result:
            date_str = datetime.datetime.now().strftime("%Y-%m-%d")
            # Final slug check from AI result
            slug = result.get('slug', temp_slug)
            if check_duplicate_slug(slug):
                 print(f"⏩ Skipping duplicate AI-slug: {slug}")
                 continue

            filename = f"{date_str}-{slug}.json"
            
            with open(OUTPUT_DIR / filename, "w") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"✅ Article saved: {filename}")

if __name__ == "__main__":
    main()
