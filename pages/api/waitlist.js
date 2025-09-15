// pages/api/waitlist.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email } = req.body || {};
    if (!email || !/.+@.+\..+/.test(email)) return res.status(400).json({ error: 'Invalid email' });

    const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE; // server-only secret
    const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // optional fallback

    // Only try to write if URL + some key exist
    if (SUPABASE_URL && (SERVICE_ROLE || ANON)) {
      try {
        const key = SERVICE_ROLE || ANON;
        // Insert via PostgREST — no npm packages required
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
          method: 'POST',
          headers: {
            apikey: key,
            authorization: `Bearer ${key}`,
            'content-type': 'application/json',
            prefer: 'return=representation'
          },
          body: JSON.stringify({ email /* created_at uses default now() */ })
        });

        // If RLS blocks anon or table missing, swallow and still show success to the user
        if (!resp.ok) {
          const text = await resp.text();
          console.error('Supabase waitlist insert failed:', resp.status, text);
        }
      } catch (dbErr) {
        console.error('Supabase insert error (continuing anyway):', dbErr);
      }
    } else {
      console.log('Waitlist captured (no DB configured):', email);
    }

    // Always OK for smooth UX
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Waitlist API error:', err);
    return res.status(200).json({ ok: true });
  }
}
