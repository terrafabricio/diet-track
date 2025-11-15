// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// 1. Cole as chaves que você encontrou no Supabase
// (são as da sua imagem 761567c8-234e-47b8-9fba-39706fab37e2.pdf)

const supabaseUrl = 'https://kykdsozpdofligxukhhz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5a2Rzb3pwZG9mbGlneHVraGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMzg4NTIsImV4cCI6MjA3ODgxNDg1Mn0.Au5NZ5hauHOgTcwCkyxG_KgRO7kMp4pqajV5tWUnZ88'

// 2. Este 'supabase' é o seu conector oficial com o banco.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// src/lib/supabaseClient.ts (Substituição Completa e Segura)

import { createClient } from '@supabase/supabase-js'

// 1. Lê as chaves das "Variáveis de Ambiente" (o "cofre secreto")
// O 'VITE_' é necessário por causa do Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Verifica se as chaves foram encontradas no "cofre"
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Chaves do Supabase (URL ou Anon Key) não foram encontradas nas Variáveis de Ambiente.")
}

// 3. Este 'supabase' é o seu conector oficial com o banco.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
