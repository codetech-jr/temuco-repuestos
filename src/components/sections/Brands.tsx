// src/components/sections/Brands.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// ANIMACIÓN: Importamos motion
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/autoplay';

interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  altText: string;
  link?: string;
}

const brandsData: Brand[] = [
  { id: 'brand1', name: 'Freeze Refrigeración', logoUrl: '/img/freeze-logo.png', altText: 'Logo de Freeze Refrigeración' },
  { id: 'brand2', name: 'Pegatanke', logoUrl: '/img/brands/pegatanke-logo.png', altText: 'Logo de Pegatanke' },
  { id: 'brand3', name: 'Coverca', logoUrl: '/img/brands/coverca-logo.png', altText: 'Logo de Coverca' },
  { id: 'brand4', name: 'RUN', logoUrl: '/img/brands/run-logo.png', altText: 'Logo de Run' },
  { id: 'brand5', name: 'Celoven', logoUrl: '/img/brands/celoven-logo.png', altText: 'Logo de Celoven' },
  { id: 'brand6', name: 'Fermetal', logoUrl: '/img/brands/fermetal-logo.png', altText: 'Logo de Fermetal' },
  // Duplicar los datos ya no es necesario si Swiper tiene loop={true} y suficientes items para llenar la vista
  // Swiper se encarga de clonar los slides para que el loop sea infinito.
  // Vamos a dejar los datos originales. Si tienes pocos, puedes duplicarlos como antes.
];

const Brands = () => {
  // Para un loop fluido, Swiper recomienda tener al menos el doble de slides de los que se ven.
  // Si en la vista más pequeña se ven ~3, tener 6 es perfecto.
  const allBrands = [...brandsData, ...brandsData]; // Duplicamos para asegurar fluidez en el loop

  return (
    // ANIMACIÓN: La sección aparece suavemente al hacer scroll
    <motion.section 
      className="py-10 md:py-12 bg-[#F7FAFC] overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-8 md:mb-10">
          Marcas que Distribuimos
        </h2>
      </div>
      {/* ANIMACIÓN: El contenedor del carrusel ahora es un motion.div y tiene `group` */}
      <motion.div 
        className="swiper-container-brands group"
        whileHover={{ scale: 1.02 }} // Un sutil zoom a todo el carrusel al pausarlo
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {allBrands.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={60}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 1, // delay 1 o 0 para movimiento continuo
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={6000} // Velocidad del desplazamiento
            grabCursor={true}
            freeMode={{
              enabled: true,
              momentum: false, // <-- Ahora se llama 'momentum' y va dentro del objeto
            }}
            className="!py-4"
          >
            {allBrands.map((brand, index) => (
              <SwiperSlide key={`${brand.id}-${index}`} className="!w-auto">
                {/* ANIMACIÓN: El logo individual tiene su propia animación de hover */}
                <motion.div
                  className="flex justify-center items-center h-16 md:h-20"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {brand.link ? (
                    <Link href={brand.link} target="_blank" rel="noopener noreferrer" className="block filter grayscale hover:grayscale-0 transition-all duration-300">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.altText}
                        width={120}
                        height={60}
                        style={{ objectFit: 'contain', maxHeight: '100%', width: 'auto' }}
                        priority
                      />
                    </Link>
                  ) : (
                    <div className="block filter grayscale group-hover:grayscale-0 transition-all duration-300">
                        <Image
                        src={brand.logoUrl}
                        alt={brand.altText}
                        width={120}
                        height={60}
                        style={{ objectFit: 'contain', maxHeight: '100%', width: 'auto' }}
                        priority
                      />
                    </div>
                  )}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="container mx-auto px-4">
            <p className="text-center text-[#718096]">Próximamente mostraremos las marcas con las que trabajamos.</p>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default Brands;