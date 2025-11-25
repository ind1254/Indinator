import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import IndAvatar from "./IndAvatar";

interface GameScreenProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  onQuit: () => void;
}

const answers = [
  { value: "yes", label: "✅ Yes", color: "bg-primary hover:bg-primary/90 text-primary-foreground" },
  { value: "probably-yes", label: "👍 Probably", color: "bg-primary/80 hover:bg-primary/70 text-primary-foreground" },
  { value: "maybe", label: "🤷 Maybe", color: "bg-accent hover:bg-accent/90 text-accent-foreground" },
  { value: "probably-no", label: "👎 Probably Not", color: "bg-destructive/80 hover:bg-destructive/70 text-destructive-foreground" },
  { value: "no", label: "❌ No", color: "bg-destructive hover:bg-destructive/90 text-destructive-foreground" },
];

const GameScreen = ({ question, questionNumber, totalQuestions, onAnswer, onQuit }: GameScreenProps) => {
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
    >
      {/* Quit button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuit}
        className="absolute top-6 right-6 text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-full"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Progress */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <div className="text-center mb-3">
          <span className="text-lg font-semibold text-primary playful">
            Question {questionNumber}
          </span>
        </div>
        <Progress value={progress} className="h-3 bg-muted rounded-full" />
      </div>

      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="mb-8 mt-16"
      >
        <IndAvatar mood="thinking" />
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="max-w-2xl text-center mb-12 bg-card/95 backdrop-blur-sm rounded-3xl p-8 bubble-shadow border-4 border-secondary"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-card-foreground playful">{question}</h2>
      </motion.div>

      {/* Answer buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-5xl px-4"
      >
        {answers.map((answer, index) => (
          <motion.div
            key={answer.value}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.4 + index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={() => onAnswer(answer.value)}
              className={`w-full h-24 text-lg font-bold ${answer.color} rounded-2xl bubble-shadow border-4 border-secondary playful`}
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
