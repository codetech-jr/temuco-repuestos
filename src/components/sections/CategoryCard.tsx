"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  link: string;
  variants?: Variants; 
}

export const CategoryCard = ({ name, description, imageUrl, link, variants }: CategoryCardProps) => (
  <motion.div
    variants={variants}
    className="bg-[#002A7F] text-[#F7FAFC] rounded-lg shadow-lg overflow-hidden flex flex-col h-full group"
    whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 42, 127, 0.25)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <div className="relative w-full h-48 overflow-hidden">
      <Image
        src={imageUrl}
        alt={name}
        fill
        style={{ objectFit: 'contain' }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="transition-transform duration-500 ease-in-out group-hover:scale-110"
        priority
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-sm text-[#EBF4FF] mb-4 flex-grow">{description}</p>
      <Link href={link} legacyBehavior>
        <a className="mt-auto bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] font-bold py-2 px-4 rounded text-center transition duration-300 ease-in-out transform hover:scale-105">
          Ver productos
        </a>
      </Link>
    </div>
  </motion.div>
);