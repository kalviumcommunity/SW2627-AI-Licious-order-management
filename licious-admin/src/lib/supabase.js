import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const hasRequiredConfig = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key')
)

const supabase = hasRequiredConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

export const isSupabaseConfigured = hasRequiredConfig
export default supabase
