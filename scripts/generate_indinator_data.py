import json
import os

# ---------------------------
# CONFIGURABLE PROBABILITY MODEL
# ---------------------------
PROBS = {
    "match": {"yes": 0.85, "no": 0.05, "maybe": 0.10},
    "neutral": {"yes": 0.33, "no": 0.33, "maybe": 0.34},
    "opposite": {"yes": 0.05, "no": 0.85, "maybe": 0.10}
}


# ---------------------------
# LOAD BASE FILES
# ---------------------------
def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)


# ---------------------------
# MAIN GENERATOR
# ---------------------------
def generate():
    print("Loading characters.json, traits.json, and questions.json...")

    characters = load_json("../data/characters.json")  # {char: prior}
    traits = load_json("../data/traits.json")  # {char: [traits]}
    questions = load_json("../data/questions.json")["questions"]

    all_traits = set()
    for tlist in traits.values():
        for t in tlist:
            all_traits.add(t)

    print(f"Found {len(characters)} characters.")
    print(f"Found {len(all_traits)} unique traits.")
    print(f"Found {len(questions)} questions.\n")

    # ---------------------------------------
    # BUILD CHARACTER → TRAIT BOOLEAN TABLE
    # ---------------------------------------
    print("Building expanded trait table...")
    character_traits_expanded = {}

    for char in characters:
        char_traits = traits.get(char, [])

        character_traits_expanded[char] = {
            trait: (trait in char_traits)
            for trait in all_traits
        }

    save_json(
        "../data/character_traits_expanded.json",
        character_traits_expanded
    )
    print("Saved character_traits_expanded.json")

    # ---------------------------------------
    # BUILD QUESTION LIKELIHOOD MATRIX
    # ---------------------------------------
    print("Building question likelihood matrix...")

    question_likelihoods = {}

    for q in questions:
        qtext = q["text"]
        trait = q["trait"]

        question_likelihoods[qtext] = {}

        for char in characters:
            has_trait = character_traits_expanded[char].get(trait, False)

            if has_trait:
                p = PROBS["match"]
            else:
                p = PROBS["opposite"]

            question_likelihoods[qtext][char] = {
                "yes": p["yes"],
                "no": p["no"],
                "maybe": p["maybe"]
            }

    save_json(
        "../data/question_likelihoods.json",
        question_likelihoods
    )
    print("Saved question_likelihoods.json")

    print("\nGeneration complete ✓")


# ---------------------------
# RUN
# ---------------------------
if __name__ == "__main__":
    generate()
