// src/components/layout/Header.tsx
"use client"; // Necesario para useState y manejo de eventos del menú móvil

import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoSearch, IoClose } from "react-icons/io5"; // Añadimos IoClose para cerrar
import { useState } from "react"; // Para manejar el estado del menú móvil

// Mueve la importación del logo aquí si no es una ruta pública directa
// Si 'logo' está en public/img/logo-temuco-final.png, la ruta debe ser "/img/logo-temuco-final.png"
// const logo = "/img/logo-temuco-final.png"; // Asumiendo que está en public/img/

// O si quieres seguir usando la importación directa (menos común con Next.js Image para imágenes en public)
import logoImage from "../../../public/img/logo-temuco-final.png";


const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/repuestos", label: "Repuestos" },
  { href: "/electrodomesticos", label: "Electrodomésticos" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logoImage} alt="Temuco Logo" width={120} height={40} priority />
        </Link>

        {/* Navegación Principal (Desktop) */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-700 hover:text-[#1D4ED8] transition-colors duration-300 px-2 py-1">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Barra de Búsqueda y Botón de Menú Móvil */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* Barra de Búsqueda */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#2563EB] sm:text-sm w-32 sm:w-48 md:w-auto"
            />
            <button className="bg-[#2563EB] text-white px-3 py-[9px] rounded-r-md hover:bg-[#1D4ED8] transition-colors duration-300">
              <IoSearch size={22} />
            </button>
          </div>

          {/* Botón de Menú Móvil (solo visible en pantallas pequeñas) */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-[#1D4ED8] focus:outline-none p-2"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-40">
          <nav className="flex flex-col space-y-2 p-4">
            {navLinks.map((link) => (
              <Link
                key={`mobile-${link.href}`}
                href={link.href}
                className="text-gray-700 hover:bg-blue-50 hover:text-[#2563EB] rounded-md px-3 py-2 text-base font-medium transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic en un enlace
              >
                {link.label}
              </Link>
            ))}
            {/* Opcional: Puedes añadir la barra de búsqueda también al menú móvil si quieres */}
            {/* <div className="pt-4 mt-2 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
                />
                <button className="bg-brand-blue text-white px-3 py-[9px] rounded-r-md hover:bg-brand-blue-dark">
                  <IoSearch size={22} />
                </button>
              </div>
            </div> */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;