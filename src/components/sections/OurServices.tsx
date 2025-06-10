// En src/components/sections/OurServices.tsx
"use client";

import ServiceCard, { Service } from '@/components/ui/ServiceCard';
// ANIMACIÓN: Importamos motion
import { motion } from 'framer-motion';

// Íconos...
import { FaWrench } from 'react-icons/fa';
import { HiShieldCheck } from 'react-icons/hi2';
import { MdAcUnit, MdOutlineSecurity } from 'react-icons/md';
import { RiToolsFill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

const servicesData: Service[] = [
    {
        id: 's001',
        icon: <FaWrench />,
        title: 'Servicio Técnico Especializado',
        description: 'Reparación profesional de electrodomésticos y equipos de refrigeración con garantía.',
        link: '/servicios/servicio-tecnico',
        buttonText: 'Saber Más',
      },
      {
        id: 's002',
        icon: <MdAcUnit />,
        title: 'Instalación Profesional de Equipos',
        description: 'Instalamos tus nuevos electrodomésticos y sistemas de aire acondicionado.',
        link: '/servicios/instalacion',
        buttonText: 'Saber Más',
      },
      {
        id: 's003',
        icon: <HiShieldCheck />,
        title: 'Mantenimiento Preventivo',
        description: 'Prolonga la vida útil de tus equipos y evita fallas costosas con nuestros planes.',
        link: '/servicios/mantenimiento',
        buttonText: 'Saber Más',
      },
      {
        id: 's004',
        icon: <MdOutlineSecurity />,
        title: 'Gestión de Garantías',
        description: 'Te asistimos en el proceso de garantía de tus equipos con el fabricante.',
        link: '/servicios/garantias',
        buttonText: 'Saber Más',
      },
      {
        id: 's005',
        icon: <RiToolsFill />,
        title: 'Asesorías Técnicas',
        description: 'Te orientamos en la elección, uso y optimización de tus electrodomésticos.',
        link: '/servicios/asesorias',
        buttonText: 'Saber Más',
      },
      {
        id: 's006',
        icon: <TbTruckDelivery />,
        title: 'Delivery de Repuestos',
        description: 'Recibe tus repuestos directamente en la comodidad de tu hogar o taller.',
        link: '/servicios/delivery-repuestos',
        buttonText: 'Saber Más',
      },
];

const OurServices = () => {
  // ANIMACIÓN: Definimos las variantes para el contenedor y las tarjetas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Un retraso sutil entre cada tarjeta
        delayChildren: 0.2,   // Una pequeña espera antes de que la primera tarjeta aparezca
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    // ANIMACIÓN: La sección entera aparece suavemente
    <motion.section 
      className="py-12 md:py-16 bg-[#F7FAFC]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Nuestros Servicios
        </h2>
        {/* ANIMACIÓN: El grid orquesta la animación en cascada */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
        >
          {servicesData.map((service) => (
            // Pasamos las variantes a cada tarjeta
            <ServiceCard key={service.id} service={{ ...service, variants: cardVariants }} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default OurServices;