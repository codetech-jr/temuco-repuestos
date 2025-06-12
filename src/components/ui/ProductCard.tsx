// src/components/ui/ProductCard.tsx

"use client";

import Image from 'next/image';
import Link from 'next/link';
import RatingStars from './RatingStars';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import apiClient from '@/app/api/axiosClient';
import type { ProductForCard } from '@/types/product';

interface ProductCardProps {
  product: ProductForCard;
  productType: 'electrodomestico' | 'repuesto';
}

const PLACEHOLDER_IMAGE_URL = '/images/placeholder/product-placeholder.png';

const ProductCard = ({ product, productType }: ProductCardProps) => {
  const handleProductClick = () => {
    apiClient.post('/tracking/click', {
      productId: product.id,
      productType: productType,
    }).catch(error => {
      console.warn('Click tracking failed:', error.message);
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', { 
      style: 'currency', 
      currency: 'CLP', 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const tagBgColor = 
          product.tag === 'Oferta' ? 'bg-[#C8102E]' : 
          product.tag === 'Nuevo' ? 'bg-[#002A7F]' : 
          product.tag === 'Más Vendido' ? 'bg-[#DD6B20]' : 
          product.tag === 'Original' ? 'bg-green-600' :
          product.tag === 'Alternativo' ? 'bg-gray-500' :
          '';
  const tagTextColor = 'text-[#F7FAFC]';
  
  const imageToDisplay = product.imageUrl || PLACEHOLDER_IMAGE_URL;
  const altTextToDisplay = product.altText || product.name || 'Imagen de producto';

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full 
                 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1
                 w-full max-w-xs sm:max-w-sm mx-auto relative cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <WishlistButton
          productId={product.id}
          productType={productType}
        />
      </div>

      <Link href={product.link} className="block group flex-grow flex flex-col">
        <div className="w-full h-48 sm:h-52 md:h-56 relative overflow-hidden bg-gray-200">
          <Image
            src={imageToDisplay}
            alt={altTextToDisplay}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="group-hover:scale-105 transition-transform duration-300 ease-in-out object-cover"
          />
          {product.tag && tagBgColor && (
            <span
              className={`absolute top-2 left-2 px-2.5 py-0.5 text-xs font-bold tracking-wide rounded-full shadow-md ${tagBgColor} ${tagTextColor}`}
            >
              {product.tag.toUpperCase()}
            </span>
          )}
        </div>
      
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          <h3 
            className="text-sm sm:text-base font-semibold text-[#2D3748] mb-1 leading-tight 
                       min-h-[2.8em] sm:min-h-[2.6em] line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mb-2 h-[22px] flex items-center">
            {typeof product.rating === 'number' && product.rating > 0 && (
              <>
                <RatingStars rating={product.rating} starSize="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {typeof product.reviewCount === 'number' && (
                  <span className="ml-1.5 text-[11px] sm:text-xs text-[#718096]">({product.reviewCount})</span>
                )}
              </>
            )}
          </div>

          <div className="mb-3">
            <span className="text-lg sm:text-xl font-bold text-[#002A7F]">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="ml-2 text-xs line-through text-[#718096]">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-auto pt-2">
            <div className="w-full bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] 
                          font-semibold py-2 px-3 rounded text-center transition duration-300 
                          text-xs sm:text-sm">
              Ver Detalles
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;