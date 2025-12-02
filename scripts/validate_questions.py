"""
Validation script for questions.json
Ensures all questions have positive and negative examples.
"""

import json
import sys
from pathlib import Path

def validate_questions(questions_file: str, traits_file: str):
    """Validate questions against character traits."""
    
    # Load data
    with open(questions_file, 'r', encoding='utf-8') as f:
        questions_data = json.load(f)
    
    with open(traits_file, 'r', encoding='utf-8') as f:
        traits_data = json.load(f)
    
    # Handle both array and object with "questions" key
    if isinstance(questions_data, dict) and 'questions' in questions_data:
        questions = questions_data['questions']
    else:
        questions = questions_data
    
    num_characters = len(traits_data)
    
    print("=" * 70)
    print("QUESTION VALIDATION")
    print("=" * 70)
    print(f"Total questions: {len(questions)}")
    print(f"Total characters: {num_characters}\n")
    
    issues = {
        'no_positive': [],
        'no_negative': [],
        'too_few_positive': [],  # ≤2
        'too_few_negative': [],  # ≤2
        'unbalanced': [],  # <10% or >90% positive
        'missing_trait': []
    }
    
    for q in questions:
        trait = q.get('trait', '')
        if not trait:
            continue
        
        # Count positive examples
        positive_count = 0
        trait_exists = False
        
        for char, char_traits in traits_data.items():
            if trait in char_traits:
                trait_exists = True
                if char_traits.get(trait, 0) == 1:
                    positive_count += 1
        
        negative_count = num_characters - positive_count
        positive_pct = (positive_count / num_characters * 100) if num_characters > 0 else 0
        
        # Check for issues
        if not trait_exists:
            issues['missing_trait'].append((q, trait))
        elif positive_count == 0:
            issues['no_positive'].append((q, positive_count, negative_count))
        elif negative_count == 0:
            issues['no_negative'].append((q, positive_count, negative_count))
        elif positive_count <= 2:
            issues['too_few_positive'].append((q, positive_count, negative_count, positive_pct))
        elif negative_count <= 2:
            issues['too_few_negative'].append((q, positive_count, negative_count, positive_pct))
        elif positive_pct < 10 or positive_pct > 90:
            issues['unbalanced'].append((q, positive_count, negative_count, positive_pct))
    
    # Report issues
    total_issues = sum(len(v) for v in issues.values())
    
    if issues['missing_trait']:
        print(f"❌ QUESTIONS WITH MISSING TRAITS ({len(issues['missing_trait'])}):")
        for q, trait in issues['missing_trait']:
            print(f"   - {trait}: \"{q.get('question', 'N/A')}\"")
        print()
    
    if issues['no_positive']:
        print(f"❌ QUESTIONS WITH NO POSITIVE EXAMPLES ({len(issues['no_positive'])}):")
        for q, pos, neg in issues['no_positive']:
            print(f"   - {q.get('trait', 'N/A')}: \"{q.get('question', 'N/A')}\"")
        print()
    
    if issues['no_negative']:
        print(f"❌ QUESTIONS WITH NO NEGATIVE EXAMPLES ({len(issues['no_negative'])}):")
        for q, pos, neg in issues['no_negative']:
            print(f"   - {q.get('trait', 'N/A')}: \"{q.get('question', 'N/A')}\"")
        print()
    
    if issues['too_few_positive']:
        print(f"⚠️  QUESTIONS WITH ≤2 POSITIVE EXAMPLES ({len(issues['too_few_positive'])}):")
        for q, pos, neg, pct in issues['too_few_positive'][:10]:
            print(f"   - {q.get('trait', 'N/A')}: \"{q.get('question', 'N/A')}\" ({pos} positive, {pct:.1f}%)")
        if len(issues['too_few_positive']) > 10:
            print(f"   ... and {len(issues['too_few_positive']) - 10} more")
        print()
    
    if issues['too_few_negative']:
        print(f"⚠️  QUESTIONS WITH ≤2 NEGATIVE EXAMPLES ({len(issues['too_few_negative'])}):")
        for q, pos, neg, pct in issues['too_few_negative'][:10]:
            print(f"   - {q.get('trait', 'N/A')}: \"{q.get('question', 'N/A')}\" ({pos} positive, {pct:.1f}%)")
        if len(issues['too_few_negative']) > 10:
            print(f"   ... and {len(issues['too_few_negative']) - 10} more")
        print()
    
    if issues['unbalanced']:
        print(f"⚠️  UNBALANCED QUESTIONS (<10% or >90% positive) ({len(issues['unbalanced'])}):")
        for q, pos, neg, pct in issues['unbalanced'][:10]:
            print(f"   - {q.get('trait', 'N/A')}: \"{q.get('question', 'N/A')}\" ({pct:.1f}% positive)")
        if len(issues['unbalanced']) > 10:
            print(f"   ... and {len(issues['unbalanced']) - 10} more")
        print()
    
    print("=" * 70)
    if total_issues == 0:
        print("✅ ALL QUESTIONS VALID!")
    else:
        print(f"❌ FOUND {total_issues} ISSUES")
        print("\nRecommendations:")
        if issues['no_positive'] or issues['no_negative']:
            print("  - Remove questions with no positive or negative examples")
        if issues['too_few_positive'] or issues['too_few_negative']:
            print("  - Review questions with very few examples (≤2)")
        if issues['unbalanced']:
            print("  - Consider rephrasing unbalanced questions")
    print("=" * 70)
    
    return total_issues == 0


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    questions_file = project_root / "data" / "questions.json"
    traits_file = project_root / "data" / "traits_flat.json"
    
    if not questions_file.exists():
        print(f"❌ Error: {questions_file} not found")
        sys.exit(1)
    
    if not traits_file.exists():
        print(f"❌ Error: {traits_file} not found")
        sys.exit(1)
    
    is_valid = validate_questions(str(questions_file), str(traits_file))
    sys.exit(0 if is_valid else 1)

