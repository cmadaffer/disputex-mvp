import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'
import SiteLayout from '../components/SiteLayout'
import styles from '../styles/Form.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <SiteLayout>
      <Head>
        <title>Login — Disputex</title>
      </Head>
      <section className={styles.page}>
        <div className="container">
          <form className={`${styles.card} ${styles.narrow}`} onSubmit={handleLogin}>
            <header className={styles.header}>
              <h1>Client login</h1>
              <p>Access dispute workspaces, evidence files, and submission history.</p>
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
                Log in
              </button>
              {error && <p className={styles.note} style={{ color: '#fca5a5' }}>{error}</p>}
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  )
}
