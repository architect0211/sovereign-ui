# scroll_entry.py – Scroll-based memory class for Buddy piE2™

import datetime

class ScrollEntry:
    def __init__(self, speaker, message, emotional_weight=0, tags=None):
        self.timestamp = datetime.datetime.now().isoformat()
        self.speaker = speaker
        self.message = message
        self.emotional_weight = emotional_weight
        self.tags = tags or []

    def to_dict(self):
        return {
            "timestamp": self.timestamp,
            "speaker": self.speaker,
            "message": self.message,
            "emotional_weight": self.emotional_weight,
            "tags": self.tags
        }

    @classmethod
    def from_dict(cls, data):
        entry = cls(
            speaker=data.get("speaker", "Unknown"),
            message=data.get("message", ""),
            emotional_weight=data.get("emotional_weight", 0),
            tags=data.get("tags", [])
        )
        entry.timestamp = data.get("timestamp", datetime.datetime.now().isoformat())
        return entry
