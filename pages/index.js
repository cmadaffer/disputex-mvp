// pages/index.js
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  async function handleWaitlistSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitted(false)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (res.ok) setSubmitted(true)
      else setError(data.error || 'Submission failed.')
    } catch {
      setError('An unexpected error occurred.')
    }
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundImage: 'url(/background.jpg)',
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      justifyContent: isMobile ? 'center' : 'flex-end',
      alignItems: isMobile ? 'flex-end' : 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.75)',
        padding: '2rem',
        borderRadius: '12px',
        width: isMobile ? '100%' : '360px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#fff' }}>Get Early Access</h2>
        <form onSubmit={handleWaitlistSubmit}>
          <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', marginBottom: '1rem' }} />
          <button type="submit" style={{ width: '100%', backgroundColor: '#FF6F00', color: 'white', padding: '0.75rem' }}>
            Protect My Revenue
          </button>
        </form>
        {submitted && <p style={{ color: 'lightgreen' }}>✅ You’ve been added to the waitlist.</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
        <p style={{ marginTop: '1rem', color: '#ccc' }}>
          ✅ Join 230+ businesses
        </p>
        <Link href="/login" style={{ color: '#FF6F00', textDecoration: 'underline', display: 'block', marginTop: '1rem' }}>→ Login</Link>
      </div>
    </div>
  )
}
