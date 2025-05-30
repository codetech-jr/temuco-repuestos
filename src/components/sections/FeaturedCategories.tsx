// src/components/sections/FeaturedCategories.tsx
import Image from "next/image";
import Link from "next/link";
import "@/app/globals.css";

// NO NECESITAS ESTOS IMPORTS SI LAS IMÁGENES ESTÁN EN LA CARPETA 'public'
// import categoryCompressor from "../../../public/img/category-compressor.png"
// import categoryRefrigerator from "../../../public/img/category-refrigerator.png"
// import categoryAir from "../../../public/img/category-air-conditioner.png"
// import categoryOriginalParts from "../../../public/img/category-original-parts.png"


// Datos de ejemplo
const categories = [
  {
    name: "Repuestos para Compresores",
    description: "Amplia variedad de compresores para todo tipo de sistemas de refrigeración.",
    // Ruta relativa a la carpeta 'public'
    imageUrl: "/img/category-compressor.png",
    link: "/repuestos/compresores",
  },
  {
    name: "Repuestos para Refrigeradores",
    description: "Las mejores marcas y modelos para su hogar o negocio.",
    imageUrl: "/img/category-refrigerator.png",
    link: "/repuestos/refrigeradores",
  },
  {
    name: "Repuestos para Aires Acondicionados",
    description: "Soluciones de climatización para todos los espacios.",
    imageUrl: "/img/category-air-conditioner.png",
    link: "/repuestos/aires-acondicionados",
  },
  {
    name: "Repuestos Originales",
    description: "Todo lo que necesita para reparar sus electrodomésticos.",
    imageUrl: "/img/category-original-parts.png",
    link: "/repuestos/originales",
  },
];

// El tipo para las props de CategoryCard. imageUrl ahora es string.
interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string; // Cambiado a string
  link: string;
}

const CategoryCard = ({ name, description, imageUrl, link }: CategoryCardProps) => (
  <div className="bg-blue-700 text-white rounded-lg shadow-lg overflow-hidden flex flex-col">
    <div className="relative w-full h-48"> {/* Contenedor para la imagen */}
      {/* src ahora es una cadena de texto */}
      <Image src={imageUrl} alt={name} layout="fill" objectFit="contain" />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-sm text-blue-200 mb-4 flex-grow">{description}</p>
      <Link href={link} legacyBehavior>
        <a className="mt-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-center transition duration-300">
          Ver productos
        </a>
      </Link>
    </div>
  </div>
);


const FeaturedCategories = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-10">
          Categorías Destacadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;