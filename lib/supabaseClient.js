import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase ENV vars are missing. App may not function properly.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)
