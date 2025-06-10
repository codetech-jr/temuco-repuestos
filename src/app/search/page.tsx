// src/app/search/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedGrid from '@/components/utils/AnimatedGrid';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';

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

interface SearchResults {
  electrodomesticos: Electrodomestico[];
  repuestos: Repuesto[];
  searchTerm: string;
  suggestion: string | null;
}

const SITE_NAME = "Temuco Repuestos";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pageTitleBase = `Buscar - ${SITE_NAME}`;
    let currentTitle = pageTitleBase;

    if (query && query.trim() !== '') {
      currentTitle = `Resultados para "${query}" - ${SITE_NAME}`;
      document.title = currentTitle; // Actualiza título al iniciar búsqueda

      const fetchResults = async () => {
        setLoading(true);
        setResults(null);

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const fetchUrl = `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`;
        console.log("SEARCH PAGE: Fetching from:", fetchUrl);

        try {
          const response = await fetch(fetchUrl, { cache: 'no-store' });
          
          if (!response.ok) {
            console.error(`Error al buscar (${query}): ${response.status} ${response.statusText}`);
            notFound(); 
            return; 
          }
          
          const data: SearchResults = await response.json();
          console.log("SEARCH PAGE: Results received:", data);
          setResults(data);

          // Actualizar título si la API devuelve un searchTerm diferente (ej. corregido)
          if (data.searchTerm && data.searchTerm !== query) {
            document.title = `Resultados para "${data.searchTerm}" - ${SITE_NAME}`;
          } else {
            // Asegurar que el título refleje el query original si no hay searchTerm de la API
            document.title = `Resultados para "${query}" - ${SITE_NAME}`;
          }

        } catch (err: any) {
          console.error(`Excepción al realizar la búsqueda (${query}):`, err);
          notFound(); 
          return;
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    } else {
      setLoading(false);
      setResults({ electrodomesticos: [], repuestos: [], searchTerm: '', suggestion: null });
      document.title = pageTitleBase; // Título por defecto si no hay query
    }
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <FadeIn>
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-8 animate-pulse"></div>
        </FadeIn>
        <AnimatedGrid>
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </AnimatedGrid>
      </div>
    );
  }

  if (!results && !loading) {
      return (
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
              Inicia una búsqueda para ver resultados.
          </div>
      );
  }
  
  const noResultsFound = results && results.electrodomesticos.length === 0 && results.repuestos.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <FadeIn>
        {query && query.trim() !== '' ? (
          <h1 className="text-3xl font-bold mb-8">
            Resultados de Búsqueda para: <span className="text-[#002A7F]">{results?.searchTerm || query}</span>
          </h1>
        ) : (
          <h1 className="text-3xl font-bold mb-8">Página de Búsqueda</h1>
        )}
      </FadeIn>
      
      {(!query || query.trim() === '') && results && (results.electrodomesticos.length === 0 && results.repuestos.length === 0) && (
        <FadeIn delay={0.1}>
            <p className="text-lg text-gray-600">Usa la barra de búsqueda en la parte superior para encontrar productos o repuestos.</p>
        </FadeIn>
      )}

      {query && query.trim() !== '' && noResultsFound && results && ( 
        <FadeIn delay={0.1}>
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500 mb-4">No se encontraron resultados para tu búsqueda "{results.searchTerm || query}".</p>
            {results.suggestion && (
              <p className="text-lg text-gray-700">
                Quizás quisiste decir:{" "}
                <Link href={`/search?q=${encodeURIComponent(results.suggestion)}`} className="font-semibold text-[#002A7F] hover:underline">
                  {results.suggestion}
                </Link> ?
              </p>
            )}
          </div>
        </FadeIn>
      )}

      {results && results.electrodomesticos.length > 0 && (
        <FadeIn delay={0.1}>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Electrodomésticos Encontrados</h2>
            <AnimatedGrid>
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
                  productType="electrodomestico"
                />
              ))}
            </AnimatedGrid>
          </section>
        </FadeIn>
      )}

      {results && results.repuestos.length > 0 && (
        <FadeIn delay={0.2}>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Repuestos Encontrados</h2>
            <AnimatedGrid>
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
                  productType="repuesto"
                />
              ))}
            </AnimatedGrid>
          </section>
        </FadeIn>
      )}

      {query && query.trim() !== '' && (
        <FadeIn delay={0.3}>
          <div className="mt-12 text-center">
            <Link href="/" className="text-[#002A7F] hover:underline font-medium">
              ← Volver al Inicio
            </Link>
          </div>
        </FadeIn>
      )}
    </div>
  );
}