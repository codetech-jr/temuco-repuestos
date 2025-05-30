// src/components/catalog/SortDropdown.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const sortOptions = [
  { label: 'Relevancia', value: '' }, // O 'default'
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
    // No resetear la página aquí, la ordenación se aplica a la página actual
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto">
      <label htmlFor="sort" className="sr-only">Ordenar por</label>
      <select
        id="sort"
        value={selectedSort}
        onChange={handleSortChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm bg-white"
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