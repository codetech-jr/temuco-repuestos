// src/components/sections/FeaturedProducts.tsx
"use client"

import ProductCard, { Product } from '@/components/ui/ProductCard'; // Importa ProductCard y la interfaz Product
import Link from 'next/link';

// Datos de ejemplo para los productos destacados
// Asegúrate de que estas imágenes existan en public/images/
const featuredProductsData: Product[] = [
  {
    id: 'prod1',
    name: 'Dieléctrico 500gr',
    imageUrl: '/img/dielectrico-500gr.jpg', // Reemplaza con tus imágenes
    altText: 'Dieléctrico 500gr en lata negra',
    tag: 'Oferta',
    rating: 4, // 4 estrellas
    reviewCount: 20,
    price: 6990,
    originalPrice: 10990,
    link: '/productos/dielectrico-500gr',
  },
  {
    id: 'prod2',
    name: 'Rociador Cowplandt',
    imageUrl: '/img/rociador-cowplandt.jpg', // Reemplaza con tus imágenes
    altText: 'Rociador amarillo Cowplandt',
    tag: 'Oferta', // La maqueta general muestra "Oferta"
    rating: 5, // 5 estrellas
    reviewCount: 18,
    price: 30000,
    originalPrice: 32990,
    link: '/productos/rociador-cowplandt',
  },
  {
    id: 'prod3',
    name: 'Aceite para compresor de neveras R134a',
    imageUrl: '/img/aceite-compresor.jpg', // Reemplaza con tus imágenes
    altText: 'Botella de aceite para compresor R134a',
    // Sin tag en la maqueta
    rating: 4, // 4 estrellas
    reviewCount: 12,
    price: 4000,
    originalPrice: 8990,
    link: '/productos/aceite-compresor-r134a',
  },
  {
    id: 'prod4',
    name: 'Kit de Mantenimiento para Refrigeradores',
    imageUrl: '/img/kit-mantenimiento.jpg', // Reemplaza con tus imágenes
    altText: 'Kit de mantenimiento para refrigeradores',
    // Sin tag en la maqueta
    rating: 3, // 3 estrellas
    reviewCount: 5,
    price: 45990,
    originalPrice: 50000,
    link: '/productos/kit-mantenimiento-refrigeradores',
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50"> {/* Fondo claro para la sección */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-900 mb-10 md:mb-12">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-12 md:mt-16">
          <Link href="/catalogo" legacyBehavior>
            <a className="bg-red-600 hover:bg-red-900 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
              Ver Catálogo Completo
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;