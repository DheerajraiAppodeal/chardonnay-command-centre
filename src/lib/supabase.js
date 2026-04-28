import { createClient } from '@supabase/supabase-js'

// Supabase publishable config — safe to commit, anon key has RLS protection
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  || 'https://bbzhntajcxdgeskbmbzp.supabase.co'

const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_yg4cwAEi_Rq9aqe9KJrhPQ_Cq7gkb3z'

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
