'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import FadeIn from '@/components/utils/FadeIn';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [accessVerified, setAccessVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

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

  const verifyAdminAccess = async () => {
    setIsLoadingApi(true);
    setError(null);
    setAccessVerified(false);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No hay sesión activa.');
        setIsLoadingApi(false);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/protected-data`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch (e) { throw new Error(`Error del servidor: ${response.status} ${response.statusText}. La respuesta no es JSON.`); }
        throw new Error(errorData.message || `Error ${response.status} al verificar acceso.`);
      }
      setAccessVerified(true);
    } catch (err: any) {
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
      <FadeIn>
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-2xl sm:text-3xl font-bold text-[#002A7F] mb-4">
              Admin Dashboard
            </motion.h1>
            <motion.p variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-[#2D3748] mb-1">Bienvenido, <span className="font-semibold">{userEmail}</span>!</motion.p>
            <motion.p variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } }} className="text-[#2D3748] mb-6 text-sm">Esta página está protegida.</motion.p>
            <motion.button
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#C8102E] rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E]"
              whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar Sesión
            </motion.button>
          </motion.div>
          <hr className="my-6 md:my-8 border-[#EBF4FF]" />
          <h2 className="text-xl sm:text-2xl font-semibold text-[#002A7F] mb-3">
            Panel de Administración
          </h2>
          <AnimatePresence mode="wait">
            {!accessVerified && !error && (
              <motion.div key="verify-button" exit={{ opacity: 0, y: -10 }}>
                <motion.button
                  onClick={verifyAdminAccess}
                  disabled={isLoadingApi}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] transition-colors duration-150 mb-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[280px]"
                  whileHover={{ scale: isLoadingApi ? 1 : 1.05 }}
                  whileTap={{ scale: isLoadingApi ? 1 : 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoadingApi ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><PulseLoader size={8} color="#FFFFFF" /></motion.span>
                    ) : (
                      <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Verificar Acceso a Funciones Admin</motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            )}
            {error && (
              <motion.div
                key="error-message"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </motion.div>
            )}
            {accessVerified && !error && (
              <motion.div
                key="admin-options"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-[#EBF4FF] border border-[#718096]/20 rounded-md"
              >
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                  <motion.h3 variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="text-lg font-semibold text-[#002A7F] mb-3">Gestionar Contenido:</motion.h3>
                  <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }} className="space-y-3 sm:space-y-0 sm:space-x-3 flex flex-col sm:flex-row">
                    <Link href="/admin/electrodomesticos" legacyBehavior>
                      <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="block w-full sm:w-auto text-center px-6 py-3 text-base font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] transition-colors duration-150">
                        Gestionar Electrodomésticos
                      </motion.a>
                    </Link>
                    <Link href="/admin/repuestos" legacyBehavior>
                      <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="block w-full sm:w-auto text-center px-6 py-3 text-base font-medium text-white bg-[#002A7F] rounded-lg shadow-sm hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] transition-colors duration-150">
                        Gestionar Repuestos
                      </motion.a>
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FadeIn>
    </div>
  );
}