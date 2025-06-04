// src/app/admin/(protected)/page.tsx
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server'; // Cliente Supabase para Server Components
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Aunque el layout debería proteger, una doble verificación nunca está de más
    // o si este layout se accede de alguna forma sin la protección del AuthWrapper
    redirect('/admin/login');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-[#002A7F] mb-6">
        Bienvenido al Panel de Administración
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Hola, {user.email || 'Administrador'}!
      </p>
      <p className="text-gray-600 mb-8">
        Desde aquí puedes gestionar los electrodomésticos y repuestos de la tienda.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/electrodomesticos" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-[#002A7F] mb-2">Gestionar Electrodomésticos</h2>
            <p className="text-gray-600">Ver, crear, editar y eliminar electrodomésticos.</p>
          </a>
        </Link>
        <Link href="/admin/repuestos" legacyBehavior>
          <a className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-[#002A7F] mb-2">Gestionar Repuestos</h2>
            <p className="text-gray-600">Ver, crear, editar y eliminar repuestos.</p>
          </a>
        </Link>
        {/* Podrías añadir más enlaces aquí, como a los mensajes de contacto, etc. */}
      </div>
    </div>
  );
}