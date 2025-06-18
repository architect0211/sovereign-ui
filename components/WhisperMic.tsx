import { useState, useRef } from 'react';

export default function WhisperMic({ onTranscription }: { onTranscription: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setIsRecording(true);

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          const res = await fetch('/api/whisper', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          onTranscription(data.text || '[no transcription]');
        } catch (err) {
          onTranscription('[error: failed to transcribe]');
          console.error('Whisper transcription error:', err);
        }
      };

      recorder.start();
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert('Microphone access is required to use voice input.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      style={{
        padding: '0.75rem 1.25rem',
        backgroundColor: isRecording ? '#b00' : '#222',
        color: '#fff',
        border: '1px solid #555',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
    >
      {isRecording ? '⏹️ Stop' : '🎙️ Speak'}
    </button>
  );
}
