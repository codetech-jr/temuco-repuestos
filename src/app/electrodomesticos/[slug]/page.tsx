// src/app/electrodomesticos/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ProductViewTracker, { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker';
import RecentlyViewedProducts from '@/components/sections/RecentlyViewedProducts'; // <--- IMPORTACIÓN AÑADIDA
import SimilarProducts from '@/components/sections/SimilarProducts';
import { ShareButtons } from '@/components/products/ShareButtons'; 
import type { Metadata, ResolvingMetadata } from 'next';

// 1. DEFINE O IMPORTA TU INTERFAZ Electrodomestico
export interface Electrodomestico {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number; // Asumimos que 'price' es un número aquí. Si es string de la API, se parsea abajo.
  original_price?: number;
  image_url: string;
  category: string;
  brand: string;
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  stock?: number;
  is_active?: boolean;
  created_at?: string;
}

interface ElectrodomesticoDetailPageProps {
  params: { slug: string };
}

// 2. FUNCIÓN PARA HACER FETCH AL ELECTRODOMÉSTICO ESPECÍFICO POR SLUG DESDE LA API
async function getElectrodomesticoBySlugFromAPI(slug: string): Promise<Electrodomestico | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/electrodomesticos/slug/${slug}`;
  console.log(`FRONTEND (detalle electrodoméstico): Intentando fetch a: ${fetchUrl}`);

  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (res.status === 404) {
      return null;
    }
    if (!res.ok) {
      console.error(`Error al cargar electrodoméstico por slug (${slug}): ${res.status} ${res.statusText}`);
      throw new Error(`Falló la carga del electrodoméstico con slug ${slug}`);
    }
    const data = await res.json();
    return data as Electrodomestico; // Asegúrate que la API devuelva 'price' como número o ajústalo
  } catch (error) {
    console.error(`Excepción al cargar electrodoméstico por slug (${slug}):`, error);
    throw error;
  }
}

// 3. METADATA DINÁMICA
export async function generateMetadata(
  { params }: ElectrodomesticoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const electrodomestico = await getElectrodomesticoBySlugFromAPI(params.slug);
  if (!electrodomestico) {
    return {
      title: 'Electrodoméstico no encontrado - Temuco Repuestos',
    };
  }
  return {
    title: `${electrodomestico.name} - Electrodomésticos Temuco`,
    description: electrodomestico.short_description || `Detalles y especificaciones para el electrodoméstico ${electrodomestico.name}.`,
  };
}

// 4. GENERACIÓN DE PARÁMETROS ESTÁTICOS (opcional, para SSG)
export async function generateStaticParams() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/electrodomesticos`);
    if (!res.ok) {
        console.error("Error fetching slugs for electrodomesticos generateStaticParams:", res.statusText);
        return [];
    }
    const todosLosElectrodomesticos: Electrodomestico[] = await res.json().then(d => d.data || []);
    return todosLosElectrodomesticos.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Error en generateStaticParams para electrodomesticos:", error);
    return [];
  }
}

