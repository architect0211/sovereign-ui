import React, { useRef, useState } from 'react';
import { transcribeAndCallBuddy } from '@/utils/api';

const PushToTalkButton: React.FC<{ setMessages: Function; speak: Function }> = ({ setMessages, speak }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');

  const startRecording = async () => {
    setStatus('🎙️ Recording...');
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setStatus('⏳ Transcribing...');
      try {
        const reply = await transcribeAndCallBuddy(blob);
        setMessages((prev: string[]) => [...prev, `🧑‍🚀 You (voice): [spoken]`, `🤖 Sov B: ${reply}`]);
        speak(reply);
        setStatus('✅ Buddy Responded');
      } catch (err) {
        console.error(err);
        setStatus('❌ Error during transcription');
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus('⏳ Processing...');
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        className={`px-6 py-2 font-semibold rounded text-white transition duration-200 ${
          isRecording ? 'bg-red-600' : 'bg-green-600'
        }`}
      >
        {isRecording ? 'Release to Send' : 'Hold to Speak'}
      </button>
      <p className="text-sm text-yellow-300">{status}</p>
    </div>
  );
};

export default PushToTalkButton;
