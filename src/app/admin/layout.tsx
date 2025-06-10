// src/app/admin/layout.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import AdminNavbarDashboard from '@/components/admin/AdminNavbarDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// ANIMACIÓN: Importamos motion y AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: ReactNode;
}

function ProtectedAdminContent({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (!isLoading && user && pathname === '/admin/login') {
      router.push('/admin/dashboard');
    }
  }, [user, isLoading, router, pathname]);

  // ANIMACIÓN: Usamos AnimatePresence para gestionar las transiciones entre estados
  return (
    <AnimatePresence mode="wait">
      {/* Estado de Carga y Redirección */}
      {isLoading || (!user && pathname !== '/admin/login') || (user && pathname === '/admin/login') ? (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-center items-center min-h-screen bg-gray-100"
        >
          <LoadingSpinner size={60} />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-700 mt-4"
          >
            Verificando sesión...
          </motion.p>
        </motion.div>
      ) : (
        /* Estado de Contenido Renderizado */
        <motion.div
          key="content-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#333', color: '#fff', fontSize: '14px' },
              success: { duration: 3000, iconTheme: { primary: 'green', secondary: 'white' }},
              error: { duration: 5000, iconTheme: { primary: 'red', secondary: 'white' }}
            }}
          />
          {/* ANIMACIÓN: El Navbar se desliza desde arriba */}
          {pathname !== '/admin/login' && (
            <motion.div
              initial={{ y: -64, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            >
              <AdminNavbarDashboard />
            </motion.div>
          )}
          {/* ANIMACIÓN: El contenido principal aparece con un fundido */}
          <motion.main 
            className={pathname !== '/admin/login' ? "p-4 md:p-6 lg:p-8" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            {children}
          </motion.main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthProvider>
      <ProtectedAdminContent>{children}</ProtectedAdminContent>
    </AuthProvider>
  );
}