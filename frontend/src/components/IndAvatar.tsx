import { motion } from "framer-motion";

interface IndAvatarProps {
  mood?: "thinking" | "confident" | "curious";
}

const IndAvatar = ({ mood = "thinking" }: IndAvatarProps) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case "confident":
        return "😎";
      case "curious":
        return "🤔";
      default:
        return "🧠";
    }
  };

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Floating stars */}
      <motion.div
        className="absolute -top-4 -left-4 text-3xl"
        animate={{ 
          rotate: [0, 15, -15, 0],
          y: [0, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute -top-4 -right-4 text-2xl"
        animate={{ 
          rotate: [0, -15, 15, 0],
          y: [0, -8, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      >
        ✨
      </motion.div>
      <motion.div
        className="absolute -bottom-2 left-8 text-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        💫
      </motion.div>

      {/* Main character bubble */}
      <motion.div
        className="relative w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center bubble-shadow"
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        
        {/* Character face */}
        <motion.div
          className="text-7xl z-10"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getMoodEmoji()}
        </motion.div>

        {/* Sparkle effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(168, 85, 247, 0.4)",
              "0 0 40px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(168, 85, 247, 0.4)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
};

export default IndAvatar;
