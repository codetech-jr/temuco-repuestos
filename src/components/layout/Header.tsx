"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose, IoChevronDown } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
// 'useRouter' ya no es necesario aquí, lo quitamos para limpiar.

// --- Importaciones de componentes ---
import { WishlistNavItem } from "./WishlistNavItem"; 
// --- NUEVA IMPORTACIÓN ---
import PredictiveSearchBar from "../catalog/PredictiveSearchBar"; // Ajusta la ruta si es necesario

import logoImage from "../../../public/img/logo-temuco-final.png";
import { serviciosDetalleData } from "@/app/data/servicios";

// ... (El resto de tus interfaces y datos de navLinks no cambia) ...
const serviciosSubLinks: NavLink[] = serviciosDetalleData.map(servicio => ({
  href: `/servicios/${servicio.slug}`,
  label: servicio.title,
}));

const repuestosSubLinks: NavLink[] = [
  { href: "/repuestos?category=Compresores", label: "Compresores" },
  { href: "/repuestos?category=Termostatos", label: "Termostatos" },
  { href: "/repuestos?category=Filtros", label: "Filtros Secadores" },
  { href: "/repuestos?category=Capacitores", label: "Capacitores" },
  { href: "/repuestos?tipo=originales", label: "Repuestos Originales" },
  { href: "/repuestos", label: "Ver Todos los Repuestos" },
];

const electrodomesticosSubLinks: NavLink[] = [
  { href: "/electrodomesticos?category=Refrigeradores", label: "Refrigeradores" },
  { href: "/electrodomesticos?category=Lavadoras", label: "Lavadoras" },
  { href: "/electrodomesticos?category=Secadoras", label: "Secadoras" },
  { href: "/electrodomesticos?category=Cocinas", label: "Cocinas" },
  { href: "/electrodomesticos?category=Aires Acondicionados", label: "Aires Acondicionados" },
  { href: "/electrodomesticos?category=Hornos", label: "Hornos y Microondas" },
  { href: "/electrodomesticos?category=Televisores", label: "Televisores" },
  { href: "/electrodomesticos", label: "Ver Todos los Electrodomésticos" },
];

const navLinks: NavLink[] = [
  { href: "/", label: "Inicio" },
  {
    href: "/repuestos",
    label: "Repuestos",
    subLinks: repuestosSubLinks,
  },
  {
    href: "/electrodomesticos",
    label: "Electrodomésticos",
    subLinks: electrodomesticosSubLinks,
  },
  {
    href: "/servicios",
    label: "Servicios",
    subLinks: serviciosSubLinks,
  },
  { href: "/quienes-somos", label: "Quiénes Somos" },
  { href: "/contacto", label: "Contacto" },
];

interface NavLink {
  href: string;
  label: string;
  subLinks?: NavLink[];
}


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownLabel, setOpenDropdownLabel] = useState<string | null>(null);
  const dropdownButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dropdownMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // --- LÓGICA DE BÚSQUEDA ELIMINADA ---
  // El estado 'searchQuery' y la función 'handleSearchSubmit' ya no son necesarios aquí.
  // Toda esa lógica ahora está encapsulada dentro de PredictiveSearchBar.

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdownLabel(null);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdownLabel(prevLabel => (prevLabel === label ? null : label));
  };

  const closeAllDropdowns = () => {
    setOpenDropdownLabel(null);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickInsideAnyDropdownButton = Object.values(dropdownButtonRefs.current).some(
        (ref) => ref && ref.contains(event.target as Node)
      );
      const isClickInsideAnyDropdownMenu = Object.values(dropdownMenuRefs.current).some(
        (ref) => ref && ref.contains(event.target as Node)
      );
      if (!isClickInsideAnyDropdownButton && !isClickInsideAnyDropdownMenu) {
        closeAllDropdowns();
      }
    };
    if (openDropdownLabel) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownLabel]);

  return (
    <header className="bg-[#F7FAFC] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center" onClick={() => { setIsMobileMenuOpen(false); closeAllDropdowns(); }}>
          <Image src={logoImage} alt="Temuco Logo" width={120} height={40} priority />
        </Link>

        {/* Navegación Principal (Desktop) */}
        <nav className="hidden lg:flex items-center space-x-3 lg:space-x-4">
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.subLinks ? (
                <button
                  ref={(el) => (dropdownButtonRefs.current[link.label] = el)}
                  onClick={() => handleDropdownToggle(link.label)}
                  className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  {link.label}
                  <IoChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      openDropdownLabel === link.label ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={link.href}
                  className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                  onClick={closeAllDropdowns}
                >
                  {link.label}
                </Link>
              )}

              {link.subLinks && openDropdownLabel === link.label && (
                <div
                  ref={(el) => (dropdownMenuRefs.current[link.label] = el)}
                  className="absolute left-0 mt-2 w-64 origin-top-left bg-[#F7FAFC] rounded-md shadow-lg ring-1 ring-[#EBF4FF] focus:outline-none z-50 py-1"
                >
                  {link.subLinks.map((subLink) => (
                    <Link
                      key={subLink.href}
                      href={subLink.href}
                      className="block px-4 py-2 text-sm text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] transition-colors duration-150"
                      onClick={closeAllDropdowns}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Barra de Búsqueda Desktop y Botones de Acción */}
        <div className="flex items-center space-x-3 md:space-x-4 md:ml-4">
          
          {/* --- REEMPLAZO DEL FORMULARIO DE BÚSQUEDA --- */}
          <div className="hidden lg:flex items-center">
            <PredictiveSearchBar />
          </div>

          <div className="hidden lg:block">
             <WishlistNavItem />
          </div>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#718096] hover:text-[#002A7F] focus:outline-none p-2"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#F7FAFC] shadow-lg absolute top-full left-0 w-full z-40 max-h-[calc(100vh-70px)] overflow-y-auto">
          <nav className="flex flex-col space-y-1 p-4">
            
            {/* Búsqueda en Menú Móvil */}
            <div className="mb-4">
              <PredictiveSearchBar />
            </div>
            
            <Link
              href="/favoritos"
              className="flex items-center justify-between text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium"
              onClick={toggleMobileMenu}
            >
              Mis Favoritos
              <WishlistNavItem /> 
            </Link>

            {navLinks.map((link) => (
              <div key={`mobile-${link.label}`}>
                {link.subLinks ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(link.label)}
                      className="w-full text-left flex justify-between items-center text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium"
                    >
                      {link.label}
                      <IoChevronDown
                        className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                          openDropdownLabel === link.label ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openDropdownLabel === link.label && (
                      <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#EBF4FF]">
                        {link.subLinks.map((subLink) => (
                          <Link
                            key={`mobile-${subLink.href}`}
                            href={subLink.href}
                            className="block text-[#718096] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-sm font-medium"
                            onClick={toggleMobileMenu}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium"
                    onClick={toggleMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;