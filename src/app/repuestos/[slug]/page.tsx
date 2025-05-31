// src/app/repuestos/[slug]/page.tsx
import { repuestosData, Repuesto } from '@/app/data/repuestos';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
// import ProductImageGallery from '@/components/ui/ProductImageGallery';

export async function generateStaticParams() {
  return repuestosData.map((repuesto) => ({
    slug: repuesto.slug,
  }));
}

interface RepuestoDetailPageProps {
  params: { slug: string };
}

// Función para generar metadata dinámica (opcional pero recomendado)
export async function generateMetadata({ params }: RepuestoDetailPageProps) {
  const repuesto = repuestosData.find(p => p.slug === params.slug);
  if (!repuesto) {
    return {
      title: 'Repuesto no encontrado',
    };
  }
  return {
    title: `${repuesto.name} - Temuco Repuestos`,
    description: repuesto.shortDescription || `Detalles del repuesto ${repuesto.name}.`,
    // openGraph: {
    //   title: repuesto.name,
    //   description: repuesto.shortDescription,
    //   images: [repuesto.imageUrl, ...(repuesto.images || [])],
    // },
  };
}


export default function RepuestoDetailPage({ params }: RepuestoDetailPageProps) {
  const repuesto = repuestosData.find(p => p.slug === params.slug);

  if (!repuesto) {
    notFound();
  }

  return (
    <div className="bg-[#F7FAFC] py-8 md:py-12">     
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Columna de Imágenes */}
          <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg">
            {/* Fondo blanco para la imagen si es 'contain' */}
            {(repuesto.images && repuesto.images.length > 0) ? (
              <Image src={repuesto.images[0]} alt={repuesto.name} fill objectFit="contain" className="bg-white p-2 sm:p-4"/>
            ) : (
              <Image src={repuesto.imageUrl} alt={repuesto.name} fill objectFit="contain" className="bg-white p-2 sm:p-4"/>
            )}
          </div>

          {/* Columna de Detalles */}
          <div>
            {/* Título del producto: Azul oscuro principal */}
            <h1 className="text-3xl md:text-4xl font-bold text-[#002A7F] mb-3">
              {repuesto.name}
            </h1>

            {/* Tag "REPUESTO ORIGINAL": Fondo azul muy pálido, texto azul oscuro principal */}
            {repuesto.isOriginal && (
              <span className="text-xs font-semibold text-[#002A7F] bg-[#EBF4FF] px-2.5 py-1 rounded-full mb-4 inline-block tracking-wide">
                REPUESTO ORIGINAL
              </span>
            )}

            {/* Precio: Rojo */}
            <p className="text-2xl md:text-3xl font-bold text-[#C8102E] mb-6">
              {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.price)}
            </p>

            {/* Descripción larga: Texto gris oscuro azulado */}
            {repuesto.longDescription && (
              <div
                className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] mb-6 
                           prose-headings:text-[#002A7F] prose-strong:text-[#002A7F]" // Estilos para elementos dentro de prose
                dangerouslySetInnerHTML={{ __html: repuesto.longDescription.replace(/\n/g, '<br />') }}
              />
            )}

            {/* Características */}
            {repuesto.features && repuesto.features.length > 0 && (
              <div className="mb-6">
                {/* Título de sección: Azul oscuro principal */}
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características Destacadas:</h3>
                {/* Texto de lista: Gris oscuro azulado */}
                <ul className="list-disc list-inside space-y-1 text-[#2D3748]">
                  {repuesto.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Especificaciones */}
            {repuesto.specifications && repuesto.specifications.length > 0 && (
              <div className="mb-6">
                {/* Título de sección: Azul oscuro principal */}
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                {/* Texto de lista: Gris oscuro azulado */}
                <ul className="space-y-1 text-[#2D3748]">
                  {repuesto.specifications.map((spec, index) => (
                    <li key={index}><strong className="font-medium text-[#002A7F]">{spec.key}:</strong> {spec.value}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* WhatsAppButton: Estilizado internamente.
                Ejemplo: bg-[#002A7F] hover:bg-[#002266] text-white */}
            <div className="mt-8 mb-6">
              <WhatsAppButton
                phoneNumber="569XXXXXXXX" // Reemplaza con tu número
                productName={repuesto.name}
                message={`Hola, estoy interesado/a en el repuesto: ${repuesto.name} (ID: ${repuesto.id}). ¿Podrían darme más información?`}
                // Clases para el botón pueden ser pasadas como props o definidas dentro
                // className="w-full sm:w-auto bg-[#002A7F] hover:bg-[#002266] text-white ..."
              />
            </div>

            {/* Enlace "Volver": Texto azul oscuro principal, hover azul muy oscuro */}
            <Link href="/repuestos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">
              ← Volver al catálogo de repuestos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}