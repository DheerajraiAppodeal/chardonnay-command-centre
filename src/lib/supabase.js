import { createClient } from '@supabase/supabase-js'

// Supabase publishable config — safe to commit, anon key has RLS protection
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  || 'https://bbzhntajcxdgeskbmbzp.supabase.co'

const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiemhudGFqY3hkZ2Vza2JtYnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTk5MjUsImV4cCI6MjA5MjkzNTkyNX0.4v_Uf8ypcyfAcb8zAhNZoWIMetvlnfHGgOQj9QkttOc'

// Guard: validate before calling createClient — a bad value would throw
const urlOk = typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('https://')
const keyOk = typeof SUPABASE_KEY === 'string' && SUPABASE_KEY.length > 20

// Wrap in try-catch so a bad URL/key can never crash the module at load time
let _client = null
let _configured = false

if (urlOk && keyOk) {
  try {
    _client = createClient(SUPABASE_URL, SUPABASE_KEY)
    _configured = true
  } catch (e) {
    console.warn('[Supabase] createClient failed:', e.message)
  }
}

export const supabase = _client
export const isConfigured = _configured
