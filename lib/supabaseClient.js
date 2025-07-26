// /lib/supabaseClient.js

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

// For client-side Supabase usage
export const createClientSupabaseClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// For server-side Supabase usage (pass req/res manually in getServerSideProps)
export const createServerSupabaseClient = (req, res) =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      req,
      res,
    }
  );
