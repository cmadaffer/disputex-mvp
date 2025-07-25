// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, create: isCreating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{isCreating ? 'Create Account' : 'Login'}</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">{isCreating ? 'Create Account' : 'Login'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      <p>
        {isCreating ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsCreating(!isCreating)} style={{ color: 'blue' }}>
          {isCreating ? 'Login' : 'Create one'}
        </button>
      </p>
    </div>
  );
}
