// app/api/admin/protected-data/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/client'; // Usamos el cliente browser/universal para validar token
                                                    // O podrías crear uno específico para API si prefieres.

// Si necesitas una instancia de Supabase con cookies para el servidor
// import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = createClient(); // O createSupabaseServerClient() si usas cookies
                                 // Para validar un token JWT del header, el cliente 'client' es suficiente.

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No authorization header provided' }, { status: 401 });
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Malformed token' }, { status: 401 });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    console.error('Token validation error:', error);
    return NextResponse.json({ error: 'Invalid token or user not found' }, { status: 401 });
  }

  // Si necesitas verificar roles o permisos específicos del usuario:
  // if (user.app_metadata?.role !== 'admin') {
  //   return NextResponse.json({ error: 'Forbidden: User is not an admin' }, { status: 403 });
  // }

  // El usuario está autenticado, puedes proceder
  return NextResponse.json({
    message: `Hello ${user.email}! This is protected data from the server.`,
    userId: user.id,
    timestamp: new Date().toISOString()
  });
}