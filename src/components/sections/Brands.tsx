// src/components/sections/Brands.tsx
"use client"; // Necesario para Swiper

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/autoplay'; // Aunque a veces está en el core

interface Brand {
  id: string;
  name: string;
  logoUrl: string;
  altText: string;
  link?: string;
}

const brandsData: Brand[] = [
  {
    id: 'brand1',
    name: 'Freeze Refrigeración',
    logoUrl: '/img/freeze-logo.png',
    altText: 'Logo de Freeze Refrigeración',
  },
  {
    id: 'brand2',
     name: 'Pegatanke',
    logoUrl: '/img/pegatanke-logo.png',
    altText: 'Logo de Pegatanke',
  },
  {
    id: 'brand3',
    name: 'Coverca',
    logoUrl: '/img/coverca-logo.png',
    altText: 'Logo de Coverca',
  },
  {
    id: 'brand4',
    name: 'RUN',
    logoUrl: '/img/run-logo.png',
    altText: 'Logo de Run',
  },
  {
    id: 'brand5',
    name: 'Celoven',
    logoUrl: '/img/celoven-logo.png',
    altText: 'Logo de Celoven',
  },
  {
    id: 'brand6',
    name: 'Fermetal',
    logoUrl: '/img/fermetal-logo.png',
    altText: 'Logo de Fermetal',
  },
  // Para un carrusel infinito y suave, a veces es útil duplicar los items si son pocos
  // y el slidesPerView es 'auto' o un número alto. Swiper maneja bien el loop,
  // pero para el efecto visual de "siempre hay más", duplicar puede ayudar.
  // Si tienes muchos logos (ej. 10+), la duplicación no es tan necesaria con loop.
  // Para 6 logos y un efecto de cinta continua, duplicar puede mejorar la sensación.
  {
    id: 'brand1-dup',
    name: 'Freeze Refrigeración',
    logoUrl: '/img/freeze-logo.png',
    altText: 'Logo de Freeze Refrigeración',
  },
  {
    id: 'brand2-dup',
    name: 'Pegatanke',
    logoUrl: '/img/pegatanke-logo.png',
    altText: 'Logo de Pegatanke',
  },
  {
    id: 'brand3-dup',
    name: 'Coverca',
    logoUrl: '/img/coverca-logo.png',
    altText: 'Logo de Coverca',
  },
  {
    id: 'brand4-dup',
    name: 'RUN',
    logoUrl: '/img/run-logo.png',
    altText: 'Logo de Run',
  },
  {
    id: 'brand5-dup',
    name: 'Celoven',
    logoUrl: '/img/celoven-logo.png',
    altText: 'Logo de Celoven',
  },
  {
    id: 'brand6-dup',
    name: 'Fermetal',
    logoUrl: '/img/fermetal-logo.png',
    altText: 'Logo de Fermetal',
  },
];

const Brands = () => {
  return (
    <section className="py-10 md:py-12 bg-gray-50 overflow-hidden"> {/* overflow-hidden en la sección */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-8 md:mb-10">
          Marcas que Distribuimos
        </h2>
      </div>
      {/* El contenedor del Swiper no necesita ser 'container mx-auto' para un efecto full-width de logos */}
      <div className="swiper-container-brands"> {/* Contenedor para Swiper sin márgenes laterales del container principal si se desea */}
        {brandsData.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={60} // Espacio entre logos, ajusta según el tamaño del logo
            slidesPerView={'auto'} // Clave para el efecto de cinta continua. Los slides toman su propio ancho.
            loop={true} // Imprescindible para el carrusel infinito
            autoplay={{
              delay: 0, // Sin retraso para el inicio del movimiento
              disableOnInteraction: false, // No detenerse si el usuario interactúa
              pauseOnMouseEnter: true, // Pausar al pasar el mouse
            }}
            speed={5000} // Duración de la transición de un "grupo" de slides (ajusta para velocidad)
            grabCursor={true}
            freeMode={true} // Permite un deslizamiento más libre, sin "snapping" a slides específicos
            freeModeMomentum={false} // Evita el "impulso" al soltar, para un movimiento más constante
            className="!py-4" // Padding vertical para los logos dentro del swiper
          >
            {brandsData.map((brand) => (
              <SwiperSlide key={brand.id} className="!w-auto"> {/* '!w-auto' para que el slide tome el ancho de su contenido */}
                <div className="flex justify-center items-center h-16 md:h-20"> {/* Contenedor con altura fija para los logos */}
                  {brand.link ? (
                    <Link href={brand.link} target="_blank" rel="noopener noreferrer" className="block hover:opacity-75 transition-opacity duration-300">
                      <Image
                        src={brand.logoUrl}
                        alt={brand.altText}
                        width={120} // Ancho MÁXIMO o deseado del logo
                        height={60} // Altura MÁXIMA o deseada del logo
                        objectFit="contain"
                        className="max-h-full" // Asegura que no exceda la altura del contenedor del slide
                      />
                    </Link>
                  ) : (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.altText}
                      width={120}
                      height={60}
                      objectFit="contain"
                      className="max-h-full"
                    />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-600">Próximamente mostraremos las marcas con las que trabajamos.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Brands;