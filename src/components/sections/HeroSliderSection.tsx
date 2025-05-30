// src/components/sections/HeroSlider.tsx
"use client"; // Este componente necesita ser un Client Component por la interactividad del slider

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade'; // Si quieres efecto de desvanecimiento
import 'swiper/css/autoplay'; // Autoplay module CSS is often included in core or navigation

interface SlideContent {
  id: number;
  imageUrl: string;
  altText: string;
  title?: string; // Opcional: título sobre la imagen
  subtitle?: string; // Opcional: subtítulo
  buttonText?: string; // Opcional: texto del botón
  buttonLink?: string; // Opcional: enlace del botón
}

// Datos de ejemplo para los slides
// Asegúrate de que estas imágenes existan en public/images/
const slidesData: SlideContent[] = [
  {
    id: 1,
    imageUrl: "/img/hero-bg.jpg", // La imagen principal que mencionaste
    altText: "Técnico revisando un refrigerador",
    title: "Servicio Técnico Especializado",
    subtitle: "Reparamos tus electrodomésticos con garantía y eficiencia.",
    buttonText: "Ver Servicios",
    buttonLink: "/servicios",
  },
  {
    id: 2,
    imageUrl: "/img/hero-bg2.jpg", // Necesitarás otra imagen
    altText: "Variedad de repuestos para electrodomésticos",
    title: "Repuestos Originales y Alternativos",
    subtitle: "Encuentra todo lo que necesitas para tus equipos.",
    buttonText: "Comprar Repuestos",
    buttonLink: "/repuestos",
  },
  {
    id: 3,
    imageUrl: "/img/hero-bg3.jpg", // Y otra más
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/refrigeracion",
  },
    {
    id: 4,
    imageUrl: "/img/hero-bg4.jpg", // Y otra más
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/refrigeracion",
  },
    {
    id: 5,
    imageUrl: "/img/hero-bg5.jpg", // Y otra más
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/refrigeracion",
  },
    {
    id: 6,
    imageUrl: "/img/hero-bg6.jpg", // Y otra más
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/refrigeracion",
  },
      {
    id: 6,
    imageUrl: "/img/hero-bg7.png", // Y otra más
    altText: "Instalación de aire acondicionado",
    title: "Climatización Profesional",
    subtitle: "Instalación y mantenimiento de aires acondicionados.",
    buttonText: "Saber Más",
    buttonLink: "/refrigeracion",
  },
];

const HeroSliderSection = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] lg:h-[calc(100vh-80px)]"> {/* Ajusta altura según necesidad, restando altura del header si es sticky */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0} // Sin espacio entre slides
        slidesPerView={1} // Mostrar un slide a la vez
        navigation // Habilita flechas de navegación
        pagination={{ clickable: true }} // Habilita paginación (dots)
        loop={true} // Loop infinito
        autoplay={{
            delay: 5000, // Tiempo entre slides en ms
            disableOnInteraction: false, // No detener autoplay con interacción manual
            pauseOnMouseEnter: true,
        }}
        effect="fade" // Efecto de transición: 'slide', 'fade', 'cube', 'coverflow', 'flip'
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
              layout="fill"
              objectFit="cover"
              priority={index === 0} // Dar prioridad de carga a la primera imagen
              quality={85}
            />
            {/* Contenedor para el texto superpuesto */}
            {(slide.title || slide.subtitle || slide.buttonText) && (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/40 text-white p-4 md:p-8 text-center">
                <div className="max-w-2xl">
                  {slide.title && (
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 drop-shadow-md">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    <Link href={slide.buttonLink} legacyBehavior>
                      <a className="bg-brand-red hover:bg-brand-red-dark text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
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
      {/* Estilos personalizados para la navegación y paginación si es necesario */}
      {/* Swiper agrega clases como .swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #fff; /* Color de las flechas */
          background-color: rgba(0,0,0,0.3);
          padding: 15px; /* Aumenta el área clickeable */
          border-radius: 50%; /* Hace las flechas redondas */
          width: 50px; /* Ancho explícito */
          height: 50px; /* Alto explícito */
          top: 50%;
          transform: translateY(-50%);
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px !important; /* Tamaño del ícono de la flecha */
        }
        .swiper-pagination-bullet {
          background-color: #fff;
          opacity: 0.7;
          width: 10px;
          height: 10px;
        }
        .swiper-pagination-bullet-active {
          background-color: #D92525; /* Color rojo de tu marca para el bullet activo */
          opacity: 1;
        }
        /* Para pantallas pequeñas, las flechas pueden ser muy grandes */
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
        }
      `}</style>
    </section>
  );
};

export default HeroSliderSection;