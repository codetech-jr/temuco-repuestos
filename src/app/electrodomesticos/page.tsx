// src/app/electrodomesticos/page.tsx

import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Metadata } from 'next';
import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

export interface Electrodomestico {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  brand: string;
  rating?: number;
  review_count?: number;
  stock?: number;
  is_active?: boolean;
  altText?: string;
  tag?: string;
}

const ITEMS_PER_PAGE = 8;

export const metadata: Metadata = {
  title: 'Catálogo de Electrodomésticos - Temuco Repuestos',
  description: 'Encuentra los mejores electrodomésticos para tu hogar',
};

interface ElectrodomesticosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

async function fetchPaginatedElectrodomesticos(
  searchParams: ElectrodomesticosPageProps['searchParams']
) {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  params.append('limit', ITEMS_PER_PAGE.toString());
  const url = `${API_BASE_URL}/electrodomesticos?${params.toString()}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
}

async function fetchFilterOptions(endpoint: 'categories' | 'brands'): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/electrodomesticos/config/${endpoint}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error('Failed to fetch');
    return await res.json();
  } catch (error) {
    console.error(`Fetch ${endpoint} error:`, error);
    return [];
  }
}

export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  const [
    { data: electrodomesticos = [], totalPages = 0, currentPage = 1, totalItems = 0 },
    categories,
    brands
  ] = await Promise.all([
    fetchPaginatedElectrodomesticos(searchParams),
    fetchFilterOptions('categories'),
    fetchFilterOptions('brands')
  ]);

  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
            Catálogo de Electrodomésticos
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
            Descubre nuestra selección de electrodomésticos
          </p>
        </header>

        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar electrodomésticos..." />
          <CategoryFilter categories={categories} />
          <BrandFilter brands={brands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {electrodomesticos.length} de {totalItems} electrodomésticos
          </p>
        )}

        {electrodomesticos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {electrodomesticos.map((product) => {
              // --- ESPÍA 1: VERIFICANDO EN EL ORIGEN ---
              console.log(`[electrodomesticos/page.tsx] Preparando ProductCard para: ${product.name}`, { type: "electrodomestico" });

              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    imageUrl: product.image_url,
                    altText: product.altText || product.name,
                    rating: product.rating || 0,
                    reviewCount: product.review_count || 0,
                    price: product.price,
                    originalPrice: product.original_price,
                    tag: product.tag,
                    link: `/electrodomesticos/${product.slug}`,
                  }}
                  productType="electrodomestico"
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-[#718096]">
              No se encontraron electrodomésticos
            </p>
            <Link 
              href="/electrodomesticos" 
              className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline"
            >
              Limpiar búsqueda
            </Link>
          </div>
        )}
        
        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}