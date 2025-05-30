// src/app/repuestos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { repuestosData, Repuesto } from '@/app/data/repuestos'; // Sigue usando la misma fuente de datos
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';
// Podrías tener un componente específico para seleccionar el "tipo" de repuesto (todos, originales, alternativos)
// import TypeFilter from '@/components/catalog/TypeFilter';

const ITEMS_PER_PAGE = 8;

// La metadata podría ser más general o ajustarse dinámicamente si es necesario
export async function generateMetadata({ searchParams }: RepuestosPageProps): Promise<Metadata> {
  const isOriginalsView = searchParams.tipo === 'originales' || searchParams.original === 'true';
  const title = isOriginalsView
    ? 'Repuestos Originales - Temuco Repuestos'
    : 'Catálogo de Repuestos - Temuco Repuestos';
  const description = isOriginalsView
    ? 'Encuentra repuestos originales de las mejores marcas para tus electrodomésticos.'
    : 'Todos los repuestos para electrodomésticos y sistemas de refrigeración.';

  return { title, description };
}


interface RepuestosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
    tipo?: 'originales' | string; // Nuevo: para filtrar por tipo, ej. 'originales'
    // o podrías usar original?: 'true';
  };
}

async function getRepuestosData(searchParams: RepuestosPageProps['searchParams']): Promise<{ repuestos: Repuesto[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...repuestosData];

  // --- NUEVO: Filtro por tipo (originales) ---
  const showOriginalsOnly = searchParams.tipo === 'originales' || searchParams.original === 'true';
  if (showOriginalsOnly) {
    itemsToFilter = itemsToFilter.filter(r => r.isOriginal === true);
  }
  // Si tuvieras 'alternativos': else if (searchParams.tipo === 'alternativos') { itemsToFilter = itemsToFilter.filter(r => r.isOriginal === false); }

  // El resto de los filtros (búsqueda, categoría, marca) se aplican DESPUÉS del filtro de tipo
  if (searchParams.q) { /* ... lógica de búsqueda ... */ }
  if (searchParams.category) { /* ... lógica de filtro de categoría ... */ }
  if (searchParams.brand) { /* ... lógica de filtro de marca ... */ }
  if (searchParams.sort) { /* ... lógica de ordenación ... */ }

  // Lógica de Paginación (se aplica al final)
  const totalItems = itemsToFilter.length;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentPage = Math.max(1, Math.min(page, Math.ceil(totalItems / ITEMS_PER_PAGE) || 1));
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedRepuestos = itemsToFilter.slice(startIndex, endIndex);

  return { repuestos: paginatedRepuestos, totalPages, currentPage, totalItems };
}

// Para los selectores de filtro, ahora necesitas decidir si mostrar todas las categorías/marcas
// o solo las de los repuestos originales si ese filtro está activo.
// Por simplicidad, aquí mostramos todas, pero podrías pasar `showOriginalsOnly`
// a estas funciones para que filtren las opciones.
const getUniqueCategories = (data: Repuesto[], filterForOriginalsOnly?: boolean): string[] => {
    const sourceData = filterForOriginalsOnly ? data.filter(r => r.isOriginal === true) : data;
    return Array.from(new Set(sourceData.map(item => item.category))).sort();
};
const getUniqueBrands = (data: Repuesto[], filterForOriginalsOnly?: boolean): string[] => {
    const sourceData = filterForOriginalsOnly ? data.filter(r => r.isOriginal === true) : data;
    return Array.from(new Set(sourceData.map(item => item.brand).filter(Boolean) as string[])).sort();
};


export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const { repuestos, totalPages, currentPage, totalItems } = await getRepuestosData(searchParams);

  const isOriginalsView = searchParams.tipo === 'originales' || searchParams.original === 'true';

  // Decide si las opciones de filtro deben basarse solo en originales o en todos
  const categoriesForFilter = getUniqueCategories(repuestosData, isOriginalsView);
  const brandsForFilter = getUniqueBrands(repuestosData, isOriginalsView);

  const pageTitle = isOriginalsView ? "Catálogo de Repuestos Originales" : "Catálogo de Repuestos";
  const pageDescription = isOriginalsView
    ? "Garantiza la calidad y durabilidad con nuestra selección de repuestos originales."
    : "Explora nuestra amplia gama de repuestos para electrodomésticos y sistemas de refrigeración.";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">
            {pageTitle}
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </header>

        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 bg-white rounded-lg shadow">
          <SearchBar placeholder={isOriginalsView ? "Buscar repuestos originales..." : "Buscar repuestos..."} />
          {/* Podrías tener un TypeFilter aquí para seleccionar "Todos", "Originales", "Alternativos" */}
          {/* <TypeFilter /> */}
          <CategoryFilter categories={categoriesForFilter} />
          <BrandFilter brands={brandsForFilter} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-gray-600">
            Mostrando {repuestos.length} de {totalItems} {isOriginalsView ? "repuestos originales" : "repuestos"}.
          </p>
        )}

        {repuestos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {repuestos.map((item) => (
              <ProductCard
                key={item.id}
                product={{ // El objeto que espera ProductCard
                  id: item.id,
                  name: item.name,
                  imageUrl: item.imageUrl,
                  altText: item.name, // Añadir altText
                  rating: item.rating || 0, // Añadir rating (con valor por defecto)
                  reviewCount: item.reviewCount || 0, // Añadir reviewCount (con valor por defecto)
                  price: item.price, // <--- AÑADIR EL PRECIO
                  originalPrice: item.originalPrice, // <--- AÑADIR PRECIO ORIGINAL (si existe)
                  // tag: item.tag, // Si tienes un campo 'tag' en tu interfaz Repuesto
                  link: `/repuestos/${item.slug}`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No se encontraron {isOriginalsView ? "repuestos originales" : "repuestos"} que coincidan con tu búsqueda o filtros.
            </p>
            <Link href="/repuestos" className="mt-4 inline-block text-brand-blue hover:underline">
              Ver todos los repuestos
            </Link>
          </div>
        )}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}