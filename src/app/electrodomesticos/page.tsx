// src/app/electrodomesticos/page.tsx
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard'; // REUTILIZANDO
import { electrodomesticosData, Electrodomestico } from '@/app/data/electrodomesticos'; // CAMBIADO
import type { Metadata } from 'next';

// REUTILIZANDO COMPONENTES DE CATÁLOGO
import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import BrandFilter from '@/components/catalog/BrandFilter';
import SortDropdown from '@/components/catalog/SortDropdown';
import PaginationControls from '@/components/catalog/PaginationControls';

const ITEMS_PER_PAGE = 8;

// METADATA ESPECÍFICA
export const metadata: Metadata = {
  title: 'Catálogo de Electrodomésticos - Temuco Repuestos',
  description: 'Encuentra los mejores electrodomésticos para tu hogar: refrigeradores, lavadoras, cocinas y más.',
};

// PROPS ESPECÍFICAS (LA INTERFAZ ES LA MISMA)
interface ElectrodomesticosPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
  };
}

// --- FUNCIÓN getElectrodomesticosData ADAPTADA ---
async function getElectrodomesticosData(searchParams: ElectrodomesticosPageProps['searchParams']): Promise<{ electrodomesticos: Electrodomestico[], totalPages: number, currentPage: number, totalItems: number }> {
  let itemsToFilter = [...electrodomesticosData]; // USA DATOS DE ELECTRODOMÉSTICOS

  // 1. Búsqueda
  if (searchParams.q) {
    const searchTerm = searchParams.q.toLowerCase();
    itemsToFilter = itemsToFilter.filter(item =>
      item.name.toLowerCase().includes(searchTerm) ||
      item.shortDescription.toLowerCase().includes(searchTerm) ||
      (item.brand && item.brand.toLowerCase().includes(searchTerm)) // Aquí usas searchParams.brand implícitamente si searchTerm coincide con una marca
    );
  }

  // 2. Filtro por Categoría
  if (searchParams.category) {
    itemsToFilter = itemsToFilter.filter(item => item.category === searchParams.category);
  }

  // 3. Filtro por Marca
  if (searchParams.brand) { // <--- CORREGIDO a searchParams.brand
    itemsToFilter = itemsToFilter.filter(item => item.brand === searchParams.brand); // <--- CORREGIDO a searchParams.brand
  }

  // 4. Ordenación
  if (searchParams.sort) {
    const [sortBy, sortOrder] = searchParams.sort.split('_');
    itemsToFilter.sort((a, b) => {
      let valA = a[sortBy as keyof Electrodomestico];
      let valB = b[sortBy as keyof Electrodomestico];

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

  // 5. Paginación
  const totalItems = itemsToFilter.length;
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const currentPage = Math.max(1, Math.min(page, Math.ceil(totalItems / ITEMS_PER_PAGE) || 1));
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedElectrodomesticos = itemsToFilter.slice(startIndex, endIndex);

  return { electrodomesticos: paginatedElectrodomesticos, totalPages, currentPage, totalItems };
}
// --- FIN DE getElectrodomesticosData ---

// FUNCIONES HELPER ADAPTADAS
const getUniqueCategories = (data: Electrodomestico[]): string[] => Array.from(new Set(data.map(item => item.category))).sort();
const getUniqueBrands = (data: Electrodomestico[]): string[] => Array.from(new Set(data.map(item => item.brand).filter(Boolean) as string[])).sort();


export default async function ElectrodomesticosPage({ searchParams }: ElectrodomesticosPageProps) {
  const { electrodomesticos, totalPages, currentPage, totalItems } = await getElectrodomesticosData(searchParams);

  const allCategories = getUniqueCategories(electrodomesticosData);
  const allBrands = getUniqueBrands(electrodomesticosData);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12 text-center">
          {/* TÍTULO ESPECÍFICO */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">
            Catálogo de Electrodomésticos
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de electrodomésticos para equipar tu hogar con la mejor tecnología y calidad.
          </p>
        </header>

        {/* FILTROS (REUTILIZADOS) */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 items-center md:justify-between p-4 bg-white rounded-lg shadow">
          <SearchBar /> {/* Puedes pasarle un placeholder diferente si quieres */}
          <CategoryFilter categories={allCategories} />
          <BrandFilter brands={allBrands} />
          <SortDropdown />
        </div>

        {totalItems > 0 && (
          <p className="mb-6 text-sm text-gray-600">
            Mostrando {electrodomesticos.length} de {totalItems} electrodomésticos.
          </p>
        )}

        {electrodomesticos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {/* MAPEANDO SOBRE 'electrodomesticos' */}
            {electrodomesticos.map((item) => (
              <ProductCard
                key={item.id}
                product={{ // Asegúrate que ProductCard pueda manejar estos datos
                  id: item.id,
                  name: item.name,
                  imageUrl: item.imageUrl,
                  altText: item.name,
                  rating: item.rating || 0,
                  reviewCount: item.reviewCount || 0,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  link: `/electrodomesticos/${item.slug}`, // RUTA CORRECTA
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No se encontraron electrodomésticos que coincidan con tu búsqueda o filtros.
            </p>
            {/* ENLACE CORRECTO */}
            <Link href="/electrodomesticos" className="mt-4 inline-block text-brand-blue hover:underline">
              Limpiar búsqueda y filtros
            </Link>
          </div>
        )}

        {/* PAGINACIÓN (REUTILIZADA) */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}