// src/components/admin/AdminNavbarDashboard.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
// ANIMACIÓN: Importamos motion y AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoMenu } from 'react-icons/io5'; // Usaremos íconos de react-icons para facilitar la animación

export default function AdminNavbarDashboard() {
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };
  
  // ANIMACIÓN: Variantes para el menú móvil y sus ítems
  const mobileMenuVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24, staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <nav className="bg-[#002266] text-[#F7FAFC] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="font-bold text-xl hover:text-[#EBF4FF] transition-colors duration-150">
              Temuco Admin
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  // ANIMACIÓN: Hover sutil en los links de escritorio
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                      ${pathname === item.href ? 'text-white' : 'text-[#EBF4FF] hover:text-white'}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8102E]"
                        layoutId="underline"
                      />
                    )}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user?.email && (
                <span className="text-sm text-[#EBF4FF] mr-3">
                  Hola, {user.email.split('@')[0]}
                </span>
              )}
              {/* ANIMACIÓN: Botón con feedback visual en hover y tap */}
              <motion.button
                onClick={handleSignOut}
                className="bg-[#C8102E] text-[#F7FAFC] px-3 py-2 rounded-md text-sm font-medium"
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                Cerrar Sesión
              </motion.button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* ANIMACIÓN: Transición entre ícono de hamburguesa y 'X' */}
            <button
              type="button"
              className="relative h-10 w-10 inline-flex items-center justify-center p-2 rounded-md text-[#EBF4FF] hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence initial={false}>
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ANIMACIÓN: Menú móvil con entrada/salida y cascada */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-[#002266] shadow-lg absolute top-16 inset-x-0 z-40"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <motion.a
                  key={`mobile-${item.name}`}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150
                    ${pathname === item.href ? 'bg-[#002A7F] text-[#F7FAFC]' : 'text-[#EBF4FF] hover:bg-[#002A7F] hover:text-[#F7FAFC]'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  variants={mobileMenuItemVariants}
                >
                  {item.name}
                </motion.a>
              ))}
              <motion.div variants={mobileMenuItemVariants} className="pt-4 pb-3 border-t border-[#002A7F]">
                {user?.email && (
                  <div className="flex items-center px-3 mb-3">
                    <p className="text-base font-medium text-[#F7FAFC]">Hola, {user.email.split('@')[0]}</p>
                  </div>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#EBF4FF] hover:bg-[#002A7F] hover:text-[#F7FAFC]"
                >
                  Cerrar Sesión
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}