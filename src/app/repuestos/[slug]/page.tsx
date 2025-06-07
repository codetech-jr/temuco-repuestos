// src/app/repuestos/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { ShareButtons } from '@/components/products/ShareButtons'; // <--- YA LO TIENES IMPORTADO, ¡GENIAL!
import ProductViewTracker, { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker'; 
import RecentlyViewedProducts from '@/components/sections/RecentlyViewedProducts';
import SimilarProducts from '@/components/sections/SimilarProducts';
import type { Metadata, ResolvingMetadata } from 'next';

// ... (El resto de tus interfaces, funciones de fetch, metadata, etc., no cambia)
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
}

interface RepuestoDetailPageProps {
  params: { slug: string };
}

async function getRepuestoBySlugFromAPI(slug: string): Promise<Repuesto | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/repuestos/slug/${slug}`;
  console.log(`FRONTEND (detalle repuesto): Intentando fetch a: ${fetchUrl}`);
  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`Error al cargar repuesto por slug (${slug}): ${res.status} ${res.statusText}`);
      throw new Error(`Falló la carga del repuesto con slug ${slug}`);
    }
    const data = await res.json();
    return data as Repuesto;
  } catch (error) {
    console.error(`Excepción al cargar repuesto por slug (${slug}):`, error);
    throw error;
  }
}

export async function generateMetadata(
  { params }: RepuestoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);
  if (!repuesto) return { title: 'Repuesto no encontrado' };
  return {
    title: `${repuesto.name} - Repuestos Temuco`,
    description: repuesto.short_description || `Detalles del repuesto ${repuesto.name}.`,
  };
}

export async function generateStaticParams() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos`);
    if (!res.ok) return [];
    const todosLosRepuestos: Repuesto[] = await res.json().then(d => d.data || []);
    return todosLosRepuestos.map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("Error en generateStaticParams para repuestos:", error);
    return [];
  }
}


export default async function RepuestoDetailPage({ params }: RepuestoDetailPageProps) {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);

  if (!repuesto) {
    notFound();
  }

  // --- LÓGICA AÑADIDA PARA OBTENER LA URL COMPLETA ---
  // Necesitamos el dominio base para construir la URL completa para compartir.
  // Usamos una variable de entorno, con un fallback para desarrollo.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productUrl = `${siteUrl}/repuestos/${repuesto.slug}`;

  const productInfoForTracker: RecentlyViewedProductInfo = {
    id: repuesto.id,
    slug: repuesto.slug,
    name: repuesto.name,
    image_url: repuesto.image_url,
    price: parseFloat(repuesto.price as any) || 0,
    product_type: 'repuesto',
  };

  const displayImage = (repuesto.images && repuesto.images.length > 0)
                       ? repuesto.images[0]
                       : repuesto.image_url;

  return (
    <>
      <ProductViewTracker productInfo={productInfoForTracker} />

      <div className="bg-[#F7FAFC] py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="flex flex-col">
              <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-white">
                <Image
                  src={displayImage || '/placeholder.png'}
                  alt={repuesto.name}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-2 sm:p-4 md:p-6"
                  priority
                />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#002A7F] mb-2">
                {repuesto.name}
              </h1>
              
              {repuesto.brand && (
                <p className="text-sm text-[#718096] mb-1">
                  Marca: <span className="font-medium text-[#2D3748]">{repuesto.brand}</span>
                </p>
              )}
              {repuesto.category && (
                <p className="text-sm text-[#718096] mb-3">
                  Categoría: <span className="font-medium text-[#2D3748]">{repuesto.category}</span>
                </p>
              )}

              {/* --- AQUÍ ES EL LUGAR PERFECTO PARA LOS BOTONES DE COMPARTIR --- */}
              <div className="my-4 border-t border-b border-gray-200 py-2">
                 <ShareButtons url={productUrl} title={repuesto.name} />
              </div>

              {repuesto.is_original !== undefined && (
                  <p className="text-sm mb-4">
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${repuesto.is_original ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {repuesto.is_original ? "Original" : "Alternativo"}
                      </span>
                  </p>
              )}
              <p className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-6">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.price)}
                {repuesto.original_price && repuesto.original_price > repuesto.price && (
                  <span className="ml-3 text-base line-through text-[#718096]">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.original_price)}
                  </span>
                )}
              </p>
              {/* ... (el resto de tu código no cambia) ... */}
              {repuesto.short_description && (
                  <p className="text-lg text-[#2D3748] mb-6">{repuesto.short_description}</p>
              )}
              <div className="mt-8 mb-6">
                <WhatsAppButton
                  phoneNumber="584123975545"
                  productName={repuesto.name}
                  buttonText="Consultar por este Repuesto"
                />
              </div>
              <Link href="/repuestos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
                ← Volver al catálogo de repuestos
              </Link>
            </div>
          </div>
        </div>
      </div>
       
      { (repuesto.category || repuesto.brand) && 
        <SimilarProducts
          currentProductId={repuesto.id}
          productType="repuesto"
          category={repuesto.category}
          brand={repuesto.brand}
          limit={4}
          title="También Te Podría Interesar"
        />
      }

      <div className="container mx-auto px-4 my-8 md:my-12 ">
        <RecentlyViewedProducts title="Otros Productos que Has Visto" />
      </div>
    </>
  );
}