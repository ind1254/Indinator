"""
Fetch Ultimate Marvel character pages via the Wikipedia MediaWiki API and
emit a clean entities.json for Indinator.

Usage:
  python tools/scrape_ultimate_marvel.py \
    --max 300 \
    --out data/entities.json

Notes:
- Avoids HTML scraping (and 403s) by using the API.
- Traverses Category:Ultimate Marvel characters and its subcategories (depth 2).
- Creates stable numeric IDs starting at 1001.
- Set USER_AGENT to a string that identifies your project + a contact email
  (per Wikipedia API etiquette).
"""
import argparse
import json
import time
from collections import deque
from pathlib import Path
from typing import Dict, List, Set

import requests
from unidecode import unidecode

API = "https://en.wikipedia.org/w/api.php"

# 👇 IMPORTANT: put a real contact email or GitHub repo URL here
USER_AGENT = "Indinator/0.1 (CS3346 project; contact: your_email@example.com)"

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": USER_AGENT})

def api_get(params: Dict) -> Dict:
    """Call MediaWiki API with continuation handling."""
    params = {**params, "format": "json", "formatversion": "2"}
    out = {}
    while True:
        resp = SESSION.get(API, params=params, timeout=30)
        if resp.status_code == 403:
            raise SystemExit(
                "HTTP 403 from Wikipedia API. "
                "Set USER_AGENT in the script to include a contact email."
            )
        resp.raise_for_status()
        data = resp.json()
        # Merge top-level keys (only safe ones)
        for k, v in data.items():
            if k in ("continue", "batchcomplete"):
                continue
            if k not in out:
                out[k] = v
            else:
                # Append list results if needed
                if isinstance(out[k], list) and isinstance(v, list):
                    out[k].extend(v)
                else:
                    out[k] = v
        if "continue" not in data:
            break
        params.update(data["continue"])
        time.sleep(0.1)  # be polite
    return out

def clean_title(title: str) -> str:
    """
    Convert Wikipedia page title to a display name:
    - Decode accents
    - Replace underscores, trim whitespace
    - Keep suffixes; do NOT drop disambiguators by default (e.g., '(Ultimate Marvel character)')
    """
    t = unidecode(title.replace("_", " ").strip())
    # Wikipedia title case is already good; don't force Title Case.
    return t

def fetch_category_members(root_category: str, depth: int = 2, limit: int | None = None) -> List[str]:
    """
    BFS over categories up to 'depth'; collect page titles in namespace 0 (articles).
    """
    seen_cats: Set[str] = set()
    pages: Set[str] = set()

    q = deque([(root_category, 0)])
    while q:
        cat, d = q.popleft()
        if cat in seen_cats:
            continue
        seen_cats.add(cat)

        # Get members of this category (pages + subcats)
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": cat,
            "cmnamespace": "0|14",  # 0=article (pages), 14=category
            "cmtype": "page|subcat",
            "cmlimit": "max",
        }
        data = api_get(params)
        members = data.get("query", {}).get("categorymembers", [])
        for m in members:
            ns = m.get("ns")
            title = m.get("title", "")
            if ns == 0:  # article -> character page
                pages.add(title)
                if limit and len(pages) >= limit:
                    return sorted(pages)
            elif ns == 14 and d < depth:  # subcategory
                q.append((title, d + 1))

    return sorted(pages)

def to_entities_json(titles: List[str]) -> Dict:
    base_id = 1001
    entities = []
    for i, title in enumerate(titles):
        eid = str(base_id + i)
        entities.append({
            "id": eid,
            "name": clean_title(title),
            "franchise": "Ultimate Marvel",
            "meta": {
                "source": "Wikipedia",
                "universe": "Marvel",
                "list": "Ultimate",
                "wikipedia_title": title
            }
        })
    return {"version": 1, "entities": entities}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="Category:Ultimate Marvel characters",
                    help="Root category to traverse")
    ap.add_argument("--depth", type=int, default=2, help="Subcategory depth to traverse")
    ap.add_argument("--max", type=int, default=300, help="Max pages to collect (None for all)")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    titles = fetch_category_members(args.root, depth=args.depth, limit=args.max)
    data = to_entities_json(titles)

    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(data['entities'])} entities → {args.out}")

if __name__ == "__main__":
    main()