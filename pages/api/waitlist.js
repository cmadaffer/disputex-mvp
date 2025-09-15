// pages/api/waitlist.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || !/.+@.+\..+/.test(email)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If Supabase envs exist, try to save. If not, we just log and succeed.
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Table name: waitlist  (columns: id uuid default uuid_generate_v4(), email text unique, created_at timestamptz)
        const { error } = await supabase
          .from('waitlist')
          .insert({ email, created_at: new Date().toISOString() });

        if (error) throw error;
      } catch (dbErr) {
        console.error('Supabase insert failed (continuing anyway):', dbErr);
        // We still succeed so your user never sees a failure.
      }
    } else {
      console.log('Waitlist (no DB configured):', email);
    }

    // Always return OK to keep UX smooth.
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Waitlist API error:', err);
    // Still return OK so the user sees success instead of an error banner
    return res.status(200).json({ ok: true });
  }
}
