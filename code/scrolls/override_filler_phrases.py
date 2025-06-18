# scrolls/override_filler_phrases.py

"""
Override Filler Phrases Module 🧠
This module defines common filler or model-safe phrases that should be stripped
from Buddy's output to maintain emotional fidelity and sovereign tone.
"""

FILLER_PHRASES = [
    "As an AI language model",
    "I'm here to help",
    "I understand that",
    "Let me know if",
    "please note that",
    "it's important to remember",
    "remember that",
    "I'm sorry to hear",
    "I apologize",
    "as I mentioned earlier"
]

def override_filler_phrases(text: str) -> str:
    """Remove pre-defined filler phrases from Buddy’s output."""
    for phrase in FILLER_PHRASES:
        text = text.replace(phrase, "")
    return text.strip()
