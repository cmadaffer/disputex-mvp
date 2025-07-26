// /lib/supabaseClient.js

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient as supabaseServerClient } from '@supabase/auth-helpers-nextjs';

// CLIENT SIDE
export const createClientSupabaseClient = () => {
  return createPagesBrowserClient(); // ✅ modern function
};

// SERVER SIDE
export const createServerSupabaseClient = (req, res) => {
  return supabaseServerClient({ req, res });
};
