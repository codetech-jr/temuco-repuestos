// src/app/electrodomesticos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton';
import AnimatedGrid from '@/components/utils/AnimatedGrid';
import FadeIn from '@/components/utils/FadeIn';

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
  // Campos que podrían no venir en la lista pero sí en el detalle
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  created_at?: string;
}

const ITEMS_PER_PAGE = 8;

interface ElectrodomesticosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

export async function generateMetadata(
  { searchParams }: ElectrodomesticosPageProps
): Promise<Metadata> {
  const siteName = "Temuco Repuestos";
  let title = `Catálogo de Electrodomésticos - ${siteName}`;
  let description = `Encuentra los mejores electrodomésticos: refrigeradores, lavadoras, cocinas y más en ${siteName}.`;
  const keywords: string[] = ['electrodomésticos', 'Temuco', 'repuestos', 'hogar', 'tecnología'];

  const filtersApplied: string[] = [];
  if (searchParams?.category) filtersApplied.push(searchParams.category);
  if (searchParams?.brand) filtersApplied.push(`marca ${searchParams.brand}`);
  if (searchParams?.q) filtersApplied.push(`"${searchParams.q}"`);

  if (filtersApplied.length > 0) {
    const filterText = filtersApplied.join(', ');
    title = `Electrodomésticos: ${filterText} - ${siteName}`;
    description = `Resultados para electrodomésticos ${filterText} en ${siteName}. Descubre calidad y variedad.`;
    if(searchParams?.category) keywords.push(searchParams.category);
    if(searchParams?.brand) keywords.push(searchParams.brand);
    if(searchParams?.q) keywords.push(searchParams.q);
  }

  return {
    title,
    description,
    keywords: Array.from(new Set(keywords)).join(', '),
  };
}

async function fetchPaginatedAndFilteredElectrodomesticos(
  searchParams: ElectrodomesticosPageProps['searchParams']
): Promise<{ data: Electrodomestico[], totalItems: number, totalPages: number, currentPage: number }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const params = new URLSearchParams();
  
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.append(key, value as string);
  });
  params.append('limit', ITEMS_PER_PAGE.toString());
  
  const url = `${API_BASE_URL}/electrodomesticos?${params.toString()}`;
  console.log("FRONTEND (lista electro): Fetching:", url);

  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
        console.error("Fetch error en fetchPaginatedAndFilteredElectrodomesticos:", res.status, res.statusText);
        return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
    }
    return await res.json();
  } catch (error) {
    console.error("Excepción en fetchPaginatedAndFilteredElectrodomesticos:", error);
    return { data: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }
}

async function fetchFilterOptions(endpoint: 'categories' | 'brands'): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const url = `${API_BASE_URL}/electrodomesticos/config/${endpoint}`;
  console.log("FRONTEND (filtros): Fetching:", url);
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // Considerar caché más larga para estos
    if (!res.ok) {
        console.error(`Fetch ${endpoint} error:`, res.status, res.statusText);
        return [];
    }
    return await res.json();
  } catch (error) {
    console.error(`Excepción fetching ${endpoint}:`, error);
    return [];
  }
}

async function ElectrodomesticosListContent({ searchParams }: ElectrodomesticosPageProps) {
  const { data: electrodomesticos = [], totalPages = 0, currentPage = 1, totalItems = 0 } = await fetchPaginatedAndFilteredElectrodomesticos(searchParams);

  if (totalItems === 0 && (searchParams.q || searchParams.category || searchParams.brand)) {
    return (
      <FadeIn delay={0.3}>
        <div className="text-center py-12">
          <p className="text-xl text-[#718096]">
            No se encontraron electrodomésticos que coincidan con tu búsqueda o filtros.
          </p>
          <Link 
            href="/electrodomesticos" 
            className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline"
          >
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
            Actualmente no hay electrodomésticos para mostrar.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <>
      <FadeIn delay={0.3}>
        <p className="mb-6 text-sm text-[#718096]">
          Mostrando {electrodomesticos.length} de {totalItems} electrodomésticos. (Página {currentPage} de {totalPages})
        </p>
      </FadeIn>
      <AnimatedGrid>
        {electrodomesticos.map((product) => (
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
              tag: product.tag as 'Oferta' | 'Nuevo' | 'Más Vendido' | undefined,
              link: `/electrodomesticos/${product.slug}`,
            }}
            productType="electrodomestico"
          />
        ))}
      </AnimatedGrid>
      {totalPages > 1 && (
        <FadeIn delay={0.4}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </FadeIn>
      )}
    </>
  );
}

function ElectrodomesticosListSkeleton() {
  return (
    <>
      <div className="mb-6 h-4 bg-gray-300 rounded w-1/3 animate-pulse"></div>
      <AnimatedGrid>
        {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </AnimatedGrid>
      <div className="mt-8 h-10 bg-gray-300 rounded w-1/4 mx-auto animate-pulse"></div>
    </>
  );
}


export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  const [categories, brands] = await Promise.all([
    fetchFilterOptions('categories'),
    fetchFilterOptions('brands')
  ]);

  let pageTitle = "Catálogo de Electrodomésticos";
  if (searchParams?.category && searchParams?.brand) {
    pageTitle = `Electrodomésticos: ${searchParams.brand} en ${searchParams.category}`;
  } else if (searchParams?.category) {
    pageTitle = `Electrodomésticos: ${searchParams.category}`;
  } else if (searchParams?.brand) {
    pageTitle = `Electrodomésticos: Marca ${searchParams.brand}`;
  } else if (searchParams?.q) {
    pageTitle = `Búsqueda: "${searchParams.q}"`;
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
              Descubre nuestra selección de electrodomésticos para equipar tu hogar.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
            <SearchBar placeholder="Buscar electrodomésticos..." />
            <CategoryFilter categories={categories} />
            <BrandFilter brands={brands} />
            <SortDropdown />
          </div>
        </FadeIn>
        
        <Suspense fallback={<ElectrodomesticosListSkeleton />}>
          <ElectrodomesticosListContent searchParams={searchParams} />
        </Suspense>
        
      </div>
    </div>
  );
}