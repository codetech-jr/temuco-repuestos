// src/app/repuestos/[slug]/page.tsx
import { repuestosData, Repuesto } from '@/app/data/repuestos'; // Ajusta la ruta
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton'; // Crearemos este
// import ProductImageGallery from '@/components/ui/ProductImageGallery'; // Para Fase 3

// Opcional: Generar rutas estáticas en tiempo de build
export async function generateStaticParams() {
  return repuestosData.map((repuesto) => ({
    slug: repuesto.slug,
  }));
}

interface RepuestoDetailPageProps {
  params: { slug: string };
}

export default function RepuestoDetailPage({ params }: RepuestoDetailPageProps) {
  const repuesto = repuestosData.find(p => p.slug === params.slug);

  if (!repuesto) {
    notFound(); // Muestra página 404 si no se encuentra
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Columna de Imágenes */}
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
          {/* <ProductImageGallery images={repuesto.images || [repuesto.imageUrl]} /> */} {/* Para Fase 3 */}
          {repuesto.images && repuesto.images.length > 0 ? (
             <Image src={repuesto.images[0]} alt={repuesto.name} layout="fill" objectFit="contain" className="bg-white p-4"/>
          ) : (
             <Image src={repuesto.imageUrl} alt={repuesto.name} layout="fill" objectFit="contain" className="bg-white p-4"/>
          )}
        </div>

        {/* Columna de Detalles */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">{repuesto.name}</h1>
          {repuesto.isOriginal && ( // <--- AÑADIR ESTO
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mb-3 inline-block tracking-wide">
              REPUESTO ORIGINAL
            </span>
          )}
          <p className="text-2xl font-semibold text-brand-red mb-6">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(repuesto.price)}
          </p>
          {repuesto.longDescription && (
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-6" dangerouslySetInnerHTML={{ __html: repuesto.longDescription.replace(/\n/g, '<br />') }} />
          )}

          {repuesto.features && repuesto.features.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Características Destacadas:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {repuesto.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {repuesto.specifications && repuesto.specifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Especificaciones:</h3>
              <ul className="space-y-1 text-gray-600">
                {repuesto.specifications.map((spec, index) => (
                  <li key={index}><strong>{spec.key}:</strong> {spec.value}</li>
                ))}
              </ul>
            </div>
          )}

          <WhatsAppButton
            phoneNumber="569XXXXXXXX" // Reemplaza con tu número de WhatsApp
            productName={repuesto.name}
            message={`Hola, estoy interesado/a en el repuesto: ${repuesto.name} (ID: ${repuesto.id}). ¿Podrían darme más información?`}
          />
          {/* Opcional: Botón de volver al catálogo */}
          <Link href="/repuestos" className="mt-6 inline-block text-brand-blue hover:underline">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}