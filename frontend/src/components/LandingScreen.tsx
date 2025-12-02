import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useState, useEffect } from "react";

interface LandingScreenProps {
  onStart: () => void;
  onOpenAbout: () => void;
}

const characterIcons = ["🧙", "🦸", "👑", "🎭", "⚔️", "🛡️"];

const LandingScreen = ({ onStart, onOpenAbout }: LandingScreenProps) => {
  const [currentIcon, setCurrentIcon] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % characterIcons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden animated-gradient"
    >
      {/* Animated particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-200/30 rounded-full particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 max-w-2xl z-10 flex-1 flex flex-col justify-center"
      >
        {/* Title with glowing royal-blue gradient */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-7xl md:text-8xl font-black gradient-royal-blue glow-blue mb-4"
        >
          Ind-inator
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xl md:text-2xl text-foreground/80 font-medium"
        >
          Think of a character... and I'll try to guess who it is!
        </motion.p>

        {/* Buttons - Start Game and Info side by side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <Button
            onClick={onStart}
            size="lg"
            className="px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 soft-glow relative overflow-hidden group"
          >
            <motion.span
              key={currentIcon}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-3xl mr-3"
            >
              {characterIcons[currentIcon]}
            </motion.span>
            Start Game
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </Button>
          
          <Button
            onClick={onOpenAbout}
            size="lg"
            variant="outline"
            className="px-8 py-8 text-lg font-semibold border-2 border-blue-500/50 hover:border-blue-500 text-blue-600 hover:text-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 soft-glow bg-white/80 backdrop-blur-sm"
          >
            <Info className="w-5 h-5 mr-2" />
            Info
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LandingScreen;
