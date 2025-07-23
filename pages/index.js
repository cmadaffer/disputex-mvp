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
          padding: '20px',
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
      </main>
    </>
  );
}
