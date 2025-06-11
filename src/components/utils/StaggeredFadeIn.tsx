"use client";

import { motion } from 'framer-motion';
import React from 'react';

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

// ✅ Definimos las props correctamente
interface StaggeredFadeInProps {
  children: React.ReactNode;
  className?: string;
}

const StaggeredFadeIn = ({ children, className }: StaggeredFadeInProps) => {
  return (
    <motion.div
      className={className}  // 👈 ahora soporta className
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
