// src/components/sections/RecentlyViewedProducts.tsx
"use client";

import { useState, useEffect } from 'react';
import ProductCard, { Product as ProductCardType } from '@/components/ui/ProductCard';
import { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker';

// ANIMACIÓN: Importamos los componentes necesarios
import FadeIn from '@/components/utils/FadeIn';
import AnimatedGrid from '@/components/utils/AnimatedGrid';

const RecentlyViewedProducts: React.FC<{ title?: string }> = ({ title = "Vistos Recientemente" }) => {
  const [recentProducts, setRecentProducts] = useState<RecentlyViewedProductInfo[]>([]);

  const loadRecentProducts = () => {
    try {
      const storedProducts = sessionStorage.getItem('recentlyViewedProducts');
      if (storedProducts) {
        setRecentProducts(JSON.parse(storedProducts));
      } else {
        setRecentProducts([]);
      }
    } catch (error) {
      console.error("Error cargando vistos recientemente:", error);
      setRecentProducts([]);
    }
  };

  useEffect(() => {
    loadRecentProducts();
    window.addEventListener('recentlyViewedUpdated', loadRecentProducts);
    return () => {
      window.removeEventListener('recentlyViewedUpdated', loadRecentProducts);
    };
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    // ANIMACIÓN: La sección entera aparece suavemente al hacer scroll
    <FadeIn>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002A7F] mb-6 md:mb-8">
            {title}
          </h2>
          
          {/* ANIMACIÓN: La rejilla de productos aparece en cascada */}
          <AnimatedGrid>
            {recentProducts.map((product) => {
              const productForCard: ProductCardType = {
                id: product.id,
                name: product.name,
                imageUrl: product.image_url,
                altText: product.name,
                link: `/${product.product_type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${product.slug || product.id}`,
                price: product.price,
              };
              // La key se pasa directamente a ProductCard, AnimatedGrid se encarga del motion.div
              return (
                 <ProductCard key={product.id} product={productForCard} productType="electrodomestico" />
              );
            })}
          </AnimatedGrid>
        </div>
      </section>
    </FadeIn>
  );
};

export default RecentlyViewedProducts;