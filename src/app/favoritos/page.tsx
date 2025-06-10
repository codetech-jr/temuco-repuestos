// src/app/favoritos/page.tsx
'use client';

import { useWishlist } from '@/contexts/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import Link from 'next/link';
import { HeartCrack } from 'lucide-react';
// ANIMACIÓN: Importamos motion, AnimatePresence y los componentes de animación
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedGrid from '@/components/utils/AnimatedGrid';

export default function FavoritosPage() {
  const { wishlistItems, isLoading } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[60vh]">
      <AnimatePresence mode="wait">
        {/* Estado de Carga */}
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-[#002A7F]">Mis Favoritos</h1>
            <p className="mt-4 text-lg text-gray-600">Cargando tus productos guardados...</p>
          </motion.div>
        )}

        {/* Estado Vacío */}
        {!isLoading && wishlistItems.length === 0 && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="text-center flex flex-col items-center"
          >
            <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
              <HeartCrack size={64} className="text-gray-400 mb-4" />
            </motion.div>
            <FadeIn delay={0.3}>
              <h1 className="text-3xl font-bold text-[#002A7F]">Tu lista de favoritos está vacía</h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="mt-4 text-lg text-gray-600">Explora nuestros catálogos y guarda los productos que te interesan.</p>
            </FadeIn>
            <motion.div
              className="mt-6 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/electrodomesticos" className="bg-[#002A7F] text-white px-6 py-2 rounded-lg hover:bg-[#002266] transition transform hover:scale-105">Ver Electrodomésticos</Link>
              <Link href="/repuestos" className="bg-[#C8102E] text-white px-6 py-2 rounded-lg hover:bg-[#A80D26] transition transform hover:scale-105">Ver Repuestos</Link>
            </motion.div>
          </motion.div>
        )}

        {/* Estado con Contenido */}
        {!isLoading && wishlistItems.length > 0 && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FadeIn>
              <header className="mb-12 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-[#002A7F]">Mis Productos Favoritos</h1>
                <p className="mt-2 text-lg text-gray-600">Aquí tienes los productos que has guardado para más tarde.</p>
              </header>
            </FadeIn>

            <AnimatedGrid>
              {wishlistItems.map((item) => {
                const productData = item.electrodomesticos || item.repuestos;
                const productType = item.electrodomesticos ? 'electrodomestico' : 'repuesto';
                if (!productData) return null;
                return (
                  <ProductCard
                    key={item.id}
                    product={{
                      id: productData.id,
                      name: productData.name,
                      imageUrl: productData.image_url,
                      altText: productData.name,
                      price: productData.price,
                      link: `/${productType === 'electrodomestico' ? 'electrodomesticos' : 'repuestos'}/${productData.slug}`
                    }}
                    productType={productType}
                  />
                );
              })}
            </AnimatedGrid>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}