"use client";

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedList from '@/components/utils/AnimatedList';

const QuienesSomosCarousel = dynamic(
  () => import('@/components/sections/QuienesSomosCarousel'),
  { 
    ssr: false,
    loading: () => <div className="h-64 md:h-80 lg:h-96 rounded-lg bg-gray-200 animate-pulse"></div>
  }
);

const nuestraHistoria = `
  Temuco nace como un pequeño establecimiento 
comercial (del tamaño de un garaje pequeño) donde se realizaba servicio técnico 
de Ventiladores, Planchas, Secadores de Cabello, Cafeteras y se vendían 
Repuestos Básicos de los mismos como también de cocinas y algunos de 
Lavadora, se sitúa en la ciudad de Charallave en el año 1998 Actividad Económica 
Registrada por Los Hermanos Gaviola Renato y Gaviola Américo, Su nombre 
proviene de la ciudad natal del Principal Fundador de la actividad comercial 
relacionada a estos tipos de productos que además se distribuían a nivel nacional 
a baja escala en ciudades como Valencia, Caracas, Barquisimeto, Maracay, Cuá y 
Ocumare por los años 1986 el señor Javier Gaviola padre de los hermanos Gaviola, 
persona que inspiro he inspira actualmente a la Marca y su vocación a la 
excelencia, competitividad y compromiso.
`;

const mision = `
  Nuestra misión es proporcionar a nuestros clientes productos y servicios de la más alta calidad
  en el ámbito de la refrigeración y los electrodomésticos, ofreciendo soluciones eficientes,
  confiables y accesibles, respaldadas por un equipo técnico experto y un servicio al cliente excepcional.
`;

const vision = `
  Ser la empresa líder y de mayor confianza en Charallave y la región en la provisión de repuestos,
  servicio técnico y venta de electrodomésticos, reconocida por nuestra innovación,
  compromiso con el cliente y contribución al bienestar de la comunidad.
`;

const valores = [
  { nombre: "Empatía", descripcion: "Entendemos que detrás de cada llamada hay una persona buscando tranquilidad. Por eso, nuestro servicio es cercano y honesto, enfocado en resolver tu problema y ganar tu confianza." },
  { nombre: "Respeto", descripcion: "Más que palabras, nuestro respeto se demuestra con hechos. Respetamos tu confianza con diagnósticos honestos, tu hogar con un trabajo limpio y tu criterio, dándote siempre la información completa para que elijas lo mejor." },
  { nombre: "Ética Profesional", descripcion: "Nuestra ética es un compromiso de honestidad contigo. Te garantizamos diagnósticos certeros, precios justos y reparaciones de calidad. Jamás te venderemos algo innecesario, pues tu confianza es lo más importante para nosotros." },
  { nombre: "Servicio", descripcion: "Nuestra vocación de servicio significa que nos apasiona resolver tus problemas. Nos comprometemos a ir más allá para asegurar tu completa satisfacción, restaurando no solo tus aparatos, sino también tu paz mental." },
];

const equipo = [
  {
    nombre: "Michel Gaviola",
    rol: "Gerente de Operaciones",
    bio: "Como Gerente de Operaciones, Michel Gaviola lidera nuestro equipo técnico y de ventas para ofrecer soluciones rápidas, eficientes y de la más alta calidad en cada servicio.",
    imageUrl: "/img/team/team5.jpg"
  },
  {
    nombre: "Víctor Guzmán",
    rol: "Encargado de H2O",
    bio: "Victor Guzmán es el encargado de H2O, garantiza agua mineral de máxima calidad, destacando por su inigualable atención personalizada y su profundo compromiso con la comunidad.",
    imageUrl: "/img/team/team3.jpg"
  },
  {
    nombre: "Victoria Chávez",
    rol: "Supervisora de inventario y compras",
    bio: "Victoria Chávez es una experta Supervisora de Inventario y Compras, reconocida por su liderazgo en la optimización de stock y su habilidad para negociar estratégicamente con proveedores.",
    imageUrl: "/img/team/team1.jpg"
  },
  {
    nombre: "Vicgleidy Farrera",
    rol: "Supervisora General de Ventas",
    bio: "Vicgleidy Farrera es una apasionada Supervisora General de Ventas, experta en liderar y motivar equipos para superar metas mediante estrategias comerciales innovadoras y un fuerte enfoque en el cliente.",
    imageUrl: "/img/team/team2.jpg"
  },
  {
    nombre: "José Ramon",
    rol: "Servicio Técnico",
    bio: "José Ramón es nuestro experto en bombas de agua. Con gran precisión, se encarga de la instalación, reparación y mantenimiento para asegurar que su sistema funcione de manera óptima y fiable.",
    imageUrl: "/img/team/team4.jpg"
  },
  {
    nombre: "Aranxa Perroni",
    rol: "Asesora de ventas",
    bio: "María se encarga de que cada cliente reciba la mejor asesoría y encuentre lo que necesita.",
    imageUrl: "/img/team/team6.jpg"
  },
  {
    nombre: "Marian Meléndez",
    rol: "Auditora general",
    bio: "María se encarga de que cada cliente reciba la mejor asesoría y encuentre lo que necesita.",
    imageUrl: "/img/team/team7.jpg"
  },
  {
    nombre: "Anamindy Griman",
    rol: "subgerente de Operaciones",
    bio: "María se encarga de que cada cliente reciba la mejor asesoría y encuentre lo que necesita.",
    imageUrl: "/img/team/team8.jpg"
  }
];

