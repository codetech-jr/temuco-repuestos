// src/components/ui/TestimonialCard.tsx
import RatingStars from './RatingStars';
import Image from 'next/image';

// La interfaz Testimonial se define aquí mismo para claridad en este ejemplo,
// pero es bueno tenerla en un archivo centralizado de tipos si se usa en múltiples lugares.
export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorDetail?: string;
  rating: number;
  avatarUrl?: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  isSlider?: boolean;
}

const TestimonialCard = ({ testimonial, isSlider = false }: TestimonialCardProps) => {
  return (
    // Fondo de tarjeta: Casi blanco azulado
    <div className={`bg-[#F7FAFC] rounded-xl shadow-lg p-6 md:p-8 flex flex-col ${isSlider ? 'h-full' : 'h-full'}`}>
      {/* En modo slider, Swiper suele manejar bien la altura, 'h-full' ayuda a que la card se estire si es necesario */}
      {/* Si no está en slider, h-full permite que las tarjetas en un grid tengan la misma altura. */}
      <div className="mb-4">
        {/* RatingStars: Estrellas activas con naranja/marrón, inactivas con azul muy pálido */}
        <RatingStars
          rating={testimonial.rating}
          activeColor="text-[#DD6B20]" // Naranja/Marrón para estrellas activas
          inactiveColor="text-[#EBF4FF]" // Azul muy pálido para estrellas inactivas
          starSize="w-5 h-5"
        />
      </div>
      {/* Cita: Texto gris oscuro azulado */}
      <blockquote className="text-[#2D3748] italic mb-6 flex-grow text-sm md:text-base leading-relaxed">
        <p>“{testimonial.quote}”</p>
      </blockquote>
      {/* Borde separador: Azul muy pálido */}
      <div className="mt-auto pt-4 border-t border-[#EBF4FF] flex items-center">
        {testimonial.avatarUrl && (
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={testimonial.avatarUrl}
              alt={`Avatar de ${testimonial.authorName}`}
              fill // Usar fill en lugar de layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 48px, 56px" // Tamaños para optimización de imagen
            />
          </div>
        )}
        <div>
          {/* Nombre del autor: Azul oscuro principal */}
          <p className="font-semibold text-[#002A7F] text-base">{testimonial.authorName}</p>
          {/* Detalle del autor: Gris medio */}
          {testimonial.authorDetail && (
            <p className="text-xs text-[#718096]">{testimonial.authorDetail}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;