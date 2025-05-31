// src/components/ui/ServiceCard.tsx
import Link from 'next/link';
import React from 'react';

export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    // Fondo de tarjeta: Blanco. Sombra y efecto hover.
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1.5 h-full">
      {/* Círculo del icono: Fondo azul muy pálido, icono azul oscuro principal */}
      <div className="mb-5 md:mb-6 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#EBF4FF] text-[#002A7F]">
        <span className="text-3xl md:text-4xl">{service.icon}</span>
      </div>
      {/* Título del servicio: Azul oscuro principal */}
      <h3 className="text-xl md:text-2xl font-semibold text-[#002A7F] mb-3">{service.title}</h3>
      {/* Descripción: Gris oscuro azulado */}
      <p className="text-[#2D3748] text-sm md:text-base mb-6 flex-grow min-h-[4.5em]">
        {service.description}
      </p>
      {/* Botón secundario/outline */}
      <Link href={service.link} legacyBehavior>
        <a
          className="mt-auto inline-block bg-transparent 
                     text-[#002A7F] font-semibold 
                     py-2.5 px-6 
                     border border-[#002A7F] 
                     rounded-lg 
                     hover:bg-[#EBF4FF] hover:text-[#002266] hover:border-[#002266]
                     transition duration-300 ease-in-out
                     text-sm md:text-base"
        >
          {service.buttonText}
        </a>
      </Link>
    </div>
  );
};

export default ServiceCard;