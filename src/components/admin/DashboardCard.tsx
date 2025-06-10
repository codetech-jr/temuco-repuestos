// Crea un nuevo archivo: src/components/admin/DashboardCard.tsx
"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  href: string;
  title: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ href, title, description }) => {
  return (
    <Link href={href} legacyBehavior>
      <motion.a
        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <h2 className="text-xl font-semibold text-[#002A7F] mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </motion.a>
    </Link>
  );
};

export default DashboardCard;