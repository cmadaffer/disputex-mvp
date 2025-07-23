
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Disputex</h1>
      <p>AI-Powered Chargeback Defense Platform</p>

      <form onSubmit={handleWaitlistSubmit} style={{ marginTop: '2rem' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Join Waitlist'}
        </button>
        {submitted && <p style={{ color: 'green' }}>✅ You’ve been added to the waitlist.</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      </form>
    </main>
  );
}
