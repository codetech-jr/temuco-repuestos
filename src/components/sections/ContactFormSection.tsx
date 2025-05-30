"use client";

// src/components/sections/ContactFormSection.tsx
import ContactInfoItem from '@/components/ui/ContactInfoItem';
import ContactForm from '@/components/forms/ContactForm';

// Importa los íconos de react-icons
import { BsTelephoneFill, BsClockFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactFormSection = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50"> {/* Fondo claro */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          {/* Columna Izquierda: Información de Contacto */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">
                ¿Necesita ayuda con su electrodoméstico?
              </h2>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                Contáctenos hoy mismo y uno de nuestros técnicos especializados le atenderá a la brevedad.
              </p>
            </div>

            <ContactInfoItem
              icon={<BsTelephoneFill size={20} />}
              // label="Teléfono"
              text="+56 45 2123456"
              href="tel:+56452123456"
              className="text-lg"
            />
            <ContactInfoItem
              icon={<MdEmail size={20} />}
              // label="Correo Electrónico"
              text="contacto@refrigeraciontemuco.cl"
              href="mailto:contacto@refrigeraciontemuco.cl"
              className="text-lg"
            />
            <ContactInfoItem
              icon={<MdLocationOn size={20} />}
              // label="Dirección"
              text={
                <>
                  Av. Alemania 0123, <br />
                  Temuco, Chile
                </>
              }
              // href="https_maps_google_com_..." // Puedes añadir un enlace a Google Maps
              className="text-lg"
            />
             {/* Opcional: Horarios */}
             <div className="pt-4">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Horario de Atención</h3>
                <ContactInfoItem
                icon={<BsClockFill size={20} />}
                text={
                    <>
                    Lunes a Viernes: 9:00 - 18:30 hrs
                    <br />
                    Sábado: 9:00 - 14:00 hrs
                    </>
                }
                className="text-base"
                />
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-6 text-center">
              Solicite una Cotización
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFormSection;