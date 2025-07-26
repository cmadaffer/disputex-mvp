// /lib/supabaseClient.js

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient as supabaseServerClient } from '@supabase/auth-helpers-nextjs';

// CLIENT SIDE
export const createClientSupabaseClient = () => {
  return createBrowserSupabaseClient();
};

// SERVER SIDE
export const createServerSupabaseClient = (req, res) => {
  return supabaseServerClient({ req, res });
};
