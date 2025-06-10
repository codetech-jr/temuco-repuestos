// src/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdOutlineArrowOutward } from 'react-icons/md';
import { BsClockFill } from 'react-icons/bs';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const logoFooter = "/img/logo/logo-temuco.png";

  const footerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };
  
  const linkContainerClasses = "hover:text-white transition-colors duration-200 inline-flex items-center group";
  const linkTextClasses = "pb-0.5 border-b border-transparent group-hover:border-[#718096] transition-colors duration-200";

  return (
    <motion.footer 
      className="bg-[#002266] text-[#EBF4FF] pt-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={footerContainerVariants}
        >
          <motion.div variants={columnVariants} className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src={logoFooter} alt="Temuco Repuestos Logo" width={160} height={55} className="h-auto" priority/>
            </Link>
            <p className="text-sm mb-6 leading-relaxed text-[#F7FAFC]">
              Tu tienda especializada en repuestos, reparación y electrodomésticos en Charallave. Calidad y confianza a tu servicio.
            </p>
            <motion.div 
              className="flex space-x-4"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.a variants={listItemVariants} href="https://www.facebook.com/temuco784ca" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Temuco Repuestos" className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300 transform hover:scale-110">
                <FaFacebookF size={22} />
              </motion.a>
              <motion.a variants={listItemVariants} href="https://www.instagram.com/temuco784/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Temuco Repuestos" className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300 transform hover:scale-110">
                <FaInstagram size={24} />
              </motion.a>
              <motion.a variants={listItemVariants} href="https://www.tiktok.com/@inversionestemuco" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Temuco Repuestos" className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300 transform hover:scale-110">
                <FaTiktok size={24} />
              </motion.a>
              <motion.a variants={listItemVariants} href="https://wa.me/584123975545" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Temuco Repuestos" className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300 transform hover:scale-110">
                <FaWhatsapp size={24} />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Productos</h5>
            <motion.ul className="space-y-2.5 text-sm" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li variants={listItemVariants}><Link href="/electrodomesticos?category=Refrigeradores" className={linkContainerClasses}><span className={linkTextClasses}>Refrigeradores</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/electrodomesticos?category=Aires Acondicionados" className={linkContainerClasses}><span className={linkTextClasses}>Aires Acondicionados</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/electrodomesticos?category=Lavadoras" className={linkContainerClasses}><span className={linkTextClasses}>Lavadoras</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/electrodomesticos?category=Secadoras" className={linkContainerClasses}><span className={linkTextClasses}>Secadoras</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/electrodomesticos?category=Cocinas" className={linkContainerClasses}><span className={linkTextClasses}>Cocinas</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/repuestos?category=Compresores" className={linkContainerClasses}><span className={linkTextClasses}>Compresores</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
            </motion.ul>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Servicios</h5>
            <motion.ul className="space-y-2.5 text-sm" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li variants={listItemVariants}><Link href="/servicios/servicio-tecnico" className={linkContainerClasses}><span className={linkTextClasses}>Servicio Técnico</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/servicios/instalacion" className={linkContainerClasses}><span className={linkTextClasses}>Instalación</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/servicios/mantenimiento" className={linkContainerClasses}><span className={linkTextClasses}>Mantenimiento</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/servicios/garantias" className={linkContainerClasses}><span className={linkTextClasses}>Garantías</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/servicios/asesorias" className={linkContainerClasses}><span className={linkTextClasses}>Asesorías</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
              <motion.li variants={listItemVariants}><Link href="/servicios/delivery-repuestos" className={linkContainerClasses}><span className={linkTextClasses}>Delivery</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></motion.li>
            </motion.ul>
          </motion.div>

          <motion.div variants={columnVariants}>
            <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Contacto</h5>
            <motion.ul className="space-y-3 text-sm" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li variants={listItemVariants} className="flex items-start">
                <MdLocationOn className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-[#718096]" />
                <span>Calle 15-A Independencia, Charallave 1210, Miranda</span>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-center">
                <FaWhatsapp className="w-5 h-5 mr-2.5 flex-shrink-0 text-[#718096]" />
                <a href="https://wa.me/584123975545" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+58 412-3975545</a>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-center">
                <MdEmail className="w-5 h-5 mr-2.5 flex-shrink-0 text-[#718096]" />
                <a href="mailto:contacto@refrigeraciontemuco.cl" className="hover:text-white transition-colors">contacto@refrigeraciontemuco.cl</a>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start">
                <BsClockFill className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-[#718096]" />
                <span>Lunes a Viernes: 8:00 - 17:30 hrs<br/>Sábado: 8:00 - 16:30 hrs</span>
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="mt-10 pt-8 pb-8 border-t border-[#002A7F] text-center text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <p className="mb-1">© {currentYear} Temuco Repuestos. Todos los derechos reservados.</p>
        <div className="space-x-4">
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Política de Privacidad</Link>
          <p className="text-center text-neutral-400 text-sm pt-2 md:pt-3">
            Created by <Link href="https://portfolio-codetech.vercel.app/" target="_blank" rel="noopener noreferrer" className={linkContainerClasses}><span className={linkTextClasses}>Codetech Junior</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link>.
          </p>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;