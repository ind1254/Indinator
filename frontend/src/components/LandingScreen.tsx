import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface LandingScreenProps {
  onStart: () => void;
  onOpenAbout: () => void;
}

const LandingScreen = ({ onStart, onOpenAbout }: LandingScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center text-foreground relative overflow-hidden"
    >

      {/* About button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenAbout}
        className="absolute top-6 right-6 text-secondary hover:text-secondary/80 hover:bg-secondary/10 rounded-full z-20"
      >
        <Info className="w-6 h-6" />
      </Button>

      {/* Content */}
      <div className="z-10 text-center space-y-8 px-4 max-w-2xl">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="text-xl px-12 py-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 font-bold playful bubble-shadow border-4 border-secondary"
          >
            🎮 Start Game
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
