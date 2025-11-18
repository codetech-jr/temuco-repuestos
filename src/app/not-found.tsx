// app/not-found.tsx
import Link from 'next/link';
import Image from 'next/image'; // Opcional, si quieres una imagen

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-[#F7FAFC]"> {/* Fondo similar al resto de tu sitio */}
      {/* Opcional: Puedes añadir un logo o una imagen ilustrativa */}
      
      <div className="mb-8">
        <Image 
          src="/img/logo/repuestos-temuco.png" // Ajusta la ruta a tu logo
          alt="Temuco Repuestos Logo"
          width={180}
          height={60}
          priority
        />
      </div>
      

      <h1 className="text-6xl md:text-9xl font-bold text-[#C8102E] mb-4">404</h1> {/* Color de acento */}
      <h2 className="text-2xl md:text-3xl font-semibold text-[#002A7F] mb-6">
        ¡Ups! Página No Encontrada
      </h2>
      <p className="text-md md:text-lg text-[#2D3748] mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
        Quizás te equivocaste al escribir la dirección.
      </p>
      <div className="flex space-x-4">
        <Link href="/" legacyBehavior>
          <a className="bg-[#002A7F] hover:bg-[#002266] text-white font-semibold py-3 px-6 rounded-lg text-md transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            Ir a la Página Principal
          </a>
        </Link>
        <Link href="/contacto" legacyBehavior>
          <a className="bg-gray-200 hover:bg-gray-300 text-[#2D3748] font-semibold py-3 px-6 rounded-lg text-md transition duration-300 ease-in-out shadow-md hover:shadow-lg">
            Contactar Soporte
          </a>
        </Link>
      </div>
    </div>
  );
}