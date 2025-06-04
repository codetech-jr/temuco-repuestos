// src/app/electrodomesticos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

// 1. Interfaz Electrodomestico (debe coincidir con tu API)
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
  title: 'Catálogo de Electrodomésticos - Temuco Repuestos',
  description: 'Encuentra los mejores electrodomésticos para tu hogar: refrigeradores, lavadoras, cocinas y más.',
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

// 2. Función de fetch que pasa los searchParams a la API (SIN CAMBIOS RESPECTO A LA ÚLTIMA VERSIÓN)
async function fetchPaginatedAndFilteredElectrodomesticos(
  searchParams: ElectrodomesticosPageProps['searchParams']
): Promise<{ electrodomesticos: Electrodomestico[], totalPages: number, currentPage: number, totalItems: number }> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  
  const query = new URLSearchParams();
  if (searchParams.q) query.append('q', searchParams.q);
  if (searchParams.category) query.append('category', searchParams.category);
  if (searchParams.brand) query.append('brand', searchParams.brand);
  if (searchParams.sort) query.append('sort', searchParams.sort);
  if (searchParams.page) query.append('page', searchParams.page);
  query.append('limit', ITEMS_PER_PAGE.toString());

  const fetchUrl = `${API_BASE_URL}/electrodomesticos?${query.toString()}`;
  console.log("FRONTEND (lista electro): Intentando fetch a:", fetchUrl);

  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error("FRONTEND (lista electro): Error al cargar electrodomésticos:", res.status, res.statusText, "URL:", fetchUrl);
      return { electrodomesticos: [], totalPages: 0, currentPage: 1, totalItems: 0 };
    }
    const responseData = await res.json();
    return {
      electrodomesticos: responseData.data || [],
      totalItems: responseData.totalItems || 0,
      totalPages: responseData.totalPages || 0,
      currentPage: responseData.currentPage || 1,
    };
  } catch (error) {
    console.error("FRONTEND (lista electro): Excepción al cargar electrodomésticos:", error, "URL:", fetchUrl);
    return { electrodomesticos: [], totalPages: 0, currentPage: 1, totalItems: 0 };
  }
}

// 3. NUEVAS FUNCIONES para obtener valores de filtro desde endpoints dedicados
async function fetchElectrodomesticoCategories(): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  // CAMBIO: Usar la nueva ruta del backend
  const fetchUrl = `${API_BASE_URL}/electrodomesticos/config/categories`; 
  console.log("FRONTEND (filtros): Intentando fetch a categorías:", fetchUrl);
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' }); // Considera 'force-cache' o revalidación para estos datos
    if (!res.ok) {
      console.error("Error fetching electrodomestico categories:", res.statusText, "URL:", fetchUrl);
      return [];
    }
    return await res.json(); // API devuelve directamente el array de strings
  } catch (error) {
    console.error("Excepción fetching electrodomestico categories:", error, "URL:", fetchUrl);
    return [];
  }
}

async function fetchElectrodomesticoBrands(): Promise<string[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  // CAMBIO: Usar la nueva ruta del backend
  const fetchUrl = `${API_BASE_URL}/electrodomesticos/config/brands`; 
  console.log("FRONTEND (filtros): Intentando fetch a marcas:", fetchUrl);
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Error fetching electrodomestico brands:", res.statusText, "URL:", fetchUrl);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Excepción fetching electrodomestico brands:", error, "URL:", fetchUrl);
    return [];
  }
}

// 4. Componente de Página Principal
export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  // Llama a la función de fetch que pasa los searchParams a la API
  const { electrodomesticos, totalPages, currentPage, totalItems } = await fetchPaginatedAndFilteredElectrodomesticos(searchParams);

  // Obtiene valores para los filtros llamando a los nuevos endpoints en paralelo
  const [allCategories, allBrands] = await Promise.all([
    fetchElectrodomesticoCategories(),
    fetchElectrodomesticoBrands()
  ]);

  return (
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
            Catálogo de Electrodomésticos
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
            Descubre nuestra selección de electrodomésticos para equipar tu hogar con la mejor tecnología y calidad.
          </p>
        </header>

        {/* La sección de filtros ahora usa los datos de los nuevos fetches */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar electrodomésticos..." />
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {electrodomesticos.length} de {totalItems} electrodomésticos.
            (Página {currentPage} de {totalPages})
          </p>
        )}

        {electrodomesticos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {electrodomesticos.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url,
                  altText: item.altText || item.name,
                  rating: item.rating || 0,
                  reviewCount: item.review_count || 0,
                  price: item.price,
                  originalPrice: item.original_price,
                  tag: item.tag,
                  link: `/electrodomesticos/${item.slug}`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-[#718096]">
              No se encontraron electrodomésticos que coincidan con tu búsqueda o filtros.
            </p>
            <Link href="/electrodomesticos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
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