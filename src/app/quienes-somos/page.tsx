"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import FadeIn from '@/components/utils/FadeIn';
import AnimatedList from '@/components/utils/AnimatedList';

import 'swiper/css';
import 'swiper/css/effect-fade';

const nuestraHistoria = `
  Fundada en el año 2000, Temuco nació con la visión de ofrecer soluciones integrales y de calidad para las necesidades de refrigeración y electrodomésticos en la región de Los Valles del Tuy.
  Comenzamos como un pequeño taller familiar, y gracias a la confianza de nuestros clientes y nuestro compromiso con la excelencia, hemos crecido hasta convertirnos en un referente local.
  A lo largo de los años, hemos adaptado nuestros servicios y ampliado nuestro catálogo de repuestos para mantenernos a la vanguardia de la tecnología y las demandas del mercado.
`;

const mision = `
  Nuestra misión es proporcionar a nuestros clientes productos y servicios de la más alta calidad
  en el ámbito de la refrigeración y los electrodomésticos, ofreciendo soluciones eficientes,
  confiables y accesibles, respaldadas por un equipo técnico experto y un servicio al cliente excepcional.
`;

const vision = `
  Ser la empresa líder y de mayor confianza en Temuco y la región en la provisión de repuestos,
  servicio técnico y venta de electrodomésticos, reconocida por nuestra innovación,
  compromiso con el cliente y contribución al bienestar de la comunidad.
`;

const valores = [
  { nombre: "Calidad", descripcion: "Nos esforzamos por ofrecer productos y servicios que cumplan con los más altos estándares." },
  { nombre: "Confianza", descripcion: "Construimos relaciones duraderas basadas en la honestidad y la transparencia." },
  { nombre: "Compromiso", descripcion: "Estamos dedicados a la satisfacción de nuestros clientes y a la solución de sus necesidades." },
  { nombre: "Innovación", descripcion: "Buscamos constantemente nuevas formas de mejorar y ofrecer lo último en tecnología." },
  { nombre: "Servicio al Cliente", descripcion: "Nuestros clientes son nuestra prioridad, y nos dedicamos a brindarles la mejor atención." },
];

const equipo = [
  {
    nombre: "Juan Pérez",
    rol: "Fundador y Técnico Principal",
    bio: "Con más de 20 años de experiencia en refrigeración, Juan lidera nuestro equipo técnico con pasión y conocimiento.",
    imageUrl: "/images/placeholder/avatar-male.png"
  },
  {
    nombre: "María González",
    rol: "Atención al Cliente y Ventas",
    bio: "María se encarga de que cada cliente reciba la mejor asesoría y encuentre lo que necesita.",
    imageUrl: "/images/placeholder/avatar-female.png"
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
              <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={true}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false }}
                  className="w-full h-full"
                >
                  {carruselImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        objectFit="cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
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
                    <Image src={miembro.imageUrl} alt={miembro.nombre} fill objectFit="cover" priority/>
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