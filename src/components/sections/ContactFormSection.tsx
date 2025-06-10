// src/components/sections/ContactFormSection.tsx
"use client";

import ContactInfoItem from '@/components/ui/ContactInfoItem';
import ContactForm from '@/components/forms/ContactForm';
// ANIMACIÓN: Importamos motion
import { motion } from 'framer-motion';

import { BsTelephoneFill, BsClockFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactFormSection = () => {

  // ANIMACIÓN: Variantes para la columna de la izquierda y sus ítems
  const leftColumnVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 100,
      },
    },
  };

  return (
    // ANIMACIÓN: La sección aparece suavemente
    <motion.section 
      className="py-12 md:py-16 bg-[#F7FAFC]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* Columna Izquierda: Animada en cascada */}
          <motion.div 
            className="space-y-8"
            variants={leftColumnVariants}
          >
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#002A7F] mb-2">
                ¿Necesita ayuda con su electrodoméstico?
              </h2>
              <p className="text-[#2D3748] text-base md:text-lg leading-relaxed">
                Contáctenos hoy mismo y uno de nuestros técnicos especializados le atenderá a la brevedad.
              </p>
            </motion.div>

            {/* Cada ContactInfoItem ahora está envuelto en un motion.div para la cascada */}
            <motion.div variants={itemVariants}>
              <ContactInfoItem
                icon={<BsTelephoneFill size={20} className="text-[#002A7F]" />}
                text="+58412-3975545"
                href="+58412-3975545"
                className="text-lg text-[#2D3748] hover:text-[#002266]"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ContactInfoItem
                icon={<MdEmail size={20} className="text-[#002A7F]" />}
                text="contacto@refrigeraciontemuco.cl"
                href="mailto:contacto@refrigeraciontemuco.cl"
                className="text-lg text-[#2D3748] hover:text-[#002266]"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <ContactInfoItem
                icon={<MdLocationOn size={20} className="text-[#002A7F]" />}
                text={
                  <>
                    Calle 15-A Independencia, <br />
                    Charallave 1210, Miranda
                  </>
                }
                className="text-lg text-[#2D3748]"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="pt-4">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-3">Horario de Atención</h3>
                <ContactInfoItem
                  icon={<BsClockFill size={20} className="text-[#002A7F]" />}
                  text={
                      <>
                      Lunes a Viernes: 8:00 - 17:30 hrs
                      <br />
                      Sábado: 8:00 - 16:30 hrs
                      </>
                  }
                  className="text-base text-[#2D3748]"
                />
            </motion.div>
          </motion.div>

          {/* Columna Derecha: El formulario aparece después de la columna izquierda */}
          <motion.div 
            className="bg-white p-6 md:p-10 rounded-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-[#002A7F] mb-6 text-center">
              Solicite una Cotización
            </h3>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactFormSection;