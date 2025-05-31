// src/app/electrodomesticos/[slug]/page.tsx
import { electrodomesticosData, Electrodomestico } from '@/app/data/electrodomesticos';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import type { Metadata, ResolvingMetadata } from 'next';

interface ElectrodomesticoDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: ElectrodomesticoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const electrodomestico = electrodomesticosData.find(p => p.slug === params.slug);
  if (!electrodomestico) {
    return {
      title: 'Electrodoméstico no encontrado - Temuco Repuestos', // Incluir nombre de la tienda
    }
  }
  return {
    title: `${electrodomestico.name} - Electrodomésticos Temuco Repuestos`, // Título más específico
    description: electrodomestico.shortDescription || `Descubre detalles y características del ${electrodomestico.name}.`,
    // openGraph: {
    //   title: electrodomestico.name,
    //   description: electrodomestico.shortDescription,
    //   images: [electrodomestico.imageUrl, ...(electrodomestico.images || [])],
    // },
  }
}

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

  return (
    // Contenedor principal con fondo claro
    <div className="bg-[#F7FAFC] py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna de Imágenes */}
          {/* Eliminado aspect-w-x aspect-h-y, usar aspect-square o similar si es necesario */}
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-white">
            {(electrodomestico.images && electrodomestico.images.length > 0) ? (
                <Image src={electrodomestico.images[0]} alt={electrodomestico.name} fill objectFit="contain" className="p-2 sm:p-4 md:p-6"/>
            ) : (
                <Image src={electrodomestico.imageUrl} alt={electrodomestico.name} fill objectFit="contain" className="p-2 sm:p-4 md:p-6"/>
            )}
          </div>

          {/* Columna de Detalles */}
          <div>
            {/* Título del producto: Azul oscuro principal */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#002A7F] mb-2">
              {electrodomestico.name}
            </h1>
            {/* Marca: Gris medio */}
            {electrodomestico.brand && (
              <p className="text-sm text-[#718096] mb-3">
                Marca: <span className="font-medium text-[#2D3748]">{electrodomestico.brand}</span>
              </p>
            )}

            {/* Precio: Rojo. Precio original: Gris medio */}
            <p className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-6">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.price)}
              {electrodomestico.originalPrice && (
                <span className="ml-3 text-base line-through text-[#718096]">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.originalPrice)}
                </span>
              )}
            </p>

            {/* Descripción larga: Texto gris oscuro azulado. Encabezados y strong en azul */}
            {electrodomestico.longDescription && (
              <div className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] mb-6
                              prose-headings:text-[#002A7F] prose-strong:text-[#002A7F]"
                   dangerouslySetInnerHTML={{ __html: electrodomestico.longDescription.replace(/\n/g, '<br />') }} />
            )}

            {/* Características */}
            {electrodomestico.features && electrodomestico.features.length > 0 && (
              <div className="mb-6">
                {/* Título de sección: Azul oscuro principal */}
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características Destacadas:</h3>
                {/* Texto de lista: Gris oscuro azulado */}
                <ul className="list-disc list-inside space-y-1 text-[#2D3748]">
                  {electrodomestico.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Especificaciones */}
            {electrodomestico.specifications && electrodomestico.specifications.length > 0 && (
              <div className="mb-6">
                {/* Título de sección: Azul oscuro principal */}
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                {/* Texto de lista: Gris oscuro azulado. Key de especificación en azul */}
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

            {/* WhatsAppButton: Estilizado internamente */}
            <div className="mt-8 mb-6">
              <WhatsAppButton
                phoneNumber="569XXXXXXXX" // Reemplaza con tu número
                productName={electrodomestico.name}
                buttonText="Consultar por este Electrodoméstico"
                // className="w-full sm:w-auto bg-[#002A7F] hover:bg-[#002266] text-white ..."
              />
            </div>

            {/* Enlace "Volver": Texto azul oscuro principal, hover azul muy oscuro */}
            <Link href="/electrodomesticos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
              ← Volver al catálogo de electrodomésticos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}