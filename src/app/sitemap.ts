// app/sitemap.ts
import { MetadataRoute } from 'next';

// Asume que tienes interfaces para tus productos
interface Electrodomestico {
  slug: string;
  updated_at?: string; // O created_at, para lastModified
  // ... otros campos si los necesitas para lógica aquí
}
interface Repuesto {
  slug: string;
  updated_at?: string; // O created_at
  // ...
}

// URL base de tu sitio (¡CAMBIA ESTO EN PRODUCCIÓN!)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // 1. Obtener todos los slugs de electrodomésticos
  let electrodomesticosUrls: MetadataRoute.Sitemap = [];
  try {
    const electroRes = await fetch(`${API_BASE_URL}/electrodomesticos?limit=10000`); // Límite alto para obtener todos
    if (electroRes.ok) {
      const electroData = await electroRes.json();
      const items: Electrodomestico[] = electroData.data || [];
      electrodomesticosUrls = items.map((item) => ({
        url: `${SITE_URL}/electrodomesticos/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        // changeFrequency: 'weekly', // Opcional
        // priority: 0.8,             // Opcional
      }));
    }
  } catch (error) {
    console.error("Error fetching electrodomesticos for sitemap:", error);
  }

  // 2. Obtener todos los slugs de repuestos
  let repuestosUrls: MetadataRoute.Sitemap = [];
  try {
    const repuestoRes = await fetch(`${API_BASE_URL}/repuestos?limit=10000`, { cache: 'no-store' });
    if (repuestoRes.ok) {
      const repuestoData = await repuestoRes.json();
      const items: Repuesto[] = repuestoData.data || [];
      repuestosUrls = items.map((item) => ({
        url: `${SITE_URL}/repuestos/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        // changeFrequency: 'weekly',
        // priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Error fetching repuestos for sitemap:", error);
  }
  
  // 3. Añadir páginas estáticas y de catálogo
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/electrodomesticos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/repuestos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/quienes-somos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/search`, // Tu página de búsqueda si quieres que sea descubierta
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }
    // Añade aquí otras páginas estáticas importantes
  ];

  return [
    ...staticPages,
    ...electrodomesticosUrls,
    ...repuestosUrls,
  ];
}