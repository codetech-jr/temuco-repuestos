// src/components/sections/Brands.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

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
  { id: 'brand2', name: 'Pegatanke', logoUrl: '/img/pegatanke-logo.png', altText: 'Logo de Pegatanke' },
  { id: 'brand3', name: 'Coverca', logoUrl: '/img/coverca-logo.png', altText: 'Logo de Coverca' },
  { id: 'brand4', name: 'RUN', logoUrl: '/img/run-logo.png', altText: 'Logo de Run' },
  { id: 'brand5', name: 'Celoven', logoUrl: '/img/celoven-logo.png', altText: 'Logo de Celoven' },
  { id: 'brand6', name: 'Fermetal', logoUrl: '/img/fermetal-logo.png', altText: 'Logo de Fermetal' },
  // Duplicados para un carrusel más fluido con loop y pocos ítems
  { id: 'brand1-dup', name: 'Freeze Refrigeración', logoUrl: '/img/freeze-logo.png', altText: 'Logo de Freeze Refrigeración' },
  { id: 'brand2-dup', name: 'Pegatanke', logoUrl: '/img/pegatanke-logo.png', altText: 'Logo de Pegatanke' },
  { id: 'brand3-dup', name: 'Coverca', logoUrl: '/img/coverca-logo.png', altText: 'Logo de Coverca' },
  { id: 'brand4-dup', name: 'RUN', logoUrl: '/img/run-logo.png', altText: 'Logo de Run' },
  { id: 'brand5-dup', name: 'Celoven', logoUrl: '/img/celoven-logo.png', altText: 'Logo de Celoven' },
  { id: 'brand6-dup', name: 'Fermetal', logoUrl: '/img/fermetal-logo.png', altText: 'Logo de Fermetal' },
];

const Brands = () => {
  return (
    // Fondo de sección: Casi blanco azulado
    <section className="py-10 md:py-12 bg-[#F7FAFC] overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Título de sección: Azul oscuro principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-8 md:mb-10">
          Marcas que Distribuimos
        </h2>
      </div>
      <div className="swiper-container-brands">
        {brandsData.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={60}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={5000} // Aumentar speed para un movimiento más lento y suave
            grabCursor={true}
            freeMode={true}
            freeModeMomentum={false} // Importante para un movimiento constante
            className="!py-4" // Usar ! para asegurar que este padding se aplique
          >
            {brandsData.map((brand) => (
              <SwiperSlide key={brand.id} className="!w-auto"> {/* !w-auto es importante para slidesPerView: 'auto' */}
                <div className="flex justify-center items-center h-16 md:h-20">
                  {brand.link ? (
                    <Link href={brand.link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-75 transition-opacity duration-300">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.altText}
                        width={120} // Ajusta estos valores según el tamaño promedio de tus logos
                        height={60}
                        style={{ objectFit: 'contain', maxHeight: '100%', width: 'auto' }} // Estilos para asegurar que se adapte
                      />
                    </Link>
                  ) : (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.altText}
                      width={120}
                      height={60}
                      style={{ objectFit: 'contain', maxHeight: '100%', width: 'auto' }}
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="container mx-auto px-4">
            {/* Texto "Próximamente...": Gris medio */}
            <p className="text-center text-[#718096]">Próximamente mostraremos las marcas con las que trabajamos.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Brands;