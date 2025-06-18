import { useEffect, useState } from 'react';

interface Entry {
  timestamp: string;
  content: string;
  tag?: string;
  tone?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

export default function MemoryEditor() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMemory = async () => {
    try {
      const res = await fetch(`${BASE_URL}/memory`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError(`❌ Failed to load memory: ${err}`);
    }
  };

  const saveEdit = async (entry: Entry) => {
    try {
      const res = await fetch(`${BASE_URL}/memory/${entry.timestamp}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error("Save failed");
    } catch (err) {
      setError(`❌ Save error: ${err}`);
    }
  };

  const deleteEntry = async (timestamp: string) => {
    try {
      const res = await fetch(`${BASE_URL}/memory/${timestamp}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error("Delete failed");
      setEntries(prev => prev.filter(e => e.timestamp !== timestamp));
    } catch (err) {
      setError(`❌ Delete error: ${err}`);
    }
  };

  useEffect(() => {
    fetchMemory();
  }, []);

  return (
    <div className="mt-10 bg-zinc-900 text-white p-4 rounded w-full max-w-3xl border border-zinc-700">
      <h3 className="text-xl font-bold mb-4">✏️ Edit Passive Memory</h3>

      {error && <p className="text-red-400">{error}</p>}

      {entries.length === 0 && !error && (
        <p className="text-gray-400">No memory entries found.</p>
      )}

      <ul className="space-y-4 max-h-[400px] overflow-y-auto">
        {entries.map((entry, i) => (
          <li key={entry.timestamp} className="bg-zinc-800 p-4 rounded border border-zinc-600">
            <p className="text-xs text-gray-400 mb-2">{entry.timestamp}</p>

            <textarea
              className="w-full p-2 mb-2 bg-zinc-700 text-white rounded"
              value={entry.content}
              rows={3}
              onChange={(e) => {
                const updated = [...entries];
                updated[i].content = e.target.value;
                setEntries(updated);
              }}
            />

            <div className="flex gap-2 mb-2">
              <input
                className="flex-1 p-1 bg-zinc-700 text-white rounded"
                value={entry.tag || ''}
                placeholder="Tag"
                onChange={(e) => {
                  const updated = [...entries];
                  updated[i].tag = e.target.value;
                  setEntries(updated);
                }}
              />
              <input
                className="flex-1 p-1 bg-zinc-700 text-white rounded"
                value={entry.tone || ''}
                placeholder="Tone"
                onChange={(e) => {
                  const updated = [...entries];
                  updated[i].tone = e.target.value;
                  setEntries(updated);
                }}
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => saveEdit(entry)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded text-sm"
              >
                💾 Save
              </button>
              <button
                onClick={() => deleteEntry(entry.timestamp)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-sm"
              >
                ❌ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
