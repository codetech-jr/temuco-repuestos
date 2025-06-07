// En src/components/sections/MostViewedProducts.tsx
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard, { Product as ProductCardType } from '@/components/ui/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import useFetchData from '@/hooks/useFetchData';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

interface ApiProductRecommendation {
  id: string;
  slug?: string;
  name: string;
  image_url: string;
  price: string;
  product_type: 'electrodomestico' | 'repuesto';
  view_count: string;
}

const DESKTOP_ITEMS_PER_VIEW = 4;
const PLACEHOLDER_IMAGE_URL = '/images/placeholder-product.png';

const MostViewedProducts: React.FC<{ totalItems?: number }> = ({ totalItems = 8 }) => {
  const apiUrl = useMemo(() => {
    const fetchLimit = Math.max(totalItems, DESKTOP_ITEMS_PER_VIEW * 2);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    return `${baseUrl}/views/recommendations/most-viewed?limit=${fetchLimit}`;
  }, [totalItems]);

  const { data: products, loading, error } = useFetchData<ApiProductRecommendation[]>(apiUrl, [totalItems]);

  // Loading state
  if (loading) return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p className="text-lg">Cargando productos más vistos...</p>
      </div>
    </section>
  );

  // Error state
  if (error) return (
    <section className="py-12 md:py-16 bg-red-50">
      <div className="container mx-auto px-4 text-center text-red-700">
        <p className="text-lg font-semibold">Error al cargar productos</p>
        <p className="text-sm">{error}</p>
      </div>
    </section>
  );
  
  // No products state
  if (!products || products.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#002A7F] mb-8 md:mb-10">
            Nuestros Productos y Repuestos Más Vistos
          </h2>
          <p className="text-center text-gray-500">Aún no hay productos populares para mostrar.</p>
        </div>
      </section>
    );
  }
  
  // Not enough products for slider state
  if (products.length < 2) { 
    return (
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#002A7F] mb-8 md:mb-10">
            Nuestros Productos y Repuestos Más Vistos
          </h2>
          <p className="text-center text-gray-500">Aún no hay suficientes productos populares para mostrar en carrusel.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Nuestros Productos y Repuestos Más Vistos
        </h2>
        <div className="overflow-hidden">
          <Swiper
            modules={[Autoplay, FreeMode]}
            loop={products.length >= DESKTOP_ITEMS_PER_VIEW}
            slidesPerView={1.3}
            spaceBetween={16}
            autoplay={{ 
              delay: 1, 
              disableOnInteraction: false, 
              pauseOnMouseEnter: true 
            }}
            speed={8000}
            grabCursor={true}
            freeMode={true}
            freeModeMomentum={false}
            className="!pb-6 !pt-2"
            breakpoints={{
              640: { slidesPerView: 2.3, spaceBetween: 20 },
              768: { slidesPerView: 3.3, spaceBetween: 20 },
              1024: { slidesPerView: DESKTOP_ITEMS_PER_VIEW, spaceBetween: 24 },
            }}
          >
            {products.map((apiProduct) => {
              const productForCard: ProductCardType = {
                id: apiProduct.id,
                name: apiProduct.name,
                imageUrl: apiProduct.image_url || PLACEHOLDER_IMAGE_URL,
                altText: apiProduct.name,
                link: `/${apiProduct.product_type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${apiProduct.slug || apiProduct.id}`,
                price: parseFloat(apiProduct.price),
              };
              return (
                <SwiperSlide key={apiProduct.id} className="!h-auto flex">
                  <div className="h-full w-full">
                    <ProductCard product={productForCard} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default MostViewedProducts;