import { createClient } from '@supabase/supabase-js'

// Supabase publishable config — safe to commit, anon key has RLS protection
const URL = import.meta.env.VITE_SUPABASE_URL
  || 'https://bbzhntajcxdgeskbmbzp.supabase.co'

const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_yg4cwAEi_Rq9aqe9KJrhPQ_Cq7gkb3z'

// Guard: only create client if values look valid
const urlOk  = typeof URL === 'string' && URL.startsWith('http')
const keyOk  = typeof KEY === 'string' && KEY.length > 10

export const isConfigured = urlOk && keyOk

export const supabase = isConfigured
  ? createClient(URL, KEY)
  : null
