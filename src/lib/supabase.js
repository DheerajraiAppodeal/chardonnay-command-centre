import { createClient } from '@supabase/supabase-js'

// Supabase config — anon/publishable key is safe to expose in client code
// See: https://supabase.com/docs/guides/api/api-keys
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
  || 'https://bbzhntajcxdgeskbmbzp.supabase.co'

const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
  || 'sb_publishable_yg4cwAEi_Rq9aqe9KJrhPQ_Cq7gkb3z'

export const isConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY)

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null
