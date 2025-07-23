import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://epwfjgumxrhfapuglvac.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwd2ZqZ3VteHJoZmFwdWdsdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzI5MjMsImV4cCI6MjA2ODgwODkyM30.x5WAirS8kqBeuDZN7QBZikFvWqMZEt1A8jRqR2akjyY"
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to save to waitlist' });
  }

  res.status(200).json({ success: true, message: 'Email saved to waitlist' });
}
