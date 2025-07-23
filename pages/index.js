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
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          maxWidth: '1100px',
          margin: '0 auto',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ maxWidth: '550px' }}>
            <h1 style={{ fontSize: '2.8rem', lineHeight: '1.2', marginBottom: '1rem' }}>
              Never lose another dollar to chargebacks.
            </h1>
            <p style={{ fontSize: '1.2rem' }}>
              Disputex defends your business from revenue loss using AI-powered dispute letters and evidence.
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '10px',
            color: '#333',
            maxWidth: '350px',
            width: '100%',
            boxShadow: '0 0 20px rgba(0,0,0,0.15)',
            marginTop: '2rem'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Get Early Access</h3>
            <form onSubmit={handleWaitlistSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button type="submit" style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                backgroundColor: '#FF6F00',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Protect My Revenue
              </button>
            </form>
            {submitted && <p style={{ color: 'green', marginTop: '1rem' }}>✅ You’ve been added to the waitlist.</p>}
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ {error}</p>}
            <p style={{ fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center', color: '#666' }}>
              ✅ Join 230+ businesses
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
