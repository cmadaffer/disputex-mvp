import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = 'https://epwfjgumxrhfapuglvac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwd2ZqZ3VteHJoZmFwdWdsdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzI5MjMsImV4cCI6MjA2ODgwODkyM30.x5WAirS8kqBeuDZN7QBZikFvWqMZEt1A8jRqR2akjyY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%' }}
          />
        </div>
        <button type="submit">Login</button>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </form>

      <div style={{ marginTop: '1rem' }}>
        <p>Don't have an account? <Link href="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}
