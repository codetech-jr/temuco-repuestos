// src/app/repuestos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard'; // O un RepuestoCard específico
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

// 1. DEFINE O IMPORTA TU INTERFAZ Repuesto
interface Repuesto {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string; // Asumimos que los repuestos tienen categorías
  brand: string;    // Asumimos que los repuestos tienen marcas
  is_original?: boolean;
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  stock?: number;
  is_active?: boolean;
  created_at?: string;
  altText?: string; // Opcional, para ProductCard
  tag?: string;     // Opcional, para ProductCard
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

// FUNCIÓN PARA OBTENER TODOS LOS REPUESTOS DE LA API
async function fetchAllRepuestosFromAPI(): Promise<Repuesto[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos`, { cache: 'no-store' });
    if (!res.ok) {
      console.error("Error al cargar TODOS los repuestos desde la API:", res.status, res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error("Excepción al cargar TODOS los repuestos:", error);
    return [];
  }
}

// FUNCIÓN PARA PROCESAR (FILTRAR, ORDENAR, PAGINAR)
async function getProcessedRepuestos(
  allRepuestos: Repuesto[],
  searchParams: RepuestosPageProps['searchParams']
): Promise<{ repuestos: Repuesto[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...allRepuestos];

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

  if (searchParams.sort) {
    const [sortBy, sortOrder] = searchParams.sort.split('_') as [keyof Repuesto, 'asc' | 'desc'];
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

  const totalItems = itemsToFilter.length;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentPage = Math.max(1, Math.min(page, Math.ceil(totalItems / ITEMS_PER_PAGE) || 1));
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRepuestos = itemsToFilter.slice(startIndex, endIndex);

  return { repuestos: paginatedRepuestos, totalPages, currentPage, totalItems };
}

// FUNCIÓN GENÉRICA PARA OBTENER VALORES ÚNICOS PARA FILTROS
const getUniqueValues = (items: Repuesto[], key: keyof Repuesto): string[] => {
    // Asegurarse de que item[key] es un string antes de llamar a filter(Boolean) si es opcional
    return Array.from(new Set(items.map(item => item[key] as string).filter(Boolean))).sort();
};


export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const allApiRepuestos = await fetchAllRepuestosFromAPI();
  const { repuestos, totalPages, currentPage, totalItems } = await getProcessedRepuestos(allApiRepuestos, searchParams);

  // Obtener categorías y marcas únicas de los repuestos cargados
  const allCategories = getUniqueValues(allApiRepuestos, 'category');
  const allBrands = getUniqueValues(allApiRepuestos, 'brand');

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

        {/* Filtros Activados */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar repuestos..." />
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {repuestos.length} de {totalItems} repuestos.
          </p>
        )}

        {repuestos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {repuestos.map((item) => (
              <ProductCard // O RepuestoCard si lo creas
                key={item.id}
                product={{
                  id: item.id,
                  name: item.name,
                  imageUrl: item.image_url, // Asegúrate que ProductCard use 'imageUrl' o mapea
                  altText: item.altText || item.name, // altText puede ser el nombre si no viene de la API
                  price: item.price,
                  originalPrice: item.original_price,
                  link: `/repuestos/${item.slug}`,
                  // Campos como rating, reviewCount, tag pueden ser opcionales en ProductCard
                  // o específicos de un RepuestoCard
                  // rating: item.rating || 0, (si los repuestos tienen rating)
                  // reviewCount: item.review_count || 0, (si los repuestos tienen review_count)
                  // tag: item.tag, (si los repuestos tienen tag)
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

        {/* Paginación Activada */}
        {totalPages > 1 && ( // Solo mostrar paginación si hay más de una página
            <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            />
        )}
      </div>
    </div>
  );
}