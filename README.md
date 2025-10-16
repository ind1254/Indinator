# Indinator
An interactive 20-Questions engine that guesses fictional characters using Bayesian inference and information gain.

## Overview
This project implements a Bayesian 20Q-style guessing game for fictional characters (e.g., from film, TV, games, or books).
The engine asks the user a sequence of questions (yes / no / probably / probably not / unknown), updates its posterior belief over entities, and selects the next most informative question to narrow down the possibilities.
Core features:
- Bayesian posterior updates for belief tracking
- Information gain–based question selection
- Online learning via Beta distributions to improve over time
- Evaluation with simulated users and ablations
- Simple Streamlit UI for interactive play

## Project Structure
.
├── .github/workflows/ci.yml       # CI pipeline
├── data/
│   ├── entities.json              # Character metadata
│   ├── kb.json                    # Knowledge base (question ↔ entity probabilities)
│   ├── beta.json                  # Online learning counts
│   └── questions.json             # Question bank
├── eval/
│   ├── simulate.py                # Simulated users for testing
│   ├── metrics.py
│   └── ablations.py
├── indinator/
│   ├── engine.py                  # Bayesian update loop
│   ├── selection.py               # Question selection (EIG)
│   ├── learning.py                # Beta updates
│   └── kb_store.py                # Data handling utilities
├── tools/
│   ├── validate_kb.py            # Checks KB completeness and consistency
│   └── stats_kb.py               # Coverage stats
├── ui/
│   ├── cli.py                    # Minimal CLI for debugging
│   └── app_streamlit.py         # Interactive web interface
├── tests/                        # Unit tests for engine, learning, selection
├── requirements.txt
└── README.md

## Quickstart
```bash
# 1) create env
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# 2) validate starter data
python tools/validate_kb.py

# 3) run CLI demo
python ui/cli.py

# 4) run Streamlit app
streamlit run ui/app_streamlit.py
```

## Data Format
All core data lives in /data:
|File | Description |
|-----|-------------|
| questions.json | Bank of yes/no/probably questions with metadata |
| entities.json | 300+ fictional characters with basic fields|
| kb.json | Conditional probabilities P(answer) |
| beta.json | Alpha/Beta counts for online learning |

Validation scripts ensure schemas are consistent and coverage is high.

## Inference Loop
The engine maintains a belief vector over all entities. Each user answer updates the posterior:
$$P(e|a_{1:t})\propto P(e)\prod\limits_{i=1}^{t}P(a_i|e,q_i)$$
Questions are chosen by Expected Information Gain, i.e., minimizing the expected posterior entropy over answers.
Stopping rules:
- Guess when top posterior ≥ 0.85
- Or after 20 questions

## Evaluation
- Simulated users with 10% noise
- Metrics: Top-1 accuracy, mean questions to guess, AU-turn curve
- Ablations: random vs EIG, with/without learning, reduced question sets

## Development
**Run tests**
```bash
pytest -q
```
**Run KB stats**
```bash
python tools/stats_kb.py
```
**Continuous Integration**
CI runs linting, schema validation, and unit tests automatically via GitLab pipelines.

## License

## Acknowledgments