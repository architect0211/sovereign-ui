// /pages/api/tts.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required for speech synthesis.' });

  try {
    const ttsResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'onyx', // Options: onyx, alloy, echo, fable, nova, shimmer
        input: text
      })
    });

    const audioBuffer = await ttsResponse.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(audioBuffer));
  } catch (error) {
    res.status(500).json({ error: 'TTS request failed.', detail: error });
  }
}
