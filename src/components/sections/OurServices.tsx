"use client";

// src/components/sections/OurServices.tsx
import ServiceCard, { Service } from '@/components/ui/ServiceCard';

// Importa los íconos de react-icons
import { FaWrench, FaSnowflake } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi2';
import { MdBuild, MdAcUnit, MdOutlineSecurity, MdDeliveryDining } from 'react-icons/md'; // Otros ejemplos de íconos
import { RiToolsFill } from "react-icons/ri"; // Para Asesorías
import { TbTruckDelivery } from "react-icons/tb"; // Para Delivery


// Datos actualizados para coincidir con los de servicios.ts (adaptados)
// Es importante que los 'id' y 'link' (slug) aquí coincidan con los slugs de serviciosDetalleData
// si quieres que enlacen correctamente a las páginas de detalle.
const servicesData: Service[] = [
  {
    id: 's001', // Coincide con servicio-tecnico
    icon: <FaWrench />, // Ícono para Servicio Técnico
    title: 'Servicio Técnico Especializado',
    description: 'Reparación profesional de electrodomésticos y equipos de refrigeración con garantía.',
    link: '/servicios/servicio-tecnico',
    buttonText: 'Saber Más',
  },
  {
    id: 's002', // Coincide con instalacion
    icon: <MdAcUnit />, // Ícono para Instalación
    title: 'Instalación Profesional de Equipos',
    description: 'Instalamos tus nuevos electrodomésticos y sistemas de aire acondicionado.',
    link: '/servicios/instalacion',
    buttonText: 'Saber Más',
  },
  {
    id: 's003', // Coincide con mantenimiento
    icon: <HiShieldCheck />, // Ícono para Mantenimiento
    title: 'Mantenimiento Preventivo',
    description: 'Prolonga la vida útil de tus equipos y evita fallas costosas con nuestros planes.',
    link: '/servicios/mantenimiento',
    buttonText: 'Saber Más',
  },
  // Puedes añadir más servicios si los tienes en serviciosDetalleData y quieres mostrarlos aquí
  // Ejemplo:
  {
    id: 's004', // Coincide con garantias
    icon: <MdOutlineSecurity />,
    title: 'Gestión de Garantías',
    description: 'Te asistimos en el proceso de garantía de tus equipos con el fabricante.',
    link: '/servicios/garantias',
    buttonText: 'Saber Más',
  },
  {
    id: 's005', // Coincide con asesorias
    icon: <RiToolsFill />, // Ícono más genérico para asesorías
    title: 'Asesorías Técnicas',
    description: 'Te orientamos en la elección, uso y optimización de tus electrodomésticos.',
    link: '/servicios/asesorias',
    buttonText: 'Saber Más',
  },
  {
    id: 's006', // Coincide con delivery-repuestos
    icon: <TbTruckDelivery />, // Ícono para Delivery
    title: 'Delivery de Repuestos',
    description: 'Recibe tus repuestos directamente en la comodidad de tu hogar o taller.',
    link: '/servicios/delivery-repuestos',
    buttonText: 'Saber Más',
  },
];

const OurServices = () => {
  return (
    // Fondo de sección: Casi blanco azulado
    <section className="py-12 md:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        {/* Título de sección: Azul oscuro principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Nuestros Servicios
        </h2>
        {/* El grid ahora puede mostrar hasta 6 servicios en dos filas en LG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {servicesData.map((service) => (
            // ServiceCard ya debería estar estilizado con la paleta
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;