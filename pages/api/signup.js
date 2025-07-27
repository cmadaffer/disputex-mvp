import { createClientSupabaseClient } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { email } = req.body
  const supabase = createClientSupabaseClient()

  const { data, error } = await supabase
    .from('waitlist')
    .insert([{ email }])

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(200).json({ success: true })
}
