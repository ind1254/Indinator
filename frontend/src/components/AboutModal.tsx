import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { characterNames } from "@/data/characters-data";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal = ({ open, onOpenChange }: AboutModalProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-2xl shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-royal-blue mb-2">
              About Ind-inator
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-foreground/90 mt-4">
            <p className="leading-relaxed text-base">
              This is a group project for our AI class by{" "}
              <strong className="text-blue-600">Ind</strong>,{" "}
              <strong className="text-blue-600">Jay</strong>,{" "}
              <strong className="text-blue-600">Emily</strong>, and{" "}
              <strong className="text-blue-600">Vidhi</strong>.
            </p>
            
            <div className="border-t border-border/30 my-2"></div>
            
            {/* Character List Section */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                All Characters ({characterNames.length})
              </h3>
              <ScrollArea className="h-[400px] pr-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
                  {characterNames.map((character, index) => (
                    <motion.div
                      key={character}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.01 }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors cursor-default group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:shadow-lg transition-all flex-shrink-0">
                        {getInitials(character)}
                      </div>
                      <p className="text-sm text-foreground/80 group-hover:text-foreground transition-colors truncate">
                        {character}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            <div className="border-t border-border/30 my-2"></div>
            
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="px-6"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
