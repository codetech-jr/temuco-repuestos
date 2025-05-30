// src/components/sections/Testimonials.tsx
"use client"; // Necesario para Swiper
// src/components/sections/Testimonials.tsx
"use client"; // Necesario para Swiper

import TestimonialCard, { Testimonial } from '@/components/ui/TestimonialCard';
// Importa Image (si lo moviste a la interfaz aquí) y Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules'; // Navigation es opcional

// Importa los estilos de Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Si usas Navigation

// ... (datos de testimonialsData como antes, con avatarUrl) ...
const testimonialsData: Testimonial[] = [
  {
    id: 'testimonial1',
    quote: 'Excelente servicio técnico. Repararon mi refrigerador en tiempo récord y a un precio muy razonable. Totalmente recomendados.',
    authorName: 'Carmen Rodríguez',
    authorDetail: 'Cliente desde 2019',
    rating: 5,
    avatarUrl: '/img/avatar1.png',
  },
  {
    id: 'testimonial2',
    quote: 'Compré un aire acondicionado y lo instalaron el mismo día. El técnico fue muy profesional y me explicó todo el funcionamiento. Muy satisfecho.',
    authorName: 'Roberto Méndez',
    authorDetail: 'Cliente desde 2021',
    rating: 5,
    avatarUrl: '/img/avatar1.png',
  },
  {
    id: 'testimonial3',
    quote: 'Tienen todos los repuestos que necesitaba para mi negocio. Precios competitivos y asesoría técnica de primer nivel. Los recomiendo 100%.',
    authorName: 'María Fernanda López',
    authorDetail: 'Dueña de Restaurante',
    rating: 5,
    avatarUrl: '/img/avatar1.png',
  },
  {
    id: 'testimonial4',
    quote: 'El mantenimiento preventivo ha sido clave para evitar problemas con mis equipos. Un servicio muy confiable y profesional.',
    authorName: 'Juan Pérez',
    authorDetail: 'Gerente de Operaciones',
    rating: 4,
    avatarUrl: '/img/avatar1.png',
  },
];


const Testimonials = () => {
  const shouldUseSlider = testimonialsData.length > 3;

  return (
    <section className="py-12 md:py-16 bg-blue-800 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
          Lo que dicen nuestros clientes
        </h2>
        {testimonialsData.length > 0 ? (
          shouldUseSlider ? (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]} // Añade Navigation si quieres flechas
              spaceBetween={30} // Espacio entre slides
              slidesPerView={1} // Por defecto en móvil
              loop={testimonialsData.length > 2} // Loop si hay suficientes items para que tenga sentido
              autoplay={{
                delay: 7000,
                disableOnInteraction: false,
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              // navigation // Descomenta si quieres flechas
              breakpoints={{
                // cuando el ancho de la ventana es >= 768px
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                // cuando el ancho de la ventana es >= 1024px
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 40,
                },
              }}
              className="pb-12" // Padding bottom para la paginación si está fuera
            >
              {testimonialsData.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="h-auto"> {/* h-auto para que Swiper controle altura */}
                  <TestimonialCard testimonial={testimonial} isSlider={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {testimonialsData.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )
        ) : (
          <p className="text-center text-lg">Aún no hay testimonios para mostrar.</p>
        )}
      </div>
      {/* Estilos para paginación de Swiper si es necesario, similar al HeroSlider */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #193cb8 !important; /* Blanco para fondo azul */
          opacity: 0.6 !important;
        }
        .swiper-pagination-bullet-active {
          background-color: #D92525 !important; /* Amarillo para el activo (color de estrellas) */
          opacity: 1 !important;
        }
        /* Ajustes para las flechas de navegación si las usas */
        .swiper-button-next,
        .swiper-button-prev {
          color: #fff !important;
          top: 50% !important; /* Centrar verticalmente */
          transform: translateY(-50%) !important;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 24px !important; /* Ajusta el tamaño de las flechas */
        }
      `}</style>
    </section>
  );
};

export default Testimonials;