// 5. COMPONENTE DE PÁGINA
export default async function ElectrodomesticoDetailPage({ params }: ElectrodomesticoDetailPageProps) {
  const electrodomestico = await getElectrodomesticoBySlugFromAPI(params.slug);

  if (!electrodomestico) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productUrl = `${siteUrl}/electrodomesticos/${electrodomestico.slug}`;

  const productInfoForTracker: RecentlyViewedProductInfo = {
    id: electrodomestico.id,
    slug: electrodomestico.slug,
    name: electrodomestico.name,
    image_url: electrodomestico.image_url,
    price: parseFloat(electrodomestico.price as any) || 0, // Parsear si 'price' viene como string
    product_type: 'electrodomestico',
  };

  const displayImage = (electrodomestico.images && electrodomestico.images.length > 0)
                       ? electrodomestico.images[0]
                       : electrodomestico.image_url;

  return (
    <>
      <ProductViewTracker productInfo={productInfoForTracker} />

      {/* Sección principal de detalles del producto */}
      <div className="bg-[#F7FAFC] py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Columna de Imagen */}
            <div className="flex flex-col">
              <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src={displayImage || '/placeholder.png'}
                  alt={electrodomestico.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-2 sm:p-4 md:p-6"
                  priority
                />
              </div>
            </div>
            {/* Columna de Detalles */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#002A7F] mb-2">
                {electrodomestico.name}
              </h1>
              {/* ... resto de los detalles del electrodoméstico (marca, categoría, precio, etc.) ... */}
              {electrodomestico.brand && (
                <p className="text-sm text-[#718096] mb-1">
                  Marca: <span className="font-medium text-[#2D3748]">{electrodomestico.brand}</span>
                </p>
              )}
              {electrodomestico.category && (
                <p className="text-sm text-[#718096] mb-3">
                  Categoría: <span className="font-medium text-[#2D3748]">{electrodomestico.category}</span>
                </p>
              )}

                            {/* --- AQUÍ ES EL LUGAR PERFECTO PARA LOS BOTONES DE COMPARTIR --- */}
              <div className="my-4 border-t border-b border-gray-200 py-2">
                 <ShareButtons url={productUrl} title={electrodomestico.name} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-6">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.price)}
                {electrodomestico.original_price && electrodomestico.original_price > electrodomestico.price && (
                  <span className="ml-3 text-base line-through text-[#718096]">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.original_price)}
                  </span>
                )}
              </p>
              {electrodomestico.short_description && (
                  <p className="text-lg text-[#2D3748] mb-6">{electrodomestico.short_description}</p>
              )}
              {electrodomestico.long_description && (
                    <div className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] mb-6 prose-headings:text-[#002A7F] prose-strong:text-[#002A7F]"
                    dangerouslySetInnerHTML={{ __html: electrodomestico.long_description.replace(/\n/g, '<br />') }} />
              )}
              {electrodomestico.features && electrodomestico.features.length > 0 && (
              <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características Destacadas:</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#2D3748]">
                    {electrodomestico.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              {electrodomestico.specifications && electrodomestico.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                  <ul className="space-y-2 text-[#2D3748]">
                    {electrodomestico.specifications.map((spec, index) => (
                      <li key={index} className="flex flex-col sm:flex-row sm:items-baseline">
                        <strong className="w-full sm:w-1/3 md:w-1/4 flex-shrink-0 font-medium text-[#002A7F] mb-0.5 sm:mb-0">{spec.key}:</strong>
                        <span>{spec.value}</span>
                      </li>
              ))}
                </ul>
              </div>
            )}
            {electrodomestico.stock !== undefined && electrodomestico.stock > 0 && (
                <p className="text-sm text-green-600 mb-6">Stock disponible: {electrodomestico.stock} unidades</p>
            )}
            {electrodomestico.stock !== undefined && electrodomestico.stock === 0 && (
                <p className="text-sm text-red-600 mb-6">Producto agotado temporalmente</p>
            )}

              <div className="mt-8 mb-6">
                <WhatsAppButton
                  phoneNumber="584123975545"
                  productName={electrodomestico.name}
                  buttonText="Consultar por este Electrodoméstico"
                />
              </div>
              <Link href="/electrodomesticos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
                ← Volver al catálogo de electrodomésticos
              </Link>
            </div> {/* Cierre de la columna de detalles */}
          </div> {/* Cierre del grid md:grid-cols-2 */}
        </div> {/* Cierre del primer container */}
       {/* Cierre del div con bg-[#F7FAFC] */}

        {/* Productos Similares */}
        {/* Solo renderiza si tenemos al menos una categoría o marca para buscar */}
        { (electrodomestico.category || electrodomestico.brand) && 
          <SimilarProducts
            currentProductId={electrodomestico.id}
            productType="electrodomestico" // Ojo: hardcodeado para repuestos, en electrodomesticos será 'electrodomestico'
            category={electrodomestico.category}
            brand={electrodomestico.brand}
            limit={4} // O el número que quieras
            title="También Te Podría Interesar"
          />
        }

        {/* Sección para Vistos Recientemente */}
        <div className="container mx-auto px-4 my-8 md:my-12">
          <RecentlyViewedProducts title="Más Electrodomésticos que Te Podrían Interesar" /> 
          {/* Puedes cambiar el título si quieres */}
        </div>
    </div>
    </>
  );
}