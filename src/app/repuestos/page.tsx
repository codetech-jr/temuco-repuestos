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
import AnimatedGrid from '@/components/utils/AnimatedGrid';
import FadeIn from '@/components/utils/FadeIn';

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

interface RepuestosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
    is_original?: 'true' | 'false';
  };
}

export async function generateMetadata(
  { searchParams }: RepuestosPageProps
): Promise<Metadata> {
  const siteName = "Temuco Repuestos";
  let title = `Catálogo de Repuestos - ${siteName}`;
  let description = `Encuentra repuestos para electrodomésticos: compresores, termostatos, filtros y más en ${siteName}.`;
  const keywords: string[] = ['repuestos', 'Temuco', 'electrodomésticos', 'componentes'];

  const filtersApplied: string[] = [];
  if (searchParams?.category) filtersApplied.push(searchParams.category);
  if (searchParams?.brand) filtersApplied.push(`marca ${searchParams.brand}`);
  if (searchParams?.is_original) filtersApplied.push(searchParams.is_original === 'true' ? 'originales' : 'alternativos');
  if (searchParams?.q) filtersApplied.push(`"${searchParams.q}"`);

  if (filtersApplied.length > 0) {
    const filterText = filtersApplied.join(', ');
    title = `Repuestos: ${filterText} - ${siteName}`;
    description = `Resultados para repuestos ${filterText} en ${siteName}. Calidad y variedad.`;
    if(searchParams?.category) keywords.push(searchParams.category);
    if(searchParams?.brand) keywords.push(searchParams.brand);
    if(searchParams?.is_original) keywords.push(searchParams.is_original === 'true' ? 'repuestos originales' : 'repuestos alternativos');
    if(searchParams?.q) keywords.push(searchParams.q);
  }

  return {
    title,
    description,
    keywords: Array.from(new Set(keywords)).join(', '),
  };
}

async function fetchPaginatedAndFilteredRepuestos(
  searchParams: RepuestosPageProps['searchParams']
): Promise<{ data: Repuesto[], totalItems: number, totalPages: number, currentPage: number }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value as string);
  });
  params.append('limit', ITEMS_PER_PAGE.toString());
  
  const url = `${API_BASE_URL}/repuestos?${params.toString()}`;
  console.log("FRONTEND (lista repuestos): Fetching:", url);

  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
        console.error("Fetch error en fetchPaginatedAndFilteredRepuestos:", res.status, res.statusText);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    }
    return await res.json();
  } catch (error) {
    console.error("Excepción en fetchPaginatedAndFilteredRepuestos:", error);
    return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
}

async function fetchFilterOptions(entity: 'repuestos', endpoint: 'categories' | 'brands'): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const url = `${API_BASE_URL}/${entity}/config/${endpoint}`;
  console.log(`FRONTEND (filtros ${entity}): Fetching:`, url);
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
        console.error(`Fetch ${endpoint} for ${entity} error:`, res.status, res.statusText);
        return [];
    }
    return await res.json();
  } catch (error) {
    console.error(`Excepción fetching ${endpoint} for ${entity}:`, error);
    return [];
  }
}

async function RepuestoListContent({ searchParams }: RepuestosPageProps) {
  const { data: repuestos = [], totalPages = 0, currentPage = 1, totalItems = 0 } = await fetchPaginatedAndFilteredRepuestos(searchParams);

  if (totalItems === 0 && (searchParams.q || searchParams.category || searchParams.brand || searchParams.is_original)) {
    return (
      <FadeIn delay={0.3}>
        <div className="text-center py-12">
          <p className="text-xl text-[#718096]">
            No se encontraron repuestos que coincidan con tu búsqueda o filtros.
          </p>
          <Link href="/repuestos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline">
            Limpiar búsqueda y filtros
          </Link>
        </div>
      </FadeIn>
    );
  }

  if (totalItems === 0) {
     return (
      <FadeIn delay={0.3}>
        <div className="text-center py-12">
          <p className="text-xl text-[#718096]">
            Actualmente no hay repuestos para mostrar.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <>
      <FadeIn delay={0.3}>
        <p className="mb-6 text-sm text-[#718096]">
          Mostrando {repuestos.length} de {totalItems} repuestos. (Página {currentPage} de {totalPages})
        </p>
      </FadeIn>
      <AnimatedGrid>
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
      </AnimatedGrid>
      {totalPages > 1 && (
        <FadeIn delay={0.4}>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </FadeIn>
      )}
    </>
  );
}

function RepuestoListSkeleton({ count = ITEMS_PER_PAGE }: { count?: number }) {
  return (
    <>
      <div className="mb-6 h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
      <AnimatedGrid>
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={`skel-${index}`} />
        ))}
      </AnimatedGrid>
      <div className="mt-8 h-10 bg-gray-300 rounded w-1/4 mx-auto animate-pulse"></div>
    </>
  );
}

export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const [allCategories, allBrands] = await Promise.all([
    fetchFilterOptions('repuestos', 'categories'),
    fetchFilterOptions('repuestos', 'brands')
  ]);

  let pageTitle = "Catálogo de Repuestos";
  const filtersAppliedText: string[] = [];
  if (searchParams?.category) filtersAppliedText.push(searchParams.category);
  if (searchParams?.brand) filtersAppliedText.push(`marca ${searchParams.brand}`);
  if (searchParams?.is_original) filtersAppliedText.push(searchParams.is_original === 'true' ? 'originales' : 'alternativos');
  if (searchParams?.q) filtersAppliedText.push(`"${searchParams.q}"`);

  if (filtersAppliedText.length > 0) {
    pageTitle = `Repuestos: ${filtersAppliedText.join(', ')}`;
  }


  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <FadeIn>
          <header className="mb-8 md:mb-12 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
              {pageTitle}
            </h1>
            <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
              Encuentra el repuesto exacto que necesitas para tus electrodomésticos.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
            <SearchBar placeholder="Buscar repuestos..." />
            <CategoryFilter categories={allCategories} />
            <BrandFilter brands={allBrands} />
            <SortDropdown />
            {/* Aquí podrías añadir un filtro específico para is_original si lo deseas */}
          </div>
        </FadeIn>
        
        <Suspense fallback={<RepuestoListSkeleton />}>
          {/* @ts-expect-error Server Component */}
          <RepuestoListContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}