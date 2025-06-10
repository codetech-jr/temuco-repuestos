"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose, IoChevronDown } from "react-icons/io5";
import { useState, Fragment } from "react"; // useEffect y useRef ya no son necesarios para los dropdowns

// --- NUEVAS IMPORTACIONES PARA ANIMACIÓN ---
import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Importaciones de componentes ---
import { WishlistNavItem } from "./WishlistNavItem"; 
import PredictiveSearchBar from "../catalog/PredictiveSearchBar"; 

import logoImage from "../../../public/img/logo/logo-temuco-final.png";
import { serviciosDetalleData } from "@/app/data/servicios";

// --- Interfaces y datos (sin cambios) ---
interface NavLink {
  href: string;
  label: string;
  subLinks?: NavLink[];
}

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
  { href: "/repuestos", label: "Repuestos", subLinks: repuestosSubLinks },
  { href: "/electrodomesticos", label: "Electrodomésticos", subLinks: electrodomesticosSubLinks },
  { href: "/servicios", label: "Servicios", subLinks: serviciosSubLinks },
  { href: "/quienes-somos", label: "Quiénes Somos" },
  { href: "/contacto", label: "Contacto" },
];


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Este estado ahora SOLO controla los dropdowns del menú móvil
  const [openDropdownLabel, setOpenDropdownLabel] = useState<string | null>(null);

  // --- Lógica de dropdowns de escritorio ELIMINADA ---
  // Headless UI se encarga de esto de forma automática,
  // por lo que ya no necesitamos refs ni el useEffect para detectar clics fuera.

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
        setOpenDropdownLabel(null); // Cierra dropdowns al cerrar menú móvil
    }
  };

  const handleMobileDropdownToggle = (label: string) => {
    setOpenDropdownLabel(prevLabel => (prevLabel === label ? null : label));
  };
  
  // --- Variantes de animación para el menú móvil (Framer Motion) ---
  const mobileNavContainerVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const mobileNavItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    }
  };

  return (
    <header className="bg-[#F7FAFC] shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
          <Image src={logoImage} alt="Temuco Logo" width={120} height={40} priority />
        </Link>

        {/* Navegación Principal (Desktop) - AHORA CON HEADLESS UI */}
        <nav className="hidden lg:flex items-center space-x-3 lg:space-x-4">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.subLinks ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    {link.label}
                    <IoChevronDown
                      className="ml-1 h-4 w-4 transition-transform duration-300 ui-open:transform ui-open:rotate-180"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-64 origin-top-left bg-[#F7FAFC] rounded-md shadow-lg ring-1 ring-[#EBF4FF] focus:outline-none z-50 py-1">
                      {link.subLinks.map((subLink) => (
                        <Menu.Item key={subLink.href}>
                          {({ active }) => (
                            <Link
                              href={subLink.href}
                              className={`${
                                active ? 'bg-[#EBF4FF] text-[#002A7F]' : 'text-[#2D3748]'
                              } group flex w-full items-center rounded-md px-4 py-2 text-sm transition-colors duration-150`}
                            >
                              {subLink.label}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <Link
                  href={link.href}
                  className="text-[#2D3748] hover:text-[#002A7F] transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Barra de Búsqueda Desktop y Botones de Acción */}
        <div className="flex items-center space-x-3 md:space-x-4 md:ml-4">
          <div className="hidden lg:flex items-center">
            <PredictiveSearchBar />
          </div>
          <div className="hidden lg:block">
             <WishlistNavItem />
          </div>

          {/* --- BOTÓN DE MENÚ MÓVIL ANIMADO --- */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-[#718096] hover:text-[#002A7F] focus:outline-none p-2 relative h-10 w-10"
            aria-label="Abrir menú"
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={isMobileMenuOpen ? 'close' : 'menu'}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable - AHORA CON FRAMER MOTION */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-[#F7FAFC] shadow-lg absolute top-full left-0 w-full z-40 max-h-[calc(100vh-70px)] overflow-y-auto"
          >
            <motion.nav
              variants={mobileNavContainerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex flex-col space-y-1 p-4"
            >
              <motion.div variants={mobileNavItemVariants} className="mb-4">
                <PredictiveSearchBar onSearch={toggleMobileMenu} />
              </motion.div>
              
              <motion.div variants={mobileNavItemVariants}>
                <Link
                  href="/favoritos"
                  className="flex items-center justify-between text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium transition-colors hover:-translate-y-0.5"
                  onClick={toggleMobileMenu}
                >
                  Mis Favoritos <WishlistNavItem /> 
                </Link>
              </motion.div>

              {navLinks.map((link) => (
                <motion.div key={`mobile-${link.label}`} variants={mobileNavItemVariants}>
                  {link.subLinks ? (
                    <>
                      <button
                        onClick={() => handleMobileDropdownToggle(link.label)}
                        className="w-full text-left flex justify-between items-center text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium transition-colors hover:-translate-y-0.5"
                      >
                        {link.label}
                        <IoChevronDown
                          className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                            openDropdownLabel === link.label ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openDropdownLabel === link.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="pl-4 mt-1 space-y-1 border-l-2 border-[#EBF4FF] overflow-hidden"
                          >
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className="block text-[#2D3748] hover:bg-[#EBF4FF] hover:text-[#002A7F] rounded-md px-3 py-2 text-base font-medium transition-colors hover:-translate-y-0.5"
                      onClick={toggleMobileMenu}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;