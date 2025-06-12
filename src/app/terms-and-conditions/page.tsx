"use client";

import Head from 'next/head';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';

const TermsAndConditionsPage = () => {
  const companyName = "Temuco";
  const catalogUrl = "Temuco784.com";
  const lastUpdateDate = "2025";
  const companyAddress = "Calle 15-A Independencia, Charallave 1210, Miranda";
  const companyEmail = "contacto@refrigeraciontemuco.cl";
  const companyPhone = "+58 412-3975545";
  const companyTaxId = "[Número de Identificación Fiscal o Registro Mercantil]";
  const legalJurisdictionCity = "Charallave";
  const legalJurisdictionCountry = "Miranda, Venezuela";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <Head>
        <title>Términos y Condiciones - {companyName}</title>
        <meta name="description" content={`Términos y condiciones de uso del catálogo de ${companyName} para repuestos, electrodomésticos y servicio técnico.`} />
      </Head>

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-10">
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white text-center">
              Términos y Condiciones de Uso del Catálogo de {companyName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
              Fecha de última actualización: {lastUpdateDate}
            </p>
          </motion.header>

          <motion.section 
            className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <p>
                Bienvenido al catálogo en línea de {companyName} (en adelante, {`"la Empresa", "nosotros", "nuestro"`}).
                Por favor, lee atentamente los siguientes Términos y Condiciones antes de utilizar nuestro catálogo
                {catalogUrl ? ` disponible en ${catalogUrl}` : ' (físico/digital distribuido)'}.
              </p>
              <p>
                Al acceder y utilizar este catálogo, aceptas estar legalmente vinculado por estos Términos y Condiciones.
                Si no estás de acuerdo con alguno de estos términos, por favor, no utilices nuestro catálogo.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                1. Objeto del Catálogo
              </h2>
              <p>Este catálogo tiene como finalidad principal la exhibición y promoción de:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Repuestos para electrodomésticos.</li>
                <li>Electrodomésticos nuevos y/o reacondicionados (especificar según tu caso).</li>
                <li>Servicios de diagnóstico y reparación técnica para electrodomésticos.</li>
              </ul>
              <p className="mt-2">
                El catálogo es una herramienta informativa y no constituye una oferta de venta directa ni permite la
                realización de transacciones de compra en línea. Su propósito es permitir a los usuarios (en adelante,
                {`"el Usuario" o "usted"`}) conocer nuestros productos y servicios y facilitar la solicitud de cotizaciones
                o la programación de servicios.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                2. Uso del Catálogo
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>La información contenida en este catálogo es para uso personal e informativo.</li>
                <li>El Usuario se compromete a utilizar el catálogo de manera lícita y de acuerdo con estos Términos y Condiciones.</li>
                <li>No está permitido el uso del catálogo con fines fraudulentos, ilegales o que puedan dañar la imagen o los derechos de la Empresa o de terceros.</li>
                <li>Queda prohibida la reproducción, distribución o modificación total o parcial del contenido del catálogo sin autorización expresa y por escrito de la Empresa.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                3. Información de Productos y Servicios
              </h2>
              <p><strong className="font-semibold">Descripción:</strong> Hacemos nuestro mejor esfuerzo para que las descripciones, imágenes, especificaciones técnicas y precios (si se muestran) de los productos y servicios sean lo más precisos posible. Sin embargo, la información es de carácter orientativo y puede contener errores o estar sujeta a cambios sin previo aviso.</p>
              <p className="mt-2"><strong className="font-semibold">Disponibilidad:</strong> La inclusión de un producto o servicio en el catálogo no garantiza su disponibilidad inmediata. La disponibilidad será confirmada al momento de solicitar una cotización o servicio.</p>
              <p className="mt-2"><strong className="font-semibold">Precios:</strong> Los precios que puedan mostrarse en el catálogo son indicativos y están sujetos a confirmación al momento de la cotización. Los precios no incluyen IVA u otros impuestos aplicables, ni costes de envío o instalación, salvo que se indique expresamente lo contrario.</p>
              <p className="mt-2"><strong className="font-semibold">Imágenes:</strong> Las imágenes de los productos son ilustrativas y pueden diferir ligeramente del producto real.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                4. Proceso de Solicitud de Cotización y/o Servicio Técnico
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Para solicitar una cotización de repuestos, electrodomésticos o para agendar un servicio técnico, el Usuario deberá contactarnos a través de los canales indicados en el catálogo o en nuestra página web (teléfono, correo electrónico, formulario de contacto).</li>
                <li>Al solicitar una cotización o servicio, el Usuario deberá proporcionar información veraz y completa.</li>
                <li>La Empresa responderá a la solicitud con una cotización detallada (incluyendo precio final, condiciones de pago, tiempos estimado de entrega o ejecución del servicio) o con la información para la programación del servicio técnico.</li>
                <li>La cotización tendrá un periodo de validez especificado en la misma.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                5. Condiciones Específicas para Repuestos
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Es responsabilidad del Usuario asegurarse de la compatibilidad del repuesto solicitado con su electrodoméstico. Recomendamos proporcionar marca, modelo y número de serie del aparato para una correcta identificación.</li>
                <li>La Empresa podrá asesorar en la identificación del repuesto, pero la decisión final de compra y la verificación de compatibilidad recae en el Usuario, salvo que la instalación sea realizada por nuestro servicio técnico.</li>
                <li>Los repuestos cuentan con la garantía ofrecida por el fabricante, la cual será informada al momento de la cotización.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                6. Condiciones Específicas para Electrodomésticos
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Los electrodomésticos nuevos cuentan con la garantía del fabricante.</li>
                <li>Los electrodomésticos reacondicionados (si aplica) contarán con una garantía especificada por la Empresa al momento de la cotización.</li>
                <li>Los costos de instalación y transporte no están incluidos en el precio del electrodoméstico, salvo que se indique lo contrario en la cotización.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                7. Condiciones Específicas para el Servicio Técnico
              </h2>
              <p><strong className="font-semibold">Diagnóstico:</strong> Podrá existir un costo por el diagnóstico inicial del electrodoméstico, el cual será informado previamente. Este costo podría ser descontado del total de la reparación si esta es aprobada y realizada por nosotros.</p>
              <p className="mt-2"><strong className="font-semibold">Presupuesto:</strong> Tras el diagnóstico, se presentará un presupuesto detallado de la reparación. La reparación solo se llevará a cabo con la aprobación explícita del Usuario.</p>
              <p className="mt-2"><strong className="font-semibold">Garantía del Servicio:</strong> Las reparaciones realizadas por nuestro servicio técnico contarán con una garantía sobre la mano de obra y sobre los repuestos instalados por nosotros, cuyos términos y duración serán especificados en la orden de servicio o factura. Esta garantía no cubre fallas distintas a la reparada o daños causados por mal uso posterior a la reparación.</p>
              <p className="mt-2"><strong className="font-semibold">Acceso y Condiciones:</strong> El Usuario deberá garantizar el acceso seguro al electrodoméstico y un entorno adecuado para la realización del servicio técnico.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                8. Propiedad Intelectual
              </h2>
              <p>
                Todos los contenidos del catálogo, incluyendo, pero no limitado a, textos, gráficos, logos, iconos,
                imágenes, clips de audio y video, y software, son propiedad de {companyName} o de sus
                proveedores de contenido, y están protegidos por las leyes de propiedad intelectual aplicables.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                9. Limitación de Responsabilidad
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>La Empresa no se responsabiliza por la interpretación o mal uso de la información contenida en el catálogo.</li>
                <li>La Empresa no será responsable por daños directos o indirectos, consecuenciales, incidentales o especiales que surjan del uso o la imposibilidad de uso del catálogo o de la información contenida en él.</li>
                <li>En el caso de los servicios técnicos y venta de productos (una vez formalizada la transacción fuera del catálogo), la responsabilidad de la Empresa se limitará a lo establecido en las condiciones de garantía específicas del producto o servicio adquirido.</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                10. Privacidad de Datos
              </h2>
              <p>
                El tratamiento de los datos personales que el Usuario nos proporcione al solicitar cotizaciones o
                servicios se regirá por nuestra Política de Privacidad, la cual puede consultar en {' '}
                <Link href="/politica-de-privacidad" legacyBehavior>
                  <a className="text-blue-600 dark:text-blue-400 hover:underline">
                    nuestra Política de Privacidad
                  </a>
                </Link>.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                11. Modificaciones a los Términos y Condiciones
              </h2>
              <p>
                La Empresa se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
                Cualquier cambio será efectivo desde su publicación en nuestro sitio web o comunicación por otros medios.
                Es responsabilidad del Usuario revisar periódicamente estos términos. El uso continuado del catálogo
                después de cualquier modificación constituirá la aceptación de dichos cambios.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                12. Ley Aplicable y Jurisdicción
              </h2>
              <p>
                Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de {legalJurisdictionCountry}.
                Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva de
                los tribunales de {legalJurisdictionCity}.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                13. Contacto
              </h2>
              <p>
                Si tienes alguna pregunta o comentario sobre estos Términos y Condiciones, por favor contáctanos:
              </p>
              <address className="mt-2 not-italic space-y-1">
                <p><strong className="font-semibold">{companyName}</strong></p>
                <p>{companyAddress}</p>
                <p>
                  Correo Electrónico: {' '}
                  <a href={`mailto:${companyEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {companyEmail}
                  </a>
                </p>
                <p>
                  Teléfono: {' '}
                  <a href={`tel:${companyPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {companyPhone}
                  </a>
                </p>
                <p>{companyTaxId}</p>
              </address>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditionsPage;