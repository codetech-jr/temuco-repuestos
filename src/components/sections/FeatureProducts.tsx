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
    imageUrl: '/img/dielectrico-500gr.jpg',
    altText: 'Dieléctrico 500gr en lata negra',
    tag: 'Oferta', // Este tag se estilizaría dentro de ProductCard, idealmente con bg-[#C8102E] text-[#F7FAFC]
    rating: 4,
    reviewCount: 20,
    price: 6990,
    originalPrice: 10990,
    link: '/productos/dielectrico-500gr',
  },
  {
    id: 'prod2',
    name: 'Rociador Cowplandt',
    imageUrl: '/img/rociador-cowplandt.jpg',
    altText: 'Rociador amarillo Cowplandt',
    tag: 'Oferta', // Ídem anterior
    rating: 5,
    reviewCount: 18,
    price: 30000,
    originalPrice: 32990,
    link: '/productos/rociador-cowplandt',
  },
  {
    id: 'prod3',
    name: 'Aceite para compresor de neveras R134a',
    imageUrl: '/img/aceite-compresor.jpg',
    altText: 'Botella de aceite para compresor R134a',
    // Sin tag aquí, pero si se añade un tag como "Nuevo", podría ser bg-[#002A7F] text-[#F7FAFC]
    rating: 4,
    reviewCount: 12,
    price: 4000,
    originalPrice: 8990,
    link: '/productos/aceite-compresor-r134a',
  },
  {
    id: 'prod4',
    name: 'Kit de Mantenimiento para Refrigeradores',
    imageUrl: '/img/kit-mantenimiento.jpg',
    altText: 'Kit de mantenimiento para refrigeradores',
    tag: 'Más Vendido', // Ejemplo de otro tag, podría usar bg-[#DD6B20] text-[#F7FAFC] (asumiendo #DD6B20 como tu naranja)
    rating: 3,
    reviewCount: 5,
    price: 45990,
    originalPrice: 50000,
    link: '/productos/kit-mantenimiento-refrigeradores',
  },
];

const FeaturedProducts = () => {
  return (
    // Fondo de la sección: Usando el color más claro de la paleta
    <section className="py-12 md:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        {/* Título de la sección: Usando el azul oscuro principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
            // Nota: El estilo visual del 'tag' (ej. "Oferta") y otros elementos
            // dentro de ProductCard (como precio, estrellas de rating)
            // deben configurarse dentro del propio componente ProductCard.tsx
            // usando la paleta de colores proporcionada.
          ))}
        </div>
        <div className="text-center mt-12 md:mt-16">
          <Link href="/repuestos" legacyBehavior>
            {/* Botón: Fondo rojo, hover azul muy oscuro, texto casi blanco azulado */}
            <a className="bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
              Ver Catálogo Completo
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;