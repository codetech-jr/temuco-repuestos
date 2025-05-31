// src/components/catalog/CategoryFilter.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CategoryFilterProps {
  categories: string[];
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
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // { scroll: false } para UX
  };

  return (
    <div className="w-full md:w-auto">
      <label htmlFor="category-filter" className="sr-only">Filtrar por categoría</label> {/* Cambiado id */}
      <select
        id="category-filter" // Asegúrate que el id sea único y coincida con htmlFor
        value={selectedCategory}
        onChange={handleCategoryChange}
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