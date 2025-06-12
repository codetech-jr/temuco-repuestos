'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { ProductFromAPI, ProductForCard } from '@/types/product';

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState<ProductFromAPI[]>([]);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query && query.trim() !== '') {
      setIsLoading(true);
      setError(null);
      setSuggestion(null);
      setResults([]);
      
      const fetchResults = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
          setError("Error de configuración: La URL de la API no está definida.");
          setIsLoading(false);
          return;
        }

        const fullUrl = `${apiUrl}/search?q=${encodeURIComponent(query)}`;

        try {
          const response = await fetch(fullUrl);
          if (!response.ok) {
            let errorMsg = `Error del servidor: Status ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;
            } catch (e) {}
            throw new Error(errorMsg);
          }
          
          const data = await response.json();

          const electrodomesticos = (data.electrodomesticos || []).map((item: any): ProductFromAPI => ({ ...item, type: 'electrodomestico' }));
          const repuestos = (data.repuestos || []).map((item: any): ProductFromAPI => ({ ...item, type: 'repuesto' }));
          
          const combinedResults: ProductFromAPI[] = [...electrodomesticos, ...repuestos];
          
          setResults(combinedResults);

          if (combinedResults.length === 0 && data.suggestion) {
            setSuggestion(data.suggestion);
          }

        } catch (err: any) {
          setError(err.message || 'Ocurrió un error al buscar los productos.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  const PageContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[calc(100vh-15rem)] bg-[#F7FAFC]">
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center text-center p-10 h-full">
          <LoadingSpinner size={40} />
          <p className="mt-4 text-lg text-[#718096]">{`Buscando productos para "${query}"...`}</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="text-center p-10">
            <p className="text-xl font-semibold text-[#C8102E] mb-2">¡Ups! Algo salió mal.</p>
            <p className="text-[#C8102E]">{error}</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!query || query.trim() === '') {
    return (
      <PageContainer>
        <div className="text-center p-10">
            <p className="text-lg text-[#718096]">Por favor, introduce un término de búsqueda.</p>
        </div>
      </PageContainer>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <PageContainer>
        <div className="text-center p-10">
          <p className="text-xl text-[#2D3748] mb-4">{`No se encontraron resultados para "${query}"`}.</p>
          {suggestion && (
            <p className="text-md text-[#718096]">
              Quizás quisiste decir:{" "}
              <Link 
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="font-semibold text-[#002A7F] hover:text-[#002266] hover:underline"
              >
                {suggestion}
              </Link>
            </p>
          )}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h2 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6 md:mb-8">
        {`Resultados para "${query}" (${results.length})`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {results.map((product) => {
          const cardProduct: ProductForCard = {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.original_price,
            imageUrl: product.image_url || '/images/placeholder/product-placeholder.png',
            tag: product.tag,
            altText: product.name,
            link: `/${product.type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${product.slug}`,
            rating: product.rating,
            reviewCount: product.reviewCount,
          };

          return (
            <div key={`${product.type}-${product.id}`}>
              <ProductCard           
                product={cardProduct} 
                productType={product.type} 
              />
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}