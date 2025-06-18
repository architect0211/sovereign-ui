// utils/api.ts – Sovereign Frontend Logic for Buddy aiE2 Integration
// Handles direct mic audio transcription + text dispatch to Buddy backend

const BASE_URL = process.env.NEXT_PUBLIC_BUDDY_API_URL || 'http://localhost:5000';

/**
 * Calls Buddy’s /buddy endpoint with input text
 * @param input string - the user’s input or transcribed text
 * @param override boolean - force override mode (e.g. tone lock)
 * @param tone string - requested Buddy tone (“sovereign”, etc)
 * @returns Buddy’s response (cleaned)
 */
export async function callBuddy(input: string, override = false, tone = 'sovereign'): Promise<string> {
  console.log("🔁 Sending to:", `${BASE_URL}/buddy`);
  const res = await fetch(`${BASE_URL}/buddy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, override, tone }),
  });

  if (!res.ok) {
    console.error("❌ Buddy response failed:", res.statusText);
    throw new Error('Buddy API call failed.');
  }

  const data = await res.json();
  return data.reply;
}

/**
 * Transcribes a given audio blob using /transcribe (Whisper)
 * Then sends the resulting text to /buddy
 * @param audioBlob Blob - recorded mic audio (webm or wav)
 * @returns Buddy’s response to transcribed text
 */
export async function transcribeAndCallBuddy(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob);

  const response = await fetch(`${BASE_URL}/transcribe`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.error("❌ Transcription failed:", response.statusText);
    throw new Error('Transcription failed.');
  }

  const data = await response.json();
  const transcribedText = data.text;

  console.log("🗣️ Transcribed Text:", transcribedText);

  // Fire transcribed result into Buddy
  return await callBuddy(transcribedText, true, "sovereign");
}

export async function getPassiveMemory(): Promise<any> {
  const res = await fetch(`${BASE_URL}/memory`);
  if (!res.ok) throw new Error("Memory fetch failed");
  return res.json();
}

export async function getMemoryLog(): Promise<any> {
  const res = await fetch(`${BASE_URL}/log`);
  if (!res.ok) throw new Error("Log fetch failed");
  return res.json();
}

export async function injectMemory(entry: string, tag = "manual", tone = "neutral"): Promise<string> {
  const res = await fetch(`${BASE_URL}/inject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry, tag, tone })
  });
  if (!res.ok) throw new Error("Memory injection failed");
  const data = await res.json();
  return data.confirmation;
}

export async function saveChat(messages: string[]): Promise<string> {
  const res = await fetch(`${BASE_URL}/savechat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) throw new Error("Chat save failed");
  const data = await res.json();
  return data.status;
}
