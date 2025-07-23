
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAIResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(false);
    setError('');
    setAIResponse('');
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      // Simulate AI reply
      const fakeAI = `Dear card issuer,\n\nWe are submitting a response regarding the dispute associated with the transaction described by the customer: "${message}".\n\nOur systems confirm the charge was valid and authorized by the user. Documentation is attached.\n\nSincerely,\nDisputex AI Defense Engine`;

      setAIResponse(fakeAI);
      setSubmitted(true);
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600, margin: 'auto' }}>
      <h1>Disputex</h1>
      <p>AI-Powered Chargeback Defense Platform</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <textarea
          placeholder="Describe your dispute (e.g., I was billed twice for the same item...)"
          value={message}
          onChange={e => setMessage(e.target.value)}
          rows={5}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Generate Dispute Letter'}
        </button>
        {submitted && <p style={{ color: 'green' }}>✅ Email saved. Letter generated below.</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      </form>

      {aiResponse && (
        <section style={{ marginTop: '2rem', whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: '1rem', borderRadius: '6px' }}>
          <h3>Your AI-Generated Response:</h3>
          <p>{aiResponse}</p>
          <button style={{ marginTop: '1rem' }} onClick={() => alert('PDF export coming soon!')}>
            📄 Download PDF
          </button>
        </section>
      )}
    </main>
  );
}
