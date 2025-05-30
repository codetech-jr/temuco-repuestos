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
    setSelectedBrand(currentBrand);
  }, [currentBrand]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brand = e.target.value;
    setSelectedBrand(brand);

    const params = new URLSearchParams(searchParams.toString());
    if (brand) {
      params.set('brand', brand);
    } else {
      params.delete('brand');
    }
    params.set('page', '1'); // Resetear página
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto">
      <label htmlFor="brand" className="sr-only">Filtrar por marca</label>
      <select
        id="brand"
        value={selectedBrand}
        onChange={handleBrandChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm bg-white"
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