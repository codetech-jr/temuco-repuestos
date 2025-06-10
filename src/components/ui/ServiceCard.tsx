// En src/components/ui/ServiceCard.tsx
"use client";

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ReactElement } from 'react';

export interface Service {
  id: string;
  icon: ReactElement;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  variants?: Variants; // Para la animación en cascada
}

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  return (
    // La tarjeta es ahora un motion.div que recibe variantes y reacciona al hover.
    <motion.div
      variants={service.variants}
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full text-center p-6 md:p-8 group"
      whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 42, 127, 0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      {/* Contenedor del ícono */}
      <div className="mx-auto mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-[#EBF4FF] text-[#002A7F] transition-all duration-300 group-hover:bg-[#002A7F] group-hover:text-white">
        {/* El ícono se agranda y rota ligeramente al hacer hover en la tarjeta */}
        <div className="transition-transform duration-300 ease-in-out group-hover:scale-125 group-hover:rotate-[-12deg] text-4xl">
          {service.icon}
        </div>
      </div>

      {/* Contenido de texto */}
      <h3 className="text-xl font-bold text-[#002A7F] mb-3">{service.title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
      
      {/* Botón */}
      <Link href={service.link} legacyBehavior>
        <a className="mt-auto inline-block bg-[#C8102E] text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 ease-in-out hover:bg-[#002A7F] transform hover:scale-105">
          {service.buttonText}
        </a>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;