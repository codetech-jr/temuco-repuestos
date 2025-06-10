"use client";

import React from 'react';

import { motion } from 'framer-motion';

const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span>{children}</span>
);

export default function PrivacyPolicyPage() {
  const companyName = "Temuco";
  const websiteUrl = "Temuco784.com";
  const lastUpdatedDate = "2025";
  const contactEmail = "contacto@refrigeraciontemuco.cl";
  const companyAddress = "Calle 15-A Independencia, Charallave 1210, Miranda";
  const companyPhone = "+58 412-3975545";
  const minorAge = "18 años";

  const fullWebsiteUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 sm:py-12">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg">
        <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto py-8 sm:py-12">
          
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">
              Política de Privacidad de <Placeholder>{companyName}</Placeholder>
            </h1>
            <p className="text-sm mb-8 text-center text-gray-500 dark:text-gray-400">
              Última actualización: <Placeholder>{lastUpdatedDate}</Placeholder>
            </p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
          >
            <motion.div variants={itemVariants}>
              <p>
                Bienvenido/a a <Placeholder>{companyName}</Placeholder> (en adelante, &quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Empresa&quot;).
                Nos comprometemos a proteger la privacidad de nuestros usuarios y clientes. Esta Política de Privacidad
                explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando visita nuestro
                catálogo en línea <a href={fullWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline"><Placeholder>{websiteUrl}</Placeholder></a> (en adelante, el &quot;Sitio&quot;) y
                cuando solicita información sobre nuestros productos (repuestos, electrodomésticos) o servicios técnicos.
              </p>
              <p>
                Al utilizar nuestro Sitio, usted acepta las prácticas descritas en esta Política de Privacidad.
                Si no está de acuerdo con los términos de esta política, por favor, no utilice el Sitio.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">1. Información que Recopilamos</h2>
              <p>Podemos recopilar diferentes tipos de información personal sobre usted, incluyendo:</p>
              <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Información de Identificación Personal:</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Nombre y apellidos.</li>
                <li>Dirección de correo electrónico.</li>
                <li>Número de teléfono.</li>
                <li>Dirección postal (si es relevante para consultas de servicio técnico o envío de información).</li>
                <li>Información sobre el electrodoméstico o repuesto por el que consulta (marca, modelo, descripción del problema, etc.).</li>
              </ul>
              <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Información de Uso del Sitio Web (Recopilada Automáticamente):</h3>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Dirección IP.</li>
                <li>Tipo de navegador y sistema operativo.</li>
                <li>Páginas visitadas en nuestro Sitio y tiempo de permanencia.</li>
                <li>Enlaces en los que hace clic.</li>
                <li>Sitio web de referencia (si llegó a nuestro Sitio desde otro enlace).</li>
                <li>Información recopilada a través de cookies y tecnologías similares (ver sección &quot;Cookies&quot;).</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">2. Cómo Recopilamos su Información</h2>
              <p>Recopilamos información de las siguientes maneras:</p>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li><strong>Directamente de usted:</strong> Cuando nos la proporciona voluntariamente a través de formularios de contacto, solicitudes de cotización, consultas por correo electrónico, llamadas telefónicas o cualquier otra comunicación directa.</li>
                <li><strong>Automáticamente:</strong> Cuando navega por nuestro Sitio, podemos recopilar cierta información automáticamente utilizando cookies y otras tecnologías de seguimiento.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">3. Uso de su Información</h2>
                <p>Utilizamos la información que recopilamos para los siguientes propósitos:</p>
                <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Proporcionar y gestionar nuestros servicios:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Responder a sus consultas sobre productos y servicios.</li>
                    <li>Proporcionar cotizaciones para repuestos, electrodomésticos o servicios técnicos.</li>
                    <li>Coordinar y programar visitas de servicio técnico (si aplica).</li>
                    <li>Comunicarnos con usted sobre sus solicitudes o consultas.</li>
                </ul>
                <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Mejorar nuestro Sitio y servicios:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Entender cómo los usuarios utilizan nuestro Sitio para mejorar su diseño y funcionalidad.</li>
                    <li>Analizar tendencias y realizar investigaciones de mercado internas.</li>
                </ul>
                <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Comunicaciones (con su consentimiento, si es necesario):</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Enviarle información sobre nuevos productos, servicios u ofertas especiales que puedan ser de su interés (solo si ha optado por recibir dichas comunicaciones).</li>
                </ul>
                <h3 className="text-xl font-medium mt-4 mb-2 text-gray-800 dark:text-white">Cumplimiento legal y protección:</h3>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Cumplir con nuestras obligaciones legales y regulatorias.</li>
                    <li>Proteger nuestros derechos, propiedad o seguridad, y los de nuestros usuarios u otros.</li>
                </ul>
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">4. Cómo Compartimos su Información</h2>
                <p>No vendemos, alquilamos ni comercializamos su información personal a terceros con fines de marketing. Podemos compartir su información personal en las siguientes circunstancias:</p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li><strong>Proveedores de Servicios:</strong> Podemos compartir su información con terceros proveedores de servicios que nos ayudan a operar nuestro Sitio, realizar nuestro negocio o prestarle servicios.</li>
                    <li><strong>Requisitos Legales:</strong> Podemos divulgar su información si así lo exige la ley, una orden judicial o una solicitud gubernamental.</li>
                    <li><strong>Transferencias Comerciales:</strong> En caso de fusión, adquisición, reorganización, quiebra u otra venta de todos o una parte de nuestros activos, su información personal puede ser transferida.</li>
                </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">5. Cookies y Tecnologías de Seguimiento</h2>
                <p>Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro Sitio, analizar el tráfico y comprender de dónde provienen nuestros visitantes.</p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del Sitio.</li>
                    <li><strong>Cookies de Rendimiento/Análisis:</strong> Nos ayudan a entender cómo interactúan los visitantes con el Sitio.</li>
                    <li><strong>Cookies de Funcionalidad:</strong> Permiten que el Sitio recuerde las elecciones que realiza.</li>
                </ul>
                <p>Usted puede controlar y/o eliminar las cookies como desee. Para más detalles, consulte <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">aboutcookies.org</a>.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">6. Seguridad de su Información</h2>
                <p>Hemos implementado medidas de seguridad técnicas y organizativas razonables para proteger su información personal. Sin embargo, ningún método es 100% seguro.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">7. Retención de Datos</h2>
                <p>Retendremos su información personal solo durante el tiempo que sea necesario para los fines establecidos en esta Política de Privacidad, a menos que la ley exija un período mayor.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">8. Sus Derechos de Privacidad</h2>
                <p>Dependiendo de su jurisdicción, puede tener ciertos derechos con respecto a su información personal, tales como:</p>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Derecho de Acceso, Rectificación, Supresión, Restricción del Procesamiento, Portabilidad y Oposición.</li>
                    <li>Derecho a Retirar el Consentimiento.</li>
                </ul>
                <p>Para ejercer cualquiera de estos derechos, por favor contáctenos.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">9. Privacidad de los Menores</h2>
                <p>Nuestro Sitio no está dirigido a personas menores de <Placeholder>{minorAge}</Placeholder>. No recopilamos intencionadamente información personal de menores.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">10. Enlaces a Otros Sitios Web</h2>
                <p>Nuestro Sitio puede contener enlaces a otros sitios web. No tenemos control ni asumimos responsabilidad por el contenido o las prácticas de privacidad de sitios de terceros.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">11. Cambios a esta Política de Privacidad</h2>
                <p>Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.</p>
            </motion.div>

            <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-white">12. Contacto</h2>
                <p>Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos en:</p>
                <address className="not-italic mt-2 space-y-1">
                    <p><strong><Placeholder>{companyName}</Placeholder></strong></p>
                    <p><Placeholder>{companyAddress}</Placeholder></p>
                    <p>Email: <a href={`mailto:${contactEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline"><Placeholder>{contactEmail}</Placeholder></a></p>
                    <p>Teléfono: <a href={`tel:${companyPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline"><Placeholder>{companyPhone}</Placeholder></a></p>
                </address>
            </motion.div>

          </motion.div>
        </article>
      </main>
    </div>
  );
}