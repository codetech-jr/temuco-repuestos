// src/app/servicios/[slug]/page.tsx
import { serviciosDetalleData, ServicioDetalle } from '@/app/data/servicios';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { FaWhatsapp } from 'react-icons/fa';

// ANIMACIÓN: Importamos los componentes de animación
import AnimatedHero from '@/components/utils/AnimatedHero';
import AnimatedList from '@/components/utils/AnimatedList';
import FadeIn from '@/components/utils/FadeIn'; // Reutilizamos este

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
    <div className="bg-[#F7FAFC]">
      {/* ANIMACIÓN: Hero animado */}
      {servicio.imageUrl && (
        <AnimatedHero 
          imageUrl={servicio.imageUrl}
          altText={`Imagen destacada para ${servicio.title}`}
          title={servicio.title}
        />
      )}

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* ANIMACIÓN: El contenido del artículo aparece suavemente */}
        <FadeIn>
          <article className="prose prose-lg max-w-4xl mx-auto ...">
            {!servicio.imageUrl && (
               <h1 className="...">{servicio.title}</h1>
            )}

            <div dangerouslySetInnerHTML={{ __html: servicio.longDescription }} />

            {servicio.benefits && servicio.benefits.length > 0 && (
              <div className="mt-8 not-prose"> {/* not-prose para controlar estilos manualmente */}
                <h2 className="text-2xl font-semibold mb-4 text-[#002A7F]">Beneficios del Servicio</h2>
                {/* ANIMACIÓN: Lista de beneficios animada */}
                <AnimatedList className="list-disc list-inside space-y-2 pl-0 sm:pl-5 text-[#2D3748]">
                  {servicio.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </AnimatedList>
              </div>
            )}

            {servicio.process && servicio.process.length > 0 && (
              <div className="mt-8 not-prose">
                <h2 className="text-2xl font-semibold mb-4 text-[#002A7F]">Nuestro Proceso</h2>
                {/* ANIMACIÓN: Lista de proceso animada */}
                <AnimatedList className="list-decimal list-inside space-y-3 pl-0 sm:pl-5 text-[#2D3748]">
                  {servicio.process.map((step, index) => (
                    <li key={index}>
                      <strong className="text-[#002A7F]">{step.step}:</strong> {step.description}
                    </li>
                  ))}
                </AnimatedList>
              </div>
            )}
          </article>
        </FadeIn>

        {/* ANIMACIÓN: El CTA aparece al final */}
        <FadeIn delay={0.3}>
          <div className="mt-10 md:mt-12 text-center max-w-4xl mx-auto">
            {servicio.ctaText && servicio.ctaLink ? (
              <Link href={servicio.ctaLink} legacyBehavior>
                <a className="inline-block bg-[#C8102E] hover:bg-[#002A7F] text-[#F7FAFC] font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                  {servicio.ctaText}
                </a>
              </Link>
            ) : (
               <a href={`https://wa.me/...`} className="inline-block bg-[#C8102E] hover:bg-[#002A7F] text-[#F7FAFC] font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105">
                  <FaWhatsapp size={22} className="mr-2" />
                  Consultar por WhatsApp
               </a>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}