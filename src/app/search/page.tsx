// src/app/search/page.tsx
"use client"; // Necesario para useSearchParams

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard'; // Asumimos que quieres usar ProductCard

// Define tus interfaces (puedes importarlas si las tienes centralizadas)
export interface Electrodomestico {
  id: string; slug: string; name: string; price: number; image_url: string;
  category: string; brand: string; short_description?: string;
  // Campos que ProductCard podría esperar
  altText?: string; original_price?: number; rating?: number; review_count?: number; tag?: string;
}

export interface Repuesto {
  id: string; slug: string; name: string; price: number; image_url: string;
  category: string; brand: string; short_description?: string; is_original?: boolean;
  // Campos que ProductCard podría esperar
  altText?: string; original_price?: number; tag?: string;
}

interface SearchResults {
  electrodomesticos: Electrodomestico[];
  repuestos: Repuesto[];
  searchTerm: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        setError(null);
        setResults(null); // Limpiar resultados previos

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
      // Si no hay query, no hay nada que buscar.
      setLoading(false);
      setResults({ electrodomesticos: [], repuestos: [], searchTerm: '' });
    }
  }, [query]); // Se ejecuta cada vez que 'query' cambia

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
        <p className="text-lg text-gray-600">Por favor, usa la barra de búsqueda en el encabezado para encontrar productos o repuestos.</p>
      )}

      {query && noResultsFound && !loading && (
        <p className="text-lg text-gray-600">No se encontraron resultados para tu búsqueda.</p>
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
                  link: `/electrodomesticos/${item.slug}`, // Enlace a la página de detalle
                  // rating: item.rating,
                  // reviewCount: item.review_count,
                  // tag: item.tag,
                }}
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
              <ProductCard // O un RepuestoCard si lo tienes
                key={`repuesto-${item.id}`}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url,
                  altText: item.altText || item.name,
                  price: item.price,
                  originalPrice: item.original_price,
                  link: `/repuestos/${item.slug}`, // Enlace a la página de detalle
                  tag: item.is_original ? "Original" : (item.is_original === false ? "Alternativo" : undefined), // Ejemplo de tag para repuesto
                }}
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