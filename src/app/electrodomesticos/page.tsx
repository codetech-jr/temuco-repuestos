// src/app/electrodomesticos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard'; // Asegúrate que ProductCard espera los props correctos
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

// Interfaz que coincide con los datos de la API (y lo que ProductCard necesita)
// Ajusta 'altText' y 'tag' según tu ProductCard y si vienen de la API
export interface Electrodomestico {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url: string;        // Campo de la API
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
  // Campos adicionales que ProductCard podría esperar (si no vienen de la API, necesitarás gestionarlos)
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

async function fetchAllElectrodomesticosFromAPI(): Promise<Electrodomestico[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/electrodomesticos`, {
      cache: 'no-store', // Para desarrollo. Considera estrategias de caché para producción.
    });
    if (!res.ok) {
      console.error("Error al cargar TODOS los electrodomésticos desde la API:", res.status, res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Excepción al cargar TODOS los electrodomésticos:", error);
    return [];
  }
}


async function getProcessedElectrodomesticos(
  allElectrodomesticos: Electrodomestico[],
  searchParams: ElectrodomesticosPageProps['searchParams']
): Promise<{ electrodomesticos: Electrodomestico[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...allElectrodomesticos];

  // Aplicar filtros (q, category, brand)
  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase();
    itemsToFilter = itemsToFilter.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      (item.short_description && item.short_description.toLowerCase().includes(searchTerm)) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm))
    );
  }
  if (searchParams.category) {
    itemsToFilter = itemsToFilter.filter(item =>
      item.category && item.category.toLowerCase() === searchParams.category?.toLowerCase()
    );
  }
  if (searchParams.brand) {
    itemsToFilter = itemsToFilter.filter(item =>
      item.brand && item.brand.toLowerCase() === searchParams.brand?.toLowerCase()
    );
  }

  // Aplicar ordenación
  if (searchParams.sort) {
    const [sortBy, sortOrder] = searchParams.sort.split('_') as [keyof Electrodomestico, 'asc' | 'desc'];
    itemsToFilter.sort((a, b) => {
      let valA = a[sortBy] as any;
      let valB = b[sortBy] as any;
      if (sortBy === 'price') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Paginación
  const totalItems = itemsToFilter.length;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentPage = Math.max(1, Math.min(page, Math.ceil(totalItems / ITEMS_PER_PAGE) || 1));
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedElectrodomesticos = itemsToFilter.slice(startIndex, endIndex);

  return { electrodomesticos: paginatedElectrodomesticos, totalPages, currentPage, totalItems };
}

// Funciones para obtener categorías y marcas únicas de la lista completa
const getUniqueValues = (items: Electrodomestico[], key: keyof Electrodomestico): string[] => {
    return Array.from(new Set(items.map(item => item[key]).filter(Boolean) as string[])).sort();
};


export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  // 1. Obtener TODOS los electrodomésticos de la API una vez
  const allApiElectrodomesticos = await fetchAllElectrodomesticosFromAPI();

  // 2. Procesar (filtrar, ordenar, paginar) los datos obtenidos
  const { electrodomesticos, totalPages, currentPage, totalItems } = await getProcessedElectrodomesticos(allApiElectrodomesticos, searchParams);

  // 3. Obtener categorías y marcas únicas de la lista completa de la API
  const allCategories = getUniqueValues(allApiElectrodomesticos, 'category');
  const allBrands = getUniqueValues(allApiElectrodomesticos, 'brand');

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

        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar electrodomésticos..." />
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {electrodomesticos.length} de {totalItems} electrodomésticos.
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
                  imageUrl: item.image_url, // Usar image_url de la API
                  altText: item.altText || item.name, // altText puede ser el nombre si no viene de la API
                  rating: item.rating || 0,
                  reviewCount: item.review_count || 0, // Usar review_count
                  price: item.price,
                  originalPrice: item.original_price, // Usar original_price
                  tag: item.tag, // Si 'tag' no viene de la API, ProductCard debe manejarlo o quitarlo
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

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          // itemsPerPage={ITEMS_PER_PAGE} // Ya no es necesario pasar esto si se maneja en getProcessedElectrodomesticos
        />
      </div>
    </div>
  );
}