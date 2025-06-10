// src/components/ui/WhatsAppButton.tsx
"use client"; // Puede ser client si necesitas lógica extra, o server si solo genera enlace

import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

interface WhatsAppButtonProps {
  phoneNumber: string; // Formato internacional sin + ni espacios, ej: 56912345678
  message?: string;
  productName?: string; // Para incluirlo en el mensaje predeterminado
  className?: string;
  buttonText?: string;
}

const WhatsAppButton = ({
  phoneNumber,
  message,
  productName,
  className = "w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors",
  buttonText = "Consultar por WhatsApp"
}: WhatsAppButtonProps) => {

  const defaultMessage = productName
    ? `Hola, estoy interesado/a en el repuesto: ${productName}. ¿Podrían darme más información?`
    : "Hola, necesito asesoría sobre un repuesto.";

  const finalMessage = message || defaultMessage;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;

 return (
    // ANIMACIÓN: El botón ahora es un motion.a con una animación de pulso y hover
    <motion.a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-6 py-3 font-bold text-white bg-[#C8102E] rounded-lg shadow-lg"
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(200, 16, 46, 0.3)" }}
      whileTap={{ scale: 0.95 }}
      // Animación de pulso sutil para atraer la atención
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          repeatType: 'loop', 
          ease: 'easeInOut' 
      }}
    >
      <FaWhatsapp className="mr-3 h-6 w-6" />
      {buttonText}
    </motion.a>
  );
};


export default WhatsAppButton;