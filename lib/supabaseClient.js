// /lib/supabaseClient.js

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// CLIENT SIDE
export const createClientSupabaseClient = () => {
  return createBrowserSupabaseClient();
};

// SERVER SIDE
export const createServerSupabaseClient = (req, res) => {
  return createServerSupabaseClient({ req, res });
};
