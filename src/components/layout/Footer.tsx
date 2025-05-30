// src/components/layout/Footer.tsx
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-blue-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Logo y descripción */}
        <div>
          <Image src="/img/logo-temuco.png" alt="Temuco Logo" width={150} height={50} className="mb-4" /> {/* Asume un logo para fondo oscuro */}
          <p className="text-sm mb-4">
            Tu tienda especializada en repuestos, reparación y electrodomésticos en Charallave.
          </p>
          <div className="flex space-x-3">
            {/* Iconos de redes sociales (ejemplos) */}
            <a href="#" className="hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> {/* Facebook icon path */}</svg></a>
            <a href="#" className="hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> {/* Instagram icon path */}</svg></a>
            <a href="#" className="hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"> {/* YouTube icon path */}</svg></a>
          </div>
        </div>

        {/* Columna 2: Productos */}
        <div>
          <h5 className="text-white font-semibold mb-4">Productos</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/repuestos/refrigeradores" className="hover:text-white">Refrigeradores</Link></li>
            <li><Link href="/repuestos/aires" className="hover:text-white">Aires Acondicionados</Link></li>
            <li><Link href="/repuestos/lavadoras" className="hover:text-white">Lavadoras</Link></li>
            <li><Link href="/repuestos/secadoras" className="hover:text-white">Secadoras</Link></li>
            <li><Link href="/repuestos/cocinas" className="hover:text-white">Cocinas</Link></li>
            <li><Link href="/repuestos/compresores" className="hover:text-white">Compresores</Link></li>
          </ul>
        </div>

        {/* Columna 3: Servicios */}
        <div>
          <h5 className="text-white font-semibold mb-4">Servicios</h5>
          <ul className="space-y-2 text-sm">
            <li><Link href="/servicios/servicio-tecnico" className="hover:text-white">Servicio Técnico</Link></li>
            <li><Link href="/servicios/instalacion" className="hover:text-white">Instalación</Link></li>
            <li><Link href="/servicios/mantenimiento" className="hover:text-white">Mantenimiento</Link></li>
            <li><Link href="/servicios/garantia" className="hover:text-white">Garantías</Link></li>
            <li><Link href="/servicios/asesorias" className="hover:text-white">Asesorías</Link></li>
          </ul>
        </div>

        {/* Columna 4: Contacto */}
        <div>
          <h5 className="text-white font-semibold mb-4">Contacto</h5>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span>Calle 15-A Independencia, Charallave 1210, Miranda</span>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.308 1.154a11.031 11.031 0 005.516 5.516l1.154-2.308a1 1 0 011.21-.502l4.493 1.498A1 1 0 0119 14.72V18a2 2 0 01-2 2h-1C9.716 20 3 13.284 3 5z"></path></svg>
              <a href="tel:+569452123456" className="hover:text-white">+58 412-3975545</a>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <a href="mailto:contacto@refrigeraciontemuco.cl" className="hover:text-white">contacto@refrigeraciontemuco.cl</a>
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Lunes a Viernes: 7:30 - 17:30 hrs<br/>Sábado: 8:00 - 16:30 hrs</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm">
        <p>© {currentYear} Temuco. Todos los derechos reservados.</p>
        <div className="mt-2">
          <Link href="/terminos" className="hover:text-white mx-2">Términos y Condiciones</Link>
          <Link href="/privacidad" className="hover:text-white mx-2">Política de Privacidad</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;