import json


def load(path):
    with open(path, "r") as f:
        return json.load(f)


def save(path, obj):
    with open(path, "w") as f:
        json.dump(obj, f, indent=4)


# RULES: how strongly certain traits apply based on categories
WEIGHTS = {
    "universe": 1.0,
    "species": 0.9,
    "role": 0.8,
    "abilities": 0.8,
    "occupation": 0.8,
    "weapons": 0.7,
    "personality": 0.6,
    "team_faction": 0.6,
    "tone": 0.5,
    "media": 0.6,
    "era_world": 0.5,
    "appearance": 0.4,
    "meta": 0.3
}


def generate_weighted_traits(characters, simple_traits, trait_universe):
    weighted = {}

    for char, traits in simple_traits.items():
        weighted[char] = {}

        for t in traits:
            # find which category this trait belongs to
            category = next((cat for cat in trait_universe if t in trait_universe[cat]), None)
            if not category:
                continue

            weighted[char][t] = WEIGHTS[category]

    return weighted


def main():
    characters = load("../data/characters.json")
    simple_traits = load("../data/traits.json")  # simple list version you already created
    trait_universe = load("../data/trait_universe.json")

    weighted = generate_weighted_traits(characters, simple_traits, trait_universe)
    save("../data/weighted_traits.json", weighted)
    print("Created weighted_traits.json ✓")


if __name__ == "__main__":
    main()
