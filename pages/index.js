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
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>Disputex</h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555' }}>
        Never lose another dollar to chargebacks.
      </p>
      <p style={{ textAlign: 'center', fontSize: '1rem', marginBottom: '2rem', color: '#666' }}>
        Disputex defends your business from revenue loss using AI-powered dispute letters and evidence.
      </p>

      <section style={{ margin: '3rem 0', padding: '1.5rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>📌 What is Disputex?</h2>
        <p>
          An AI-powered chargeback defense platform that automates the creation of bank-compliant dispute letters, collects evidence,
          and helps you win back lost revenue with zero hassle. Ideal for eCommerce, SaaS, and subscription merchants.
        </p>

        <h2 style={{ marginTop: '2rem' }}>🛠 How it Works</h2>
        <ul>
          <li>Upload your dispute data or integrate via API</li>
          <li>Our system auto-generates compliant response packets</li>
          <li>You review and submit — faster and more accurately</li>
        </ul>

        <h2 style={{ marginTop: '2rem' }}>💡 Why It Works</h2>
        <ul>
          <li>Built with Visa CE 3.0 & Mastercard rules in mind</li>
          <li>AI-trained templates = higher win rates</li>
          <li>Full automation from evidence to letter creation</li>
        </ul>
      </section>

      <section style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2>🚀 Get Early Access to Disputex</h2>
        <form onSubmit={handleWaitlistSubmit} style={{ marginTop: '1rem' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '60%', fontSize: '1rem' }}
          />
          <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '1rem', backgroundColor: '#FF6F00', color: 'white', border: 'none', borderRadius: '4px' }}>
            Join Waitlist
          </button>
        </form>
        {submitted && <p style={{ color: 'green', marginTop: '1rem' }}>✅ You’ve been added to the waitlist.</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ {error}</p>}
      </section>
    </main>
  );
}
