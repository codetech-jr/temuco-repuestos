// app/politica-de-cookies/page.tsx

"use client";

import React from 'react';
import { motion, type Variants } from 'framer-motion';
import Link from 'next/link';

// Aunque este componente es 'use client', podemos definir metadatos
// estáticos. Next.js se encargará de esto en el servidor.
// (Nota: esto no es una práctica oficial, pero funciona en muchos casos.
// Para SEO robusto, es mejor no usar 'use client' si no es estrictamente necesario,
// pero para esta página de contenido con animaciones, es un buen compromiso.)
/*
export const metadata: Metadata = {
  title: 'Política de Cookies - Temuco Repuestos y Servicios',
  description: 'Conoce cómo utilizamos las cookies en nuestro sitio web para mejorar tu experiencia.',
};
*/

export default function PoliticaDeCookiesPage() {
  // --- Personaliza tus datos aquí ---
  const companyName = "Temuco Repuestos y Servicios";
  const lastUpdatedDate = "17 de Octubre, 2023"; // Cambia esta fecha
  const contactEmail = "Inversionestemuco784srl@gmail.com "; // Cambia este email

  // --- Animaciones de Framer Motion ---
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 sm:py-16">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg">
        {/* Usamos la clase 'prose' de Tailwind Typography para un formateo automático y limpio */}
        <article className="prose prose-lg mx-auto py-12 sm:py-16">
          
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-center">
              Política de Cookies
            </h1>
            <p className="text-sm text-center text-gray-500 !mt-2">
              Última actualización: {lastUpdatedDate}
            </p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10"
          >
            <motion.p variants={itemVariants}>
              En <strong>{companyName}</strong>, utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web, analizar nuestro tráfico y para fines de personalización y medición. Esta política explica qué son las cookies, qué tipos de cookies utilizamos, cómo las usamos y cómo puedes gestionarlas.
            </motion.p>
            
            <motion.div variants={itemVariants}>
              <h2>1. ¿Qué son las cookies?</h2>
              <p>
                Una cookie es un pequeño archivo de texto que un sitio web guarda en tu ordenador o dispositivo móvil cuando lo visitas. Este archivo permite que el sitio web recuerde tus acciones y preferencias (como el consentimiento) durante un período de tiempo, para que no tengas que volver a introducirlas cada vez que regreses al sitio.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2>2. ¿Qué tipo de cookies utilizamos?</h2>
              <p>Clasificamos nuestras cookies en las siguientes categorías:</p>
              
              <h4>a) Cookies Técnicas o Estrictamente Necesarias</h4>
              <p>
                Son esenciales para el funcionamiento del sitio web. Permiten la navegación y el uso de funciones básicas. Sin estas cookies, el sitio no podría funcionar correctamente.
              </p>
              <ul>
                <li><strong>cookie_consent:</strong> Almacena tu preferencia sobre el consentimiento de cookies durante un año.</li>
              </ul>

              <h4>b) Cookies de Análisis o Medición</h4>
              <p>
                Nos permiten reconocer y contar el número de visitantes y ver cómo se mueven por nuestro sitio. Esto nos ayuda a mejorar su funcionamiento. La información recopilada es agregada y anónima.
              </p>
              <ul>
                  <li>
                    <strong>Microsoft Clarity (_clck, _clsk, etc.):</strong> Usamos Microsoft Clarity para capturar cómo usas e interactúas con nuestro sitio web a través de mapas de calor y repetición de sesiones para mejorar nuestros servicios. Para más información, visita la <a href="https://privacy.microsoft.com/es-es/privacystatement" target="_blank" rel="noopener noreferrer">Declaración de privacidad de Microsoft</a>.
                  </li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2>3. Cómo gestionar tus cookies</h2>
              <p>
                Puedes controlar y/o eliminar las cookies como desees. La mayoría de los navegadores te permiten configurar tus preferencias para bloquearlas. Sin embargo, si lo haces, es posible que algunas funciones de este sitio no operen correctamente.
              </p>
              <p>
                A continuación, te proporcionamos enlaces a las guías de los principales navegadores:
              </p>
              <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2>4. Cambios en la Política de Cookies</h2>
                <p>
                    Podemos actualizar nuestra Política de Cookies de vez en cuando. Te notificaremos de cualquier cambio publicando la nueva política en esta página. Te recomendamos revisarla periódicamente.
                </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2>5. Contacto</h2>
              <p>
                Si tienes alguna pregunta sobre esta Política de Cookies, no dudes en contactarnos a través de nuestro <Link href="/contacto">formulario de contacto</Link> o directamente a nuestro correo electrónico: <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            </motion.div>

          </motion.div>
        </article>
      </main>
    </div>
  );
}