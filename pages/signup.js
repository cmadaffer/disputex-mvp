import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Form.module.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSignup(event) {
    event.preventDefault()
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <SiteLayout>
      <Head>
        <title>Sign up — Disputex</title>
      </Head>
      <section className={styles.page}>
        <div className="container">
          <form className={`${styles.card} ${styles.narrow}`} onSubmit={handleSignup}>
            <header className={styles.header}>
              <h1>Create an account</h1>
              <p>Spin up a workspace to generate dispute packets and collaborate with your team.</p>
            </header>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Password</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>
                Create account
              </button>
              {error && <p className={styles.note} style={{ color: '#fca5a5' }}>{error}</p>}
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  )
}
