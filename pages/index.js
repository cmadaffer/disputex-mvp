import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [score, setScore] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (res.ok) setSubmitted(true);
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
        <button type="submit">Join Waitlist</button>
        {submitted && <p>✅ You’ve been added to the waitlist.</p>}
      </form>

      <hr style={{ margin: '3rem 0' }} />

      <h2>Generate Dispute Letter</h2>
      <textarea
        rows={6}
        cols={60}
        placeholder="Describe your chargeback issue..."
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <br />
      <button onClick={handleLetterGenerate}>Generate Letter</button>

      {result && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Generated Letter</h3>
          <pre>{result}</pre>
          <p><strong>Confidence Score:</strong> {score}</p>
        </div>
      )}
    </main>
  );
}
