// src/components/sections/HeroSlider.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

interface SlideContent {
  id: number;
  imageUrl: string;
  altText: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

const slidesData: SlideContent[] = [
    // ... tu data de slides no cambia ...
    {
        id: 1,
        imageUrl: "/img/hero-bg/hero-bg.jpg",
        altText: "Técnico revisando un refrigerador",
        title: "Servicio Técnico Especializado",
        subtitle: "Reparamos tus electrodomésticos con garantía y eficiencia.",
        buttonText: "Ver Servicios",
        buttonLink: "/servicios/servicio-tecnico",
      },
      {
        id: 2,
        imageUrl: "/img/hero-bg/hero-bg2.jpg",
        altText: "Variedad de repuestos para electrodomésticos",
        title: "Repuestos Originales y Alternativos",
        subtitle: "Encuentra todo lo que necesitas para tus equipos.",
        buttonText: "Comprar Repuestos",
        buttonLink: "/repuestos",
      },
      {
        id: 3,
        imageUrl: "/img/hero-bg/hero-bg3.jpg",
        altText: "Instalación de aire acondicionado",
        title: "Climatización Profesional",
        subtitle: "Instalación y mantenimiento de aires acondicionados.",
        buttonText: "Saber Más",
        buttonLink: "/servicios/instalacion",
      },
      {
        id: 4,
        imageUrl: "/img/hero-bg/hero-bg4.jpg",
        altText: "Ofertas en electrodomésticos",
        title: "Electrodomésticos de Última Generación",
        subtitle: "Descubre nuestras ofertas y renueva tu hogar.",
        buttonText: "Ver Catálogo",
        buttonLink: "/electrodomesticos",
      },
      {
        id: 5,
        imageUrl: "/img/hero-bg/hero-bg5.jpg",
        altText: "Asesoría personalizada",
        title: "Te Asesoramos en tu Compra",
        subtitle: "Nuestro equipo experto te ayudará a elegir lo mejor.",
        buttonText: "Contáctanos",
        buttonLink: "/contacto",
      },
      {
        id: 6,
        imageUrl: "/img/hero-bg/hero-bg6.jpg",
        altText: "Taller de reparación de equipos",
        title: "Confía en Nuestros Expertos",
        subtitle: "Soluciones rápidas y efectivas para tus aparatos.",
        buttonText: "Solicitar Reparación",
        buttonLink: "/servicios/servicio-tecnico",
      },
      {
        id: 7,
        imageUrl: "/img/hero-bg/hero-bg7.png",
        altText: "Repuestos de alta calidad",
        title: "Calidad Garantizada en Repuestos",
        subtitle: "Solo las mejores marcas para una mayor durabilidad.",
        buttonText: "Explorar Repuestos",
        buttonLink: "/repuestos",
      },
];

const HeroSliderSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[calc(100vh-70px)] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
          }}
          effect="fade"
          fadeEffect={{
            crossFade: true
          }}
          className="w-full h-full"
        >
          {slidesData.map((slide, index) => (
            // ANIMACIÓN: La clase `group` nos permite usar el estado del padre
            <SwiperSlide key={slide.id} className="relative group"> 
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill
                style={{ objectFit: 'cover' }} // objectFit se pasa a través de style
                priority={index === 0}
                quality={85}
                sizes="(max-width: 768px) 100vw, 100vw" // Simplificado para que siempre cubra
                // ANIMACIÓN: La clase `swiper-slide-active` es la clave. La usamos en el CSS global.
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#002266]/60 text-[#F7FAFC] p-4 md:p-8 text-center">
                <div className="max-w-2xl">
                  {slide.title && (
                    <h1
                      // ANIMACIÓN: Clases para transformar y animar el texto. Se activarán con CSS.
                      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 drop-shadow-lg opacity-0 animate-on-active"
                    >
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p 
                      // ANIMACIÓN: Clases para transformar y animar el texto con un retraso.
                      className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow-md opacity-0 animate-on-active"
                      style={{ animationDelay: '200ms' }} // Retraso para el subtítulo
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    <div 
                      // ANIMACIÓN: Contenedor para animar el botón.
                      className="opacity-0 animate-on-active"
                      style={{ animationDelay: '400ms' }} // Retraso para el botón
                    >
                      <Link href={slide.buttonLink} legacyBehavior>
                        <a className="inline-block bg-[#C8102E] hover:bg-[#002A7F] text-[#F7FAFC] font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                          {slide.buttonText}
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <style jsx global>{`
          /* --- ANIMACIONES NUEVAS --- */
          
          /* Keyframes para la animación de entrada del texto (deslizar y aparecer) */
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Keyframes para el efecto Ken Burns (zoom sutil en la imagen) */
          @keyframes kenburns {
            from {
              transform: scale(1);
            }
            to {
              transform: scale(1.1); /* Puedes ajustar este valor para un zoom más o menos pronunciado */
            }
          }
          
          /* Cuando el slide ESTÁ ACTIVO, aplicamos las animaciones */
          .swiper-slide-active .animate-on-active {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          
          .swiper-slide-active img {
            /* La animación dura un poco más que el delay del autoplay para un efecto continuo */
            animation: kenburns 7s ease-out forwards;
          }
          
          /* --- ESTILOS DE SWIPER (ya existentes y mejorados) --- */

          .swiper-button-next,
          .swiper-button-prev {
            color: #F7FAFC; 
            background-color: rgba(0, 42, 127, 0.4); 
            padding: 15px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            top: 50%;
            transform: translateY(-50%);
            transition: background-color 0.3s ease, transform 0.3s ease;
          }
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background-color: rgba(0, 42, 127, 0.7);
            transform: translateY(-50%) scale(1.1); /* Efecto de crecimiento al pasar el mouse */
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 20px !important;
          }
          .swiper-pagination-bullet {
            background-color: #EBF4FF; 
            opacity: 0.8;
            width: 10px;
            height: 10px;
            transition: background-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
          }
          .swiper-pagination-bullet:hover {
            transform: scale(1.2);
          }
          .swiper-pagination-bullet-active {
            background-color: #C8102E; 
            opacity: 1;
            transform: scale(1.2); /* Hacemos el punto activo un poco más grande */
          }
          @media (max-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              width: 40px;
              height: 40px;
              padding: 10px;
            }
            .swiper-button-next::after,
            .swiper-button-prev::after {
              font-size: 16px !important;
            }
            .swiper-pagination-bullet {
              width: 8px;
              height: 8px;
            }
          }
        `}</style>
    </section>
  );
};

export default HeroSliderSection;