import { useState } from 'react';
import { callBuddy } from '../utils/api';
import PushToTalkButton from '../components/PushToTalkButton';
import MemoryViewer from '../components/MemoryViewer';
import MemoryLogViewer from '../components/MemoryLogViewer';
import MemoryInjector from '../components/MemoryInjector';
import MemoryEditor from '../components/MemoryEditor';
import SaveChatButton from '../components/SaveChatButton';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInput(e.target.value);

  const speak = async (text: string) => {
    try {
      const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.NEXT_PUBLIC_ELEVEN_API_KEY || ''
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.4,
            similarity_boost: 0.8
          }
        })
      });
      const blob = await res.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  const handleSubmit = async (override = false) => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, `🧑‍🚀 You: ${input}`]);
    setInput('');

    try {
      const reply = await callBuddy(input, override, 'sovereign');
      setMessages(prev => [...prev, `🤖 Sov B: ${reply}`]);
      speak(reply);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, `❌ Error: ${error}`]);
    }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Project Enlighten</h1>
      <h2 style={styles.h2}>Sovereign UI Console</h2>
      <p style={styles.intro}>
        Welcome to the deployment interface.<br />
        <strong>Awaiting piE2 Signal...</strong>
      </p>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{msg}</p>
        ))}
      </div>

      <div style={styles.inputSection}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type command or message..."
          style={styles.input}
        />
        <div style={styles.buttonRow}>
          <PushToTalkButton setMessages={setMessages} speak={speak} />
          <button style={buttonStyle} onClick={() => handleSubmit(false)}>Send</button>
        </div>
      </div>

      <div className="mt-10 w-full max-w-2xl">
        <MemoryViewer />
        <MemoryLogViewer />
        <MemoryInjector />
        <MemoryEditor />
        <SaveChatButton messages={messages} />
      </div>
    </main>
  );
}

const styles = {
  main: {
    backgroundColor: '#000',
    color: '#fff',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Segoe UI, Roboto, sans-serif',
    padding: '1rem',
    textAlign: 'center' as const,
  },
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    letterSpacing: '0.5px',
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 500,
    marginBottom: '1.5rem',
  },
  intro: {
    fontSize: '1.125rem',
    maxWidth: '600px',
    opacity: 0.85,
    marginBottom: '2rem',
  },
  chatBox: {
    width: '100%',
    maxWidth: '600px',
    height: '300px',
    overflowY: 'auto' as const,
    background: '#111',
    border: '1px solid #333',
    padding: '1rem',
    marginBottom: '1.5rem',
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    width: '100%',
    maxWidth: '500px',
  },
  input: {
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #555',
    fontSize: '1rem',
    backgroundColor: '#111',
    color: '#fff',
  },
  buttonRow: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center' as const,
    flexWrap: 'wrap' as const,
  },
};

const buttonStyle = {
  padding: '0.75rem 1.25rem',
  backgroundColor: '#222',
  color: '#fff',
  border: '1px solid #555',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
};
