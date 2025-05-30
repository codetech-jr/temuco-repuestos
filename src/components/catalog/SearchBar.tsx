// src/components/catalog/SearchBar.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react'; // Añadir useCallback
import { IoSearch } from 'react-icons/io5';

// Función debounce simple
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


const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(currentQuery);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set('q', term.trim());
      } else {
        params.delete('q');
      }
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`, { scroll: false }); // { scroll: false } para no saltar al inicio
    }, 500), // 500ms de debounce
    [pathname, router, searchParams] // Dependencias de useCallback
  );

  useEffect(() => {
    // Solo llamar a debouncedSearch si el searchTerm actual es diferente del query param
    // para evitar bucles o llamadas innecesarias al cargar la página.
    if (searchTerm !== currentQuery) {
      debouncedSearch(searchTerm);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, debouncedSearch]); // No añadir currentQuery aquí para evitar bucle

  // Actualizar searchTerm si el query param cambia externamente (ej. por navegación)
  useEffect(() => {
    setSearchTerm(currentQuery);
  }, [currentQuery]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Forzar la búsqueda inmediatamente al presionar enter o el botón
    // Esto cancelará cualquier debounce pendiente y ejecutará la búsqueda
    const params = new URLSearchParams(searchParams.toString());
    if (searchTerm.trim()) {
        params.set('q', searchTerm.trim());
    } else {
        params.delete('q');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full md:w-1/2 lg:w-1/3">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado, el useEffect hará el debounce
        placeholder="Buscar repuestos..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
      />
      <button
        type="submit"
        className="bg-brand-blue text-white px-4 py-2 rounded-r-md hover:bg-brand-blue-dark transition-colors duration-300"
        aria-label="Buscar"
      >
        <IoSearch size={22} />
      </button>
    </form>
  );
};

export default SearchBar;