// pages/login.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../utils/supabaseClient'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) router.push('/dashboard')
    })
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError(null)

    const action = isSignup
      ? supabase.auth.signUp({ email, password })
      : supabase.auth.signInWithPassword({ email, password })

    const { error } = await action
    if (error) return setError(error.message)

    router.push('/dashboard')
  }

  return (
    <div style={{ padding: 50, fontFamily: 'Arial', maxWidth: 400, margin: '0 auto' }}>
      <h1>{isSignup ? 'Create Account' : 'Login to Disputex'}</h1>

      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
        />
        <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#FF6F00', color: 'white', border: 'none' }}>
          {isSignup ? 'Create Account' : 'Login'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>❌ {error}</p>}

      <p style={{ marginTop: '1rem' }}>
        {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
        <a onClick={() => setIsSignup(!isSignup)} style={{ color: '#FF6F00', cursor: 'pointer', textDecoration: 'underline' }}>
          {isSignup ? 'Login' : 'Create one'}
        </a>
      </p>
    </div>
  )
}
