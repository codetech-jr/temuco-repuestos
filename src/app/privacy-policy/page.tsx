// app/privacy-policy/page.tsx
import React from 'react';
import Link from 'next/link'; // Si necesitas enlaces internos

// Componente para resaltar los placeholders que necesitas rellenar
const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <span>
    {children}
  </span>
);

export default function PrivacyPolicyPage() {
  const companyName = "Temuco";
  const websiteUrl = "Temuco784.com"; // Make sure this is a full URL like "https://Temuco784.com" for the href
  const lastUpdatedDate = "2025";
  const contactEmail = "contacto@refrigeraciontemuco.cl";
  const companyAddress = "1210";
  const companyPhone = "+58 412-3975545";
  const minorAge = "18 años";

  // Ensure websiteUrl is a full URL for the link
  const fullWebsiteUrl = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;

  return (
    // Changed overall page background
    <div className="bg-brand-page-bg min-h-screen py-8 sm:py-12">
      {/* Changed main content area background and shadow */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-brand-content-bg shadow-xl rounded-lg">
        {/* Removed prose-blue, as colors are now handled by tailwind.config.js typography settings */}
        <article className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl mx-auto py-8 sm:py-12">
          {/* 
            Tailwind typography plugin (@tailwindcss/typography) is styling this content.
            Colors are now primarily defined in `tailwind.config.js` under `theme.extend.typography`.
          */}
          
          {/* H1 color will be taken from prose config (brand-accent-red) */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Política de Privacidad de <Placeholder>{companyName}</Placeholder>
          </h1>
          {/* Secondary text color will be taken from prose config (brand-text-secondary for --tw-prose-lead, or default body) */}
          <p className="text-sm mb-8 text-center text-brand-text-secondary"> {/* Explicitly set for this specific "last updated" */}
            Última actualización: <Placeholder>{lastUpdatedDate}</Placeholder>
          </p>

          <p>
            Bienvenido/a a <Placeholder>{companyName}</Placeholder> (en adelante, &quot;nosotros&quot;, &quot;nuestro&quot; o &quot;la Empresa&quot;).
            Nos comprometemos a proteger la privacidad de nuestros usuarios y clientes. Esta Política de Privacidad
            explica cómo recopilamos, usamos, compartimos y protegemos su información personal cuando visita nuestro
            catálogo en línea <a href={fullWebsiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline"><Placeholder>{websiteUrl}</Placeholder></a> (en adelante, el &quot;Sitio&quot;) y
            cuando solicita información sobre nuestros productos (repuestos, electrodomésticos) o servicios técnicos.
          </p>
          <p>
            Al utilizar nuestro Sitio, usted acepta las prácticas descritas en esta Política de Privacidad.
            Si no está de acuerdo con los términos de esta política, por favor, no utilice el Sitio.
          </p>

          {/* Headings (h2, h3) and paragraph text color will be taken from prose config */}
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Información que Recopilamos</h2>
          <p>Podemos recopilar diferentes tipos de información personal sobre usted, incluyendo:</p>
          <h3 className="text-xl font-medium mt-4 mb-2">Información de Identificación Personal:</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Nombre y apellidos.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Número de teléfono.</li>
            <li>Dirección postal (si es relevante para consultas de servicio técnico o envío de información).</li>
            <li>Información sobre el electrodoméstico o repuesto por el que consulta (marca, modelo, descripción del problema, etc.).</li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Información de Uso del Sitio Web (Recopilada Automáticamente):</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Dirección IP.</li>
            <li>Tipo de navegador y sistema operativo.</li>
            <li>Páginas visitadas en nuestro Sitio y tiempo de permanencia.</li>
            <li>Enlaces en los que hace clic.</li>
            <li>Sitio web de referencia (si llegó a nuestro Sitio desde otro enlace).</li>
            <li>Información recopilada a través de cookies y tecnologías similares (ver sección &quot;Cookies&quot;).</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Cómo Recopilamos su Información</h2>
          <p>Recopilamos información de las siguientes maneras:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>
              <strong>Directamente de usted:</strong> Cuando nos la proporciona voluntariamente a través de formularios de contacto,
              solicitudes de cotización, consultas por correo electrónico, llamadas telefónicas o cualquier otra comunicación directa.
            </li>
            <li>
              <strong>Automáticamente:</strong> Cuando navega por nuestro Sitio, podemos recopilar cierta información automáticamente
              utilizando cookies y otras tecnologías de seguimiento.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Uso de su Información</h2>
          <p>Utilizamos la información que recopilamos para los siguientes propósitos:</p>
          <h3 className="text-xl font-medium mt-4 mb-2">Proporcionar y gestionar nuestros servicios:</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Responder a sus consultas sobre productos y servicios.</li>
            <li>Proporcionar cotizaciones para repuestos, electrodomésticos o servicios técnicos.</li>
            <li>Coordinar y programar visitas de servicio técnico (si aplica).</li>
            <li>Comunicarnos con usted sobre sus solicitudes o consultas.</li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Mejorar nuestro Sitio y servicios:</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Entender cómo los usuarios utilizan nuestro Sitio para mejorar su diseño y funcionalidad.</li>
            <li>Analizar tendencias y realizar investigaciones de mercado internas.</li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Comunicaciones (con su consentimiento, si es necesario):</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Enviarle información sobre nuevos productos, servicios u ofertas especiales que puedan ser de su interés (solo si ha optado por recibir dichas comunicaciones).</li>
          </ul>
          <h3 className="text-xl font-medium mt-4 mb-2">Cumplimiento legal y protección:</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Cumplir con nuestras obligaciones legales y regulatorias.</li>
            <li>Proteger nuestros derechos, propiedad o seguridad, y los de nuestros usuarios u otros.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cómo Compartimos su Información</h2>
          <p>
            No vendemos, alquilamos ni comercializamos su información personal a terceros con fines de marketing.
            Podemos compartir su información personal en las siguientes circunstancias:
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>
              <strong>Proveedores de Servicios:</strong> Podemos compartir su información con terceros proveedores de servicios que nos
              ayudan a operar nuestro Sitio, realizar nuestro negocio o prestarle servicios (por ejemplo, proveedores de hosting web,
              servicios de análisis, <Placeholder>[si aplica, empresas de logística...]</Placeholder>, <Placeholder>[si aplica, técnicos subcontratados...]</Placeholder>). Estos proveedores solo
              tienen acceso a la información necesaria para realizar sus funciones y están obligados a protegerla.
            </li>
            <li>
              <strong>Requisitos Legales:</strong> Podemos divulgar su información si así lo exige la ley, una orden judicial o una
              solicitud gubernamental, o si creemos de buena fe que dicha acción es necesaria para proteger nuestros derechos,
              su seguridad o la seguridad de otros, o para investigar fraudes.
            </li>
            <li>
              <strong>Transferencias Comerciales:</strong> En caso de fusión, adquisición, reorganización, quiebra u otra venta de
              todos o una parte de nuestros activos, su información personal puede ser transferida como parte de esa transacción.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies y Tecnologías de Seguimiento</h2>
          <p>
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro Sitio, analizar el tráfico y
            comprender de dónde provienen nuestros visitantes. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.
          </p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del Sitio.</li>
            <li><strong>Cookies de Rendimiento/Análisis:</strong> Nos ayudan a entender cómo interactúan los visitantes con el Sitio, recopilando información de forma anónima.</li>
            <li><strong>Cookies de Funcionalidad:</strong> Permiten que el Sitio recuerde las elecciones que realiza (como su nombre de usuario, idioma o región) y proporcionan características mejoradas y más personales.</li>
          </ul>
          <p>
            Usted puede controlar y/o eliminar las cookies como desee. Para más detalles, consulte <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="hover:underline">aboutcookies.org</a>.
            Puede eliminar todas las cookies que ya están en su ordenador y puede configurar la mayoría de los navegadores para
            evitar que se coloquen. Sin embargo, si hace esto, es posible que tenga que ajustar manualmente algunas preferencias
            cada vez que visite un sitio y que algunos servicios y funcionalidades no funcionen.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Seguridad de su Información</h2>
          <p>
            Hemos implementado medidas de seguridad técnicas y organizativas razonables para proteger su información personal
            contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Sin embargo, ningún método de
            transmisión por Internet o de almacenamiento electrónico es 100% seguro. Por lo tanto, aunque nos esforzamos por
            utilizar medios comercialmente aceptables para proteger su información personal, no podemos garantizar su seguridad absoluta.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Retención de Datos</h2>
          <p>
            Retendremos su información personal solo durante el tiempo que sea necesario para los fines establecidos en esta
            Política de Privacidad, a menos que la ley exija o permita un período de retención más largo (por ejemplo, para
            fines fiscales o legales). Cuando ya no necesitemos su información personal, la eliminaremos o anonimizaremos
            de forma segura.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Sus Derechos de Privacidad</h2>
          <p>Dependiendo de su jurisdicción, puede tener ciertos derechos con respecto a su información personal, tales como:</p>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li><strong>Derecho de Acceso:</strong> Solicitar una copia de la información personal que tenemos sobre usted.</li>
            <li><strong>Derecho de Rectificación:</strong> Solicitar la corrección de cualquier información personal inexacta o incompleta.</li>
            <li><strong>Derecho de Supresión (Derecho al Olvido):</strong> Solicitar la eliminación de su información personal, sujeto a ciertas excepciones.</li>
            <li><strong>Derecho a Restringir el Procesamiento:</strong> Solicitar la limitación del procesamiento de su información personal.</li>
            <li><strong>Derecho a la Portabilidad de los Datos:</strong> Solicitar recibir su información personal en un formato estructurado, de uso común y legible por máquina, y transmitirla a otro controlador.</li>
            <li><strong>Derecho de Oposición:</strong> Oponerse al procesamiento de su información personal en determinadas circunstancias (por ejemplo, para marketing directo).</li>
            <li><strong>Derecho a Retirar el Consentimiento:</strong> Si el procesamiento de su información personal se basa en su consentimiento, tiene derecho a retirar dicho consentimiento en cualquier momento.</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, por favor contáctenos utilizando la información proporcionada en la sección &quput;Contacto&quput;.
            Es posible que necesitemos verificar su identidad antes de procesar su solicitud.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Privacidad de los Menores</h2>
          <p>
            Nuestro Sitio no está dirigido a personas menores de <Placeholder>{minorAge}</Placeholder>. No recopilamos intencionadamente
            información personal de menores. Si es padre o tutor y cree que su hijo nos ha proporcionado información personal,
            póngase en contacto con nosotros. Si descubrimos que hemos recopilado información personal de un menor sin el
            consentimiento paterno verificado, tomaremos medidas para eliminar esa información de nuestros servidores.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Enlaces a Otros Sitios Web</h2>
          <p>
            Nuestro Sitio puede contener enlaces a otros sitios web que no son operados por nosotros. Si hace clic en un enlace
            de un tercero, será dirigido al sitio de ese tercero. Le recomendamos encarecidamente que revise la Política de
            Privacidad de cada sitio que visite. No tenemos control ni asumimos responsabilidad alguna por el contenido, las
            políticas de privacidad o las prácticas de los sitios o servicios de terceros.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Cambios a esta Política de Privacidad</h2>
          <p>
            Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando
            la nueva Política de Privacidad en esta página y actualizando la fecha de &quot;Última actualización&quot; en la parte
            superior de esta política. Le recomendamos que revise esta Política de Privacidad periódicamente para cualquier
            cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contacto</h2>
          <p>Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad o nuestras prácticas de datos, por favor contáctenos en:</p>
          {/* Address links will also pick up prose styling */}
          <address className="not-italic mt-2 space-y-1">
            <p><strong><Placeholder>{companyName}</Placeholder></strong></p>
            {companyAddress && companyAddress !== "1210" && <p><Placeholder>{companyAddress}</Placeholder></p>}
            <p>Email: <a href={`mailto:${contactEmail}`} className="hover:underline"><Placeholder>{contactEmail}</Placeholder></a></p>
            {companyPhone && companyPhone !== "+58 412-3975545" && <p>Teléfono: <Placeholder>{companyPhone}</Placeholder></p>}
          </address>

        </article>
      </main>
    </div>
  );
}