/// En src/components/sections/MostViewedProducts.tsx
"use client";

import { useMemo } from 'react';
import ProductCard from '@/components/ui/ProductCard';
// Los tipos correctos ya están importados, ¡genial!
import type { ProductFromAPI, ProductForCard } from '@/types/product'; 
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import useFetchData from '@/hooks/useFetchData';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/free-mode';

// Esta interfaz local para la API está perfecta.
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

  if (loading || error || !products || products.length < 2) {
    return null; // O tu JSX de carga/error
  }

  return (
    <motion.section 
      className="py-12 md:py-16 bg-gray-50"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Nuestros Productos y Repuestos Más Vistos
        </h2>
        <div className="relative group">
          <Swiper
            // Tu configuración de Swiper está excelente
            modules={[Autoplay, FreeMode]}
            loop={products.length >= DESKTOP_ITEMS_PER_VIEW}
            slidesPerView={1.3}
            spaceBetween={16}
            autoplay={{ delay: 1, disableOnInteraction: false, pauseOnMouseEnter: true }}
            speed={8000}
            grabCursor={true}
            freeMode={{ enabled: true, momentum: false }}
            className="!pb-6 !pt-2"
            breakpoints={{
              640: { slidesPerView: 2.3, spaceBetween: 20 },
              768: { slidesPerView: 3.3, spaceBetween: 20 },
              1024: { slidesPerView: DESKTOP_ITEMS_PER_VIEW, spaceBetween: 24 },
            }}
          >
            {products.map((apiProduct) => {
              // ----- CORRECCIÓN #1: Usa el tipo importado 'ProductForCard' -----
              const productForCard: ProductForCard = {
                id: apiProduct.id,
                name: apiProduct.name,
                imageUrl: apiProduct.image_url || PLACEHOLDER_IMAGE_URL,
                altText: apiProduct.name,
                link: `/${apiProduct.product_type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${apiProduct.slug || apiProduct.id}`,
                price: parseFloat(apiProduct.price),
                // Añadimos las props opcionales para que el tipo coincida perfectamente
                tag: undefined, 
                rating: undefined,
                reviewCount: undefined,
              };
              return (
                <SwiperSlide key={apiProduct.id} className="!h-auto flex">
                  <div className="h-full w-full">
                    <ProductCard
                      product={productForCard}
                      // ----- CORRECCIÓN #2: Usa el tipo del producto de la API -----
                      productType={apiProduct.product_type}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent opacity-100 transition-opacity duration-300 pointer-events-none group-hover:opacity-0" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent opacity-100 transition-opacity duration-300 pointer-events-none group-hover:opacity-0" />
        </div>
      </div>
    </motion.section>
  );
};

export default MostViewedProducts;