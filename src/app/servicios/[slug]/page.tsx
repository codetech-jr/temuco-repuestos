// src/app/servicios/[slug]/page.tsx
import { serviciosDetalleData, ServicioDetalle } from '@/app/data/servicios';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { FaWhatsapp } from 'react-icons/fa';

interface ServicioDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: ServicioDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const servicio = serviciosDetalleData.find(s => s.slug === params.slug);
  if (!servicio) {
    return { title: 'Servicio no encontrado - Temuco Repuestos' };
  }
  return {
    title: `${servicio.title} - Servicios Temuco Repuestos`,
    description: servicio.shortDescription || `Información detallada sobre nuestro servicio de ${servicio.title}.`,
    // openGraph: { images: servicio.imageUrl ? [servicio.imageUrl] : [] },
  };
}

export async function generateStaticParams() {
  return serviciosDetalleData.map((servicio) => ({
    slug: servicio.slug,
  }));
}

export default function ServicioDetailPage({ params }: ServicioDetailPageProps) {
  const servicio = serviciosDetalleData.find(s => s.slug === params.slug);

  if (!servicio) {
    notFound();
  }

  return (
    // Fondo general de la página: Casi blanco azulado
    <div className="bg-[#F7FAFC]">
      {/* Hero del Servicio (Opcional) */}
      {servicio.imageUrl && (
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <Image
            src={servicio.imageUrl}
            alt={`Imagen destacada para ${servicio.title}`}
            fill
            objectFit="cover"
            priority
          />
          {/* Overlay: Azul muy oscuro con opacidad. Título: Blanco */}
          <div className="absolute inset-0 bg-[#002266]/60 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
              {servicio.title}
            </h1>
          </div>
        </div>
      )}

      {/* Contenedor principal del contenido */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Artículo con estilos de Tailwind Typography */}
        <article className="prose prose-lg max-w-4xl mx-auto 
                          prose-p:text-[#2D3748] 
                          prose-li:text-[#2D3748]
                          prose-headings:text-[#002A7F] 
                          prose-strong:text-[#002A7F] font-normal
                          prose-a:text-[#002A7F] hover:prose-a:text-[#002266] hover:prose-a:underline
                          prose-bullets:text-[#002A7F] prose-counters:text-[#002A7F]
                          ">
          {!servicio.imageUrl && (
             // Título principal (si no hay hero): Azul oscuro principal
             <h1 className="text-3xl md:text-4xl font-bold !text-[#002A7F] mb-6 text-center"> {/* !text para sobreescribir prose */}
                {servicio.title}
             </h1>
          )}

          <div dangerouslySetInnerHTML={{ __html: servicio.longDescription }} />

          {servicio.benefits && servicio.benefits.length > 0 && (
            <div className="mt-8">
              {/* Título de sección (Beneficios): Hereda de prose-headings o usa text-[#002A7F] */}
              <h2 className="text-2xl font-semibold mb-4">Beneficios del Servicio</h2>
              <ul className="list-disc list-inside space-y-2 pl-0 sm:pl-5"> {/* Ajuste de pl para mejor alineación */}
                {servicio.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {servicio.process && servicio.process.length > 0 && (
            <div className="mt-8">
              {/* Título de sección (Proceso): Hereda de prose-headings o usa text-[#002A7F] */}
              <h2 className="text-2xl font-semibold mb-4">Nuestro Proceso</h2>
              <ol className="list-decimal list-inside space-y-3 pl-0 sm:pl-5">
                {servicio.process.map((step, index) => (
                  <li key={index}>
                    {/* 'step.step' en negrita con color azul oscuro principal */}
                    <strong>{step.step}:</strong> {step.description}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </article>

        {/* Call to Action */}
        <div className="mt-10 md:mt-12 text-center max-w-4xl mx-auto">
          {servicio.ctaText && servicio.ctaLink && (
            // Botón de CTA específico: Fondo rojo, hover azul muy oscuro, texto casi blanco
            <Link href={servicio.ctaLink} legacyBehavior>
              <a className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#F7FAFC] bg-[#C8102E] hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] transition-colors duration-300">
                {servicio.ctaText}
              </a>
            </Link>
          )}
          {(!servicio.ctaText || !servicio.ctaLink) && (
             // Botón genérico de WhatsApp: Fondo azul oscuro principal, hover azul muy oscuro, texto casi blanco
             <a
                href={`https://wa.me/584123975545?text=${encodeURIComponent(`Hola, me gustaría consultar sobre el servicio de ${servicio.title}`)}`} // REEMPLAZA XXXXXXXX con tu número
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-[#F7FAFC] bg-[#002A7F] hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] transition-colors duration-300"
              >
                <FaWhatsapp size={22} className="mr-2" />
                Consultar por WhatsApp
             </a>
          )}
        </div>
      </div>
    </div>
  );
}