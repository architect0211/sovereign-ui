// components/MemoryViewer.tsx
import { useEffect, useState } from 'react';

interface MemoryEntry {
  content: string;
  tone?: string;
  timestamp?: string;
  tag?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

export default function MemoryViewer() {
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await fetch(`${BASE_URL}/memory`);
        if (!res.ok) throw new Error(`Memory fetch failed (${res.status})`);
        const data = await res.json();
        setMemory(data || []);
      } catch (err) {
        setError(`❌ Memory error: ${err}`);
      }
    };

    fetchMemory();
  }, []);

  return (
    <div className="mt-10 bg-zinc-900 text-white p-4 rounded w-full max-w-3xl border border-zinc-700">
      <h3 className="text-xl font-bold mb-4">🧠 Passive Memory</h3>
      {error && <p className="text-red-500">{error}</p>}
      {memory.length === 0 && !error && (
        <p className="text-gray-400">No memory entries found.</p>
      )}
      <ul className="space-y-3 max-h-[300px] overflow-y-auto">
        {memory.map((entry, index) => (
          <li key={index} className="bg-zinc-800 p-3 rounded border border-zinc-600">
            <p className="text-sm text-gray-400 mb-1">{entry.timestamp || '—'}</p>
            <p className="whitespace-pre-line">{entry.content}</p>
            {entry.tag && (
              <p className="text-xs text-green-400 mt-1">#{entry.tag}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
