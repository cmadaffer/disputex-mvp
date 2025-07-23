import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Disputex – AI Chargeback Defense</title>
        <meta name="description" content="Disputex automatically defends your business from revenue loss using AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: '40px',
        }}
      >
        <Image
          src="/A_promotional_digital_graphic_for_Disputex,_an_AI-.png"
          alt="Disputex Promotional Graphic"
          width={1200}
          height={800}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        />

        <div style={{ marginTop: '40px', textAlign: 'center', width: '100%', maxWidth: '600px' }}>
          <form
            action="https://YOUR_SUPABASE_ENDPOINT_HERE" // Replace this with your actual form handler
            method="POST"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              style={{
                padding: '16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                width: '100%',
              }}
            />

            <button
              type="submit"
              style={{
                padding: '16px',
                fontSize: '16px',
                borderRadius: '8px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Request Early Access
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
