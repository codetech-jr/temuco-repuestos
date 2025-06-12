// src/components/ui/ProductCardSkeleton.tsx
'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Asegúrate que este CSS se importe globalmente o aquí

export default function ProductCardSkeleton() {
  return (
    <div className="border p-4 rounded-lg shadow animate-pulse"> {/* Tailwind pulse animation */}
      <div className="aspect-square bg-gray-300 mb-3 rounded"></div> {/* Placeholder para imagen */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div> {/* Placeholder para nombre */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div> {/* Placeholder para precio/info corta */}
      <div className="h-9 bg-gray-300 rounded"></div> {/* Placeholder para botón */}
    </div>
  );
}