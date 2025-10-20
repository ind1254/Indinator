from indinator.kb_store import KBStore
from indinator.engine import Engine
from indinator.selection import select_next_question
from indinator.config import MAX_QUESTIONS, ANSWER_SET

QUESTIONS = "data/questions.json"
ENTITIES  = "data/entities.json"
KB        = "data/kb.json"

SHORTCUTS = {
    "y": "yes",
    "n": "no",
    "p": "probably",
    "pn": "probably_not",
    "u": "unknown"
}

def normalize_answer(s: str) -> str:
    s = (s or "").strip().lower()
    if s in SHORTCUTS:
        return SHORTCUTS[s]
    # allow common variants
    if s in {"maybe"}:
        return "probably"
    if s in ANSWER_SET:
        return s
    return "unknown"

def main():
    kb = KBStore(QUESTIONS, ENTITIES, KB)
    id_to_name = {e["id"]: e["name"] for e in kb.entities}
    eng = Engine(kb.all_entities(), kb.all_questions(), kb.likelihood)

    # map question id -> text for nicer printing
    qid_to_text = {q["id"]: q["text"] for q in kb.questions}

    asked = set()
    for t in range(1, MAX_QUESTIONS + 1):
        # get remaining questions that haven’t been asked
        remaining = [q for q in kb.all_questions() if q not in asked]

        # select next question
        q_id = None
        if t == 1 and remaining:
            q_id = remaining[0]
        elif remaining:
            q_id = select_next_question(
                eng.pi, eng.entities, remaining, kb.likelihood
            )

        # if no question left, end the game
        if q_id is None:
            guess, conf = eng.guess()
            print(f"\nNo more questions. I guess: {id_to_name[guess]} (confidence={conf:.2f}, questions={t-1})")
            return

        asked.add(q_id)
        text = qid_to_text.get(q_id, q_id)

        try:
            raw = input(f"Q{t}: {text}  (y/n/p/pn/u) > ")
        except (EOFError, KeyboardInterrupt):
            print("\n[exit]")
            return

        ans = normalize_answer(raw)
        eng.update(q_id, ans)

        # show live top-3 guesses
        tops = ", ".join([f"{id_to_name[e]}:{p:.2f}" for e, p in eng.top_k(3)])
        print(f"   top-3 → {tops}")

        # check stopping rule
        if eng.should_guess(t):
            guess, conf = eng.guess()
            print(f"\nI guess: {id_to_name[guess]}  (confidence={conf:.2f}, questions={t})")
            return

if __name__ == "__main__":
    main()