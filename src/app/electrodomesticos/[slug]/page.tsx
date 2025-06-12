import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import ProductViewTracker, { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker';
import { ShareButtons } from '@/components/products/ShareButtons';
import type { Metadata, ResolvingMetadata } from 'next';
import FadeIn from '@/components/utils/FadeIn';
import StaggeredFadeIn from '@/components/utils/StaggeredFadeIn';

const RecentlyViewedProducts = dynamic(
  () => import('@/components/sections/RecentlyViewedProducts'),
  { 
    ssr: false, 
    loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" /> 
  }
);

const SimilarProducts = dynamic(
  () => import('@/components/sections/SimilarProducts'),
  { 
    ssr: false, 
    loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg" /> 
  }
);

export interface Electrodomestico {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
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
  rating?: number;
  review_count?: number;
  product_type?: 'electrodomestico' | 'repuesto';
}

async function getElectrodomesticoBySlugFromAPI(slug: string): Promise<Electrodomestico | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/electrodomesticos/slug/${slug}`;
  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 600, tags: ['electrodomesticos', `electrodomesticos-${slug}`] }});
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data, product_type: 'electrodomestico' } as Electrodomestico;
  } catch (error) {
    console.error(`Fetch Exception for electrodomestico (${fetchUrl}):`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const electrodomestico = await getElectrodomesticoBySlugFromAPI(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = "Temuco Repuestos";

  if (!electrodomestico) {
    return {
      title: `Electrodoméstico no encontrado - ${siteName}`,
      description: `El electrodoméstico que buscas no está disponible en ${siteName}.`,
    };
  }

  const productPageUrl = `${siteUrl}/electrodomesticos/${electrodomestico.slug}`;
  const ogImageBaseUrl = electrodomestico.image_url && electrodomestico.image_url.startsWith('http') ? '' : siteUrl;
  
  const ogImagesList: { url: string; width?: number; height?: number; alt?: string }[] = [];
  if (electrodomestico.image_url) {
    ogImagesList.push({
      url: `${ogImageBaseUrl}${electrodomestico.image_url}`,
      width: 1200, height: 630, alt: electrodomestico.name,
    });
  }
  electrodomestico.images?.slice(0, 2).forEach(img => {
    if (ogImagesList.length < 3) {
      ogImagesList.push({
        url: img.startsWith('http') ? img : `${siteUrl}${img}`,
        width: 800, height: 600, alt: `${electrodomestico.name} - Imagen adicional`,
      });
    }
  });
  if (ogImagesList.length === 0 && ogImagesList.every(img => !img.url)) {
    ogImagesList.push({ url: `${siteUrl}/og-default-image.png`, width: 1200, height: 630, alt: siteName });
  }

  return {
    title: `${electrodomestico.name} - ${electrodomestico.category || ''} ${siteName}`,
    description: electrodomestico.short_description || `Descubre ${electrodomestico.name}, ${electrodomestico.brand || ''} ${electrodomestico.category || ''}. Calidad y servicio en ${siteName}.`,
    keywords: [electrodomestico.name, electrodomestico.brand, electrodomestico.category, 'electrodomestico', siteName, 'comprar', 'ficha técnica'].filter(Boolean).join(', '),
    openGraph: {
      title: `${electrodomestico.name} - ${siteName}`,
      description: electrodomestico.short_description || `Todo sobre ${electrodomestico.name}.`,
      url: productPageUrl,
      siteName: siteName,
      images: ogImagesList.filter(img => img.url),
      type: 'article', 
    },
    other: {
      'og:type': 'product',
      'product:brand': electrodomestico.brand,
      'product:availability': electrodomestico.stock !== undefined && electrodomestico.stock > 0 ? 'instock' : 'oos',
      'product:condition': 'new',
      'product:price:amount': electrodomestico.price.toString(),
      'product:price:currency': 'CLP',
      'product:retailer_item_id': electrodomestico.slug,
    }
  };
}

export async function generateStaticParams() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/electrodomesticos?limit=10000`);
    if (!res.ok) return [];
    const responseData = await res.json();
    const todosLosElectrodomesticos: Electrodomestico[] = responseData.data || [];
    return todosLosElectrodomesticos.map((item) => ({ slug: item.slug }));
  } catch (error) {
    return [];
  }
}

