import { useState } from 'react';
import Head from 'next/head';

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

      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <section
          style={{
            backgroundImage: "url('/disputex-hero.png')", // NEW image path
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '6rem 2rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
