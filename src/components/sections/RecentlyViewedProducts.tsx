// src/components/sections/RecentlyViewedProducts.tsx
"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
// Los tipos correctos ya están aquí, ¡solo hay que usarlos bien!
import type { ProductFromAPI, ProductForCard } from '@/types/product'; 
import { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker';

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
    <FadeIn>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002A7F] mb-6 md:mb-8">
            {title}
          </h2>
          
          <AnimatedGrid>
            {recentProducts.map((product) => {
              // ----- CORRECCIÓN #1: Usa el tipo importado 'ProductForCard' -----
              const productForCard: ProductForCard = {
                id: product.id,
                name: product.name,
                imageUrl: product.image_url,
                altText: product.name,
                link: `/${product.product_type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${product.slug || product.id}`,
                price: product.price,
                // Añadimos las props opcionales como undefined para que coincida el tipo
                originalPrice: undefined,
                tag: undefined,
                rating: undefined,
                reviewCount: undefined,
              };
              
              return (
                 <ProductCard 
                    key={product.id} 
                    product={productForCard} 
                    // ----- CORRECCIÓN #2: Usa el tipo del producto guardado -----
                    productType={product.product_type} 
                 />
              );
            })}
          </AnimatedGrid>
        </div>
      </section>
    </FadeIn>
  );
};

export default RecentlyViewedProducts;