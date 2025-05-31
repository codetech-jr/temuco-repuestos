"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoSearch, IoClose, IoChevronDown } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // <--- IMPORTAR useRouter

import logoImage from "../../../public/img/logo-temuco-final.png";
import { serviciosDetalleData } from "@/app/data/servicios";

// ... (tus interfaces y datos de navLinks, serviciosSubLinks, etc. permanecen igual)
// --- Sub-enlaces para SERVICIOS (ya los tenías) ---
const serviciosSubLinks: NavLink[] = serviciosDetalleData.map(servicio => ({
  href: `/servicios/${servicio.slug}`,
  label: servicio.title,
}));

// --- NUEVO: Sub-enlaces para REPUESTOS ---
const repuestosSubLinks: NavLink[] = [
  { href: "/repuestos?category=Compresores", label: "Compresores" },
  { href: "/repuestos?category=Termostatos", label: "Termostatos" },
  { href: "/repuestos?category=Filtros", label: "Filtros Secadores" },
  { href: "/repuestos?category=Capacitores", label: "Capacitores" },
  { href: "/repuestos?tipo=originales", label: "Repuestos Originales" },
  { href: "/repuestos", label: "Ver Todos los Repuestos" },
];

// --- NUEVO: Sub-enlaces para ELECTRODOMÉSTICOS ---
const electrodomesticosSubLinks: NavLink[] = [
  { href: "/electrodomesticos?category=Refrigeradores", label: "Refrigeradores" },
  { href: "/electrodomesticos?category=Lavadoras", label: "Lavadoras" },
  { href: "/electrodomesticos?category=Secadoras", label: "Secadoras" },
  { href: "/electrodomesticos?category=Cocinas", label: "Cocinas" },
  { href: "/electrodomesticos?category=Aires Acondicionados", label: "Aires Acondicionados" },
  { href: "/electrodomesticos?category=Hornos", label: "Hornos y Microondas" },
  { href: "/electrodomesticos", label: "Ver Todos los Electrodomésticos" },
];


// --- NAVLINKS PRINCIPALES ACTUALIZADOS ---
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

  const [searchQuery, setSearchQuery] = useState(""); // <--- ESTADO PARA LA BÚSQUEDA
  const router = useRouter(); // <--- HOOK PARA NAVEGACIÓN

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

  // MANEJADOR PARA EL ENVÍO DE LA BÚSQUEDA
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir recarga de página por defecto del form
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Opcional: limpiar campo después de buscar
      setIsMobileMenuOpen(false); // Cerrar menú móvil si está abierto
      closeAllDropdowns(); // Cerrar otros dropdowns
    }
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
          {/* ... tu navegación principal no cambia ... */}
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.subLinks ? (
                <button
                  ref={(el) => (dropdownButtonRefs.current[link.label] = el)}
                  onClick={() => handleDropdownToggle(link.label)}
                  className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  aria-haspopup="true"
                  aria-expanded={openDropdownLabel === link.label}
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
                  className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap" // <-- Añadido whitespace-nowrap
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
                      // Se eliminó whitespace-nowrap
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

        {/* Barra de Búsqueda Desktop y Botón de Menú Móvil */}
        <div className="flex items-center space-x-3 md:space-x-2 md:ml-4">
          {/* Envolver en FORM para que Enter funcione y para el handler */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery} // <--- BINDEAR VALOR
              onChange={(e) => setSearchQuery(e.target.value)} // <--- ACTUALIZAR ESTADO
              className="px-3 py-2 border border-[#718096] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#002A7F] sm:text-sm w-32 sm:w-40 md:w-48" // <--- MODIFICAR ESTA LÍNEA
              aria-label="Buscar productos"
            />
            <button
              type="submit" // <--- TIPO SUBMIT
              className="bg-[#002A7F] text-white px-3 py-[9px] rounded-r-md hover:bg-[#002266] transition-colors duration-300"
              aria-label="Realizar búsqueda"
            >
              <IoSearch size={22} />
            </button>
          </form>
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
            {/* ... tu mapeo de navLinks no cambia ... */}
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
                            onClick={toggleMobileMenu} // Esto cierra todo el menú móvil
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
            {/* Búsqueda en Menú Móvil */}
            <div className="pt-4 mt-2 border-t border-[#EBF4FF]">
              {/* Envolver en FORM para que Enter funcione y para el handler */}
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery} // <--- BINDEAR VALOR
                  onChange={(e) => setSearchQuery(e.target.value)} // <--- ACTUALIZAR ESTADO
                  className="flex-grow px-3 py-2 border border-[#718096] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#002A7F] sm:text-sm"
                  aria-label="Buscar productos en móvil"
                />
                <button
                  type="submit" // <--- TIPO SUBMIT
                  className="bg-[#002A7F] text-white px-3 py-[9px] rounded-r-md hover:bg-[#002266]"
                  aria-label="Realizar búsqueda en móvil"
                >
                  <IoSearch size={22} />
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;