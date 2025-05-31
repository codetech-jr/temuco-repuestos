// src/app/electrodomesticos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import { electrodomesticosData, Electrodomestico } from '@/app/data/electrodomesticos';
import type { Metadata } from 'next';

import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

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

async function getElectrodomesticosData(searchParams: ElectrodomesticosPageProps['searchParams']): Promise<{ electrodomesticos: Electrodomestico[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...electrodomesticosData];

  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase();
    itemsToFilter = itemsToFilter.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      (item.shortDescription && item.shortDescription.toLowerCase().includes(searchTerm)) ||
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
    const [sortBy, sortOrder] = searchParams.sort.split('_');
    itemsToFilter.sort((a, b) => {
      let valA = a[sortBy as keyof Electrodomestico] as any;
      let valB = b[sortBy as keyof Electrodomestico] as any;

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
  const paginatedElectrodomesticos = itemsToFilter.slice(startIndex, endIndex);

  return { electrodomesticos: paginatedElectrodomesticos, totalPages, currentPage, totalItems };
}

const getUniqueCategories = (data: Electrodomestico[]): string[] => Array.from(new Set(data.map(item => item.category).filter(Boolean) as string[])).sort();
const getUniqueBrands = (data: Electrodomestico[]): string[] => Array.from(new Set(data.map(item => item.brand).filter(Boolean) as string[])).sort();


export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  const { electrodomesticos, totalPages, currentPage, totalItems } = await getElectrodomesticosData(searchParams);

  const allCategories = getUniqueCategories(electrodomesticosData);
  const allBrands = getUniqueBrands(electrodomesticosData);

  return (
    // Fondo general de la página: Casi blanco azulado
    <div className="bg-[#F7FAFC] min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          {/* Título de página: Azul oscuro principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002A7F]">
            Catálogo de Electrodomésticos
          </h1>
          {/* Descripción de página: Gris oscuro azulado */}
          <p className="mt-2 text-base sm:text-lg text-[#2D3748] max-w-2xl mx-auto">
            Descubre nuestra selección de electrodomésticos para equipar tu hogar con la mejor tecnología y calidad.
          </p>
        </header>

        {/* Barra de filtros y búsqueda: Fondo blanco, sombra */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 md:p-6 bg-white rounded-lg shadow-md">
          <SearchBar placeholder="Buscar electrodomésticos..." />
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          // Texto de conteo de ítems: Gris medio
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
                  imageUrl: item.imageUrl,
                  altText: item.altText || item.name,
                  rating: item.rating || 0,
                  reviewCount: item.reviewCount || 0,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  tag: item.tag,
                  link: `/electrodomesticos/${item.slug}`,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            {/* Mensaje "No encontrado": Texto gris medio */}
            <p className="text-xl text-[#718096]">
              No se encontraron electrodomésticos que coincidan con tu búsqueda o filtros.
            </p>
            {/* Enlace "Limpiar": Texto azul oscuro principal, hover azul muy oscuro */}
            <Link href="/electrodomesticos" className="mt-4 inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
              Limpiar búsqueda y filtros
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