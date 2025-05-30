// src/app/electrodomesticos/[slug]/page.tsx
import { electrodomesticosData, Electrodomestico } from '@/app/data/electrodomesticos'; // CAMBIADO
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton'; // REUTILIZANDO
// import ProductImageGallery from '@/components/ui/ProductImageGallery'; // REUTILIZANDO (si lo implementaste)
import type { Metadata, ResolvingMetadata } from 'next';

interface ElectrodomesticoDetailPageProps {
  params: { slug: string };
}

// FUNCIÓN PARA GENERAR METADATA DINÁMICA
export async function generateMetadata(
  { params }: ElectrodomesticoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const electrodomestico = electrodomesticosData.find(p => p.slug === params.slug);
  if (!electrodomestico) {
    return {
      title: 'Electrodoméstico no encontrado',
    }
  }
  return {
    title: `${electrodomestico.name} - Temuco Repuestos`,
    description: electrodomestico.shortDescription || `Detalles sobre ${electrodomestico.name}.`,
    // openGraph: { images: [electrodomestico.imageUrl] } // Para redes sociales
  }
}


// Opcional: Generar rutas estáticas en tiempo de build
export async function generateStaticParams() {
  return electrodomesticosData.map((item) => ({
    slug: item.slug,
  }));
}

export default function ElectrodomesticoDetailPage({ params }: ElectrodomesticoDetailPageProps) {
  const electrodomestico = electrodomesticosData.find(p => p.slug === params.slug);

  if (!electrodomestico) {
    notFound();
  }

  // El resto del JSX será muy similar al de repuestos/[slug]/page.tsx
  // Solo asegúrate de usar la variable 'electrodomestico' y sus campos.
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Columna de Imágenes */}
        <div className="aspect-w-1 aspect-h-1 md:aspect-w-4 md:aspect-h-5 relative rounded-lg overflow-hidden shadow-lg bg-white">
          {/* Si tienes ProductImageGallery, úsalo aquí */}
          {/* <ProductImageGallery images={electrodomestico.images || [electrodomestico.imageUrl]} /> */}
          {electrodomestico.images && electrodomestico.images.length > 0 ? (
              <Image src={electrodomestico.images[0]} alt={electrodomestico.name} layout="fill" objectFit="contain" className="p-4 md:p-6"/>
          ) : (
              <Image src={electrodomestico.imageUrl} alt={electrodomestico.name} layout="fill" objectFit="contain" className="p-4 md:p-6"/>
          )}
        </div>

        {/* Columna de Detalles */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">{electrodomestico.name}</h1>
          {electrodomestico.brand && <p className="text-sm text-gray-500 mb-3">Marca: {electrodomestico.brand}</p>}

          <p className="text-2xl font-semibold text-brand-red mb-6">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(electrodomestico.price)}
            {electrodomestico.originalPrice && (
              <span className="ml-3 text-base line-through text-gray-500">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(electrodomestico.originalPrice)}
              </span>
            )}
          </p>

          {electrodomestico.longDescription && (
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-6"
                 dangerouslySetInnerHTML={{ __html: electrodomestico.longDescription.replace(/\n/g, '<br />') }} />
          )}

          {electrodomestico.features && electrodomestico.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Características Destacadas:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {electrodomestico.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {electrodomestico.specifications && electrodomestico.specifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Especificaciones:</h3>
              <ul className="space-y-2 text-gray-600">
                {electrodomestico.specifications.map((spec, index) => (
                  <li key={index} className="flex">
                    <strong className="w-1/3 md:w-1/4 flex-shrink-0">{spec.key}:</strong>
                    <span>{spec.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <WhatsAppButton
            phoneNumber="569XXXXXXXX" // Tu número de WhatsApp
            productName={electrodomestico.name}
            buttonText="Consultar por este Electrodoméstico" // Texto específico
          />
          <Link href="/electrodomesticos" className="mt-6 inline-block text-brand-blue hover:underline">
            ← Volver al catálogo de electrodomésticos
          </Link>
        </div>
      </div>
    </div>
  );
}