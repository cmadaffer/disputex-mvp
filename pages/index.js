import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Disputex</title>
      </Head>
      <main style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '3rem' }}>
        <h1>Welcome to Disputex</h1>
        <p>The AI-Powered Chargeback Defense Platform</p>
        <form style={{ marginTop: '2rem' }}>
          <input placeholder="Your Email" style={{ padding: '0.5rem', width: '300px' }} />
          <button type="submit" style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
            Join Waitlist
          </button>
        </form>
        <div style={{ marginTop: '4rem' }}>
          <h2>Generate a Dispute Letter</h2>
          <textarea rows="6" cols="60" placeholder="Describe your issue..." style={{ padding: '1rem' }}></textarea>
          <br /><br />
          <button style={{ padding: '0.75rem 2rem' }}>Generate Letter</button>
        </div>
      </main>
    </>
  );
}
