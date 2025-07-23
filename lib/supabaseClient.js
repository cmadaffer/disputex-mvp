import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://epwfjgumxrhfapuglvac.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwd2ZqZ3VteHJoZmFwdWdsdmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMzI5MjMsImV4cCI6MjA2ODgwODkyM30.x5WAirS8kqBeuDZN7QBZikFvWqMZEt1A8jRqR2akjyY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
