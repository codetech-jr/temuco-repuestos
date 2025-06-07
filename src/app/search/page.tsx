// src/app/search/page.tsx
"use client"; 

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

// Interfaces de tus productos
export interface Electrodomestico {
  id: string; slug: string; name: string; price: number; image_url: string;
  category: string; brand: string; short_description?: string;
  altText?: string; original_price?: number;
}

export interface Repuesto {
  id: string; slug: string; name: string; price: number; image_url: string;
  category: string; brand: string; short_description?: string; is_original?: boolean;
  altText?: string; original_price?: number;
}

// --- INTERFAZ ACTUALIZADA ---
// Ahora esperamos también un campo 'suggestion' que puede ser string o null.
interface SearchResults {
  electrodomesticos: Electrodomestico[];
  repuestos: Repuesto[];
  searchTerm: string;
  suggestion: string | null; // <-- CAMBIO CLAVE
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  // El estado ahora usa la nueva interfaz
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const fetchUrl = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
        console.log("SEARCH PAGE: Intentando fetch a:", fetchUrl);

        try {
          const response = await fetch(fetchUrl, { cache: 'no-store' });
          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || `Error al buscar: ${response.statusText}`);
          }
          const data: SearchResults = await response.json();
          setResults(data);
        } catch (err: any) {
          console.error("Error en fetch de búsqueda:", err);
          setError(err.message || 'Ocurrió un error al realizar la búsqueda.');
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
      setResults({ electrodomesticos: [], repuestos: [], searchTerm: '', suggestion: null });
    }
  }, [query]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  }

  const noResultsFound = results && results.electrodomesticos.length === 0 && results.repuestos.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {query ? (
        <h1 className="text-3xl font-bold mb-8">
          Resultados de Búsqueda para: <span className="text-[#002A7F]">{results?.searchTerm || query}</span>
        </h1>
      ) : (
        <h1 className="text-3xl font-bold mb-8">Página de Búsqueda</h1>
      )}
      
      {!query && (
        <p className="text-lg text-gray-600">Usa la barra de búsqueda para encontrar productos o repuestos.</p>
      )}

      {/* --- BLOQUE DE RESULTADOS ACTUALIZADO --- */}
      {query && noResultsFound && !loading && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 mb-4">No se encontraron resultados para tu búsqueda.</p>
          
          {/* Mostramos la sugerencia si existe */}
          {results?.suggestion && (
            <p className="text-lg text-gray-700">
              Quizás quisiste decir:{" "}
              <Link 
                href={`/search?q=${encodeURIComponent(results.suggestion)}`}
                className="font-semibold text-[#002A7F] hover:underline"
              >
                {results.suggestion}
              </Link>
              ?
            </p>
          )}
        </div>
      )}

      {results && results.electrodomesticos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Electrodomésticos Encontrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.electrodomesticos.map((item) => (
              <ProductCard
                key={`electro-${item.id}`}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url,
                  altText: item.altText || item.name,
                  price: item.price,
                  originalPrice: item.original_price,
                  link: `/electrodomesticos/${item.slug}`,
                }}
                // Pasamos el tipo correcto para que el wishlist funcione
                productType="electrodomestico"
              />
            ))}
          </div>
        </section>
      )}

      {results && results.repuestos.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Repuestos Encontrados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.repuestos.map((item) => (
              <ProductCard
                key={`repuesto-${item.id}`}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url,
                  altText: item.altText || item.name,
                  price: item.price,
                  originalPrice: item.original_price,
                  link: `/repuestos/${item.slug}`,
                  tag: item.is_original ? "Original" : (item.is_original === false ? "Alternativo" : undefined),
                }}
                // Pasamos el tipo correcto para que el wishlist funcione
                productType="repuesto"
              />
            ))}
          </div>
        </section>
      )}

      {query && (
        <div className="mt-12 text-center">
          <Link href="/" className="text-[#002A7F] hover:underline font-medium">
            ← Volver al Inicio
          </Link>
        </div>
      )}
    </div>
  );
}