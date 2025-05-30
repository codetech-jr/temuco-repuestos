// src/components/layout/Header.tsx
import Link from "next/link";
import Image from "next/image"; // Importa el componente Image de Next.js
import { IoMenu } from "react-icons/io5";
import logo from "../../../public/img/logo-temuco-final.png";


const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Temuco Logo" width={120} height={40} /> {/* Ajusta width y height */}
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600">Inicio</Link>
          <Link href="/repuestos" className="text-gray-700 hover:text-blue-600">Repuestos</Link>
          <Link href="/electrodomesticos" className="text-gray-700 hover:text-blue-600">Electrodomésticos</Link>
          <Link href="/refrigeracion" className="text-gray-700 hover:text-blue-600">Refrigeración</Link>
          <Link href="/servicios" className="text-gray-700 hover:text-blue-600">Servicios</Link>
          <Link href="/contacto" className="text-gray-700 hover:text-blue-600">Contacto</Link>
        </nav>

        {/* Barra de Búsqueda (simplificada) */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
            {/* Icono de búsqueda (puedes usar un SVG o una librería de iconos) */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
        <button>
            <IoMenu />
        </button>
      </div>
    </header>
  );
};

export default Header;