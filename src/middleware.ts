// src/middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('*******************************************');
  console.log('MIDDLEWARE EJECUTÁNDOSE para:', request.nextUrl.pathname);
  console.log('NEXT_PUBLIC_SUPABASE_URL en middleware:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY en middleware:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Presente" : "AUSENTE o VACÍO"); // No imprimas la clave directamente por seguridad
  console.log('*******************************************');

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // ... (resto del código del middleware como lo tenías)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // console.log(`Middleware GET cookie: ${name}`);
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // console.log(`Middleware SET cookie: ${name}`);
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // console.log(`Middleware REMOVE cookie: ${name}`);
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.getSession();
  // console.log('Middleware: Sesión refrescada (o intentado)');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};