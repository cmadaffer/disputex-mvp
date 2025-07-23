import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState('');
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

  async function handleLetterGenerate() {
    const res = await fetch('/api/generate-dispute-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });
    const data = await res.json();
    setResult(data.letter);
    setScore(data.confidence);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Disputex</h1>
      <p style={{ textAlign: 'center' }}>AI-Powered Chargeback Defense Platform</p>

      <section style={{ margin: '3rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🔐 Join the Early Access Waitlist</h2>
        <form onSubmit={handleWaitlistSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '60%', fontSize: '1rem' }}
          />
          <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Join Waitlist
          </button>
        </form>
        {submitted && <p style={{ color: 'green', marginTop: '1rem' }}>✅ You’ve been added to the waitlist.</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ {error}</p>}
      </section>

      <section style={{ margin: '3rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>🧠 Generate Dispute Letter</h2>
        <textarea
          rows={6}
          cols={60}
          placeholder="Describe your chargeback issue..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ padding: '1rem', fontSize: '1rem', width: '100%' }}
        />
        <br />
        <button onClick={handleLetterGenerate} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}>
          Generate Letter
        </button>

        {result && (
          <div style={{ marginTop: '2rem', background: '#f8f8f8', padding: '1rem', borderRadius: '6px' }}>
            <h3>📄 Generated Letter</h3>
            <pre>{result}</pre>
            <p><strong>Confidence Score:</strong> {score}</p>
          </div>
        )}
      </section>
    </main>
  );
)
