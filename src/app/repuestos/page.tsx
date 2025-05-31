// src/app/repuestos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { repuestosData, Repuesto } from '@/app/data/repuestos';
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

const ITEMS_PER_PAGE = 8;

export async function generateMetadata({ searchParams }: RepuestosPageProps): Promise<Metadata> {
  const isOriginalsView = searchParams.tipo === 'originales' || searchParams.original === 'true';
  const title = isOriginalsView
    ? 'Repuestos Originales - Temuco Repuestos'
    // Aplicando tu azul oscuro principal al título en metadata si es posible (esto es solo texto)
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
    tipo?: 'originales' | string;
  };
}

async function getRepuestosData(searchParams: RepuestosPageProps['searchParams']): Promise<{ repuestos: Repuesto[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...repuestosData];

  const showOriginalsOnly = searchParams.tipo === 'originales' || searchParams.original === 'true';
  if (showOriginalsOnly) {
    itemsToFilter = itemsToFilter.filter(r => r.isOriginal === true);
  }

  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase();
    itemsToFilter = itemsToFilter.filter(repuesto =>
      repuesto.name.toLowerCase().includes(searchTerm) ||
      (repuesto.shortDescription && repuesto.shortDescription.toLowerCase().includes(searchTerm)) ||
      (repuesto.brand && repuesto.brand.toLowerCase().includes(searchTerm))
    );
  }

  if (searchParams.category) {
    itemsToFilter = itemsToFilter.filter(repuesto => {
      const repuestoCategory = repuesto.category ? repuesto.category.toLowerCase() : '';
      const searchCategory = searchParams.category ? searchParams.category.toLowerCase() : '';
      return repuestoCategory === searchCategory;
    });
  }

  if (searchParams.brand) {
    const searchBrand = searchParams.brand.toLowerCase();
    itemsToFilter = itemsToFilter.filter(repuesto =>
      repuesto.brand && repuesto.brand.toLowerCase() === searchBrand
    );
  }

  if (searchParams.sort) {
    const [sortBy, sortOrder] = searchParams.sort.split('_');
    itemsToFilter.sort((a, b) => {
      let valA = a[sortBy as keyof Repuesto] as any; // Type assertion
      let valB = b[sortBy as keyof Repuesto] as any; // Type assertion

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

const getUniqueCategories = (data: Repuesto[], filterForOriginalsOnly?: boolean): string[] => {
    const sourceData = filterForOriginalsOnly ? data.filter(r => r.isOriginal === true) : data;
    return Array.from(new Set(sourceData.map(item => item.category).filter(Boolean) as string[])).sort();
};
const getUniqueBrands = (data: Repuesto[], filterForOriginalsOnly?: boolean): string[] => {
    const sourceData = filterForOriginalsOnly ? data.filter(r => r.isOriginal === true) : data;
    return Array.from(new Set(sourceData.map(item => item.brand).filter(Boolean) as string[])).sort();
};


export default async function RepuestosPage({ searchParams }: RepuestosPageProps) {
  const { repuestos, totalPages, currentPage, totalItems } = await getRepuestosData(searchParams);
  const isOriginalsView = searchParams.tipo === 'originales' || searchParams.original === 'true';

  const categoriesForFilter = getUniqueCategories(repuestosData, isOriginalsView);
  const brandsForFilter = getUniqueBrands(repuestosData, isOriginalsView);

  const pageTitle = isOriginalsView ? "Catálogo de Repuestos Originales" : "Catálogo de Repuestos";
  const pageDescription = isOriginalsView
    ? "Garantiza la calidad y durabilidad con nuestra selección de repuestos originales."
    : "Explora nuestra amplia gama de repuestos para electrodomésticos y sistemas de refrigeración.";

  return (
    // Fondo general de la página: Casi blanco azulado
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          {/* Título de página: Azul oscuro principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
            {pageTitle}
          </h1>
          {/* Descripción de página: Gris oscuro azulado */}
          <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
            {pageDescription}
          </p>
        </header>

        {/* Barra de filtros y búsqueda: Fondo blanco, sombra */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          {/* Los componentes de filtro (SearchBar, CategoryFilter, etc.) deben estilizarse internamente
              con la paleta de colores. Ej: inputs con border-[#718096], focus:ring-[#002A7F],
              botones de búsqueda con bg-[#002A7F] hover:bg-[#002266] */}
          <SearchBar placeholder={isOriginalsView ? "Buscar repuestos originales..." : "Buscar repuestos..."} />
          <CategoryFilter categories={categoriesForFilter} />
          <BrandFilter brands={brandsForFilter} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          // Texto de conteo de ítems: Gris medio
          <p className="mb-6 text-sm text-[#718096]">
            Mostrando {repuestos.length} de {totalItems} {isOriginalsView ? "repuestos originales" : "repuestos"}.
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
                  imageUrl: item.imageUrl,
                  altText: item.altText || item.name, // Usar altText si existe, sino el nombre
                  rating: item.rating || 0,
                  reviewCount: item.reviewCount || 0,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  tag: item.tag, // Asegúrate que 'tag' exista en tu tipo 'Repuesto' si lo usas
                  link: `/repuestos/${item.slug}`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {/* Mensaje "No encontrado": Texto gris medio */}
            <p className="text-xl text-[#718096]">
              No se encontraron {isOriginalsView ? "repuestos originales" : "repuestos"} que coincidan con tu búsqueda o filtros.
            </p>
            {/* Enlace "Ver todos": Texto azul oscuro principal, hover azul muy oscuro */}
            <Link href="/repuestos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
              Ver todos los repuestos
            </Link>
          </div>
        )}

        {/* PaginationControls debe estilizarse internamente con la paleta:
            - Ítem activo: bg-[#002A7F] text-[#F7FAFC]
            - Ítems inactivos: text-[#718096] hover:bg-[#EBF4FF] hover:text-[#002A7F]
            - Flechas: text-[#002A7F] */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}