export default async function ElectrodomesticoDetailPage({
  params,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
    price: electrodomestico.price,
    product_type: 'electrodomestico',
  };

  const displayImage = (electrodomestico.images && electrodomestico.images.length > 0)
                       ? electrodomestico.images[0]
                       : electrodomestico.image_url;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": electrodomestico.name,
    "image": displayImage && displayImage.startsWith('http') ? displayImage : `${siteUrl}${displayImage || '/placeholder.png'}`,
    "description": electrodomestico.long_description || electrodomestico.short_description || `Información detallada sobre ${electrodomestico.name}`,
    "sku": electrodomestico.id,
    "mpn": electrodomestico.slug,
    "brand": { "@type": "Brand", "name": electrodomestico.brand },
    "offers": {
      "@type": "Offer", "url": productUrl, "priceCurrency": "CLP",
      "price": electrodomestico.price.toString(),
      "availability": electrodomestico.stock !== undefined && electrodomestico.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    ...(electrodomestico.rating && electrodomestico.review_count && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": electrodomestico.rating.toString(),
        "reviewCount": electrodomestico.review_count.toString()
      }
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductViewTracker productInfo={productInfoForTracker} />
      <div className="bg-[#F7FAFC] py-8 md:py-12 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <FadeIn>
              <div className="flex flex-col">
                <div className="aspect-square relative rounded-lg overflow-hidden shadow-lg bg-white">
                  <Image
                    src={displayImage || '/placeholder.png'}
                    alt={electrodomestico.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="p-2 sm:p-4 md:p-6"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority
                  />
                </div>
                {electrodomestico.images && electrodomestico.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {electrodomestico.images.map((imgUrl, index) => (
                            <div key={index} className="aspect-square relative border rounded overflow-hidden bg-white">
                                <Image 
                                    src={imgUrl} 
                                    alt={`${electrodomestico.name} - imagen ${index + 1}`} 
                                    fill 
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    style={{objectFit: "contain"}} 
                                    className="p-1 cursor-pointer hover:opacity-75 transition-opacity"
                                    priority
                                />
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </FadeIn>
            <StaggeredFadeIn className="space-y-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-[#002A7F]">{electrodomestico.name}</h1></div>
              <div>
                {electrodomestico.brand && (<p className="text-sm text-[#718096]">Marca: <span className="font-medium text-[#2D3748]">{electrodomestico.brand}</span></p>)}
                {electrodomestico.category && (<p className="text-sm text-[#718096] mt-1">Categoría: <span className="font-medium text-[#2D3748]">{electrodomestico.category}</span></p>)}
              </div>
              <div className="border-t border-b border-gray-200 py-2"><ShareButtons url={productUrl} title={electrodomestico.name} /></div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-[#C8102E]">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.price)}
                  {electrodomestico.original_price && electrodomestico.original_price > electrodomestico.price && (
                    <span className="ml-3 text-base line-through text-[#718096]">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(electrodomestico.original_price)}
                    </span>
                  )}
                </p>
              </div>
              {electrodomestico.short_description && (<p className="text-lg text-[#2D3748]">{electrodomestico.short_description}</p>)}
              {electrodomestico.long_description && (<div className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] prose-headings:text-[#002A7F] prose-strong:text-[#002A7F]" dangerouslySetInnerHTML={{ __html: electrodomestico.long_description.replace(/\n/g, '<br />') }} />)}
              {electrodomestico.features && electrodomestico.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características Destacadas:</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#2D3748]">{electrodomestico.features.map((f, i) => (<li key={i}>{f}</li>))}</ul>
                </div>
              )}
              {electrodomestico.specifications && electrodomestico.specifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                  <ul className="space-y-2 text-[#2D3748]">{electrodomestico.specifications.map((s, i) => (<li key={i} className="flex flex-col sm:flex-row sm:items-baseline"><strong className="w-full sm:w-1/3 md:w-1/4 shrink-0 font-medium text-[#002A7F] mb-0.5 sm:mb-0">{s.key}:</strong><span>{s.value}</span></li>))}</ul>
                </div>
              )}
              {electrodomestico.stock !== undefined && (
                <div>{electrodomestico.stock > 0 ? (<p className="text-sm text-green-600">Stock disponible: {electrodomestico.stock} unidades</p>) : (<p className="text-sm text-red-600">Producto agotado temporalmente</p>)}</div>
              )}
              <div className="mt-8"><WhatsAppButton phoneNumber="584123975545" productName={electrodomestico.name} buttonText="Consultar por este Electrodoméstico"/></div>
              <div className="mt-4"><Link href="/electrodomesticos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">← Volver al catálogo</Link></div>
            </StaggeredFadeIn>
          </div>
        </div>
      </div>
      {(electrodomestico.category || electrodomestico.brand) && (<FadeIn><SimilarProducts currentProductId={electrodomestico.id} productType="electrodomestico" category={electrodomestico.category} brand={electrodomestico.brand} limit={4} title="También Te Podría Interesar"/></FadeIn>)}
      <div className="container mx-auto px-4 my-8 md:my-12"><FadeIn><RecentlyViewedProducts title="Visto Recientemente"/></FadeIn></div>
    </>
  );
}