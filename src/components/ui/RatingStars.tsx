// src/components/ui/RatingStars.tsx
interface RatingStarsProps {
  rating: number; // e.g., 4
  maxRating?: number; // e.g., 5
  starSize?: string; // Tailwind class for size, e.g., "w-5 h-5"
  activeColor?: string; // Tailwind class for filled stars, e.g., "text-yellow-400"
  inactiveColor?: string; // Tailwind class for empty stars, e.g., "text-gray-600" (dentro de la card azul oscuro)
}

const RatingStars = ({
  rating,
  maxRating = 5,
  starSize = "w-4 h-4",
  activeColor = "text-yellow-400",
  inactiveColor = "text-blue-500", // Color para estrellas vacías dentro de la card azul
}: RatingStarsProps) => {
  const roundedRating = Math.round(rating); // Redondeamos, ya que no hay medias estrellas en el diseño

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => (
        <svg
          key={i}
          className={`${starSize} ${i < roundedRating ? activeColor : inactiveColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;