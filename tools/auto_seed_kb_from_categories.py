"""
Auto-seed kb.json for a few questions using Wikipedia categories.

Maps:
- Q3: "Is the character part of the X-Men?"        -> categories containing "Ultimate X-Men"
- Q4: "Is the character part of the Ultimates?"    -> categories containing "Ultimates"
- Q6: "Is the character a mutant?"                  -> categories containing "Mutants"

Usage:
  python tools/auto_seed_kb_from_categories.py \
    --entities data/entities.json \
    --kb-in data/kb.json \
    --kb-out data/kb.json
"""
import argparse, json, time, sys
import requests

API = "https://en.wikipedia.org/w/api.php"
USER_AGENT = "Indinator/0.1 (class project; contact: your_email@example.com)"

TARGETS = {
    "1": {"needles": ["superheroes", "superhero", "vigilantes"], "pos": 0.95, "neg": 0.05},   # hero
    "2": {"needles": ["superhuman", "metahuman", "mutants"], "pos": 0.95, "neg": 0.5},        # superhuman abilities (weak proxy)
    "3": {"needles": ["ultimate x-men"], "pos": 0.95, "neg": 0.05},                            # x-men
    "4": {"needles": ["ultimates"], "pos": 0.95, "neg": 0.05},                                 # ultimates
    "5": {"needles": ["mutants"], "pos": 0.05, "neg": 0.5},                                    # human (inverse of mutant; keep neutral if unknown)
    "6": {"needles": ["mutants"], "pos": 0.95, "neg": 0.05},                                   # mutant
    "7": {"needles": ["supervillains", "villains"], "pos": 0.95, "neg": 0.05},                 # villain
    "8": {"needles": ["armored superheroes", "powered exoskeleton", "powered armor", "inventors"], "pos": 0.95, "neg": 0.5},  # tech/armor
    "9": {"needles": ["founding members", "founders"], "pos": 0.95, "neg": 0.5}               # founding member (weak)
}

def assign_value(qcfg, cats_lower: list[str]):
    text = " ".join(cats_lower)
    return qcfg["pos"] if any(nd in text for nd in qcfg["needles"]) else qcfg["neg"]

def page_categories(title: str) -> list[str]:
    params = {
        "action": "query",
        "prop": "categories",
        "cllimit": "max",
        "titles": title,
        "format": "json",
        "formatversion": "2",
    }
    r = requests.get(API, params=params, headers={"User-Agent": USER_AGENT}, timeout=30)
    r.raise_for_status()
    js = r.json()
    pages = js.get("query", {}).get("pages", [])
    if not pages:
        return []
    cats = pages[0].get("categories", []) or []
    return [c["title"].lower() for c in cats]

def hit(cats: list[str], needles: list[str]) -> bool:
    c = " ".join(cats)
    return any(n in c for n in needles)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--entities", required=True)
    ap.add_argument("--kb-in", required=True)
    ap.add_argument("--kb-out", required=True)
    args = ap.parse_args()

    entities = json.load(open(args.entities))["entities"]
    kb = json.load(open(args.kb_in))
    like = kb["likelihoods"]

    for e in entities:
        eid = e["id"]
        title = e.get("meta", {}).get("wikipedia_title", e["name"])
        try:
            cats = page_categories(title)
        except Exception as ex:
            print(f"[warn] {title}: {ex}", file=sys.stderr)
            cats = []

        for qid, qcfg in TARGETS.items():
            like.setdefault(eid, {})
            like[eid][qid] = assign_value(qcfg, cats)

        time.sleep(0.1)  # be polite

    json.dump(kb, open(args.kb_out, "w"), indent=2)
    print(f"Seeded KB for questions {list(TARGETS.keys())} → {args.kb_out}")

if __name__ == "__main__":
    main()