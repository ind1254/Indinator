"""
Akinator Game - CLI interface for Decision Tree AI
Handles user interaction and game loop.
"""

from typing import Optional, Literal
from .decision_tree_engine import DecisionTreeAI

# Answer types for user responses
AnswerType = Literal["yes", "no", "probably", "probably_not", "dont_know"]


class AkinatorGame:
    """
    Main game class that handles user interaction and game loop.
    
    Uses DecisionTreeAI to select questions and make guesses.
    """
    
    def __init__(self, ai: DecisionTreeAI, max_questions: int = 30, confidence_threshold: float = 0.85, 
                 min_questions: int = 5, show_stats: bool = True):
        """
        Initialize the game with an AI engine.
        
        Args:
            ai: DecisionTreeAI instance to use for question selection and guessing
            max_questions: Maximum number of questions to ask before forcing a guess (default: 30)
            confidence_threshold: Confidence threshold for making a guess (default: 0.85 = 85%)
            min_questions: Minimum questions to ask before allowing a guess (default: 5)
            show_stats: Whether to show stats after each question (default: True)
        """
        self.ai = ai
        self.max_questions = max_questions
        self.confidence_threshold = confidence_threshold
        self.min_questions = min_questions
        self.show_stats = show_stats
        
        # Game statistics (optional, for tracking)
        self.games_played = 0
        self.games_won = 0
    
    def run(self):
        """
        Main game loop.
        
        Handles:
        - Asking questions
        - Getting user answers
        - Making guesses
        - Handling correct/incorrect guesses
        - Game restart
        """
        print("=" * 60)
        print("🎮 Welcome to Indinator!")
        print("Think of a character, and I'll try to guess it!")
        print("=" * 60)
        
        # Main game loop (can play multiple games)
        while True:
            # Start a new game
            self.ai.reset()
            self.games_played += 1
            
            print(f"\n🎯 Game #{self.games_played}")
            print("Think of a character...\n")
            
            # Question-asking loop
            questions_asked = 0
            game_won = False
            
            while questions_asked < self.max_questions:
                # Check if we should make a guess (only after minimum questions)
                if questions_asked >= self.min_questions and self.ai.should_make_guess(self.confidence_threshold):
                    # Make a guess
                    if self._make_guess():
                        game_won = True
                        self.games_won += 1
                        self._handle_correct_guess(self.ai.get_best_guess()[0])
                        break
                    else:
                        # Wrong guess - continue asking questions
                        self._handle_wrong_guess(self.ai.get_best_guess()[0])
                        # Continue asking questions
                
                # Select next question
                question_idx = self.ai.select_best_question()
                
                if question_idx is None:
                    # No more questions available - check if we should make a guess
                    # Only guess if we meet the safety criteria (confidence, candidates, etc.)
                    if questions_asked >= self.min_questions and self.ai.should_make_guess(self.confidence_threshold):
                        if self._make_guess():
                            game_won = True
                            self.games_won += 1
                            self._handle_correct_guess(self.ai.get_best_guess()[0])
                        else:
                            self._handle_wrong_guess(self.ai.get_best_guess()[0])
                        break
                    else:
                        # Can't select a question and shouldn't guess yet - this shouldn't happen
                        # but if it does, force a guess as last resort
                        print("\n⚠️  Warning: No more questions available but criteria not met. Making final guess...")
                        if self._make_guess():
                            game_won = True
                            self.games_won += 1
                            self._handle_correct_guess(self.ai.get_best_guess()[0])
                        else:
                            self._handle_wrong_guess(self.ai.get_best_guess()[0])
                        break
                
                # Ask the question
                answer = self._ask_question(question_idx)
                
                if answer is None:
                    # User wants to quit or reveal answer
                    revealed_char = self._reveal_answer()
                    if revealed_char:
                        self.ai.boost_character(revealed_char)
                        print(f"\n✓ Got it! The character was: {revealed_char}")
                        self.games_won += 1
                    break
                
                # Update AI with the answer
                self.ai.update_probabilities(question_idx, answer)
                questions_asked += 1
                
                # Show stats after each question
                if self.show_stats:
                    self._display_stats()
            
            # If we hit max questions without winning, ask user to reveal
            if not game_won and questions_asked >= self.max_questions:
                print(f"\n🤔 I've asked {questions_asked} questions. Let me make a final guess...")
                if self._make_guess():
                    game_won = True
                    self.games_won += 1
                    self._handle_correct_guess(self.ai.get_best_guess()[0])
                else:
                    revealed_char = self._reveal_answer()
                    if revealed_char:
                        self.ai.boost_character(revealed_char)
                        print(f"\n✓ Got it! The character was: {revealed_char}")
            
            # Ask if user wants to play again
            if not self._play_again():
                break
        
        # Game over - show statistics
        print("\n" + "=" * 60)
        print("🎮 Thanks for playing Indinator!")
        if self.games_played > 0:
            win_rate = (self.games_won / self.games_played) * 100
            print(f"📊 Games played: {self.games_played}")
            print(f"🏆 Games won: {self.games_won}")
            print(f"📈 Win rate: {win_rate:.1f}%")
        print("=" * 60)
    
    def _ask_question(self, question_idx: int) -> Optional[AnswerType]:
        """
        Ask a question to the user and get their answer.
        
        Args:
            question_idx: Index of the question to ask
            
        Returns:
            Answer type: "yes", "no", "probably", "probably_not", "dont_know"
            None if user wants to quit/guess
        """
        # Get question text
        if question_idx < 0 or question_idx >= len(self.ai.questions):
            return None
        
        question_data = self.ai.questions[question_idx]
        question_text = question_data.get('question', '')
        
        # Display question
        print(f"❓ {question_text}")
        print("   (y/n/p/pn/dk/guess/quit): ", end="", flush=True)
        print("\n   y=yes, n=no, p=probably, pn=probably not, dk=don't know", end="", flush=True)
        print("\n   Enter choice: ", end="", flush=True)
        
        # Get user input
        while True:
            try:
                user_input = input().strip().lower()
                
                # Parse input
                if user_input in ['y', 'yes', '1', 'true']:
                    return "yes"
                elif user_input in ['n', 'no', '0', 'false']:
                    return "no"
                elif user_input in ['p', 'probably', 'likely', 'likely yes']:
                    return "probably"
                elif user_input in ['pn', 'probably not', 'probably_not', 'likely not', 'likely_no']:
                    return "probably_not"
                elif user_input in ['dk', "don't know", 'dont know', 'dont_know', 'unknown', '?', 'skip']:
                    return "dont_know"
                elif user_input in ['g', 'guess', 'make guess']:
                    return None  # Signal to make a guess
                elif user_input in ['q', 'quit', 'exit', 'reveal']:
                    return None  # Signal to quit/reveal answer
                else:
                    # Invalid input - ask again
                    print("   Please enter 'y' (yes), 'n' (no), 'p' (probably), 'pn' (probably not), 'dk' (don't know), 'guess', or 'quit': ", end="", flush=True)
            except (EOFError, KeyboardInterrupt):
                # User pressed Ctrl+C or EOF
                print("\n")
                return None
    
    def _make_guess(self) -> bool:
        """
        Make a guess and handle user response.
        
        Returns:
            True if guess was correct, False otherwise
        """
        # Get best guess from AI
        character, confidence = self.ai.get_best_guess()
        
        if not character:
            print("\n🤔 I don't have enough information to make a guess.")
            return False
        
        # Display guess with confidence
        confidence_pct = confidence * 100
        print(f"\n🎯 I think your character is: {character}")
        print(f"   Confidence: {confidence_pct:.1f}%")
        print("   Is this correct? (y/n): ", end="", flush=True)
        
        # Get user response
        while True:
            try:
                user_input = input().strip().lower()
                
                if user_input in ['y', 'yes', '1', 'true', 'correct']:
                    return True
                elif user_input in ['n', 'no', '0', 'false', 'incorrect', 'wrong']:
                    return False
                else:
                    print("   Please enter 'y' (yes) or 'n' (no): ", end="", flush=True)
            except (EOFError, KeyboardInterrupt):
                # User pressed Ctrl+C or EOF - treat as incorrect
                print("\n")
                return False
    
    def _handle_correct_guess(self, character: str):
        """
        Handle successful guess.
        
        Args:
            character: Name of the correctly guessed character
        """
        questions_asked = len(self.ai.asked_questions)
        
        print("\n" + "=" * 60)
        print("🎉 Correct! I guessed it!")
        print(f"✅ Character: {character}")
        print(f"📊 Questions asked: {questions_asked}")
        print("=" * 60)
    
    def _handle_wrong_guess(self, character: str):
        """
        Handle incorrect guess.
        
        Args:
            character: Name of the incorrectly guessed character
        """
        print(f"\n❌ That's not correct. {character} is not the right answer.")
        
        # Penalize the wrong guess in the AI
        self.ai.penalize_wrong_guess(character)
        
        print("   Let me ask more questions...\n")
    
    def _reveal_answer(self) -> Optional[str]:
        """
        Ask user to reveal the correct answer.
        
        Returns:
            Character name if provided, None if cancelled
        """
        print("\n🤔 What character were you thinking of?")
        print("   (Enter character name, or 'cancel' to skip): ", end="", flush=True)
        
        while True:
            try:
                user_input = input().strip()
                
                if not user_input:
                    print("   Please enter a character name or 'cancel': ", end="", flush=True)
                    continue
                
                if user_input.lower() in ['cancel', 'c', 'skip', 'none']:
                    return None
                
                # Try to find the character using fuzzy matching
                found_char = self.ai.find_character(user_input)
                
                if found_char:
                    return found_char
                else:
                    print(f"   Character '{user_input}' not found in database.")
                    print("   Please try again or enter 'cancel': ", end="", flush=True)
                    
            except (EOFError, KeyboardInterrupt):
                # User pressed Ctrl+C or EOF
                print("\n")
                return None
    
    def _play_again(self) -> bool:
        """
        Ask user if they want to play again.
        
        Returns:
            True if user wants to play again, False otherwise
        """
        print("\n🔄 Would you like to play again? (y/n): ", end="", flush=True)
        
        while True:
            try:
                user_input = input().strip().lower()
                
                if user_input in ['y', 'yes', '1', 'true']:
                    return True
                elif user_input in ['n', 'no', '0', 'false', 'quit', 'exit']:
                    return False
                else:
                    print("   Please enter 'y' (yes) or 'n' (no): ", end="", flush=True)
            except (EOFError, KeyboardInterrupt):
                # User pressed Ctrl+C or EOF - treat as no
                print("\n")
                return False
    
    def _display_stats(self):
        """
        Display current game statistics (for debugging/curiosity).
        """
        stats = self.ai.get_stats()
        
        print(f"\n📊 [Q{stats['questions_asked']}] Top: {stats['top_character'][0]} ({stats['top_character'][1]*100:.1f}%) | "
              f"Candidates: {stats['remaining_candidates']} | Entropy: {stats['entropy']:.2f} bits")
        
        # Show top 3 candidates in compact format
        if len(stats['top_5']) > 1:
            top_3 = stats['top_5'][:3]
            top_3_str = ", ".join([f"{char} ({prob*100:.0f}%)" for char, prob in top_3])
            print(f"   Top 3: {top_3_str}")

