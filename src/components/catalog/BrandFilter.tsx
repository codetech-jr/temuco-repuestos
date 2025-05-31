// src/components/catalog/BrandFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface BrandFilterProps {
  brands: string[];
}

const BrandFilter = ({ brands }: BrandFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentBrand = searchParams.get('brand') || '';
  const [selectedBrand, setSelectedBrand] = useState(currentBrand);

  useEffect(() => {
    // Actualiza el estado local si el parámetro de la URL cambia (navegación atrás/adelante)
    setSelectedBrand(currentBrand);
  }, [currentBrand]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand); // Actualiza el estado local inmediatamente para la UI

    const params = new URLSearchParams(searchParams.toString());
    if (brand) {
      params.set('brand', brand);
    } else {
      params.delete('brand');
    }
    params.set('page', '1'); // Resetear a la página 1 cuando cambia el filtro
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // { scroll: false } para evitar saltar al inicio de la página
  };

  return (
    <div className="w-full md:w-auto">
      <label htmlFor="brand-filter" className="sr-only">Filtrar por marca</label> {/* Cambiado id para evitar colisión si "brand" se usa en otro lugar */}
      <select
        id="brand-filter" // Asegúrate que el id sea único y coincida con htmlFor
        value={selectedBrand}
        onChange={handleBrandChange}
        // Clases de estilo con tu paleta:
        // Borde: Gris medio
        // Texto: Gris oscuro azulado
        // Fondo: Blanco
        // Focus: Anillo azul oscuro principal y borde azul oscuro principal
        className="block w-full px-4 py-2 border border-[#718096] rounded-md shadow-sm 
                   text-[#2D3748] bg-white 
                   focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F] 
                   sm:text-sm transition-colors duration-150"
      >
        <option value="">Todas las Marcas</option>
        {brands.map((brandName) => (
          <option key={brandName} value={brandName}>
            {brandName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BrandFilter;