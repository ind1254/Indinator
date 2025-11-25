import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain } from "lucide-react";
import CharacterList from "./CharacterList";

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutModal = ({ open, onOpenChange }: AboutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-card border-4 border-primary/30 rounded-3xl overflow-y-auto bubble-shadow">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl playful text-primary">
            <Brain className="w-8 h-8 text-accent" />
            About Ind-inator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-foreground/90">
          <p className="leading-relaxed">
            <strong className="text-accent">Ind-inator</strong> is an AI-powered mind-reading experiment for our school project.
          </p>
          <p className="leading-relaxed">
            Made by <strong className="text-accent">Jay</strong>, <strong className="text-accent">Vidhi</strong>,{" "}
            <strong className="text-accent">Emily</strong>, and <strong className="text-accent">Ind</strong>.
          </p>
          <p className="leading-relaxed">
            Think of any <strong>fictional character</strong> and Ind-inator will ask you a series of questions to narrow down
            who you're thinking of. The more honestly you answer, the better Ind-inator can read your mind.
          </p>
          <p className="text-sm text-muted-foreground playful">
            Built with React, TypeScript, Tailwind CSS, and Framer Motion.
          </p>
          <CharacterList />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
