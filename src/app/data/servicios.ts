// src/data/servicios.ts
export interface ServicioDetalle {
  id: string;
  slug: string; // Para la URL, ej: "servicio-tecnico-electrodomesticos"
  title: string; // Título principal de la página del servicio
  shortDescription: string; // Usado en listados o resúmenes
  longDescription: string; // HTML o Markdown para el cuerpo principal
  imageUrl?: string; // Imagen destacada para la página del servicio
  iconName?: string; // Nombre del ícono (si quieres mostrar el mismo de la home)
  benefits?: string[]; // Lista de beneficios
  process?: { step: string; description: string }[]; // Pasos del proceso del servicio
  ctaText?: string; // Texto para el Call to Action
  ctaLink?: string; // Enlace del Call to Action (ej. a WhatsApp o formulario)
}

export const serviciosDetalleData: ServicioDetalle[] = [
  {
    id: 's001',
    slug: 'servicio-tecnico',
    title: 'Servicio Técnico Especializado',
    shortDescription: 'Reparación profesional de electrodomésticos y equipos de refrigeración.',
    longDescription: `
      <p>En Temuco Repuestos, ofrecemos un <strong>servicio técnico especializado</strong> para una amplia gama de electrodomésticos, incluyendo refrigeradores, lavadoras, secadoras, cocinas, hornos y más. Nuestros técnicos están altamente capacitados para diagnosticar y reparar fallas de manera eficiente, utilizando repuestos originales o de alta calidad para garantizar la durabilidad de la reparación.</p>
      <p>Entendemos la importancia de tus electrodomésticos en tu día a día, por eso nos esforzamos en ofrecer un servicio rápido y confiable.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">¿Por qué elegir nuestro servicio técnico?</h3>
    `, // Puedes usar HTML simple aquí. Para Markdown, necesitarías un parser.
    imageUrl: '/img/services/servicio-tecnico.jpg', // Necesitarás estas imágenes
    benefits: [
      "Diagnóstico preciso y rápido.",
      "Técnicos certificados y con experiencia.",
      "Uso de repuestos de calidad.",
      "Garantía en todas nuestras reparaciones.",
      "Atención personalizada y presupuesto transparente."
    ],
    process: [
      { step: "Contacto Inicial", description: "Nos contactas describiendo el problema de tu equipo." },
      { step: "Visita y Diagnóstico", description: "Agendamos una visita para que nuestro técnico evalúe el equipo." },
      { step: "Presupuesto", description: "Te entregamos un presupuesto detallado de la reparación." },
      { step: "Reparación", description: "Con tu aprobación, procedemos a reparar el equipo." },
      { step: "Pruebas y Entrega", description: "Verificamos el correcto funcionamiento y te entregamos el equipo reparado." }
    ],
    ctaText: "Solicitar Servicio Técnico",
    ctaLink: "/contacto?servicio=tecnico" // Podrías pre-rellenar el formulario de contacto
  },
  {
    id: 's002',
    slug: 'instalacion',
    title: 'Instalación Profesional de Equipos',
    shortDescription: 'Instalamos tus nuevos electrodomésticos y sistemas de aire acondicionado.',
    longDescription: `
      <p>Asegura el óptimo funcionamiento y la validez de la garantía de tus equipos con nuestro servicio de instalación profesional. Realizamos la instalación de aires acondicionados (split, ventana, centrales), campanas de cocina, hornos empotrables y más, siguiendo estrictamente las especificaciones del fabricante.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">Nuestros servicios de instalación incluyen:</h3>
    `,
    imageUrl: '/img/services/hero-bg3.jpg',
    benefits: [
      "Cumplimiento de normativas y estándares del fabricante.",
      "Personal calificado y herramientas adecuadas.",
      "Puesta en marcha y pruebas de funcionamiento.",
      "Asesoramiento sobre el uso y cuidado del equipo."
    ],
    ctaText: "Cotizar Instalación",
    ctaLink: "/contacto?servicio=instalacion"
  },
  {
    id: 's003',
    slug: 'mantenimiento',
    title: 'Mantenimiento Preventivo y Correctivo',
    shortDescription: 'Prolonga la vida útil de tus equipos y evita fallas costosas.',
    longDescription: `
      <p>El mantenimiento regular es clave para asegurar la eficiencia y durabilidad de tus electrodomésticos y sistemas de climatización. Ofrecemos planes de mantenimiento preventivo adaptados a tus necesidades, así como servicios de mantenimiento correctivo para solucionar problemas existentes.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">Beneficios del mantenimiento:</h3>
    `,
    imageUrl: '/img/services/mantenimiento-preventivo.jpg',
    benefits: [
      "Prevención de averías mayores.",
      "Optimización del consumo energético.",
      "Mayor vida útil de los equipos.",
      "Funcionamiento seguro y eficiente."
    ],
    ctaText: "Agendar Mantenimiento",
    ctaLink: "/contacto?servicio=mantenimiento"
  },
  {
    id: 's004',
    slug: 'garantias',
    title: 'Gestión de Garantías',
    shortDescription: 'Te ayudamos con el proceso de garantía de tus equipos.',
    longDescription: `
      <p>Si tu electrodoméstico adquirido con nosotros o de una marca asociada presenta fallas dentro del período de garantía, te asistimos en el proceso de gestión con el fabricante. Actuamos como servicio técnico autorizado para diversas marcas, facilitando el diagnóstico y la reparación cubierta por la garantía.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">¿Cómo funciona?</h3>
    `,
    imageUrl: '/img/services/gestion-garantia.jpg',
    process: [
        { step: "Verificación", description: "Revisamos la documentación y el estado del equipo." },
        { step: "Diagnóstico Técnico", description: "Determinamos si la falla está cubierta por la garantía." },
        { step: "Gestión con Fabricante", description: "Coordinamos con la marca para la aprobación de la reparación o reemplazo." },
        { step: "Solución", description: "Ejecutamos la reparación o te guiamos en los pasos para el reemplazo según corresponda." }
    ],
    ctaText: "Consultar sobre Garantías",
    ctaLink: "/contacto?servicio=garantias"
  },
  {
    id: 's005',
    slug: 'asesorias',
    title: 'Asesorías Técnicas Personalizadas',
    shortDescription: 'Te orientamos en la elección, uso y optimización de tus equipos.',
    longDescription: `
      <p>¿Tienes dudas sobre qué equipo comprar? ¿Necesitas optimizar el uso de tus electrodomésticos para ahorrar energía? Nuestro equipo de expertos te ofrece asesoría técnica personalizada para ayudarte a tomar las mejores decisiones, ya sea para tu hogar o negocio.</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">Podemos asesorarte en:</h3>
    `,
    imageUrl: '/img/services/asesoria.jpg',
    benefits: [
      "Selección de equipos según tus necesidades y presupuesto.",
      "Optimización del rendimiento y consumo energético.",
      "Resolución de dudas técnicas sobre funcionamiento.",
      "Planificación de instalaciones complejas."
    ],
    ctaText: "Solicitar Asesoría",
    ctaLink: "/contacto?servicio=asesoria"
  },
  {
    id: 's006', // Nuevo ID único
    slug: 'delivery-repuestos', // O 'despacho-a-domicilio', 'envios'
    title: 'Servicio de Delivery de Repuestos',
    shortDescription: 'Recibe tus repuestos directamente en la comodidad de tu hogar o taller.',
    longDescription: `
      <p>Sabemos que tu tiempo es valioso. Por eso, en Temuco Repuestos ofrecemos un conveniente <strong>servicio de delivery</strong> para que recibas los repuestos que necesitas sin tener que desplazarte. Realizamos envíos rápidos y seguros dentro de la ciudad de Temuco y también a comunas cercanas (consultar cobertura y costos).</p>
      <h3 class="text-xl font-semibold mt-6 mb-3">¿Cómo funciona nuestro delivery?</h3>
      <p>Es muy sencillo:</p>
      <ol class="list-decimal list-inside space-y-2 my-4">
        <li><strong>Realiza tu pedido:</strong> Puedes hacerlo por teléfono, WhatsApp o visitando nuestra tienda para seleccionar tus repuestos.</li>
        <li><strong>Coordina el envío:</strong> Indícanos tu dirección y coordinaremos el horario de entrega más conveniente.</li>
        <li><strong>Recibe tus productos:</strong> Nuestro personal de despacho te entregará los repuestos en la dirección acordada.</li>
      </ol>
      <p>También ofrecemos opciones de envío a otras regiones a través de servicios de courier (Starken, Chilexpress, etc.). ¡Consúltanos!</p>
    `,
    imageUrl: '/img/services/delivery.jpg', // Necesitarás esta imagen
    benefits: [
      "Comodidad: Ahorra tiempo y evita traslados innecesarios.",
      "Rapidez: Entregas eficientes en el radio urbano.",
      "Seguridad: Tus repuestos llegan en perfectas condiciones.",
      "Cobertura Amplia: Consultar por despacho a comunas y regiones."
    ],
    // process: [...] // Puedes añadir un proceso si lo deseas
    ctaText: "Consultar Cobertura de Delivery",
    ctaLink: "https://wa.me/584123975545?text=Hola,%20quisiera%20consultar%20sobre%20el%20servicio%20de%20delivery%20de%20repuestos" // Enlace directo a WhatsApp para consultar
  },
];