// src/components/ui/ServiceCard.tsx
import Link from 'next/link';
import React from 'react';

export interface Service {
  id: string;
  icon: React.ReactNode; // Sigue siendo React.ReactNode
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
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center flex flex-col items-center transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1.5">
      <div className="mb-5 md:mb-6 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 text-brand-blue">
        {/* Aquí se renderizará el ícono de react-icons */}
        {/* Aplicamos un tamaño base aquí que puede ser sobreescrito por props del ícono si es necesario */}
        <span className="text-3xl md:text-4xl">{service.icon}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-3">{service.title}</h3>
      <p className="text-gray-600 text-sm md:text-base mb-6 flex-grow min-h-[4.5em]">
        {service.description}
      </p>
      <Link href={service.link} legacyBehavior>
        <a className="mt-auto inline-block bg-transparent hover:bg-blue-50 text-brand-blue font-semibold py-2.5 px-6 border border-blue-300 hover:border-brand-blue rounded-lg transition duration-300 text-sm md:text-base">
          {service.buttonText}
        </a>
      </Link>
    </div>
  );
};

export default ServiceCard;