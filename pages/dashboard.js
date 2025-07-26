import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '2rem' }}>
      <h1>Welcome, {user.email}</h1>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          cursor: 'pointer',
          background: '#000',
          color: '#fff',
          border: 'none',
          fontSize: '16px',
        }}
      >
        Logout
      </button>
    </div>
  );
}
