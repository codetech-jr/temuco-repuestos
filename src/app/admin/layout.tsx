// src/app/admin/layout.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminNavbarDashboard from '@/components/admin/AdminNavbarDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AdminLayoutProps {
  children: ReactNode;
}

function ProtectedAdminContent({ children }: AdminLayoutProps) {
  const { user, isLoading, session } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (!isLoading && user && pathname === '/admin/login') {
      router.push('/admin/dashboard');
    }
  }, [user, isLoading, router, pathname, session]);

  // Loading states
  if (isLoading && pathname !== '/admin/login') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner size={60} />
        <p className="text-lg text-gray-700 mt-4">Verificando sesión...</p>
      </div>
    );
  }

  if (!isLoading && !user && pathname !== '/admin/login') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner size={60} />
        <p className="text-lg text-gray-700 mt-4">Redirigiendo a login...</p>
      </div>
    );
  }

  if (!isLoading && user && pathname === '/admin/login') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner size={60} />
        <p className="text-lg text-gray-700 mt-4">Redirigiendo al panel...</p>
      </div>
    );
  }

  const canRenderContent = !isLoading && (pathname === '/admin/login' || !!user);

  if (!canRenderContent) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner size={60} />
        <p className="text-lg text-gray-700 mt-4">Verificando acceso...</p>
      </div>
    );
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
      {showAdminNavbarDashboard && <AdminNavbarDashboard />}
      <main className={showAdminNavbarDashboard ? "p-4 md:p-6 lg:p-8" : ""}>
        {children}
      </main>
    </>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <ProtectedAdminContent>{children}</ProtectedAdminContent>
    </AuthProvider>
  );
}