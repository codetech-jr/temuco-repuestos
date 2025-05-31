// src/components/sections/ContactFormSection.tsx
"use client";

import ContactInfoItem from '@/components/ui/ContactInfoItem';
import ContactForm from '@/components/forms/ContactForm';

import { BsTelephoneFill, BsClockFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactFormSection = () => {
  return (
    // Fondo de sección: Muy claro, casi blanco azulado
    <section className="py-12 md:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Columna Izquierda: Información de Contacto */}
          <div className="space-y-8">
            <div>
              {/* Título principal: Azul oscuro principal */}
              <h2 className="text-2xl md:text-3xl font-semibold text-[#002A7F] mb-2">
                ¿Necesita ayuda con su electrodoméstico?
              </h2>
              {/* Párrafo descriptivo: Gris oscuro azulado */}
              <p className="text-[#2D3748] text-base md:text-lg leading-relaxed">
                Contáctenos hoy mismo y uno de nuestros técnicos especializados le atenderá a la brevedad.
              </p>
            </div>

            {/* ContactInfoItem: Íconos con azul oscuro principal, texto con gris oscuro azulado */}
            {/* El estilo del icono y texto se definiría mejor dentro de ContactInfoItem */}
            {/* Aquí asumimos que ContactInfoItem usa clases que podemos sobreescribir o que
                internamente ya permite pasar colores para ícono y texto. */}
            <ContactInfoItem
              icon={<BsTelephoneFill size={20} className="text-[#002A7F]" />} // Color de ícono
              text="+58412-3975545"
              href="+58412-3975545"
              className="text-lg text-[#2D3748] hover:text-[#002266]" // Color de texto y hover
            />
            <ContactInfoItem
              icon={<MdEmail size={20} className="text-[#002A7F]" />}
              text="contacto@refrigeraciontemuco.cl"
              href="mailto:contacto@refrigeraciontemuco.cl"
              className="text-lg text-[#2D3748] hover:text-[#002266]"
            />
            <ContactInfoItem
              icon={<MdLocationOn size={20} className="text-[#002A7F]" />}
              text={
                <>
                  Calle 15-A Independencia, <br />
                  Charallave 1210, Miranda
                </>
              }
              className="text-lg text-[#2D3748]" // Sin hover si no es un enlace
            />
            <div className="pt-4">
                {/* Título "Horario de Atención": Azul oscuro principal */}
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
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          {/* Fondo del contenedor del formulario: Blanco para un ligero contraste con el fondo de sección */}
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
            {/* Título del formulario: Azul oscuro principal */}
            <h3 className="text-xl md:text-2xl font-semibold text-[#002A7F] mb-6 text-center">
              Solicite una Cotización
            </h3>
            {/* ContactForm deberá ser estilizado internamente con la paleta:
                - Labels: text-[#2D3748]
                - Inputs: border-[#718096] o border-[#EBF4FF], focus:ring-[#002A7F]
                - Botón Enviar: bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC]
            */}
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;