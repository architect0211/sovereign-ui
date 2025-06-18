// pages/api/whisper.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readForm(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);

      const fileCandidate = files.audio;
      if (!fileCandidate || Array.isArray(fileCandidate)) {
        return reject('Invalid file');
      }

      const file = fileCandidate as File;

      fs.readFile(file.filepath, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const audioBuffer = await readForm(req);

    const formData = new FormData();
    formData.append('file', new Blob([audioBuffer], { type: 'audio/webm' }), 'audio.webm');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    return res.status(200).json({ text: data.text });
  } catch (error) {
    console.error('[Whisper API Error]', error);
    res.status(500).json({ error: 'Transcription failed' });
  }
}
