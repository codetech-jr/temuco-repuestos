// src/components/admin/AdminNavbarDashboard.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react'; // Para el menú móvil

export default function AdminNavbarDashboard() {
  const { user, signOut, isLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    // { name: 'Productos', href: '/admin/products' }, // Ejemplo
    // { name: 'Pedidos', href: '/admin/orders' },   // Ejemplo
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // No mostrar nada si está cargando o si el usuario no existe (el layout debería redirigir)
  if (isLoading || !user) {
    return null;
  }

  return (
    // Fondo del Navbar: Azul muy oscuro. Texto base: Casi blanco azulado (para el logo).
    <nav className="bg-[#002266] text-[#F7FAFC] shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" legacyBehavior>
              {/* Título/Logo: Texto casi blanco azulado, hover azul muy pálido */}
              <a className="font-bold text-xl hover:text-[#EBF4FF] transition-colors duration-150">
                Temuco Admin
              </a>
            </Link>
            {/* Navegación Desktop */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <a
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
                        ${pathname === item.href
                          // Activo: Fondo azul oscuro principal, texto casi blanco azulado
                          ? 'bg-[#002A7F] text-[#F7FAFC]'
                          // Inactivo: Texto azul muy pálido, hover con fondo azul oscuro principal y texto casi blanco
                          : 'text-[#EBF4FF] hover:bg-[#002A7F] hover:text-[#F7FAFC]'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú móvil al hacer clic
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Sección derecha del Navbar (Desktop) */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user?.email && (
                // Texto de bienvenida: Azul muy pálido
                <span className="text-sm text-[#EBF4FF] mr-3">
                  Hola, {user.email.split('@')[0]} {/* Mostrar solo la parte antes del @ */}
                </span>
              )}
              {/* Botón Cerrar Sesión: Fondo rojo, hover rojo más oscuro, texto casi blanco */}
              <button
                onClick={handleSignOut}
                className="bg-[#C8102E] hover:brightness-90 text-[#F7FAFC] px-3 py-2 rounded-md text-sm font-medium transition-all duration-150"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          {/* Botón de Menú Móvil */}
          <div className="-mr-2 flex md:hidden">
            <button
              type="button"
              // Fondo base heredado. Icono azul muy pálido. Hover: fondo azul oscuro, icono casi blanco. Focus: ring blanco.
              className="bg-inherit inline-flex items-center justify-center p-2 rounded-md text-[#EBF4FF] hover:text-[#F7FAFC] hover:bg-[#002A7F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#002266] focus:ring-white transition-colors duration-150"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                // Icono de 'X'
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Icono de hamburguesa
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        // Fondo igual al navbar. Sombra para destacar sobre el contenido.
        <div className="md:hidden bg-[#002266] shadow-lg absolute top-16 inset-x-0 z-50" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link key={`mobile-${item.name}`} href={item.href} legacyBehavior>
                <a
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150
                    ${pathname === item.href
                      ? 'bg-[#002A7F] text-[#F7FAFC]'
                      : 'text-[#EBF4FF] hover:bg-[#002A7F] hover:text-[#F7FAFC]'
                    }`}
                   onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic
                >
                  {item.name}
                </a>
              </Link>
            ))}
             {/* Usuario y botón de cerrar sesión en móvil */}
            <div className="pt-4 pb-3 border-t border-[#002A7F]"> {/* Borde con azul oscuro principal */}
                {user?.email && (
                    <div className="flex items-center px-3 mb-3">
                        <p className="text-base font-medium text-[#F7FAFC]">
                            Hola, {user.email.split('@')[0]}
                        </p>
                    </div>
                )}
                <button
                    onClick={handleSignOut}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#EBF4FF] hover:bg-[#002A7F] hover:text-[#F7FAFC] transition-colors duration-150"
                >
                    Cerrar Sesión
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}