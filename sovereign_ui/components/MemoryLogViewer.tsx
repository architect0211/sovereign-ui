// components/MemoryLogViewer.tsx
import { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  tag?: string;
  tone?: string;
  content: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

export default function MemoryLogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/log`);
        if (!res.ok) throw new Error(`Log fetch failed (${res.status})`);
        const data = await res.json();
        setLogs(data || []);
      } catch (err) {
        setError(`❌ Log error: ${err}`);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="mt-10 bg-zinc-900 text-white p-4 rounded w-full max-w-3xl border border-zinc-700">
      <h3 className="text-xl font-bold mb-4">📓 Execution Log</h3>
      {error && <p className="text-red-500">{error}</p>}
      {logs.length === 0 && !error && (
        <p className="text-gray-400">No log entries found.</p>
      )}
      <ul className="space-y-3 max-h-[300px] overflow-y-auto">
        {logs.map((entry, index) => (
          <li key={index} className="bg-zinc-800 p-3 rounded border border-zinc-600">
            <p className="text-sm text-yellow-400 mb-1">{entry.timestamp}</p>
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
