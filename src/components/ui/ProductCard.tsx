// src/components/ui/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import RatingStars from './RatingStars'; // Asegúrate que la ruta sea correcta

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  altText: string;
  tag?: 'Oferta' | 'Nuevo' | 'Más Vendido'; // Ampliando opciones de tags
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  link: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
  };

  let tagBgColor = '';
  let tagTextColor = 'text-[#F7FAFC]'; // Casi blanco azulado por defecto para tags

  // Definir colores para diferentes tags
  if (product.tag === 'Oferta') {
    tagBgColor = 'bg-[#C8102E]'; // Rojo
  } else if (product.tag === 'Nuevo') {
    tagBgColor = 'bg-[#002A7F]'; // Azul oscuro principal
  } else if (product.tag === 'Más Vendido') {
    tagBgColor = 'bg-[#DD6B20]'; // Naranja/Marrón (asegúrate que este hex sea correcto y esté en tu paleta)
    // Podrías necesitar ajustar tagTextColor para el naranja si #F7FAFC no contrasta bien, ej: text-black
  }


  return (
    // Fondo de tarjeta: Blanco. Sombra y efecto hover.
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
      <Link href={product.link} className="block group">
        <div className="w-full h-52 sm:h-56 md:h-60 relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.altText}
            fill // Usar fill en lugar de layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Ayuda a Next/Image
          />
          {product.tag && tagBgColor && (
            <span
              className={`absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wide rounded-full shadow-md ${tagBgColor} ${tagTextColor}`}
            >
              {product.tag.toUpperCase()}
            </span>
          )}
        </div>
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Nombre del producto: Gris oscuro azulado, hover azul oscuro principal */}
        <h3 className="text-md sm:text-lg font-semibold text-[#2D3748] mb-1 leading-tight min-h-[3em] sm:min-h-[2.5em] md:min-h-[3em]">
          <Link href={product.link} className="hover:text-[#002A7F] transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center mb-2">
          {/* RatingStars se estiliza internamente. Podría usar text-[#DD6B20] o text-[#002A7F] para estrellas llenas */}
          <RatingStars rating={product.rating} starSize="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
          {/* Conteo de reseñas: Gris medio */}
          <span className="ml-2 text-xs sm:text-sm text-[#718096]">({product.reviewCount})</span>
        </div>

        <div className="mb-4">
          {/* Precio actual: Azul oscuro principal (o rojo #C8102E si quieres más énfasis) */}
          <span className="text-xl sm:text-2xl font-bold text-[#002A7F]">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            // Precio original: Gris medio
            <span className="ml-2 text-xs sm:text-sm line-through text-[#718096]">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Botón "Ver Detalles": Rojo, hover azul muy oscuro, texto casi blanco azulado */}
        <Link href={product.link} legacyBehavior>
          <a className="mt-auto w-full bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] font-semibold py-2.5 px-4 rounded text-center transition duration-300 text-sm sm:text-base">
            Ver Detalles
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;