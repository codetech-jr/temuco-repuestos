// src/lib/supabase/server.ts
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // o process.env.SUPABASE_SERVICE_ROLE_KEY! si es necesario
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Para Server Actions que modifican auth, necesitarías set y remove
      },
    }
  )
}