"use client";

// src/components/sections/OurServices.tsx
import ServiceCard, { Service } from '@/components/ui/ServiceCard';

// Importa los íconos de react-icons
import { FaWrench, FaSnowflake } from 'react-icons/fa'; // Font Awesome
import { HiShieldCheck } from 'react-icons/hi2'; // Heroicons v2 (puedes usar HiShieldCheck de 'react-icons/hi' para v1)


// Datos de ejemplo para los servicios, ahora con react-icons
const servicesData: Service[] = [
  {
    id: 'servicio1',
    // Pasamos el componente del ícono directamente.
    // Puedes pasar props como 'size' o 'className' aquí si quieres un control más granular
    // por ícono, o dejar que ServiceCard maneje el tamaño general.
    icon: <FaWrench />,
    title: 'Reparación de Electrodomésticos',
    description: 'Servicio técnico especializado para todo tipo de electrodomésticos con garantía de trabajo.',
    link: '/servicios/reparacion',
    buttonText: 'Solicitar Servicio',
  },
  {
    id: 'servicio2',
    icon: <FaSnowflake />,
    title: 'Instalación de Sistemas de Refrigeración',
    description: 'Instalación profesional de aires acondicionados, cámaras frigoríficas y sistemas comerciales.',
    link: '/servicios/instalacion-refrigeracion',
    buttonText: 'Solicitar Servicio',
  },
  {
    id: 'servicio3',
    icon: <HiShieldCheck />, // Heroicons v2 son más estilizados como en la maqueta
    title: 'Mantenimiento Preventivo',
    description: 'Planes de mantenimiento para extender la vida útil de sus equipos y prevenir fallas.',
    link: '/servicios/mantenimiento-preventivo',
    buttonText: 'Solicitar Servicio',
  },
];

const OurServices = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-10 md:mb-12">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;