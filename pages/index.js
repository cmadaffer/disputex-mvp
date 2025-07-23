import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

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
        body: JSON.stringify({ email }),
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
    <>
      <Head>
        <title>Disputex – AI Chargeback Defense</title>
        <meta name="description" content="Disputex automatically defends your business from revenue loss using AI." />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#fff',
          padding: '40px 20px',
        }}
      >
        {/* Top Image */}
        <div style={{ width: '100%', maxWidth: '1200px', textAlign: 'center' }}>
          <Image
            src="/A_promotional_digital_graphic_for_Disputex,_an_AI-.png"
            alt="Disputex Hero"
            width={1200}
            height={800}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            }}
          />
        </div>

        {/* Email Form */}
        <div
          style={{
            marginTop: '40px',
            background: '#fff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '16px' }}>Get Early Access</h2>

          <form onSubmit={handleWaitlistSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                marginBottom: '16px',
              }}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#000',
                color: '#fff',
                fontSize: '16px',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Request Early Access
            </button>
          </form>

          {submitted && (
            <p style={{ color: 'green', marginTop: '16px' }}>
              You're on the list!
            </p>
          )}
          {error && (
            <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>
          )}
        </div>
      </main>
    </>
  );
}
