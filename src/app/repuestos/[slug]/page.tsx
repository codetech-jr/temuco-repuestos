// src/app/repuestos/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import { ShareButtons } from '@/components/products/ShareButtons';
import ProductViewTracker, { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker'; 
import RecentlyViewedProducts from '@/components/sections/RecentlyViewedProducts';
import SimilarProducts from '@/components/sections/SimilarProducts';
import type { Metadata, ResolvingMetadata } from 'next';
import FadeIn from '@/components/utils/FadeIn';
import StaggeredFadeIn from '@/components/utils/StaggeredFadeIn';

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
  product_type?: 'electrodomestico' | 'repuesto';
}

interface RepuestoDetailPageProps {
  params: { slug: string };
}

async function getRepuestoBySlugFromAPI(slug: string): Promise<Repuesto | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const fetchUrl = `${API_BASE_URL}/repuestos/slug/${slug}`;
  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 600, tags: ['repuestos', `repuesto-${slug}`] }});
    if (res.status === 404) return null;
    if (!res.ok) {
      console.error(`API Error (${fetchUrl}): ${res.status} ${res.statusText}`);
      return null;
    }
    const data = await res.json();
    return { ...data, product_type: 'repuesto' } as Repuesto;
  } catch (error) {
    console.error(`Fetch Exception for repuesto (${fetchUrl}):`, error);
    return null;
  }
}

export async function generateMetadata(
  { params }: RepuestoDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const siteName = "Temuco Repuestos";

  if (!repuesto) {
    return {
      title: `Repuesto no encontrado - ${siteName}`,
      description: `El repuesto que buscas no está disponible en ${siteName}.`,
    };
  }

  const productPageUrl = `${siteUrl}/repuestos/${repuesto.slug}`;
  const ogImageBaseUrl = repuesto.image_url && repuesto.image_url.startsWith('http') ? '' : siteUrl;
  
  const ogImagesList: { url: string; width?: number; height?: number; alt?: string }[] = [];
  if (repuesto.image_url) {
    ogImagesList.push({
      url: `${ogImageBaseUrl}${repuesto.image_url}`,
      width: 1200, height: 630, alt: repuesto.name,
    });
  }
  repuesto.images?.slice(0, 2).forEach(img => {
    if (ogImagesList.length < 3 && img) {
      ogImagesList.push({
        url: img.startsWith('http') ? img : `${siteUrl}${img}`,
        width: 800, height: 600, alt: `${repuesto.name} - Imagen adicional`,
      });
    }
  });
  if (ogImagesList.length === 0 || ogImagesList.every(img => !img.url)) {
    ogImagesList.push({ url: `${siteUrl}/og-default-image.png`, width: 1200, height: 630, alt: siteName });
  }

  return {
    title: `${repuesto.name} - ${repuesto.category || ''} ${siteName}`,
    description: repuesto.short_description || `Encuentra ${repuesto.name}, ${repuesto.brand || ''} ${repuesto.category || ''}. Repuestos de calidad en ${siteName}.`,
    keywords: [repuesto.name, repuesto.brand, repuesto.category, 'repuesto', siteName, 'comprar', 'especificaciones'].filter(Boolean).join(', '),
    openGraph: {
      title: `${repuesto.name} - ${siteName}`,
      description: repuesto.short_description || `Todo sobre el repuesto ${repuesto.name}.`,
      url: productPageUrl,
      siteName: siteName,
      images: ogImagesList.filter(img => img.url),
      type: 'article', 
    },
    other: {
      'og:type': 'product',
      'product:brand': repuesto.brand,
      'product:availability_text': repuesto.stock !== undefined && repuesto.stock > 0 ? 'En stock' : 'Agotado',
      'product:condition': 'new',
      'product:price:amount': repuesto.price.toString(),
      'product:price:currency': 'CLP',
      'product:retailer_item_id': repuesto.slug,
      'product:category': repuesto.category,
    }
  };
}

