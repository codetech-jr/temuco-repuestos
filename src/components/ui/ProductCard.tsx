// src/components/ui/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import RatingStars from './RatingStars'; // Asegúrate que la ruta sea correcta

// Interfaz para los datos del producto
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  altText: string;
  tag?: 'Oferta'; // Por ahora solo "Oferta" según la maqueta
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  link: string; // Enlace a la página del producto
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Función para formatear el precio a moneda chilena (CLP)
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="bg-blue-800 rounded-lg shadow-lg overflow-hidden flex flex-col text-white transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1.5">
      <Link href={product.link} className="block group">
        <div className="w-full h-52 sm:h-56 md:h-60 relative overflow-hidden"> {/* Contenedor de imagen */}
          <Image
            src={product.imageUrl}
            alt={product.altText}
            layout="fill"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
          />
          {product.tag === 'Oferta' && (
            <span
              className="absolute top-3 left-3 px-3 py-1 text-xs font-bold tracking-wide rounded-full text-white bg-red-600 shadow-md"
            >
              OFERTA
            </span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow"> {/* Espaciado interno */}
        <h3 className="text-md sm:text-lg font-semibold mb-1 leading-tight min-h-[3em]"> {/* Altura mínima para 2 líneas de título */}
          <Link href={product.link} className="hover:text-blue-300 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-center mb-2">
          <RatingStars rating={product.rating} starSize="w-[18px] h-[18px]" /> {/* Ajusta tamaño de estrellas si es necesario */}
          <span className="ml-2 text-xs sm:text-sm text-blue-300">({product.reviewCount})</span>
        </div>

        <div className="mb-4">
          <span className="text-xl sm:text-2xl font-bold text-yellow-400">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="ml-2 text-xs sm:text-sm line-through text-blue-400">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <Link href={product.link} legacyBehavior>
          <a className="mt-auto w-full bg-red-600 hover:bg-red-900 text-white font-semibold py-2.5 px-4 rounded text-center transition duration-300 text-sm sm:text-base">
            Ver Detalles
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;