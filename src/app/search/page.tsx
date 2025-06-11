// En: src/app/search/page.tsx

import { Suspense } from 'react';
import SearchResults from '@/components/search/SearchResult'; // Ajusta la ruta si es necesario

// Este componente ahora es un Server Component, lo que es bueno para SEO.
export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 sr-only">Resultados de Búsqueda</h1>
      
      <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
        <SearchResults />
      </Suspense>
      
    </div>
  );
}