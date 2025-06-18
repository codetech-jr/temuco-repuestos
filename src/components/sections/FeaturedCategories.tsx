"use client";

import { motion, type Variants } from 'framer-motion';
import { CategoryCard } from './CategoryCard';

const categories = [
  {
    name: "Repuestos para Compresores",
    description: "Amplia variedad de compresores para todo tipo de sistemas de refrigeración.",
    imageUrl: "/img/category/category-compressor.png",
    link: "/repuestos?category=Compresores",
  },
  {
    name: "Repuestos para Refrigeradores",
    description: "Las mejores marcas y modelos para su hogar o negocio.",
    imageUrl: "/img/category/category-refrigerator.png",
    link: "/repuestos?category=Refrigeración%20(Neveras)",
  },
  {
    name: "Repuestos para Aires Acondicionados",
    description: "Soluciones de climatización para todos los espacios.",
    imageUrl: "/img/category/category-air-conditioner.png",
    link: "/repuestos?category=Aire%20Acondicionado%20y%20Ventilación",
  },
  {
    name: "Repuestos Originales",
    description: "Todo lo que necesita para reparar sus electrodomésticos.",
    imageUrl: "/img/category/category-original-parts.png",
    link: "/repuestos?tipo=originales",
  },
];

const FeaturedCategories = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section 
      className="py-12 md:py-16 bg-[#F7FAFC]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#002A7F] mb-10 md:mb-12">
          Categorías Destacadas
        </h2>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              {...category}
              variants={cardVariants}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedCategories;