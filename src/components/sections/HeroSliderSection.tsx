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
  {
    id: 1,
    imageUrl: "/img/hero-bg.jpg",
    altText: "Técnico revisando un refrigerador",
    title: "Servicio Técnico Especializado",
    subtitle: "Reparamos tus electrodomésticos con garantía y eficiencia.",
    buttonText: "Ver Servicios",
    buttonLink: "/servicios/servicio-tecnico",
  },
  {
    id: 2,
    imageUrl: "/img/hero-bg2.jpg",
    altText: "Variedad de repuestos para electrodomésticos",
    title: "Repuestos Originales y Alternativos",
    subtitle: "Encuentra todo lo que necesitas para tus equipos.",
    buttonText: "Comprar Repuestos",
    buttonLink: "/repuestos",
  },
  {
    id: 3,
    imageUrl: "/img/hero-bg3.jpg",
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/servicios/instalacion",
  },
  {
    id: 4,
    imageUrl: "/img/hero-bg4.jpg",
    altText: "Ofertas en electrodomésticos", // Cambiado para variedad
    title: "Electrodomésticos de Última Generación",
    subtitle: "Descubre nuestras ofertas y renueva tu hogar.",
    buttonText: "Ver Catálogo",
    buttonLink: "/electrodomesticos", // Asumo que esta es la página correcta
  },
  {
    id: 5,
    imageUrl: "/img/hero-bg5.jpg",
    altText: "Asesoría personalizada", // Cambiado para variedad
    title: "Te Asesoramos en tu Compra",
    subtitle: "Nuestro equipo experto te ayudará a elegir lo mejor.",
    buttonText: "Contáctanos",
    buttonLink: "/contacto",
  },
  // Puedes añadir más slides si es necesario. La slide 6 y 7 eran idénticas, eliminé una.
  // Si tienes 7 imágenes distintas, asegúrate de actualizar imageUrl y altText.
  {
    id: 6, // Si es distinta, este sería el ID 6.
    imageUrl: "/img/hero-bg6.jpg",
    altText: "Taller de reparación de equipos", // Cambiado para variedad
    title: "Confía en Nuestros Expertos",
    subtitle: "Soluciones rápidas y efectivas para tus aparatos.",
    buttonText: "Solicitar Reparación",
    buttonLink: "/servicios/servicio-tecnico",
  },
  {
    id: 7, // Si es distinta, este sería el ID 7.
    imageUrl: "/img/hero-bg7.png", // Asegúrate que esta imagen exista
    altText: "Repuestos de alta calidad", // Cambiado para variedad
    title: "Calidad Garantizada en Repuestos",
    subtitle: "Solo las mejores marcas para una mayor durabilidad.",
    buttonText: "Explorar Repuestos",
    buttonLink: "/repuestos",
  },
];

const HeroSliderSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[calc(100vh-70px)] overflow-hidden"> {/* Ajustado para la altura del header si es ~70px */}
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
            <SwiperSlide key={slide.id} className="relative">
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill // Usar fill en lugar de layout="fill" con Next.js >= 13
                objectFit="cover"
                priority={index === 0}
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Ayuda a Next/Image a elegir el mejor tamaño
              />
              {/* Contenedor para el texto superpuesto con overlay azul oscuro */}
              {(slide.title || slide.subtitle || slide.buttonText) && (
                // Usando el azul más oscuro de tu paleta para el overlay
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#002266]/60 text-[#F7FAFC] p-4 md:p-8 text-center">
                  <div className="max-w-2xl">
                    {slide.title && (
                      // Texto del título
                      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 drop-shadow-lg">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      // Texto del subtítulo
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow-md">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.buttonText && slide.buttonLink && (
                      <Link href={slide.buttonLink} legacyBehavior>
                        {/* Botón con color rojo de tu marca y hover azul oscuro */}
                        <a className="bg-[#C8102E] hover:bg-[#002A7F] text-[#F7FAFC] font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                          {slide.buttonText}
                        </a>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        <style jsx global>{`
          .swiper-button-next,
          .swiper-button-prev {
            color: #F7FAFC; /* Color de las flechas (casi blanco azulado) */
            background-color: rgba(0, 42, 127, 0.4); /* Azul oscuro principal con opacidad */
            padding: 15px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            top: 50%;
            transform: translateY(-50%);
            transition: background-color 0.3s ease;
          }
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background-color: rgba(0, 42, 127, 0.7); /* Azul oscuro principal más opaco al pasar el mouse */
          }
          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 20px !important;
          }
          .swiper-pagination-bullet {
            background-color: #EBF4FF; /* Azul muy pálido para bullets inactivos */
            opacity: 0.8;
            width: 10px;
            height: 10px;
            transition: background-color 0.3s ease, opacity 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background-color: #C8102E; /* Rojo de tu marca para el bullet activo */
            opacity: 1;
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