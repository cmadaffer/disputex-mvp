// lib/supabaseClient.js

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createServerSupabaseClient as createServerHelper } from '@supabase/auth-helpers-nextjs';

export function createClientSupabaseClient() {
  return createBrowserSupabaseClient();
}

export function createServerSupabaseClient(ctx) {
  return createServerHelper(ctx);
}
