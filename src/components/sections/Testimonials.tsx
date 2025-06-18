// src/components/sections/Testimonials.tsx
"use client";

import TestimonialCard, { Testimonial } from '@/components/ui/TestimonialCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Datos de testimonios (asumiendo que las imágenes están en public/img/)
const testimonialsData: Testimonial[] = [
  {
    id: 'testimonial1',
    quote: 'Excelente atención, mucha variedad de productos, buenos precios y full accesibilidad para llegar a tienda. 100% recomendados.',
    authorName: 'Alba Gómez',
    authorDetail: 'Cliente desde 2024',
    rating: 5,
    avatarUrl: '/img/testimonials/user-icon.png', // Cambiar a nombres de archivo más descriptivos si es posible
  },
  {
    id: 'testimonial2',
    quote: 'Muy buena la atención al público. excelentes precios y variedad. ⭐⭐⭐⭐⭐',
    authorName: 'Adrián Sanchez',
    authorDetail: 'Cliente desde 2024',
    rating: 5,
    avatarUrl: '/img/testimonials/testimonial-user.png', // Cambiar a nombres de archivo más descriptivos
  },
  {
    id: 'testimonial3',
    quote: 'Excelente atención, amables y atentos.',
    authorName: 'Bonnie Raga',
    authorDetail: 'Cliente desde 2024',
    rating: 5,
    avatarUrl: '/img/testimonials/user-icon.png', // Cambiar a nombres de archivo más descriptivos
  },
  {
    id: 'testimonial4',
    quote: 'Buena atención y si no tienen el producto especifico te dicen donde se puede conseguir.',
    authorName: 'Moises García',
    authorDetail: 'Cliente desde el 2022',
    rating: 4,
    avatarUrl: '/img/testimonials/testimonial-user-2.png', // Cambiar a nombres de archivo más descriptivos
  },
];


const Testimonials = () => {
  // Determina si usar slider basado en el número de testimonios.
  // Si tienes 1, 2, o 3, puede que no quieras un slider.
  // Si tienes 3, y muestras 3 por slide en desktop, el slider no se moverá, pero la paginación podría aparecer.
  // Ajusta esta lógica según cuántos testimonios quieres para activar el slider.
  // Por ejemplo, activar slider si hay más testimonios que los que caben en la vista más ancha (lg:slidesPerView: 3).
  const shouldUseSlider = testimonialsData.length > 3; // O > 2 si quieres slider con 3 items para lg

  return (
    // Fondo de sección: Azul muy oscuro
    // Texto principal de la sección (título): Casi blanco azulado
    <section className="py-12 md:py-16 bg-[#002266] text-[#F7FAFC]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12">
          Lo que dicen nuestros clientes
        </h2>
        {testimonialsData.length > 0 ? (
          shouldUseSlider ? (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={testimonialsData.length > 3} // O ajusta el número según slidesPerView en el breakpoint más grande
              autoplay={{
                delay: 7000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true, // Buena práctica
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              // navigation // Descomenta para flechas
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: testimonialsData.length < 3 ? testimonialsData.length : 3, // Evita mostrar menos de lo que hay si son pocos
                  spaceBetween: 40,
                },
              }}
              className="pb-12 md:pb-16" // Espacio para paginación
            >
              {testimonialsData.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="h-auto flex"> {/* h-auto y flex para que las cards se estiren */}
                  {/* TestimonialCard debería tener un fondo claro, ej: bg-[#F7FAFC]
                      y colores de texto oscuros de tu paleta para contrastar */}
                  <TestimonialCard testimonial={testimonial} isSlider={true} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // Grid para cuando no se usa el slider
            <div className={`grid grid-cols-1 md:grid-cols-2 ${testimonialsData.length >= 3 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}>
              {testimonialsData.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          )
        ) : (
          // Texto para cuando no hay testimonios: Azul muy pálido
          <p className="text-center text-lg text-[#EBF4FF]">Aún no hay testimonios para mostrar.</p>
        )}
      </div>
      <style jsx global>{`
        /* Paginación de Swiper */
        .swiper-pagination-bullet {
          background-color: #EBF4FF !important; /* Azul muy pálido para bullets inactivos */
          opacity: 0.7 !important;
          width: 10px !important; /* Tamaño un poco más grande */
          height: 10px !important;
          transition: background-color 0.3s ease, opacity 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background-color: #C8102E !important; /* Rojo para el bullet activo */
          opacity: 1 !important;
        }

        /* Flechas de navegación (si se activan) */
        .swiper-button-next,
        .swiper-button-prev {
          color: #F7FAFC !important; /* Casi blanco azulado para las flechas */
          /* Opcional: añadir un fondo como en el HeroSlider si se desea */
          /* background-color: rgba(0, 42, 127, 0.3); Azul oscuro principal con opacidad */
          /* padding: 10px; */
          /* border-radius: 50%; */
          /* width: 40px; */
          /* height: 40px; */
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          /* background-color: rgba(0, 42, 127, 0.6); */ /* Ejemplo si se usa fondo */
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 24px !important;
        }

        /* Asegurar que SwiperSlide tome altura si TestimonialCard tiene height: 100% */
        .swiper-slide {
          height: auto; /* Por defecto para Swiper, pero si las cards tienen h-full explícito */
        }
        .swiper-slide > div { /* Asumiendo que TestimonialCard es el hijo directo */
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;