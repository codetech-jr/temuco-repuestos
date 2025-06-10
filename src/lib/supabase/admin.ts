// src/lib/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';

// Este cliente está pensado para operaciones de backend que requieren
// privilegios de administrador y no están atadas a la sesión de un usuario.
// Usa la clave de servicio que omite las políticas RLS.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Las variables de entorno de Supabase (URL o Service Key) no están definidas.');
}

// Exportamos un cliente 'admin' que usa la clave de servicio.
// ¡Úsalo con responsabilidad y solo en el backend!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);