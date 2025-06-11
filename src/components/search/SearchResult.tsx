// En: src/components/search/SearchResults.tsx

"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard'; // Asegúrate de que la ruta a tu ProductCard sea correcta

// Define una interfaz para el producto, ajústala si es necesario
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
  type: 'electrodomestico' | 'repuesto'; // Añade el tipo para diferenciar
  // Añade otras propiedades que necesites para el ProductCard
  tag?: 'Oferta' | 'Nuevo' | 'Más Vendido' | 'Original' | 'Alternativo';
  altText: string;
  link: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      setError(null);
      
      const fetchResults = async () => {
        try {
          // Asume que tienes una variable de entorno para la URL de tu API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?q=${encodeURIComponent(query)}`);
          if (!response.ok) {
            throw new Error('No se pudo obtener los resultados de búsqueda.');
          }
          const data = await response.json();
          setResults(data);
        } catch (err: any) {
          setError(err.message || 'Ocurrió un error al buscar.');
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

  if (isLoading) {
    return <div className="text-center p-10">Buscando...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }
  
  if (!query) {
    return <div className="text-center p-10">Por favor, introduce un término de búsqueda.</div>
  }

  if (results.length === 0) {
    return <div className="text-center p-10">{`No se encontraron resultados para "{query}"`}.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{`Resultados para "{query}"`}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {results.map((product) => (
          <div key={`${product.type}-${product.id}`}>
            <ProductCard
              product={{
                ...product,
                altText: product.name,
                link: `/${product.type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${product.slug}`
              }}
              productType={product.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
}