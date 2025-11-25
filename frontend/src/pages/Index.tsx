import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LandingScreen from "@/components/LandingScreen";
import GameScreen from "@/components/GameScreen";
import ResultScreen from "@/components/ResultScreen";
import AboutModal from "@/components/AboutModal";
import { questions, characters, getAnswerWeight, Character } from "@/data/questions";

type GameState = "landing" | "playing" | "result";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [guessedCharacter, setGuessedCharacter] = useState<Character | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());

  const startGame = () => {
    setGameState("playing");
    setCurrentQuestionIndex(0);
    setScores({});
    setGuessedCharacter(null);
    setAskedQuestions(new Set());
  };

  const quitGame = () => {
    setGameState("landing");
    setCurrentQuestionIndex(0);
    setScores({});
    setGuessedCharacter(null);
    setAskedQuestions(new Set());
  };

  const calculateBestMatch = (): Character => {
    const characterScores = characters.map((char) => {
      let totalScore = 0;
      Object.entries(scores).forEach(([questionId, userAnswer]) => {
        const charAnswer = char.attributes[questionId] || 0;
        const difference = Math.abs(charAnswer - userAnswer);
        totalScore += 10 - difference * 2; // Higher score for closer matches
      });
      return { character: char, score: totalScore };
    });

    characterScores.sort((a, b) => b.score - a.score);
    return characterScores[0].character;
  };

  const handleAnswer = (answer: string) => {
    const weight = getAnswerWeight(answer);
    const questionId = questions[currentQuestionIndex].id;

    setScores((prev) => ({
      ...prev,
      [questionId]: weight,
    }));

    // Mark question as asked
    setAskedQuestions((prev) => new Set([...prev, questionId]));

    // Find next unasked question
    const nextQuestionIndex = questions.findIndex(
      (q, idx) => idx > currentQuestionIndex && !askedQuestions.has(q.id)
    );

    // Move to next question or show result
    if (nextQuestionIndex !== -1 && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      // Game over - calculate result
      const bestMatch = calculateBestMatch();
      setGuessedCharacter(bestMatch);
      setGameState("result");
    }
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {gameState === "landing" && (
          <LandingScreen key="landing" onStart={startGame} onOpenAbout={() => setShowAbout(true)} />
        )}

        {gameState === "playing" && (
          <GameScreen
            key="playing"
            question={questions[currentQuestionIndex].text}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
            onQuit={quitGame}
          />
        )}

        {gameState === "result" && guessedCharacter && (
          <ResultScreen
            key="result"
            characterName={guessedCharacter.name}
            characterQuote={guessedCharacter.quote}
            onPlayAgain={startGame}
          />
        )}
      </AnimatePresence>

      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
    </div>
  );
};

export default Index;
