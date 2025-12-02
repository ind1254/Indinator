import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";

interface GameScreenProps {
  question: string | null;
  questionNumber: number;
  entropy?: number;
  guess: { name: string; probability: number } | null;
  onAnswer: (answer: string) => void;
  onGuessFeedback: (correct: boolean) => void;
  onQuit: () => void;
  isLoading?: boolean;
}

const answers = [
  { 
    value: "yes", 
    label: "Yes", 
  },
  { 
    value: "probably-yes", 
    label: "Probably", 
  },
  { 
    value: "maybe", 
    label: "Maybe", 
  },
  { 
    value: "probably-no", 
    label: "Probably Not", 
  },
  { 
    value: "no", 
    label: "No", 
  },
];

const GameScreen = ({ 
  question, 
  questionNumber, 
  entropy = 0,
  guess,
  onAnswer, 
  onGuessFeedback,
  onQuit,
  isLoading = false
}: GameScreenProps) => {
  // Show guess screen if backend provided a guess
  if (guess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex flex-col items-center justify-center p-6 relative animated-gradient"
      >
        {/* Quit button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onQuit}
          className="absolute top-6 right-6 z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Guess */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-center mb-8 space-y-4"
        >
          <h2 className="text-3xl font-bold text-foreground">
            Is it {guess.name}?
          </h2>
          <p className="text-sm text-muted-foreground">
            Confidence: {Math.round(guess.probability * 100)}%
          </p>
        </motion.div>

        {/* Feedback buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-4"
        >
          <Button
            onClick={() => onGuessFeedback(true)}
            size="lg"
            disabled={isLoading}
            className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Yes, that's it
          </Button>
          <Button
            onClick={() => onGuessFeedback(false)}
            size="lg"
            variant="outline"
            disabled={isLoading}
            className="px-8 py-6 text-lg rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all"
          >
            No, keep going
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Show question screen
  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-gradient">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className="text-muted-foreground"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  const progressValue = Math.max(0, Math.min(100, (1 - entropy / 10) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative max-w-4xl mx-auto animated-gradient"
    >
      {/* Quit button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuit}
        className="absolute top-6 right-6 z-10"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Progress bar */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
        className="w-full mb-8 max-w-2xl"
      >
        <div className="flex justify-between items-center mb-3 text-sm text-foreground/70">
          <span className="font-medium">Question {questionNumber}</span>
          {entropy > 0 && (
            <span>Uncertainty: {entropy.toFixed(2)}</span>
          )}
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-800 rounded-full shadow-lg"
          />
        </div>
      </motion.div>

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="w-full max-w-2xl mb-12"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50 soft-glow">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center leading-tight">
            {question}
          </h2>
        </div>
      </motion.div>

      {/* Answer buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-4xl"
      >
        {answers.map((answer, index) => (
          <motion.div
            key={answer.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => onAnswer(answer.value)}
              className="h-20 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-blue-500/50"
              disabled={isLoading}
            >
              {answer.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default GameScreen;
