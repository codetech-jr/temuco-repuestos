// Crea un nuevo archivo: src/components/utils/AnimatedHero.tsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

interface AnimatedHeroProps {
  imageUrl: string;
  altText: string;
  title: string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ imageUrl, altText, title }) => {
  return (
    <div className="relative h-64 md:h-80 lg:h-96 w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} // Slow, smooth zoom-out
      >
        <Image
          src={imageUrl}
          alt={altText}
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[#002266]/60 flex items-center justify-center">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          {title}
        </motion.h1>
      </div>
    </div>
  );
};

export default AnimatedHero;