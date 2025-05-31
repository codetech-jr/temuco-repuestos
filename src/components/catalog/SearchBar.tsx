// src/components/catalog/SearchBar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { IoSearch } from 'react-icons/io5';

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

interface SearchBarProps {
  placeholder?: string; // Para poder personalizar el placeholder desde el padre
}

const SearchBar = ({ placeholder = "Buscar repuestos..." }: SearchBarProps) => { // Valor por defecto para placeholder
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set('q', term.trim());
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500),
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (searchTerm !== currentQuery) {
      debouncedSearch(searchTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debouncedSearch]); // No añadir currentQuery aquí

  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
        params.set('q', searchTerm.trim());
    } else {
        params.delete('q');
    }
    params.set('page', '1');
    // Empujar inmediatamente, cancelando cualquier debounce en curso
    clearTimeout((debouncedSearch as any).timeout); // Acceso a timeout si está expuesto o manejo interno en debounce
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-1/2 lg:w-1/3">
      {/* Input de búsqueda */}
      <input
        type="search" // 'search' type es más semántico y puede ofrecer UI nativa (ej. botón 'x')
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder} // Usar prop de placeholder
        // Clases de estilo con tu paleta:
        // Borde: Gris medio
        // Texto: Gris oscuro azulado
        // Placeholder: Gris por defecto de Tailwind (o #718096)
        // Focus: Anillo azul oscuro principal y borde azul oscuro principal
        className="flex-grow px-4 py-2 border border-[#718096] rounded-l-md 
                   text-[#2D3748] bg-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F] 
                   sm:text-sm transition-colors duration-150"
      />
      {/* Botón de búsqueda */}
      <button
        type="submit"
        // Fondo: Azul oscuro principal
        // Texto/Icono: Blanco
        // Hover: Azul muy oscuro
        className="bg-[#002A7F] text-white px-3 py-[9px] sm:px-4 rounded-r-md 
                   hover:bg-[#002266] 
                   transition-colors duration-300"
        aria-label="Buscar"
      >
        <IoSearch size={22} />
      </button>
    </form>
  );
};

export default SearchBar;