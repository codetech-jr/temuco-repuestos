// src/app/admin/(protected)/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ANIMACIÓN: Importamos los componentes de animación
import StaggeredFadeIn from '@/components/utils/StaggeredFadeIn';
import DashboardCard from '@/components/admin/DashboardCard';

export default async function AdminDashboardPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* ANIMACIÓN: El encabezado aparece en cascada */}
      <StaggeredFadeIn>
        <div>
          <h1 className="text-3xl font-bold text-[#002A7F] mb-6">
            Bienvenido al Panel de Administración
          </h1>
        </div>
        <div>
          <p className="text-lg text-gray-700 mb-2">
            Hola, {user.email || 'Administrador'}!
          </p>
        </div>
        <div>
          <p className="text-gray-600 mb-8">
            Desde aquí puedes gestionar los electrodomésticos y repuestos de la tienda.
          </p>
        </div>
      </StaggeredFadeIn>
      
      {/* ANIMACIÓN: Las tarjetas aparecen en cascada dentro del grid */}
      <StaggeredFadeIn className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          href="/admin/electrodomesticos"
          title="Gestionar Electrodomésticos"
          description="Ver, crear, editar y eliminar electrodomésticos."
        />
        <DashboardCard 
          href="/admin/repuestos"
          title="Gestionar Repuestos"
          description="Ver, crear, editar y eliminar repuestos."
        />
        {/* Podrías añadir más DashboardCard aquí y se animarán automáticamente */}
      </StaggeredFadeIn>
    </div>
  );
}