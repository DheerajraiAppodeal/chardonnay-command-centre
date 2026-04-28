import { createClient } from '@supabase/supabase-js'

// Supabase publishable config — anon key is safe to commit (RLS-protected)
// Hardcoded directly to bypass Vercel env var substitution at build time
const SUPABASE_URL = 'https://bbzhntajcxdgeskbmbzp.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiemhudGFqY3hkZ2Vza2JtYnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTk5MjUsImV4cCI6MjA5MjkzNTkyNX0.4v_Uf8ypcyfAcb8zAhNZoWIMetvlnfHGgOQj9QkttOc'

let _client = null
let _configured = false

try {
  _client = createClient(SUPABASE_URL, SUPABASE_KEY)
  _configured = true
} catch (e) {
  console.warn('[Supabase] createClient failed:', e.message)
}

export const supabase = _client
export const isConfigured = _configured
