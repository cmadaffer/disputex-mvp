// pages/_app.js
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useMemo } from 'react'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const supabaseClient = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_KEY
    if (url && key) {
      return createPagesBrowserClient({ supabaseUrl: url, supabaseKey: key })
    }
    return null
  }, [])

  if (!supabaseClient) {
    return <Component {...pageProps} />
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}
