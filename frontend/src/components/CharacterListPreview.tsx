import { motion } from "framer-motion";
import { useMemo } from "react";
import { characterNames } from "@/data/characters-data";

const CharacterListPreview = () => {
  // Get a random sample of 12 characters for preview (memoized to prevent regeneration)
  const previewCharacters = useMemo(() => {
    const shuffled = [...characterNames].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full mt-16 px-4">
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-lg font-semibold text-foreground/70 mb-4 text-center"
      >
        Featured Characters
      </motion.h3>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide justify-center">
        {previewCharacters.map((character, index) => (
          <motion.div
            key={character}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + index * 0.05 }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-default"
          >
            {/* Circular avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white/50">
              {getInitials(character)}
            </div>
            {/* Character name */}
            <p className="text-xs text-foreground/70 text-center max-w-[80px] truncate">
              {character}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CharacterListPreview;

