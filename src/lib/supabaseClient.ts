import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kykdsozpdofligxukhhz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5a2Rzb3pwZG9mbGlneHVraGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzg4NTIsImV4cCI6MjA3ODgxNDg1Mn0.Au5NZ5hauHOgTcwCkyxG_KgRO7kMp4pqajV5tWUnZ88'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
