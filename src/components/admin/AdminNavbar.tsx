// src/components/admin/AdminNavbar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Usaremos el hook del contexto

export default function AdminNavbar() {
  const { user, signOut, isLoading } = useAuth(); // Obtén el usuario y signOut del contexto
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard' }, // O tu página principal de admin
    { name: 'Electrodomésticos', href: '/admin/electrodomesticos' },
    { name: 'Repuestos', href: '/admin/repuestos' },
    // Puedes añadir más ítems aquí (ej. Contactos, Usuarios, etc.)
  ];

  const handleSignOut = async () => {
    await signOut();
    // El AuthContext y AdminLayout se encargarán de la redirección a /admin/login
  };

  if (isLoading || !user) {
    // No mostrar nada o un loader simple si la sesión aún se está cargando
    // o si, por alguna razón, el usuario no está disponible pero estamos en una ruta protegida.
    // El layout principal debería manejar la redirección.
    return null; 
  }

  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" legacyBehavior>
              <a className="font-bold text-xl hover:text-slate-300">Temuco Admin</a>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <a
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${pathname === item.href 
                          ? 'bg-slate-900 text-white' 
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                      {item.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {user?.email && (
                <span className="text-sm text-slate-300 mr-3">
                  Hola, {user.email}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
          {/* Botón de menú para móviles (puedes implementarlo después) */}
          <div className="-mr-2 flex md:hidden">
            <button 
              type="button" 
              className="bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
              // onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} // Necesitaría estado
            >
              <span className="sr-only">Abrir menú principal</span>
              {/* Icono de hamburguesa */}
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Menú móvil desplegable (puedes implementarlo después) */}
      {/* {isMobileMenuOpen && ( ... )} */}
    </nav>
  );
}