import { useState } from 'react';

interface Props {
  messages: string[];
}

const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

export default function SaveChatButton({ messages }: Props) {
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    if (messages.length === 0) return;

    const content = messages.join('\n');

    try {
      const res = await fetch(`${BASE_URL}/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          tag: 'session',
          tone: 'neutral',
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      setStatus(`✅ Chat saved as: ${data.entry.tag}`);
    } catch (err) {
      console.error('Save error:', err);
      setStatus(`❌ Save failed: ${err}`);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleSave}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
      >
        💾 Save Chat to Memory
      </button>
      {status && <p className="mt-2 text-yellow-300 text-sm">{status}</p>}
    </div>
  );
}
