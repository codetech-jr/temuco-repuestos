// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'; // O createClient si no usas SSR helpers aquí

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Para Client Components, puedes usar createBrowserClient
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);