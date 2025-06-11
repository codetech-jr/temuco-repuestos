// src/components/utils/StaggeredFadeIn.tsx
"use client";

import { motion } from 'framer-motion';
import React from 'react';

// --- PASO 1: (Opcional pero recomendado) Definir las props en una interfaz para más claridad ---
interface StaggeredFadeInProps {
  children: React.ReactNode;
  className?: string; // <-- AÑADIMOS className COMO PROPIEDAD OPCIONAL
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Un retraso sutil entre cada elemento hijo
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// --- PASO 2: Usar la nueva interfaz y recibir 'className' ---
const StaggeredFadeIn = ({ children, className }: StaggeredFadeInProps) => {
  return (
    // --- PASO 3: Aplicar 'className' al elemento principal ---
    <motion.div
      className={className} // <-- LA USAMOS AQUÍ
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggeredFadeIn;