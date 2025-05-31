// src/components/sections/FeaturedCategories.tsx
import Image from "next/image";
import Link from "next/link";
// Eliminé el import de globals.css, generalmente se importa una sola vez en el layout principal.
// Si necesitas estilos específicos aquí que no son de Tailwind, considera <style jsx> o un módulo CSS.

// Datos de ejemplo
const categories = [
  {
    name: "Repuestos para Compresores",
    description: "Amplia variedad de compresores para todo tipo de sistemas de refrigeración.",
    imageUrl: "/img/category-compressor.png",
    link: "/repuestos?category=Compresores", // Asumiendo que esta es la ruta correcta
  },
  {
    name: "Repuestos para Refrigeradores",
    description: "Las mejores marcas y modelos para su hogar o negocio.",
    imageUrl: "/img/category-refrigerator.png",
    link: "/repuestos?category=Refrigeradores", // Asumiendo que esta es la ruta correcta
  },
  {
    name: "Repuestos para Aires Acondicionados",
    description: "Soluciones de climatización para todos los espacios.",
    imageUrl: "/img/category-air-conditioner.png",
    link: "/repuestos?category=Aires-acondicionados", // Asumiendo que esta es la ruta correcta
  },
  {
    name: "Repuestos Originales",
    description: "Todo lo que necesita para reparar sus electrodomésticos.",
    imageUrl: "/img/category-original-parts.png",
    link: "/repuestos?tipo=originales", // Ejemplo si 'originales' es un filtro
    // o link: "/repuestos-originales", si es una página separada
  },
];

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
}

const CategoryCard = ({ name, description, imageUrl, link }: CategoryCardProps) => (
  // Fondo de la tarjeta: Azul oscuro principal
  // Texto principal (título): Casi blanco azulado
  <div className="bg-[#002A7F] text-[#F7FAFC] rounded-lg shadow-lg overflow-hidden flex flex-col">
    <div className="relative w-full h-48">
      <Image
        src={imageUrl}
        alt={name}
        fill // Recomendado sobre layout="fill" en Next.js >= 13
        objectFit="contain" // 'contain' para ver la imagen completa, 'cover' para llenar el espacio
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" // Ayuda a Next/Image
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3> {/* Hereda text-[#F7FAFC] */}
      {/* Texto de descripción: Azul muy pálido */}
      <p className="text-sm text-[#EBF4FF] mb-4 flex-grow">{description}</p>
      <Link href={link} legacyBehavior>
        {/* Botón: Fondo rojo, hover azul muy oscuro, texto casi blanco azulado */}
        <a className="mt-auto bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] font-bold py-2 px-4 rounded text-center transition duration-300 ease-in-out transform hover:scale-105">
          Ver productos
        </a>
      </Link>
    </div>
  </div>
);


const FeaturedCategories = () => {
  return (
    // Fondo de la sección: Usando el color más claro de la paleta
    <section className="py-12 md:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        {/* Título de la sección: Usando el azul oscuro principal */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Categorías Destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"> {/* Ajustado gap para ser consistente con FeaturedProducts */}
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;