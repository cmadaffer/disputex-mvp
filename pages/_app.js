// /pages/_app.js
import '@/styles/globals.css';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import supabase from '../lib/supabaseClient';

function MyApp({ Component, pageProps }) {
  const [initialSession] = useState(pageProps.initialSession);

  return (
    <SessionContextProvider supabaseClient={supabase} initialSession={initialSession}>
      <Component {...pageProps} />
    </SessionContextProvider>
  );
}

export default MyApp;
