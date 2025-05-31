// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";

// Importa los íconos de react-icons que necesites
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa'; // FaYoutube eliminado si no se usa
import { MdLocationOn, MdEmail, MdOutlineArrowOutward } from 'react-icons/md';
import { BsClockFill } from 'react-icons/bs';

  const linkContainerClasses = "hover:text-white transition-colors duration-200 inline-flex items-center group";
  // Clase para el span del texto (con el borde)
  const linkTextClasses = "pb-0.5 border-b border-transparent group-hover:border-[#718096] transition-colors duration-200";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // Asegúrate de que este logo se vea bien sobre un fondo #002266.
  // Si es un logo oscuro, necesitarás una versión clara (ej: blanco o #F7FAFC).
  const logoFooter = "/img/logo-temuco.png"; // O "/img/logo-temuco-blanco.png"

  return (
    // Fondo principal del footer y color de texto base (para elementos secundarios)
    <footer className="bg-[#002266] text-[#EBF4FF] py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Columna 1: Logo, descripción y Redes Sociales */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-block mb-4">
            <Image
              src={logoFooter}
              alt="Temuco Repuestos Logo"
              width={160}
              height={55}
              className="h-auto"
            />
          </Link>
          {/* Texto principal de la descripción con color más brillante */}
          <p className="text-sm mb-6 leading-relaxed text-[#F7FAFC]">
            Tu tienda especializada en repuestos, reparación y electrodomésticos en Charallave. Calidad y confianza a tu servicio.
          </p>
          <div className="flex space-x-4">
            {/* Iconos de Redes Sociales con color secundario y hover más brillante */}
            <a
              href="https://www.facebook.com/temuco784ca"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Temuco Repuestos"
              className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300"
            >
              <FaFacebookF size={22} />
            </a>
            <a
              href="https://www.instagram.com/temuco784/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Temuco Repuestos"
              className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@inversionestemuco"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Temuco Repuestos"
              className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="https://wa.me/584123975545"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp de Temuco Repuestos"
              className="text-[#718096] hover:text-[#F7FAFC] transition-colors duration-300"
            >
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>

{/* Columna 2: Productos */}
        <div>
          <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Productos</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/electrodomesticos?category=Refrigeradores" className={linkContainerClasses}> <span className={linkTextClasses}>Refrigeradores</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/electrodomesticos?category=Aires Acondicionados" className={linkContainerClasses}><span className={linkTextClasses}>Aires Acondicionados</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/electrodomesticos?category=Lavadoras" className={linkContainerClasses}><span className={linkTextClasses}>Lavadoras</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/electrodomesticos?category=Secadoras" className={linkContainerClasses}><span className={linkTextClasses}>Secadoras</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/electrodomesticos?category=Cocinas" className={linkContainerClasses}><span className={linkTextClasses}>Cocinas</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/repuestos?category=Compresores" className={linkContainerClasses}> <span className={linkTextClasses}>Compresores</span> <MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
          </ul>
        </div>

        {/* Columna 3: Servicios */}
        <div>
          <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Servicios</h5>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/servicios/servicio-tecnico" className={linkContainerClasses}><span className={linkTextClasses}>Servicio Técnico</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/servicios/instalacion" className={linkContainerClasses}><span className={linkTextClasses}>Instalación</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/servicios/mantenimiento" className={linkContainerClasses}><span className={linkTextClasses}>Mantenimiento</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/servicios/garantias" className={linkContainerClasses}><span className={linkTextClasses}>Garantías</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/servicios/asesorias" className={linkContainerClasses}><span className={linkTextClasses}>Asesorías</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
            <li><Link href="/servicios/delivery-repuestos" className={linkContainerClasses}><span className={linkTextClasses}>Delivery</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link></li>
          </ul>
        </div>


        {/* Columna 4: Contacto */}
        <div>
          <h5 className="text-[#F7FAFC] font-semibold text-lg mb-4">Contacto</h5>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              {/* Iconos de contacto con color secundario */}
              <MdLocationOn className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-[#718096]" />
              {/* Texto de contacto usa el color base del footer (#EBF4FF) */}
              <span>Calle 15-A Independencia, Charallave 1210, Miranda</span>
            </li>
            <li className="flex items-center">
              <FaWhatsapp className="w-5 h-5 mr-2.5 flex-shrink-0 text-[#718096]" />
              <a href="https://wa.me/584123975545" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+58 412-3975545</a>
            </li>
            <li className="flex items-center">
              <MdEmail className="w-5 h-5 mr-2.5 flex-shrink-0 text-[#718096]" />
              <a href="mailto:contacto@refrigeraciontemuco.cl" className="hover:text-white transition-colors">contacto@refrigeraciontemuco.cl</a>
            </li>
            <li className="flex items-start">
              <BsClockFill className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-[#718096]" />
              <span>Lunes a Viernes: 8:00 - 17:30 hrs<br/>Sábado: 8:00 - 16:30 hrs</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Barra inferior del footer */}
      {/* Borde con color azul principal, texto con color base */}
      <div className="mt-10 pt-8 border-t border-[#002A7F] text-center text-xs">
        <p className="mb-1">© {currentYear} Temuco Repuestos. Todos los derechos reservados.</p>
        <div className="space-x-4">
          <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Términos y Condiciones</Link>
          <Link href="/privacy-policy" className="hover:text-white transition-colors">Política de Privacidad</Link>
          <p className="text-center text-neutral-400 text-sm pt-2 md:pt-3">
            Created by <Link href="https://portfolio-codetech.vercel.app/" target="_blank" rel="noopener noreferrer" className={linkContainerClasses}><span className={linkTextClasses}>Codetech Junior</span><MdOutlineArrowOutward className="ml-1 w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity"/></Link>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;