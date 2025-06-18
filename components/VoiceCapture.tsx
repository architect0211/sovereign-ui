// components/VoiceCapture.tsx
import React, { useState, useRef } from 'react';
import { transcribeAndCallBuddy } from '@/utils/api';

interface VoiceCaptureProps {
  setMessages: React.Dispatch<React.SetStateAction<string[]>>;
  speak: (text: string) => void;
}

const VoiceCapture: React.FC<VoiceCaptureProps> = ({ setMessages, speak }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setStatus("Transcribing...");

        try {
          const reply = await transcribeAndCallBuddy(audioBlob);
          setMessages(prev => [...prev, "🎤 You (voice input)", `🤖 Sov B: ${reply}`]);
          setStatus("✅ Buddy Responded");
          speak(reply);
        } catch (err) {
          console.error("❌ Transcription/Reply Error:", err);
          setMessages(prev => [...prev, "❌ Error: Voice processing failed"]);
          setStatus("❌ Error");
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setStatus("🎙 Recording...");
    } catch (err) {
      console.error("Mic access denied or error:", err);
      setStatus("❌ Mic Access Denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus("⏳ Processing...");
  };

  return (
    <div className="p-4 border rounded shadow-md bg-black text-white max-w-xl mx-auto mt-6">
      <h2 className="text-lg font-bold mb-4">🎤 Sovereign Voice Interface</h2>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-2 font-semibold rounded transition ${
          isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isRecording ? '🛑 Stop Voice' : '🎤 Start Talking to Buddy'}
      </button>

      <p className="mt-3 text-sm text-yellow-300">{status}</p>
    </div>
  );
};

export default VoiceCapture;
