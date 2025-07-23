import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitted(false);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0,
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-end',
      alignItems: isMobile ? 'flex-end' : 'center',
      padding: isMobile ? '1rem' : '2rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '2rem',
        borderRadius: '12px',
        width: isMobile ? '100%' : '360px',
        textAlign: 'center',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        marginBottom: isMobile ? '1rem' : '0'
      }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#fff' }}>Get Early Access</h2>
        <form onSubmit={handleWaitlistSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#FF6F00',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>
            Protect My Revenue
          </button>
        </form>
        {submitted && <p style={{ color: 'lightgreen', marginTop: '1rem' }}>✅ You’ve been added to the waitlist.</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ {error}</p>}
        <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#ccc' }}>
          ✅ Join 230+ businesses
        </p>
      </div>
    </div>
  );
}
