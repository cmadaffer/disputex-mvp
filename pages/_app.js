import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) router.push('/dashboard')
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return <Component {...pageProps} session={session} />
}
