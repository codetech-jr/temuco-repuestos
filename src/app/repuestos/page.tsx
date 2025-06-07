// src/app/repuestos/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';

export interface Repuesto {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  brand: string;
  is_original?: boolean;
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  stock?: number;
  is_active?: boolean;
  created_at?: string;
  altText?: string;
  tag?: string;
}

const ITEMS_PER_PAGE = 8;

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos - Temuco Repuestos',
  description: 'Encuentra todos los repuestos para tus electrodomésticos: compresores, termostatos, filtros y más.',
};

interface RepuestosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

async function fetchPaginatedAndFilteredRepuestos(
  searchParams: RepuestosPageProps['searchParams']
): Promise<{ repuestos: Repuesto[], totalPages: number, currentPage: number, totalItems: number }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  
  const query = new URLSearchParams();
  if (searchParams.q) query.append('q', searchParams.q);
  if (searchParams.category) query.append('category', searchParams.category);
  if (searchParams.brand) query.append('brand', searchParams.brand);
  if (searchParams.sort) query.append('sort', searchParams.sort);
  if (searchParams.page) query.append('page', searchParams.page);
  query.append('limit', ITEMS_PER_PAGE.toString());

  const fetchUrl = `${API_BASE_URL}/repuestos?${query.toString()}`;
  console.log("FRONTEND (lista repuestos): Intentando fetch a:", fetchUrl);

  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error("FRONTEND (lista repuestos): Error al cargar repuestos:", res.status, res.statusText, "URL:", fetchUrl);
      return { repuestos: [], totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const responseData = await res.json();
    return {
      repuestos: responseData.data || [],
      totalItems: responseData.totalItems || 0,
      totalPages: responseData.totalPages || 0,
      currentPage: responseData.currentPage || 1,
    };
  } catch (error) {
    console.error("FRONTEND (lista repuestos): Excepción al cargar repuestos:", error, "URL:", fetchUrl);
    return { repuestos: [], totalPages: 0, currentPage: 1, totalItems: 0 };
  }
}

async function fetchRepuestoCategories(): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/repuestos/config/categories`;
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Excepción fetching repuesto categories:", error, "URL:", fetchUrl);
    return [];
  }
}

async function fetchRepuestoBrands(): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/repuestos/config/brands`;
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Excepción fetching repuesto brands:", error, "URL:", fetchUrl);
    return [];
  }
}

function RepuestoListSkeleton({ count = ITEMS_PER_PAGE }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`skel-${index}`} />
      ))}
    </div>
  );
}

async function RepuestoList({ searchParams }: RepuestosPageProps) {
  const { repuestos, totalPages, currentPage, totalItems } = await fetchPaginatedAndFilteredRepuestos(searchParams);

  return (
    <>
      {totalItems > 0 && (
        <p className="mb-6 text-sm text-[#718096]">
          Mostrando {repuestos.length} de {totalItems} repuestos.
          (Página {currentPage} de {totalPages})
        </p>
      )}
      {repuestos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {repuestos.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                id: item.id,
                name: item.name,
                imageUrl: item.image_url,
                altText: item.altText || item.name,
                price: item.price,
                originalPrice: item.original_price,
                link: `/repuestos/${item.slug}`,
                tag: item.is_original !== undefined ? (item.is_original ? "Original" : "Alternativo") : undefined,
              }}
              productType="repuesto"
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-[#718096]">No se encontraron repuestos.</p>
          <Link href="/repuestos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline">
            Limpiar filtros
          </Link>
        </div>
      )}
      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </>
  );
}

export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const [allCategories, allBrands] = await Promise.all([
    fetchRepuestoCategories(),
    fetchRepuestoBrands()
  ]);

  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
            Catálogo de Repuestos
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
            Encuentra el repuesto exacto que necesitas para tus electrodomésticos.
          </p>
        </header>

        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar repuestos..." />
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>
        
        <Suspense fallback={<RepuestoListSkeleton />}>
          {/* @ts-expect-error Server Component */}
          <RepuestoList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}