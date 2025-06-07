
// src/components/layout/WishlistNavItem.tsx
'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react'; // Icono de Lucide
import { useWishlist } from '@/contexts/WishlistContext';

export const WishlistNavItem = () => {
  const { wishlistItems, isLoading } = useWishlist();
  const itemCount = wishlistItems.length;

  // Colores de tu paleta
  const iconBaseColor = "text-[#718096]"; // Gris medio para el ícono base
  const iconHoverColor = "hover:text-[#002A7F]"; // Azul oscuro principal para el hover del ícono (y enlace)

  const counterBgColor = "bg-[#C8102E]"; // Rojo de marca para el fondo del contador
  const counterTextColor = "text-white"; // O text-[#F7FAFC]

  return (
    <Link
      href="/favoritos"
      className={`relative flex items-center p-2 ${iconBaseColor} ${iconHoverColor} transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#002A7F] rounded-md`} // Añadido focus state y rounded
      title="Lista de Deseos" // Tooltip para accesibilidad
    >
      <Heart size={24} /> {/* El color se hereda del Link padre */}
      
      {!isLoading && itemCount > 0 && (
        <span 
          key={itemCount} // Ayuda a React a re-renderizar con animación si la librería de animación lo soporta
          className={`absolute -top-1 -right-1 flex items-center justify-center 
                     w-5 h-5 ${counterBgColor} ${counterTextColor} text-xs font-bold rounded-full
                     animate-in fade-in zoom-in-75 duration-200`} // Ajustado zoom-in y duración
        >
          {itemCount}
        </span>
      )}
      {/* Opcional: Indicador de carga, aunque si isLoading es rápido, puede no ser necesario */}
      {/* {isLoading && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5">
          <Spinner size="small" /> // Un componente Spinner pequeño
        </span>
      )} */}
    </Link>
  );
};