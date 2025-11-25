import { ScrollArea } from "@/components/ui/scroll-area";
import { characters } from "@/data/questions";

const CharacterList = () => {
  return (
    <div className="mt-6 border-t border-border/20 pt-4">
      <h3 className="text-lg font-semibold text-accent mb-3 flex items-center gap-2">
        <span className="text-xl">🎭</span> Available Characters
      </h3>
      <ScrollArea className="h-64 rounded-lg border border-border/30 bg-background/50 p-4">
        <div className="grid grid-cols-2 gap-2">
          {characters.map((char) => (
            <div
              key={char.id}
              className="text-sm text-foreground/80 hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/10"
            >
              {char.name}
            </div>
          ))}
        </div>
      </ScrollArea>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {characters.length} characters available
      </p>
    </div>
  );
};

export default CharacterList;
