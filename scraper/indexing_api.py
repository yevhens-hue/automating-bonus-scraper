#!/usr/bin/env python3
"""
Google Indexing API — submits all pages (static + blog) to Google for immediate indexing.

Usage:
    python indexing_api.py --all          # indexes all pages (static + blog)
    python indexing_api.py --url URL      # index a single URL
    python indexing_api.py --blog         # blog posts only
"""
import os
import json
import argparse
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent
BLOG_DIR = BASE_DIR.parent / "frontend" / "data" / "blog"
SITE_URL = os.getenv("SITE_URL", "https://games-income.com")

STATIC_PAGES = [
    "",
    "/all-bonuses",
    "/all-bonuses/table",
    "/vip-bonuses",
    "/holiday-bonuses",
    "/blog",
    "/bonuses-by-country",
    "/bonuses-rating",
]

def get_credentials():
    """Load Google service account credentials."""
    creds_path = os.getenv("GOOGLE_CREDENTIALS")
    if not creds_path:
        print("❌  GOOGLE_CREDENTIALS env var not set. Skipping indexing.")
        return None

    try:
        from google.oauth2 import service_account
        scopes = ["https://www.googleapis.com/auth/indexing"]
        creds = service_account.Credentials.from_service_account_file(
            creds_path, scopes=scopes
        )
        return creds
    except ImportError:
        print("⚠️  google-auth not installed. Run: pip install google-auth")
        return None
    except Exception as e:
        print(f"❌  Failed to load credentials: {e}")
        return None

def index_url(url: str, creds) -> bool:
    """Submit a single URL to the Google Indexing API."""
    import urllib.request
    import urllib.error
    from google.auth.transport.requests import Request

    endpoint = "https://indexing.googleapis.com/v3/urlNotifications:publish"
    payload = json.dumps({"url": url, "type": "URL_UPDATED"}).encode("utf-8")

    try:
        if not creds.valid:
            creds.refresh(Request())

        req = urllib.request.Request(
            endpoint,
            data=payload,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {creds.token}",
            },
            method="POST"
        )
        with urllib.request.urlopen(req) as resp:
            resp.read()
            print(f"  ✅  Indexed: {url}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  ❌  HTTP {e.code} for {url}: {body[:200]}")
        return False
    except Exception as e:
        print(f"  ❌  Error indexing {url}: {e}")
        return False

def get_all_blog_urls() -> list:
    """Scan the blog output directory and collect all post URLs."""
    if not BLOG_DIR.exists():
        print(f"⚠️  Blog directory not found: {BLOG_DIR}")
        return []

    urls = []
    for f in sorted(BLOG_DIR.glob("*.json")):
        try:
            post = json.loads(f.read_text())
            slug = post.get("slug")
            if slug:
                urls.append(f"{SITE_URL}/blog/{slug}")
        except Exception:
            pass
    return urls

def get_all_static_urls() -> list:
    """Return all static page URLs."""
    return [f"{SITE_URL}{page}" for page in STATIC_PAGES]

def main():
    parser = argparse.ArgumentParser(description="Submit URLs to Google Indexing API")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--url", help="Single URL to index")
    group.add_argument("--all", action="store_true", help="Index all pages (static + blog)")
    group.add_argument("--blog", action="store_true", help="Index blog posts only")
    group.add_argument("--static", action="store_true", help="Index static pages only")
    args = parser.parse_args()

    creds = get_credentials()
    if not creds:
        return

    if args.url:
        urls = [args.url]
    elif args.all:
        urls = get_all_static_urls() + get_all_blog_urls()
    elif args.blog:
        urls = get_all_blog_urls()
    elif args.static:
        urls = get_all_static_urls()
    else:
        urls = []

    if not urls:
        print("No URLs to index.")
        return

    print(f"\n🔍  Submitting {len(urls)} URL(s) to Google Indexing API...")
    print(f"    Site: {SITE_URL}\n")

    for url in urls:
        index_url(url, creds)

    print(f"\n✨  Done! Submitted {len(urls)} URLs.")

if __name__ == "__main__":
    main()
