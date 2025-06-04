// src/app/contacto/page.tsx
// import Link from 'next/link'; // No se usa directamente aquí
import ContactInfoItem from '@/components/ui/ContactInfoItem';
import ContactForm from '@/components/forms/ContactForm'; // Importa el formulario funcional

import { BsTelephoneFill, BsClockFill } from 'react-icons/bs';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok} from 'react-icons/fa';

// Metadata puede ser estática aquí si no depende de datos dinámicos
export const metadata = {
  title: 'Contacto - Temuco Repuestos',
  description: 'Ponte en contacto con Temuco Repuestos. Encuentra nuestra dirección, teléfono, email y envíanos tus consultas.',
};

export default function ContactoPage() {
  const empresaNombre = "Temuco";
  const telefonoPrincipal = "+58412-3975545";
  const telefonoWhatsapp = "584123975545";
  const emailPrincipal = "contacto@refrigeraciontemuco.cl";
  const direccionPrincipal = "Calle 15-A Independencia, Charallave 1210, Miranda";
  const facebookLink = "https://www.facebook.com/temuco784ca";
  const instagramLink = "https://www.instagram.com/temuco784/";
  const tiktokLink = "https://www.tiktok.com/@inversionestemuco";
  const googleMapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.1847838747017!2d-66.8586553!3d10.2466761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c2aef59534c0dd5%3A0x61f946104bc88acd!2sInv.%20Temuco%20784!5e0!3m2!1ses-419!2sve!4v1748643458572!5m2!1ses-419!2sve";

  return (
    <div className="bg-[#F7FAFC] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-[#002A7F]">
            Ponte en Contacto
          </h1>
          <p className="mt-3 text-lg text-[#2D3748] max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Envíanos tus consultas, cotizaciones o visítanos en nuestra tienda.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl order-2 lg:order-1">
            <h2 className="text-2xl font-semibold text-[#002A7F] mb-6">
              Envíanos un Mensaje
            </h2>
            <ContactForm /> {/* Aquí se usa el componente funcional */}
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            {/* ... tu información de contacto estática no cambia ... */}
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
              <ContactInfoItem icon={<BsClockFill size={20} />} text={<>Lunes a Viernes: 8:00 - 17:30 hrs<br />Sábado: 8:00 - 16:30 hrs</>} />
            </div>
            <div className="pt-4">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-3">Síguenos</h3>
                <div className="flex space-x-4">
                    <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#718096] hover:text-[#002A7F] transition-colors duration-300"><FaFacebookF size={28} /></a>
                    <a href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#718096] hover:text-[#002A7F] transition-colors duration-300"><FaInstagram size={28} /></a>
                    <a href={tiktokLink} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-[#718096] hover:text-[#002A7F] transition-colors duration-300"><FaTiktok size={28} /></a>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#002A7F] mb-6 text-center">
            Nuestra Ubicación
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl bg-[#EBF4FF] md:h-[450px] h-[300px]">
            <iframe src={googleMapsEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`Mapa de ubicación de ${empresaNombre}`}></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}