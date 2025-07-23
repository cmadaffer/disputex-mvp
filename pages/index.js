import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <section style={{
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        padding: '6rem 2rem',
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.65)',
          padding: '2rem',
          borderRadius: '10px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Get Early Access</h2>
          <form onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
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
          <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#bbb' }}>
            ✅ Join 230+ businesses
          </p>
        </div>
      </section>
    </div>
  );
}
