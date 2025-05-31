// src/components/catalog/SortDropdown.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const sortOptions = [
  { label: 'Relevancia', value: '' },
  { label: 'Precio: Menor a Mayor', value: 'price_asc' },
  { label: 'Precio: Mayor a Menor', value: 'price_desc' },
  { label: 'Nombre: A-Z', value: 'name_asc' },
  { label: 'Nombre: Z-A', value: 'name_desc' },
];

const SortDropdown = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || '';
  const [selectedSort, setSelectedSort] = useState(currentSort);

  useEffect(() => {
    setSelectedSort(currentSort);
  }, [currentSort]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortValue = e.target.value;
    setSelectedSort(sortValue);

    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // { scroll: false } para UX
  };

  return (
    <div className="w-full md:w-auto">
      {/* Cambiado id para unicidad, aunque si solo hay un "sort" en la página podría no ser estrictamente necesario, es buena práctica. */}
      <label htmlFor="sort-filter-dropdown" className="sr-only">Ordenar por</label>
      <select
        id="sort-filter-dropdown" // Asegúrate que el id sea único y coincida con htmlFor
        value={selectedSort}
        onChange={handleSortChange}
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
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;