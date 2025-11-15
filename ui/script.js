// === UI STATE ===
let currentQuestion = null;
let gameState = {
  questionNumber: 0,
  entropy: null,
  topCandidates: [],
  awaitingGuessConfirmation: false,
};

// === DOM ELEMENTS ===
const questionTextEl = document.getElementById("question-text");
const questionCountEl = document.getElementById("question-count");
const entropyLabelEl = document.getElementById("entropy-label");
const candidateListEl = document.getElementById("candidate-list");
const systemMessageEl = document.getElementById("system-message");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const answerButtons = document.querySelectorAll(".answer-btn");

const guessContainerEl = document.getElementById("guess-container");
const guessTextEl = document.getElementById("guess-text");
const guessCorrectBtn = document.getElementById("guess-correct-btn");
const guessIncorrectBtn = document.getElementById("guess-incorrect-btn");

// === EVENT LISTENERS ===
startBtn.addEventListener("click", () => {
  startGame();
});

restartBtn.addEventListener("click", () => {
  startGame();
});

answerButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const answerCode = btn.dataset.answer;
    handleAnswer(answerCode);
  });
});

guessCorrectBtn.addEventListener("click", () => {
  // Let backend know the guess was correct (for learning / stats),
  // then end the game on the frontend.
  fetch("/api/guess-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correct: true }),
  }).finally(() => {
    endGame(true);
  });
});

guessIncorrectBtn.addEventListener("click", () => {
  // Penalize the wrong guess, then get a new question.
  systemMessageEl.textContent = "Okay, updating beliefs and continuing…";
  fetch("/api/guess-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correct: false }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Guess feedback failed");
      return res.json();
    })
    .then(() => {
      gameState.awaitingGuessConfirmation = false;
      guessContainerEl.classList.add("hidden");
      requestNextQuestion();
    })
    .catch((err) => {
      console.error(err);
      showError("Could not process your feedback on the guess.");
    });
});

// === MAIN FLOW ===

function startGame() {
  disableAnswers(true);
  systemMessageEl.textContent =
    "Think of a character, person, or object — I’ll try to guess!";
  gameState = {
    questionNumber: 0,
    entropy: null,
    topCandidates: [],
    awaitingGuessConfirmation: false,
  };
  guessContainerEl.classList.add("hidden");
  guessTextEl.textContent = "";
  questionTextEl.textContent = "Loading first question…";

  fetch("/api/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to start game");
      return res.json();
    })
    .then((state) => {
      applyStateFromBackend(state);
      disableAnswers(false);
    })
    .catch((err) => {
      console.error(err);
      showError("Could not start game. Is the server running?");
      disableAnswers(true);
    });
}

function handleAnswer(answerCode) {
  if (!currentQuestion || gameState.awaitingGuessConfirmation) {
    return;
  }

  disableAnswers(true);
  systemMessageEl.textContent = "Updating beliefs…";

  fetch("/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: currentQuestion.id,
      answer: answerCode,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to submit answer");
      return res.json();
    })
    .then((state) => {
      applyStateFromBackend(state);
      // Only re-enable answer buttons if we're asking another question
      if (!gameState.awaitingGuessConfirmation) {
        disableAnswers(false);
      }
    })
    .catch((err) => {
      console.error(err);
      showError("Something went wrong submitting your answer.");
      disableAnswers(false);
    });
}

function requestNextQuestion() {
  disableAnswers(true);
  questionTextEl.textContent = "Choosing the next best question…";

  fetch("/api/next-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to get next question");
      return res.json();
    })
    .then((state) => {
      applyStateFromBackend(state);
      disableAnswers(false);
    })
    .catch((err) => {
      console.error(err);
      showError("Unable to get the next question.");
      disableAnswers(false);
    });
}

function endGame(correct) {
  disableAnswers(true);
  gameState.awaitingGuessConfirmation = false;
  guessContainerEl.classList.add("hidden");

  if (correct) {
    systemMessageEl.textContent = "🎉 Nice! Indinator guessed correctly.";
    questionTextEl.textContent =
      "Thanks for playing. Click Restart to try another round.";
  } else {
    systemMessageEl.textContent =
      "😅 I couldn't guess correctly this time. You can restart and try again!";
    questionTextEl.textContent = "Game over. Click Restart to try again.";
  }
}

// === RENDERING ===

function applyStateFromBackend(state) {
  // state shape:
  // {
  //   question: { id, text } | null,
  //   questionIndex: number | null,
  //   questionNumber: number,
  //   entropy: number,
  //   topCandidates: [{ name, probability }, ...],
  //   guess: { name, probability } | null
  // }

  currentQuestion = state.question || null;
  gameState.questionNumber =
    typeof state.questionNumber === "number"
      ? state.questionNumber
      : gameState.questionNumber;
  gameState.entropy =
    typeof state.entropy === "number" ? state.entropy : gameState.entropy;
  gameState.topCandidates = Array.isArray(state.topCandidates)
    ? state.topCandidates
    : [];

  // Update labels
  questionCountEl.textContent = `Question: ${gameState.questionNumber}`;
  entropyLabelEl.textContent =
    gameState.entropy != null
      ? `Uncertainty: ${gameState.entropy.toFixed(2)}`
      : "Uncertainty: --";

  // Update question text
  if (currentQuestion) {
    questionTextEl.textContent = currentQuestion.text;
  } else if (!state.guess) {
    questionTextEl.textContent = "I have no more questions to ask.";
  }

  // Update candidates
  renderCandidates(gameState.topCandidates);

  // Handle guess display
  if (state.guess) {
    const { name, probability } = state.guess;
    const pct = (probability * 100).toFixed(1);
    guessTextEl.textContent = `I think you're thinking of: ${name} (${pct}% confidence). Is that correct?`;
    guessContainerEl.classList.remove("hidden");
    systemMessageEl.textContent = "I’m confident enough to make a guess!";
    gameState.awaitingGuessConfirmation = true;
  } else {
    guessContainerEl.classList.add("hidden");
    gameState.awaitingGuessConfirmation = false;
  }
}

function renderCandidates(candidates) {
  candidateListEl.innerHTML = "";

  if (!candidates || candidates.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No candidates yet.";
    candidateListEl.appendChild(li);
    return;
  }

  candidates.slice(0, 8).forEach((c) => {
    const li = document.createElement("li");

    const nameSpan = document.createElement("span");
    nameSpan.className = "candidate-name";
    nameSpan.textContent = c.name;

    const probSpan = document.createElement("span");
    probSpan.className = "candidate-prob";
    probSpan.textContent = `${(c.probability * 100).toFixed(1)}%`;

    li.appendChild(nameSpan);
    li.appendChild(probSpan);
    candidateListEl.appendChild(li);
  });
}

function disableAnswers(disabled) {
  answerButtons.forEach((btn) => {
    btn.disabled = disabled;
  });
}

function showError(message) {
  systemMessageEl.textContent = message || "An error occurred.";
}
