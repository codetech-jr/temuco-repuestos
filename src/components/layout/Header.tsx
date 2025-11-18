"use client";

import Link from "next/link";
import Image from "next/image";
import { IoMenu, IoClose, IoChevronDown } from "react-icons/io5";
import { useState, Fragment } from "react";

// --- NUEVAS IMPORTACIONES PARA ANIMACIÓN ---
import { Menu, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Importaciones de componentes ---
import { WishlistNavItem } from "./WishlistNavItem"; 
import PredictiveSearchBar from "../catalog/PredictiveSearchBar"; 

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
  { href: "/repuestos?category=Lavadoras", label: "Lavadoras" },
  { href: "/repuestos?category=Refrigeración (Neveras)", label: "Refrigeración (Neveras)" },
  { href: "/repuestos?category=Aire Acondicionado y Ventilación", label: "Aire Acondicionado y Ventilación" },
  { href: "/repuestos?category=Componentes Eléctricos y Cableado", label: "Componentes Eléctricos y Cableado" },
  { href: "/repuestos?category=Materiales de Soldadura, Tuberías y Conexiones", label: "Materiales de Soldadura, Tuberías y Conexiones" },
  { href: "/repuestos?category=Motores y Bombas (Uso General)", label: "Motores y Bombas (Uso General)" },
  { href: "/repuestos?category=Herramientas y Equipos de Medición", label: "Herramientas y Equipos de Medición" },
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
  { href: "/quienes-somos", label: "Quiénes Somos" },
  { href: "/repuestos", label: "Repuestos", subLinks: repuestosSubLinks },
  { href: "/electrodomesticos", label: "Electrodomésticos", subLinks: electrodomesticosSubLinks },
  { href: "/servicios", label: "Servicios", subLinks: serviciosSubLinks },
  { href: "/contacto", label: "Contacto" },
];


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdownLabel, setOpenDropdownLabel] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileMenuOpen) {
        setOpenDropdownLabel(null);
    }
  };

  const handleMobileDropdownToggle = (label: string) => {
    setOpenDropdownLabel(prevLabel => (prevLabel === label ? null : label));
  };
  
  const mobileNavContainerVariants = {
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const mobileNavItemVariants = {
    open: { y: 0, opacity: 1, transition: { y: { stiffness: 1000, velocity: -100 } } },
    closed: { y: 50, opacity: 0, transition: { y: { stiffness: 1000 } } }
  };

  return (
    <header className="bg-[#F7FAFC] shadow-md sticky top-0 z-50">
      <div className="container px-4 py-3 flex justify-between items-center" style={{ maxWidth: '94rem' }}>
        
        <Link href="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
          {/* ---- CAMBIO AQUÍ ---- */}
          {/* Se añaden clases para hacer el logo responsivo */}
          <Image 
            src="/img/logo/repuestos-temuco.png" 
            alt="Temuco Logo" 
            width={350} 
            height={60} 
            priority 
            style={{ objectFit: 'contain' }}
            className="w-56 h-auto xl:w-[350px]" 
          />
        </Link>

        {/* Contenedor de escritorio */}
        <div className="hidden xl:flex items-center gap-x-8">
          
          <nav className="flex items-center space-x-4">
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

          <div className="flex items-center space-x-3">
            <PredictiveSearchBar />
            <WishlistNavItem />
          </div>
        </div>

        {/* Botón de menú móvil */}
        <div className="xl:hidden">
            <button
                onClick={toggleMobileMenu}
                className="text-[#718096] hover:text-[#002A7F] focus:outline-none p-2 relative h-10 w-10"
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

      {/* Panel de menú móvil */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="xl:hidden bg-[#F7FAFC] shadow-lg absolute top-full left-0 w-full z-40 max-h-[calc(100vh-70px)] overflow-y-auto"
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