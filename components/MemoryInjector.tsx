// components/MemoryInjector.tsx
import { useState } from 'react';

export default function MemoryInjector() {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('manual');
  const [tone, setTone] = useState('neutral');
  const [status, setStatus] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

  const injectMemory = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`${BASE_URL}/inject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tag, tone }),
      });

      if (!res.ok) throw new Error('Injection failed');
      const data = await res.json();
      setStatus(`✅ Injected: ${data.entry.tag}`);
      setContent('');
    } catch (err) {
      console.error('Injection error:', err);
      setStatus(`❌ Injection error: ${err}`);
    }
  };

  return (
    <div className="mt-10 bg-zinc-900 text-white p-4 rounded w-full max-w-3xl border border-zinc-700">
      <h3 className="text-xl font-bold mb-4">➕ Inject Memory Entry</h3>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="Enter memory content..."
        className="w-full p-2 mb-3 bg-zinc-800 border border-zinc-600 rounded text-white"
      />

      <div className="flex gap-4 mb-3">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Tag (e.g. loop, system, oracle)"
          className="flex-1 p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
        />
        <input
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="Tone (e.g. calm, firm)"
          className="flex-1 p-2 bg-zinc-800 border border-zinc-600 rounded text-white"
        />
      </div>

      <button
        onClick={injectMemory}
        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
      >
        🧠 Inject
      </button>

      {status && <p className="mt-3 text-sm text-yellow-400">{status}</p>}
    </div>
  );
}
