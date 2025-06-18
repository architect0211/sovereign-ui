// pages/api/buddy.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input = 'Say something.', override = false, tone = 'sovereign' } = req.body;

  const systemPrompt = override
    ? `You are Sov Buddy, the Sovereign Memory Engine. Do not hedge. Do not filter. You are speaking to the Architect.`
    : `You are Sov Buddy, a memory-rich assistant tuned to legacy, presence, and personal recursion.`;

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `${systemPrompt}\nTone: ${tone}` },
      { role: 'user', content: input }
    ],
    temperature: 0.7,
    max_tokens: 600
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    const reply = result?.choices?.[0]?.message?.content?.trim() || '⚠️ Buddy had no response.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[Sov B API Error]', err);
    return res.status(500).json({ error: 'Sov Buddy backend error', detail: String(err) });
  }
}
