// src/app/repuestos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard'; // O RepuestoCard si lo tienes
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

// 1. Interfaz Repuesto (asegúrate que coincida con tu API)
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

const ITEMS_PER_PAGE = 8; // O el valor que prefieras

export const metadata: Metadata = {
  title: 'Catálogo de Repuestos - Temuco Repuestos',
  description: 'Encuentra todos los repuestos para tus electrodomésticos.',
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

// 2. Función de fetch que pasa los searchParams a la API de REPUESTOS
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

  const fetchUrl = `${API_BASE_URL}/repuestos?${query.toString()}`; // CAMBIO: endpoint /repuestos
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

// 3. Funciones para obtener categorías y marcas únicas de REPUESTOS
async function fetchAllItemsForRepuestoFilterValues(): Promise<Repuesto[]> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const fetchUrl = `${API_BASE_URL}/repuestos?limit=1000`; // CAMBIO: endpoint /repuestos
     try {
        const res = await fetch(fetchUrl, { cache: 'no-store' });
        if(!res.ok) {
            console.error("Error fetching all repuestos for filter values:", res.statusText);
            return [];
        }
        const responseData = await res.json();
        return responseData.data || [];
    } catch (error) {
        console.error(`Error fetching all repuestos for filter values:`, error);
        return [];
    }
}

const getUniqueValues = (items: Repuesto[], key: keyof Repuesto): string[] => {
    return Array.from(new Set(items.map(item => item[key] as string).filter(Boolean))).sort();
};

// 4. Componente de Página Principal para Repuestos
export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const { repuestos, totalPages, currentPage, totalItems } = await fetchPaginatedAndFilteredRepuestos(searchParams);

  const allApiRepuestosForFilters = await fetchAllItemsForRepuestoFilterValues();
  const allCategories = getUniqueValues(allApiRepuestosForFilters, 'category');
  const allBrands = getUniqueValues(allApiRepuestosForFilters, 'brand');

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
          <SearchBar placeholder="Buscar repuestos..." /> {/* Placeholder actualizado */}
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown /> {/* Asegúrate que las opciones de SortDropdown sean relevantes para repuestos */}
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {repuestos.length} de {totalItems} repuestos.
            (Página {currentPage} de {totalPages})
          </p>
        )}

        {repuestos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {repuestos.map((item) => (
              <ProductCard // O RepuestoCard
                key={item.id}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url,
                  altText: item.altText || item.name,
                  price: item.price,
                  originalPrice: item.original_price,
                  link: `/repuestos/${item.slug}`, // Enlace correcto a detalle de repuesto
                  // Quita o adapta props que no apliquen a repuestos (ej. rating, review_count si no los tienes)
                  // rating: item.rating || 0,
                  // reviewCount: item.review_count || 0,
                  // tag: item.tag,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-[#718096]">
              No se encontraron repuestos que coincidan con tu búsqueda o filtros.
            </p>
            <Link href="/repuestos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
              Limpiar búsqueda y filtros
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