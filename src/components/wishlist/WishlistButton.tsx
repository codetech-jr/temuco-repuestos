// src/components/wishlist/WishlistButton.tsx
'use client';

import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { Heart } from 'lucide-react';

interface WishlistButtonProps {
  productId: string;
  productType: 'electrodomestico' | 'repuesto';
  className?: string;
}

export const WishlistButton = ({ productId, productType, className }: WishlistButtonProps) => {
  const { 
    wishlistItems,
    toggleWishlist, 
    isLoading: isWishlistLoading
  } = useWishlist();

  const [isProcessing, setIsProcessing] = useState(false);

  const isInWishlist = wishlistItems.some(item =>
    item.electrodomesticos?.id === productId || item.repuestos?.id === productId
  );

  const handleToggle = async () => {
    if (isWishlistLoading || isProcessing) return;
    
    setIsProcessing(true);
    await toggleWishlist(productId, productType);
    setIsProcessing(false);
  };

  const isDisabled = isWishlistLoading || isProcessing;

  // Color constants
  const activeFillColor = '#C8102E';
  const activeStrokeColor = 'text-[#C8102E]';
  const inactiveStrokeColor = 'text-[#718096]';
  const inactiveHoverStrokeColor = 'hover:text-[#002A7F]';
  const buttonBgColor = 'bg-white/80';
  const buttonHoverBgColor = 'hover:bg-white';

  return (
    <button
      onClick={handleToggle}
      disabled={isDisabled}
      className={`p-2 rounded-full ${buttonBgColor} backdrop-blur-sm 
                 ${buttonHoverBgColor} 
                 transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed
                 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#002A7F] ${className || ''}`}
      aria-label={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
      title={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
    >
      <Heart
        size={24}
        fill={isInWishlist ? activeFillColor : 'none'}
        className={`transition-colors duration-200 ${
          isInWishlist ? activeStrokeColor : `${inactiveStrokeColor} ${inactiveHoverStrokeColor}`
        }`}
      />
    </button>
  );
};