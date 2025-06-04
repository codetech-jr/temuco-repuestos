// src/app/admin/layout.tsx
'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext'; // Importa AuthProvider y useAuth
import { Toaster } from 'react-hot-toast';
import AdminNavbarDashboard from '@/components/admin/AdminNavbarDashboard';

interface AdminLayoutProps {
  children: ReactNode;
}

// Componente interno que consume el AuthContext
function ProtectedAdminContent({ children }: AdminLayoutProps) {
  const { user, isLoading, session } = useAuth(); // Usa el hook del contexto
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // La lógica de getSession() ya está en AuthProvider, aquí solo reaccionamos
    console.log("ProtectedAdminContent useEffect: isLoading", isLoading, "user", !!user, "pathname", pathname);

    if (!isLoading && !user && pathname !== '/admin/login') {
      console.log("ProtectedAdminContent: No autenticado, redirigiendo a login desde", pathname);
      router.push('/admin/login');
    } else if (!isLoading && user && pathname === '/admin/login') {
      console.log("ProtectedAdminContent: Autenticado, redirigiendo desde login a /admin/dashboard");
      router.push('/admin/dashboard'); // O tu página principal de admin
    }
  }, [user, isLoading, router, pathname, session]); // session podría ser útil para re-evaluar si cambia directamente

  if (isLoading && pathname !== '/admin/login') {
    return <div className="flex justify-center items-center min-h-screen">Cargando sesión...</div>;
  }
  if (!isLoading && !user && pathname !== '/admin/login') {
     // Debería haber redirigido, pero como fallback
    return <div className="flex justify-center items-center min-h-screen">Redirigiendo a login...</div>;
  }
  if (!isLoading && user && pathname === '/admin/login') {
    // Debería haber redirigido
    return <div className="flex justify-center items-center min-h-screen">Redirigiendo al panel...</div>;
  }

  // Solo renderizar el layout si no estamos cargando Y (somos la página de login O el usuario existe)
  // Esto es para asegurar que el login se muestre si no hay usuario.
  const canRenderContent = !isLoading && (pathname === '/admin/login' || !!user);

  if (!canRenderContent) {
    // Si no es isLoading y no se cumple la condición de arriba, es un estado intermedio de redirección.
    return <div className="flex justify-center items-center min-h-screen">Verificando acceso...</div>;
  }

  const showAdminNavbarDashboard = !!user && pathname !== '/admin/login';

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff', fontSize: '14px' },
          success: { duration: 3000, iconTheme: { primary: 'green', secondary: 'white' }},
          error: { duration: 5000, iconTheme: { primary: 'red', secondary: 'white' }}
        }}
      />
      {showAdminNavbarDashboard && <AdminNavbarDashboard />} {/* AdminNavbar ahora usa useAuth() internamente */}
      <main className={showAdminNavbarDashboard ? "pt-4 md:pt-6 lg:pt-8 pb-12" : ""}> {/* Ajustar padding */}
        {children}
      </main>
    </>
  );
}

// El layout que se exporta por defecto
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider> {/* AuthProvider envuelve el contenido protegido */}
      <ProtectedAdminContent>{children}</ProtectedAdminContent>
    </AuthProvider>
  );
}