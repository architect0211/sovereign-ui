// pages/index.tsx
export default function Home() {
  return (
    <main style={{
      backgroundColor: '#000',
      color: '#fff',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Segoe UI, Roboto, sans-serif',
      padding: '0 1rem',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '0.5rem',
        letterSpacing: '0.5px',
      }}>
        Project Enlighten
      </h1>
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: 500,
        marginBottom: '1.5rem',
      }}>
        Sovereign UI Console
      </h2>
      <p style={{
        fontSize: '1.125rem',
        maxWidth: '600px',
        opacity: 0.85,
      }}>
        Welcome to the deployment interface.<br />
        <strong>Awaiting piE2 Signal...</strong>
      </p>
    </main>
  );
}
