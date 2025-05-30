// src/components/catalog/CategoryFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[]; // Lista de todas las categorías disponibles
}

const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  useEffect(() => {
    setSelectedCategory(currentCategory);
  }, [currentCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value;
    setSelectedCategory(category);

    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // Resetear página
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-auto">
      <label htmlFor="category" className="sr-only">Filtrar por categoría</label>
      <select
        id="category"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm bg-white"
      >
        <option value="">Todas las Categorías</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;