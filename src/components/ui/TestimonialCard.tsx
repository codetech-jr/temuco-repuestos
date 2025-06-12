// En src/components/ui/TestimonialCard.tsx
"use client";

import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { FaStar, FaRegStar, FaQuoteLeft } from 'react-icons/fa';

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorDetail: string;
  rating: number;
  avatarUrl: string;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex text-yellow-400 mb-4">
    {[...Array(5)].map((_, i) => (
      i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
    ))}
  </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial; isSlider?: boolean; }> = ({ testimonial }) => {
  const innerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  return (
    <motion.div
      className="bg-[#F7FAFC] text-gray-800 rounded-lg shadow-xl p-6 md:p-8 flex flex-col h-full relative overflow-hidden"
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <motion.div
        className="absolute top-4 right-4 text-7xl text-[#002A7F]/10 z-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <FaQuoteLeft />
      </motion.div>
      
      <motion.div 
        className="flex flex-col h-full z-10"
        variants={innerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <RatingStars rating={testimonial.rating} />
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-gray-600 mb-6 flex-grow italic">
          {testimonial.quote}
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex items-center mt-auto pt-4 border-t border-gray-200">
          <Image
            src={testimonial.avatarUrl}
            alt={testimonial.authorName}
            width={56}
            height={56}
            className="rounded-full object-cover mr-4"
            priority
          />
          <div>
            <h4 className="font-bold text-[#002A7F]">{testimonial.authorName}</h4>
            <p className="text-sm text-gray-500">{testimonial.authorDetail}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;