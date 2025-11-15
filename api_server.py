# api_server.py
"""
Simple Flask API for the Indinator web UI.
Run with:  python api_server.py
"""

from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory

from indinator import AkinatorAI

# --- Setup --------------------------------------------------------------------

project_root = Path(__file__).parent
data_dir = project_root / "data"

app = Flask(__name__, static_folder="ui", static_url_path="")

# Create a single AI engine instance (single-user / local use case)
ai = AkinatorAI(
    traits_file=str(data_dir / "traits_flat.json"),
    questions_file=str(data_dir / "questions.json"),
    characters_file=str(data_dir / "characters.json"),
    enable_learning=False,  # keep web version simple & fast
)

last_guess_name = None  # track last guess for feedback


# --- Helpers ------------------------------------------------------------------


def build_state(allow_guess: bool = True):
    """
    Build the JSON state returned to the frontend.
    Includes: next question (if any), entropy, top candidates, and guess (if ready).
    """
    global last_guess_name

    # Basic stats
    entropy = ai.entropy(ai.probabilities)
    top_candidates = [
        {"name": name, "probability": float(prob)}
        for name, prob in ai.get_top_characters(8)
    ]

    # Decide whether to guess
    guess = None
    last_guess_name = None
    if allow_guess and ai.should_make_guess(threshold=0.85):
        name, prob = ai.get_best_guess()
        guess = {"name": name, "probability": float(prob)}
        last_guess_name = name

    # If we're not making a guess (or want to keep asking), pick the next question
    question = None
    question_idx = None
    if guess is None:
        q_idx = ai.select_best_question()
        if q_idx is not None:
            q_obj = ai.questions[q_idx]
            question = {
                "id": q_idx,
                "text": q_obj.get("question", ""),
            }
            question_idx = q_idx

    # Question number = asked so far + 1 if we're presenting a new one
    questions_asked = len(ai.asked_questions)
    question_number = questions_asked + (1 if question is not None else 0)

    return {
        "question": question,             # {id, text} or null
        "questionIndex": question_idx,    # same as id; included for clarity
        "questionNumber": question_number,
        "entropy": float(entropy),
        "topCandidates": top_candidates,
        "guess": guess,                   # {name, probability} or null
    }


# --- Routes -------------------------------------------------------------------


@app.route("/")
def index():
    """Serve the main UI page."""
    return send_from_directory(app.static_folder, "index.html")


@app.post("/api/start")
def api_start():
    """Start a new game (or restart) and return the initial state."""
    ai.reset()
    state = build_state(allow_guess=False)  # never guess immediately
    return jsonify(state)


@app.post("/api/answer")
def api_answer():
    """
    Submit an answer to the current question.
    Body: { "questionId": int, "answer": "yes" | "no" | "probably_yes" | ... }
    """
    data = request.get_json(force=True) or {}

    if "questionId" not in data or "answer" not in data:
        return jsonify({"error": "Missing 'questionId' or 'answer'"}), 400

    q_idx = int(data["questionId"])
    answer_code = str(data["answer"])

    # Map UI answers to (bool, likelihoods)
    if answer_code == "yes":
        ans_bool = True
        lk_correct, lk_incorrect = 0.95, 0.05
    elif answer_code == "probably_yes":
        ans_bool = True
        lk_correct, lk_incorrect = 0.75, 0.25
    elif answer_code == "no":
        ans_bool = False
        lk_correct, lk_incorrect = 0.95, 0.05
    elif answer_code == "probably_no":
        ans_bool = False
        lk_correct, lk_incorrect = 0.75, 0.25
    elif answer_code == "unknown":
        ans_bool = None  # skip: don't update probabilities
    else:
        return jsonify({"error": f"Invalid answer '{answer_code}'"}), 400

    # Update probabilities only if the user gave a directional answer
    if ans_bool is not None:
        ai.update_probabilities(
            q_idx,
            ans_bool,
            likelihood_correct=lk_correct,
            likelihood_incorrect=lk_incorrect,
        )

    state = build_state(allow_guess=True)
    return jsonify(state)


@app.post("/api/next-question")
def api_next_question():
    """
    Get the next question without changing probabilities.
    Used after a wrong guess (penalty already applied).
    """
    state = build_state(allow_guess=True)
    return jsonify(state)


@app.post("/api/guess-feedback")
def api_guess_feedback():
    """
    Receive feedback on the last guess.
    Body: { "correct": bool }
    If incorrect, penalize that character so we don't repeat the same wrong guess.
    """
    global last_guess_name

    data = request.get_json(force=True) or {}
    correct = bool(data.get("correct", False))

    if last_guess_name is None:
        return jsonify({"error": "No active guess to score"}), 400

    if correct:
        # Boost the correct character’s probability (optional)
        ai.boost_character(last_guess_name, boost_factor=1000.0)
        msg = "Great! I'll remember that."
    else:
        # Strongly penalize the wrong guess and continue
        ai.penalize_wrong_guess(last_guess_name, penalty_factor=0.001)
        msg = "Got it — updating my beliefs and continuing."

    # Clear stored guess
    last_guess_name = None

    return jsonify({"ok": True, "message": msg})


if __name__ == "__main__":
    # You can change host/port as needed
    app.run(host="127.0.0.1", port=5000, debug=True)
