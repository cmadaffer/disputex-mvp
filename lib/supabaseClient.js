import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

const missingConfigMessage =
  'Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY to enable auth.'

const fallback = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error(missingConfigMessage) }),
    signUp: async () => ({ data: null, error: new Error(missingConfigMessage) }),
    signOut: async () => ({ error: new Error(missingConfigMessage) }),
    getSession: async () => ({ data: { session: null } })
  },
  storage: {
    from: () => ({
      upload: async () => ({ error: new Error(missingConfigMessage) }),
      getPublicUrl: () => ({ data: { publicUrl: '' } })
    })
  }
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : fallback

export default supabase
