// app/admin/dashboard/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Importar Link para navegación

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  // Cambiamos apiData a un booleano para saber si se verificó el acceso
  const [accessVerified, setAccessVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // ... (useEffect para fetchUserAndSession y handleLogout se mantienen igual) ...
  useEffect(() => {
    let isMounted = true;
    const fetchUserAndSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (isMounted) {
        if (session?.user) {
          setUserEmail(session.user.email || null);
        } else {
          router.replace('/admin/login');
        }
        setIsLoadingUser(false);
      }
    };

    fetchUserAndSession();
    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };


  const verifyAdminAccess = async () => { // Renombramos la función para mayor claridad
    setIsLoadingApi(true);
    setError(null);
    setAccessVerified(false); // Resetear estado

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No hay sesión activa.');
        setIsLoadingApi(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/protected-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}. La respuesta no es JSON.`);
        }
        throw new Error(errorData.message || `Error ${response.status} al verificar acceso.`);
      }

      // No necesitamos los datos específicos, solo saber que fue exitoso
      // const data = await response.json();
      // console.log("Acceso verificado:", data);
      setAccessVerified(true);
    } catch (err: any) {
      console.error("Error al verificar acceso:", err);
      setError(err.message || 'Fallo al verificar el acceso.');
      setAccessVerified(false);
    } finally {
      setIsLoadingApi(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7FAFC]">
        <p className="text-lg text-[#718096]">Cargando información del usuario...</p>
      </div>
    );
  }

  if (!userEmail) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#002A7F] mb-4">
          Admin Dashboard
        </h1>
        <p className="text-[#2D3748] mb-1">Bienvenido, <span className="font-semibold">{userEmail}</span>!</p>
        <p className="text-[#2D3748] mb-6 text-sm">Esta página está protegida.</p>
        
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#C8102E] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] transition-colors duration-150"
        >
          Cerrar Sesión
        </button>

        <hr className="my-6 md:my-8 border-[#EBF4FF]" />

        <h2 className="text-xl sm:text-2xl font-semibold text-[#002A7F] mb-3">
          Panel de Administración
        </h2>
        {!accessVerified && ( // Mostrar botón solo si el acceso no ha sido verificado o si queremos que se pueda "re-verificar"
          <button
            onClick={verifyAdminAccess}
            disabled={isLoadingApi}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] transition-colors duration-150 mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoadingApi ? 'Verificando Acceso...' : 'Verificar Acceso a Funciones Admin'}
          </button>
        )}
        
        {error && (
          <div className="bg-red-100 border border-brand-accent-red text-brand-accent-red px-4 py-3 rounded-lg relative mb-4" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Mostrar opciones de administración si el acceso fue verificado */}
        {accessVerified && !error && (
          <div className="mt-4 p-4 bg-[#EBF4FF] border border-[#718096] rounded-md">
            <h3 className="text-lg font-semibold text-[#002A7F] mb-3">Gestionar Contenido:</h3>
            <div className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row">
              {/* Asumiendo que tienes páginas como /admin/electrodomesticos y /admin/repuestos */}
              <Link href="/admin/electrodomesticos" legacyBehavior>
                <a className="block w-full sm:w-auto text-center px-6 py-3 text-base font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-150">
                  Gestionar Electrodomésticos
                </a>
              </Link>
              <Link href="/admin/repuestos" legacyBehavior>
                <a className="block w-full sm:w-auto text-center px-6 py-3 text-base font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors duration-150">
                  Gestionar Repuestos
                </a>
              </Link>
              {/* Puedes añadir más botones/enlaces aquí */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}