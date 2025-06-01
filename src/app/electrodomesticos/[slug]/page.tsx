// src/app/repuestos/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton'; // Asumo que lo reutilizas
import type { Metadata, ResolvingMetadata } from 'next';

// 1. REUTILIZA O DEFINE TU INTERFAZ Repuesto
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

// 2. FUNCIÓN PARA HACER FETCH A LA API POR SLUG
async function getRepuestoBySlugFromAPI(slug: string): Promise<Repuesto | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/repuestos/slug/${slug}`; // CAMBIO: endpoint de repuestos
  console.log("FRONTEND (detalle repuesto por slug): Intentando fetch a:", fetchUrl);

  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`Error al cargar repuesto por slug (${slug}): ${res.status} ${res.statusText}`);
      throw new Error(`Falló la carga del repuesto con slug ${slug}`);
    }
    return await res.json() as Repuesto;
  } catch (error) {
    console.error(`Excepción al cargar repuesto por slug (${slug}):`, error);
    throw error;
  }
}

// 3. METADATA DINÁMICA
export async function generateMetadata(
  { params }: RepuestoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);
  if (!repuesto) {
    return { title: 'Repuesto no encontrado - Temuco Repuestos' };
  }
  return {
    title: `${repuesto.name} - Repuestos Temuco Repuestos`,
    description: repuesto.short_description || `Detalles del repuesto ${repuesto.name}.`,
  };
}

// 4. GENERACIÓN DE PARÁMETROS ESTÁTICOS (opcional)
export async function generateStaticParams() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos`); // CAMBIO: endpoint de repuestos
    if (!res.ok) return [];
    const todosLosRepuestos: Repuesto[] = await res.json();
    return todosLosRepuestos.map((item) => ({ slug: item.slug }));
  } catch (error) {
    console.error("Error en generateStaticParams para repuestos:", error);
    return [];
  }
}

// 5. COMPONENTE DE PÁGINA
export default async function RepuestoDetailPage({ params }: RepuestoDetailPageProps) {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);

  if (!repuesto) {
    notFound();
  }

  const displayImage = (repuesto.images && repuesto.images.length > 0)
                       ? repuesto.images[0]
                       : repuesto.image_url;

  return (
    <div className="bg-[#F7FAFC] py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Aquí va el JSX para mostrar los detalles del repuesto */}
        {/* Similar a la página de detalle de electrodomésticos, pero con los campos de Repuesto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
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
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002A7F] mb-2">
              {repuesto.name}
            </h1>
            {repuesto.brand && (
              <p className="text-sm text-[#718096] mb-3">
                Marca: <span className="font-medium text-[#2D3748]">{repuesto.brand}</span>
              </p>
            )}
            {repuesto.is_original !== undefined && ( // Mostrar si es original o no
                <p className="text-sm text-[#718096] mb-3">
                    Tipo: <span className="font-medium text-[#2D3748]">{repuesto.is_original ? "Original" : "Alternativo"}</span>
                </p>
            )}
            <p className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-6">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.price)}
              {repuesto.original_price && (
                <span className="ml-3 text-base line-through text-[#718096]">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.original_price)}
                </span>
              )}
            </p>
            {repuesto.long_description && (
              <div className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] mb-6 ..."
                   dangerouslySetInnerHTML={{ __html: repuesto.long_description.replace(/\n/g, '<br />') }} />
            )}
             {repuesto.features && repuesto.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características:</h3>
                <ul className="list-disc list-inside space-y-1 text-[#2D3748]">
                  {repuesto.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            {repuesto.specifications && repuesto.specifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                 <ul className="space-y-2 text-[#2D3748]">
                  {repuesto.specifications.map((spec, index) => (
                    <li key={index} className="flex ...">
                      <strong className="...">{spec.key}:</strong>
                      <span>{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 mb-6">
              <WhatsAppButton
                phoneNumber="569XXXXXXXX"
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
  );
}