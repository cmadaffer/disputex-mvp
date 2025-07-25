import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epwfjgumxrhfapuglvac.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwd2ZqZ3VteHJoZmFwdWdsdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzI5MjMsImV4cCI6MjA2ODgwODkyM30.x5WAirS8kqBeuDZN7QBZikFvWqMZEt1A8jRqR2akjyY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Account created! Check your email to confirm.');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Sign Up</button>
        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
      </form>
    </div>
  );
}
