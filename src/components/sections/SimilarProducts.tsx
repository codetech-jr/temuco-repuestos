"use client";

import { useMemo } from 'react';
import useFetchData from '@/hooks/useFetchData';
import ProductCard, { Product as ProductCardType } from '@/components/ui/ProductCard';
import { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedGrid from '@/components/utils/AnimatedGrid';

interface SimilarApiProduct {
  id: string;
  slug?: string;
  name: string;
  image_url: string;
  price: string | number;
  category?: string;
  brand?: string;
}

interface SimilarProductsProps {
  currentProductId: string;
  productType: 'electrodomestico' | 'repuesto';
  category?: string;
  brand?: string;
  limit?: number;
  title?: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  currentProductId,
  productType,
  category,
  brand,
  limit = 4,
  title = "Productos Similares"
}) => {
  const apiUrl = useMemo(() => {
    if (!currentProductId || !productType || (!category && !brand)) {
      return null;
    }
    const queryParams = new URLSearchParams({
      productId: currentProductId,
      productType,
      limit: limit.toString(),
    });
    if (category?.trim()) queryParams.append('category', category);
    if (brand?.trim()) queryParams.append('brand', brand);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    return `${baseUrl}/views/recommendations/similar?${queryParams.toString()}`;
  }, [currentProductId, productType, category, brand, limit]);

  const { data: fetchedProducts, loading, error } = useFetchData<SimilarApiProduct[]>(
    apiUrl,
    [currentProductId, productType, category, brand, limit]
  );

  const products = useMemo(() => {
    if (!fetchedProducts) return [];
    try {
      const recentlyViewedStored = sessionStorage.getItem('recentlyViewedProducts');
      if (recentlyViewedStored) {
        const recentlyViewedItems: RecentlyViewedProductInfo[] = JSON.parse(recentlyViewedStored);
        const recentlyViewedIds = new Set(recentlyViewedItems.map(item => item.id));
        return fetchedProducts
          .filter(similarProd => 
            !recentlyViewedIds.has(similarProd.id) && similarProd.id !== currentProductId
          )
          .slice(0, limit);
      }
      return fetchedProducts.slice(0, limit);
    } catch (e) {
      console.error("Error processing recently viewed for filtering", e);
      return fetchedProducts.slice(0, limit);
    }
  }, [fetchedProducts, currentProductId, limit]);

  const getProductPath = (productType: string, slugOrId: string) => 
    `/${productType === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${slugOrId}`;

  if (loading || error || !products.length) return null;

  return (
    <FadeIn>
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#002A7F] mb-6 md:mb-8">
            {title}
          </h2>
          <AnimatedGrid>
            {products.map((product) => {
              const productForCard: ProductCardType = {
                id: product.id,
                name: product.name,
                imageUrl: product.image_url || '/images/placeholder-product.png',
                altText: product.name,
                link: getProductPath(productType, product.slug || product.id),
                price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
              };
              return <ProductCard key={product.id} product={productForCard} productType="electrodomestico" />;
            })}
          </AnimatedGrid>
        </div>
      </section>
    </FadeIn>
  );
};

export default SimilarProducts;