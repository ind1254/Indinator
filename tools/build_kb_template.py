"""
Build a KB template (kb.json) with neutral priors P(yes)=0.5 for each (entity, question).
Optionally also emit a flat Beta prior file (beta.json) with alpha=1, beta=1.

Usage:
  python tools/build_kb_template.py \
    --entities data/entities.json \
    --questions data/questions.json \
    --out-kb data/kb.json \
    --out-beta data/beta.json
"""
import argparse
import json
from pathlib import Path

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--entities", required=True)
    ap.add_argument("--questions", required=True)
    ap.add_argument("--out-kb", required=True)
    ap.add_argument("--out-beta", default=None)
    args = ap.parse_args()

    entities = json.load(open(args.entities))["entities"]
    questions = json.load(open(args.questions))["questions"]

    eids = [e["id"] for e in entities]
    qids = [q["id"] for q in questions]

    likelihoods = {}
    beta = {}

    for eid in eids:
        likelihoods[eid] = {str(qid): 0.5 for qid in qids}
        beta[eid] = {str(qid): {"alpha": 1, "beta": 1} for qid in qids}

    Path(args.out_kb).parent.mkdir(parents=True, exist_ok=True)
    json.dump({"version": 1, "likelihoods": likelihoods}, open(args.out_kb, "w"), indent=2)
    print(f"Wrote KB template → {args.out_kb}")

    if args.out_beta:
        json.dump({"version": 1, "beta": beta}, open(args.out_beta, "w"), indent=2)
        print(f"Wrote Beta priors → {args.out_beta}")

if __name__ == "__main__":
    main()