const carruselImages = [
  { src: "/img/team/team-1.jpg", alt: "Logo Temuco Repuestos" },
  { src: "/img/team/team-2.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-3.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-4.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-5.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-6.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-8.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
  { src: "/img/team/team-9.jpg", alt: "Equipo de Temuco Repuestos trabajando" },
];

export default function QuienesSomosPage() {
  return (
    <div className="bg-[#F7FAFC] py-12 md:py-16">
      <div className="container mx-auto px-4">
        <FadeIn>
          <header className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#002A7F] tracking-tight">
              Conoce a <span className="text-[#C8102E]">Temuco</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#2D3748] max-w-3xl mx-auto">
              Más que una tienda de repuestos, somos tu socio confiable para todas tus necesidades de refrigeración y electrodomésticos.
            </p>
          </header>
        </FadeIn>

        <section className="mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <h2 className="text-3xl font-semibold text-[#002A7F] mb-4">Nuestra Trayectoria</h2>
              <div className="prose prose-lg text-[#2D3748] max-w-none prose-p:text-[#2D3748]">
                {nuestraHistoria.trim().split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph.split('\n').map((line, lIndex) => <span key={lIndex}>{line.trim()}<br/></span>)}
                    </p>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}>
              <QuienesSomosCarousel images={carruselImages} />
            </motion.div>
          </div>
        </section>

        <FadeIn>
          <section className="mb-12 md:mb-16 bg-white p-8 md:p-12 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <h2 className="text-3xl font-semibold text-[#002A7F] mb-4">Nuestra Misión</h2>
                <p className="text-[#2D3748] leading-relaxed">{mision.trim()}</p>
              </div>
              <div>
                <h2 className="text-3xl font-semibold text-[#002A7F] mb-4">Nuestra Visión</h2>
                <p className="text-[#2D3748] leading-relaxed">{vision.trim()}</p>
              </div>
            </div>
          </section>
        </FadeIn>

        <section className="mb-12 md:mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold text-[#002A7F] mb-8 text-center">Nuestros Valores Fundamentales</h2>
          </FadeIn>
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((valor) => (
              <div key={valor.nombre} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <h3 className="text-xl font-semibold text-[#002A7F] mb-2">{valor.nombre}</h3>
                <p className="text-[#718096] text-sm">{valor.descripcion}</p>
              </div>
            ))}
          </AnimatedList>
        </section>
        
        <section className="mb-12 md:mb-16">
          <FadeIn>
            <h2 className="text-3xl font-semibold text-[#002A7F] mb-8 text-center">Conoce a Nuestro Equipo</h2>
          </FadeIn>
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 justify-items-center">
            {equipo.map((miembro) => (
              <div key={miembro.nombre} className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full flex flex-col items-center transform transition-transform duration-300 hover:scale-105">
                {miembro.imageUrl && (
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 shadow-md">
                    <Image src={miembro.imageUrl || '/images/placeholder/avatar-male.png'} alt={miembro.nombre} fill objectFit="cover" priority/>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-[#002A7F] mb-1">{miembro.nombre}</h3>
                <p className="text-sm text-[#718096] font-medium mb-2">{miembro.rol}</p>
                <p className="text-[#2D3748] text-xs leading-relaxed">{miembro.bio}</p>
              </div>
            ))}
          </AnimatedList>
        </section>
        
        <FadeIn>
          <section className="text-center py-10">
            <p className="text-xl text-[#2D3748] mb-6">
              ¿Listo para experimentar la diferencia de Temuco?
            </p>
            <Link href="/contacto" legacyBehavior>
              <a className="inline-block bg-[#C8102E] hover:bg-[#002266] text-[#F7FAFC] font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg">
                Contáctanos Hoy
              </a>
            </Link>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}