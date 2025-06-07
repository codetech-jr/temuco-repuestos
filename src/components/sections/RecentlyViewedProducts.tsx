// src/components/sections/RecentlyViewedProducts.tsx
"use client";

import { useState, useEffect } from 'react';
import ProductCard, { Product as ProductCardType } from '@/components/ui/ProductCard'; // Ajusta la ruta
import { RecentlyViewedProductInfo } from '@/components/tracking/ProductViewTracker'; // Importa la interfaz

// Podrías usar Swiper aquí también si quieres un carrusel
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules'; // Ejemplo de módulo
// import 'swiper/css';
// import 'swiper/css/navigation';

const RecentlyViewedProducts: React.FC<{ title?: string }> = ({ title = "Vistos Recientemente" }) => {
  const [recentProducts, setRecentProducts] = useState<RecentlyViewedProductInfo[]>([]);

  const loadRecentProducts = () => {
    try {
      const storedProducts = sessionStorage.getItem('recentlyViewedProducts');
      if (storedProducts) {
        setRecentProducts(JSON.parse(storedProducts));
        console.log("Vistos recientemente cargados desde sessionStorage:", JSON.parse(storedProducts));
      } else {
        setRecentProducts([]);
      }
    } catch (error) {
      console.error("Error cargando vistos recientemente desde sessionStorage:", error);
      setRecentProducts([]);
    }
  };

  useEffect(() => {
    // Carga inicial
    loadRecentProducts();

    // Escuchar el evento personalizado para actualizar la lista
    window.addEventListener('recentlyViewedUpdated', loadRecentProducts);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('recentlyViewedUpdated', loadRecentProducts);
    };
  }, []); // El array vacío asegura que esto se ejecute solo al montar y desmontar

  if (recentProducts.length === 0) {
    return null; // O un mensaje sutil si prefieres, o no renderizar nada
  }

  return (
    <section className="py-8 md:py-12"> {/* O el estilo que prefieras */}
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#002A7F] mb-6 md:mb-8">
          {title}
        </h2>
        {/* Opción 1: Grid simple (similar a MostViewed sin Swiper) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {recentProducts.map((product) => {
            const productForCard: ProductCardType = {
              id: product.id,
              name: product.name,
              imageUrl: product.image_url,
              altText: product.name,
              link: `/${product.product_type === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${product.slug || product.id}`,
              price: product.price, // Ya es número desde RecentlyViewedProductInfo
              // rating y reviewCount pueden ser opcionales en ProductCard
            };
            return (
              <div key={product.id} className="h-full">
                 <ProductCard product={productForCard} />
              </div>
            );
          })}
        </div>
        {/* Opción 2: Si quieres usar Swiper, adapta la configuración de MostViewedProducts aquí */}
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;