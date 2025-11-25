import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Share2, PartyPopper } from "lucide-react";
import IndAvatar from "./IndAvatar";

interface ResultScreenProps {
  characterName: string;
  characterQuote: string;
  onPlayAgain: () => void;
}

const ResultScreen = ({ characterName, characterQuote, onPlayAgain }: ResultScreenProps) => {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Celebration confetti effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            initial={{ 
              y: -50,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 50,
              rotate: 360,
              opacity: 0
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity
            }}
          >
            {['🎉', '✨', '🎊', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="text-center max-w-2xl space-y-8 z-10"
      >
        {/* Avatar */}
        <motion.div 
          className="flex justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <IndAvatar mood="confident" />
        </motion.div>

        {/* Result */}
        <div className="space-y-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center justify-center gap-3"
          >
            <PartyPopper className="w-10 h-10 text-accent" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary playful">
              I know who you're thinking of!
            </h2>
            <Sparkles className="w-10 h-10 text-secondary" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
            className="bg-card/95 backdrop-blur-sm rounded-3xl p-10 border-4 border-secondary bubble-shadow"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-black text-primary mb-6 playful"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              {characterName}
            </motion.h1>
            <div className="bg-secondary/20 rounded-2xl p-6 border-2 border-secondary/30">
              <p className="text-xl md:text-2xl text-card-foreground italic playful">
                "{characterQuote}"
              </p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="text-xl px-10 py-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 font-bold playful bubble-shadow border-4 border-secondary"
          >
            🎮 Play Again
          </Button>
          <Button
            onClick={handleShare}
            size="lg"
            className="text-xl px-10 py-7 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 font-bold playful bubble-shadow border-4 border-secondary"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultScreen;
