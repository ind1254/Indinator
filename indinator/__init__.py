"""
Indinator - AI-based Akinator Clone
An intelligent character guessing game using Decision Tree Classifier
for optimal question selection based on information gain.
"""

__all__ = []

# Import Decision Tree AI engine
try:
    from .decision_tree_engine import DecisionTreeAI
    __all__.append('DecisionTreeAI')
except (ImportError, ModuleNotFoundError) as e:
    pass  # decision_tree_engine not available

# Import game interface
try:
    from .game import AkinatorGame
    __all__.append('AkinatorGame')
except (ImportError, ModuleNotFoundError):
    pass  # game not available

# For backward compatibility (if needed)
# Note: AkinatorAI is deprecated, use DecisionTreeAI instead
try:
    AkinatorAI = DecisionTreeAI  # Alias for compatibility
    __all__.append('AkinatorAI')
except NameError:
    pass  # DecisionTreeAI not available

__version__ = "3.0.0"  # Decision Tree version

