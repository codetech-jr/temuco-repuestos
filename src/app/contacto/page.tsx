// src/app/contacto/page.tsx
"use client"; // Necesario para las animaciones

import { BsTelephoneFill, BsClockFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok } from 'react-icons/fa';

// ANIMACIÓN: Importamos los componentes necesarios
import { motion } from 'framer-motion';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedList from '@/components/utils/AnimatedList';
import ContactForm from '@/components/forms/ContactForm'; // Asumimos que ContactForm es un Client Component
import ContactInfoItem from '@/components/ui/ContactInfoItem'; // Asumimos que ContactInfoItem es un Client Component

// La Metadata se puede manejar en un archivo layout.tsx si la página es cliente
// O mantenerla en page.tsx si no se usa "use client" a nivel de página
// En este caso, como estamos haciendo la página cliente, esto se gestionaría de otra forma.
// Pero para el ejemplo, dejaremos el código de la página funcional.

export default function ContactoPage() {
  const empresaNombre = "Temuco";
  const telefonoPrincipal = "+58412-3975545";
  const telefonoWhatsapp = "584123975545";
  const emailPrincipal = "Inversionestemuco784srl@gmail.com";
  const direccionPrincipal = "Calle 15-A Independencia, Charallave 1210, Miranda";
  const facebookLink = "https://www.facebook.com/temuco784ca";
  const instagramLink = "https://www.instagram.com/temuco784/";
  const tiktokLink = "https://www.tiktok.com/@inversionestemuco";
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.1847838747017!2d-66.8586553!3d10.2466761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2aef59534c0dd5%3A0x61f946104bc88acd!2sInv.%20Temuco%20784!5e0!3m2!1ses-419!2sve!4v1748643458572!5m2!1ses-419!2sve";

  return (
    <div className="bg-[#F7FAFC] py-12 md:py-16 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <FadeIn>
          <header className="text-center mb-10 md:mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-[#002A7F]">
              Ponte en Contacto
            </h1>
            <p className="mt-3 text-lg text-[#2D3748] max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos tus consultas, cotizaciones o visítanos en nuestra tienda.
            </p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* ANIMACIÓN: El formulario se desliza desde la izquierda */}
          <motion.div 
            className="bg-white p-6 md:p-10 rounded-xl shadow-xl order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <h2 className="text-2xl font-semibold text-[#002A7F] mb-6">
              Envíanos un Mensaje
            </h2>
            <ContactForm />
          </motion.div>

          {/* ANIMACIÓN: La información de contacto se desliza desde la derecha en cascada */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <AnimatedList className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#002A7F] mb-4">
                  Información de Contacto
                </h2>
                <ContactInfoItem icon={<MdLocationOn size={22} />} text={direccionPrincipal} />
              </div>
              <div><ContactInfoItem icon={<BsTelephoneFill size={20} />} text={telefonoPrincipal} href={`tel:${telefonoPrincipal.replace(/\s/g, '')}`} /></div>
              <div><ContactInfoItem icon={<FaWhatsapp size={22} />} text={`+${telefonoWhatsapp.substring(0,2)} ${telefonoWhatsapp.substring(2,5)} ${telefonoWhatsapp.substring(5)}`} href={`https://wa.me/${telefonoWhatsapp}?text=Hola%20${encodeURIComponent(empresaNombre)},%20tengo%20una%20consulta...`} /></div>
              <div><ContactInfoItem icon={<MdEmail size={22} />} text={emailPrincipal} href={`mailto:${emailPrincipal}`} /></div>
              <div className="pt-4">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-3">Horario de Atención</h3>
                <ContactInfoItem icon={<BsClockFill size={20} />} text={<>Lunes a Viernes: 7:30 - 17:30 hrs<br />Sábado: 7:30 - 16:30 hrs</>} />
              </div>
              <div className="pt-4">
                  <h3 className="text-xl font-semibold text-[#002A7F] mb-3">Síguenos</h3>
                  <div className="flex space-x-4">
                      <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#718096] hover:text-[#002A7F] transition-all duration-300 transform hover:scale-110"><FaFacebookF size={28} /></a>
                      <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#718096] hover:text-[#002A7F] transition-all duration-300 transform hover:scale-110"><FaInstagram size={28} /></a>
                      <a href={tiktokLink} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[#718096] hover:text-[#002A7F] transition-all duration-300 transform hover:scale-110"><FaTiktok size={28} /></a>
                  </div>
              </div>
            </AnimatedList>
          </motion.div>
        </div>

        <FadeIn delay={0.4}>
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#002A7F] mb-6 text-center">
              Nuestra Ubicación
            </h2>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl bg-[#EBF4FF] md:h-[450px] h-[300px]">
              <iframe src={googleMapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa de ubicación de ${empresaNombre}`}></iframe>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}