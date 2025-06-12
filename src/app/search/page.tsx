// src/app/search/page.tsx

import { Suspense } from 'react';
// ¡Corrección clave! La importación debe coincidir con el nombre y la ruta del archivo.
import SearchResults from '@/components/search/SearchResult'; 

// Este componente es un Server Component, lo que es bueno para el SEO inicial.
export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título invisible para lectores de pantalla, mejora la accesibilidad */}
      <h1 className="sr-only">Resultados de Búsqueda</h1>
      
      {/* Suspense muestra un 'fallback' mientras el componente de cliente carga y obtiene datos */}
      <Suspense fallback={<div className="text-center p-10">Cargando resultados...</div>}>
        <SearchResults />
      </Suspense>
      
    </div>
  );
}