export async function generateStaticParams() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos?limit=10000`);
    if (!res.ok) return [];
    const responseData = await res.json();
    const todosLosRepuestos: Repuesto[] = responseData.data || [];
    return todosLosRepuestos.map((item) => ({ slug: item.slug }));
  } catch (error) {
    return [];
  }
}

export default async function RepuestoDetailPage({ params }: RepuestoDetailPageProps) {
  const repuesto = await getRepuestoBySlugFromAPI(params.slug);

  if (!repuesto) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productUrl = `${siteUrl}/repuestos/${repuesto.slug}`;

  const productInfoForTracker: RecentlyViewedProductInfo = {
    id: repuesto.id,
    slug: repuesto.slug,
    name: repuesto.name,
    image_url: repuesto.image_url,
    price: repuesto.price,
    product_type: 'repuesto',
  };

  const displayImage = (repuesto.images && repuesto.images.length > 0)
                       ? repuesto.images[0]
                       : repuesto.image_url;

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": repuesto.name,
    "image": displayImage && displayImage.startsWith('http') ? displayImage : `${siteUrl}${displayImage || '/placeholder.png'}`,
    "description": repuesto.long_description || repuesto.short_description || `Información detallada sobre el repuesto ${repuesto.name}`,
    "sku": repuesto.id,
    "mpn": repuesto.slug,
    "brand": { "@type": "Brand", "name": repuesto.brand },
    "category": repuesto.category,
    "offers": {
      "@type": "Offer", "url": productUrl, "priceCurrency": "CLP",
      "price": repuesto.price.toString(),
      "availability": repuesto.stock !== undefined && repuesto.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
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
                    alt={repuesto.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    style={{ objectFit: "contain" }}
                    className="p-2 sm:p-4 md:p-6"
                    priority
                  />
                </div>
                {repuesto.images && repuesto.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {repuesto.images.map((imgUrl, index) => (
                            <div key={index} className="aspect-square relative border rounded overflow-hidden bg-white">
                                <Image 
                                    src={imgUrl} 
                                    alt={`${repuesto.name} - imagen ${index + 1}`} 
                                    fill 
                                    sizes="(max-width: 640px) 20vw, (max-width: 768px) 15vw, 10vw"
                                    style={{objectFit: "contain"}} 
                                    className="p-1 cursor-pointer hover:opacity-75 transition-opacity"
                                />
                            </div>
                        ))}
                    </div>
                )}
              </div>
            </FadeIn>
            <StaggeredFadeIn className="space-y-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-[#002A7F]">{repuesto.name}</h1></div>
              <div>
                {repuesto.brand && (<p className="text-sm text-[#718096]">Marca: <span className="font-medium text-[#2D3748]">{repuesto.brand}</span></p>)}
                {repuesto.category && (<p className="text-sm text-[#718096] mt-1">Categoría: <span className="font-medium text-[#2D3748]">{repuesto.category}</span></p>)}
              </div>
              <div className="border-t border-b border-gray-200 py-2"><ShareButtons url={productUrl} title={repuesto.name} /></div>
              {repuesto.is_original !== undefined && (
                  <p className="text-sm">
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${repuesto.is_original ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {repuesto.is_original ? "Original" : "Alternativo"}
                      </span>
                  </p>
              )}
              <div>
                <p className="text-2xl md:text-3xl font-bold text-[#C8102E]">
                  {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.price)}
                  {repuesto.original_price && repuesto.original_price > repuesto.price && (
                    <span className="ml-3 text-base line-through text-[#718096]">
                      {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.original_price)}
                    </span>
                  )}
                </p>
              </div>
              {repuesto.short_description && (<p className="text-lg text-[#2D3748]">{repuesto.short_description}</p>)}
              {repuesto.long_description && (<div className="prose prose-sm sm:prose-base max-w-none text-[#2D3748] prose-headings:text-[#002A7F] prose-strong:text-[#002A7F]" dangerouslySetInnerHTML={{ __html: repuesto.long_description.replace(/\n/g, '<br />') }} />)}
              {repuesto.features && repuesto.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Características:</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#2D3748]">{repuesto.features.map((f, i) => (<li key={i}>{f}</li>))}</ul>
                </div>
              )}
              {repuesto.specifications && repuesto.specifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-2">Especificaciones:</h3>
                  <ul className="space-y-2 text-[#2D3748]">{repuesto.specifications.map((s, i) => (<li key={i} className="flex flex-col sm:flex-row sm:items-baseline"><strong className="w-full sm:w-1/3 md:w-1/4 shrink-0 font-medium text-[#002A7F] mb-0.5 sm:mb-0">{s.key}:</strong><span>{s.value}</span></li>))}</ul>
                </div>
              )}
              {repuesto.stock !== undefined && (
                <div>{repuesto.stock > 0 ? (<p className="text-sm text-green-600">Stock disponible: {repuesto.stock} unidades</p>) : (<p className="text-sm text-red-600">Producto agotado temporalmente</p>)}</div>
              )}
              <div className="mt-8"><WhatsAppButton phoneNumber="584123975545" productName={repuesto.name} buttonText="Consultar por este Repuesto"/></div>
              <div className="mt-4"><Link href="/repuestos" className="inline-block text-[#002A7F] hover:text-[#002266] hover:underline transition-colors duration-300">← Volver al catálogo</Link></div>
            </StaggeredFadeIn>
          </div>
        </div>
      </div>
      {(repuesto.category || repuesto.brand) && (<FadeIn><SimilarProducts currentProductId={repuesto.id} productType="repuesto" category={repuesto.category} brand={repuesto.brand} limit={4} title="Repuestos Similares"/></FadeIn>)}
      <div className="container mx-auto px-4 my-8 md:my-12 "><FadeIn><RecentlyViewedProducts title="Repuestos Vistos Recientemente"/></FadeIn></div>
    </>
  );
}