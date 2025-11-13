import json
import math


# -----------------------------
# LOAD JSON FILES
# -----------------------------
def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

characters = load_json("../data/characters.json")  # priors
questions = load_json("../data/questions.json")["questions"]
likelihoods = load_json("../data/question_likelihoods.json")  # full probability table


# -----------------------------
# BAYESIAN UPDATE
# -----------------------------
def update_posteriors(posteriors, question_text, answer):
    new_post = {}

    for char in posteriors:
        likelihood = likelihoods[question_text][char][answer]
        new_post[char] = posteriors[char] * likelihood

    # normalize
    total = sum(new_post.values())
    for c in new_post:
        new_post[c] /= total

    return new_post


# -----------------------------
# ENTROPY / INFORMATION GAIN
# -----------------------------
def entropy(dist):
    return -sum(p * math.log2(p) for p in dist.values() if p > 0)


def expected_entropy(posteriors, qtext):
    e_total = 0

    for answer in ["yes", "no", "maybe"]:
        # P(answer) = Σ P(char)*P(answer|char)
        p_answer = sum(
            posteriors[c] * likelihoods[qtext][c][answer]
            for c in posteriors
        )

        if p_answer == 0:
            continue

        # posterior distribution after this answer
        post = {}
        for c in posteriors:
            post[c] = posteriors[c] * likelihoods[qtext][c][answer]
        total = sum(post.values())
        for c in post:
            post[c] /= total

        e_total += p_answer * entropy(post)

    return e_total


def select_best_question(posteriors, asked):
    current_H = entropy(posteriors)

    best_q = None
    best_gain = -9999

    for q in questions:
        qtext = q["text"]
        if qtext in asked:
            continue

        e = expected_entropy(posteriors, qtext)
        gain = current_H - e

        if gain > best_gain:
            best_gain = gain
            best_q = qtext

    return best_q


# -----------------------------
# INPUT HANDLING
# -----------------------------
def get_answer():
    while True:
        ans = input("(yes/no/maybe): ").strip().lower()
        if ans in ["yes", "y"]: return "yes"
        if ans in ["no", "n"]: return "no"
        if ans in ["maybe", "m"]: return "maybe"
        print("Please type yes, no, or maybe.")


# -----------------------------
# MAIN GAME LOOP
# -----------------------------
def main():
    print("=== Akinator Clone (Bayesian Inference) ===")
    print("Think of a character. I'll try to guess it.\n")

    # priors
    posteriors = characters.copy()
    asked_questions = []

    while True:
        # check certainty
        best_char = max(posteriors, key=posteriors.get)
        best_prob = posteriors[best_char]

        if best_prob > 0.90:
            print(f"\nI am {best_prob*100:.1f}% sure your character is **{best_char}**!")
            return

        # select best info-gain question
        qtext = select_best_question(posteriors, asked_questions)
        asked_questions.append(qtext)

        print("\n" + qtext)
        answer = get_answer()

        # update beliefs
        posteriors = update_posteriors(posteriors, qtext, answer)

        # For debugging / demo:
        # print(sorted([(c, f"{p:.3f}") for c,p in posteriors.items()], key=lambda x: -float(x[1]))[:5])


if __name__ == "__main__":
    main()
