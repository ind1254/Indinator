import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ResultScreenProps {
  characterName: string;
  characterQuote: string;
  onPlayAgain: () => void;
}

const ResultScreen = ({ characterName, characterQuote, onPlayAgain }: ResultScreenProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const text = `Ind-inator guessed I was thinking of ${characterName}! 🎯`;
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden animated-gradient"
    >
      {/* Confetti animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -50,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
                rotate: 360,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: "easeOut",
              }}
            >
              {['🎉', '✨', '🎊', '⭐', '🌟', '💫'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center max-w-2xl space-y-8 z-10"
      >
        {/* Message */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          I think you were thinking of...
        </motion.h2>

        {/* Character display with glowing circular frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Glowing circular frame */}
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 40px rgba(59, 130, 246, 0.8)",
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center border-4 border-white shadow-2xl"
            >
              <span className="text-6xl md:text-7xl">🎭</span>
            </motion.div>
          </div>

          {/* Character name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-border/50 w-full"
          >
            <h1 className="text-4xl md:text-5xl font-black gradient-royal-blue mb-4">
              {characterName}
            </h1>
            <p className="text-lg text-muted-foreground italic">
              "{characterQuote}"
            </p>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="px-10 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 font-bold"
          >
            Play Again
          </Button>
          <Button
            onClick={() => {
              // This would trigger "That's Wrong!" functionality
              // For now, just call play again
              onPlayAgain();
            }}
            size="lg"
            variant="outline"
            className="px-10 py-6 text-lg rounded-xl border-2 hover:scale-105 transition-all font-semibold"
          >
            That's Wrong!
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultScreen;
