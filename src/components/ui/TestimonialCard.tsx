// src/components/ui/TestimonialCard.tsx
import RatingStars from './RatingStars';
import Image from 'next/image'; // Importa el componente Image
import { Testimonial } from './TestimonialCard'; // o desde donde exportes la interfaz

interface TestimonialCardProps {
  testimonial: Testimonial;
  isSlider?: boolean; // Para ajustar estilos si está en un slider
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorDetail?: string;
  rating: number;
  avatarUrl?: string; // Nuevo: URL para la imagen del avatar (opcional)
}

const TestimonialCard = ({ testimonial, isSlider = false }: TestimonialCardProps) => {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col ${isSlider ? 'h-auto min-h-[320px]' : 'h-full'}`}>
      <div className="mb-4">
        <RatingStars rating={testimonial.rating} activeColor="text-yellow-500" inactiveColor="text-gray-300" starSize="w-5 h-5" />
      </div>
      <blockquote className="text-gray-700 italic mb-6 flex-grow text-sm md:text-base leading-relaxed">
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <div className="mt-auto pt-4 border-t border-gray-200 flex items-center">
        {testimonial.avatarUrl && (
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={testimonial.avatarUrl}
              alt={`Avatar de ${testimonial.authorName}`}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <div>
          <p className="font-semibold text-blue-800 text-base">{testimonial.authorName}</p>
          {testimonial.authorDetail && (
            <p className="text-xs text-gray-500">{testimonial.authorDetail}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;