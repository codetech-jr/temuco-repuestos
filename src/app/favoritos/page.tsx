// src/app/favoritos/page.tsx

'use client'; // <-- MUY IMPORTANTE: Esta página debe ser un Componente de Cliente para usar hooks.

import { useWishlist } from '@/contexts/WishlistContext'; // Nuestro hook para acceder al wishlist
import ProductCard from '@/components/ui/ProductCard';     // Nuestro componente reutilizable
import Link from 'next/link';
import { HeartCrack } from 'lucide-react'; // Un icono para cuando la lista está vacía

export default function FavoritosPage() {
  // Usamos nuestro hook para obtener el estado actual del wishlist.
  // Es así de simple. ¡No hay que llamar a la API de nuevo! El Context ya lo hizo por nosotros.
  const { wishlistItems, isLoading } = useWishlist();

  // Durante la carga inicial, mostramos un mensaje.
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold text-[#002A7F]">Mis Favoritos</h1>
        <p className="mt-4 text-lg text-gray-600">Cargando tus productos guardados...</p>
      </div>
    );
  }

  // Si no hay ítems y ya no está cargando, mostramos un mensaje para el estado vacío.
  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center flex flex-col items-center">
        <HeartCrack size={64} className="text-gray-400 mb-4" />
        <h1 className="text-3xl font-bold text-[#002A7F]">Tu lista de favoritos está vacía</h1>
        <p className="mt-4 text-lg text-gray-600">
          Explora nuestros catálogos y guarda los productos que te interesan.
        </p>
        <div className="mt-6 flex gap-4">
            <Link href="/electrodomesticos" className="bg-[#002A7F] text-white px-6 py-2 rounded-lg hover:bg-[#002266] transition">
                Ver Electrodomésticos
            </Link>
            <Link href="/repuestos" className="bg-[#C8102E] text-white px-6 py-2 rounded-lg hover:bg-[#A80D26] transition">
                Ver Repuestos
            </Link>
        </div>
      </div>
    );
  }

  // Si hay ítems, los mostramos.
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#002A7F]">
          Mis Productos Favoritos
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Aquí tienes los productos que has guardado para más tarde.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/*
          Mapeamos sobre la lista de favoritos.
          Por cada ítem, extraemos los datos del producto (sea electrodoméstico o repuesto).
        */}
        {wishlistItems.map((item) => {
          const productData = item.electrodomesticos || item.repuestos;
          const productType = item.electrodomesticos ? 'electrodomestico' : 'repuesto';

          // Si por alguna razón un ítem no tiene datos de producto, lo saltamos.
          if (!productData) return null;
          
          // ¡Reutilizamos nuestro ProductCard! Es la magia de los componentes.
          return (
            <ProductCard
              key={item.id} // Usamos el ID del wishlist_item para la key
              product={{
                id: productData.id,
                // Necesitaríamos más datos aquí, vamos a ajustar el Context para esto
                // Por ahora, lo dejamos simple, pero lo mejoraremos.
                // Lo ideal es que el GET a /wishlist ya traiga todos los datos necesarios.
                // ¡Y ya lo hace! Así que podemos usarlos.
                name: productData.name,
                imageUrl: productData.image_url,
                altText: productData.name,
                price: productData.price,
                link: `/${productType}s/${productData.slug}`
              }}
              productType={productType}
            />
          );
        })}
      </div>
    </div>
  );
}