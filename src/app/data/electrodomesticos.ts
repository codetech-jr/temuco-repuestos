// src/data/electrodomesticos.ts
export interface Electrodomestico {
  id: string;
  slug: string; // ej: "refrigerador-samsung-rt38k5930s8"
  name: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string; // ej: "Refrigeradores", "Lavadoras", "Cocinas", "Hornos"
  brand: string; // ej: "Samsung", "LG", "Mademsa", "Fensa"
  rating?: number;
  reviewCount?: number;
  // Campos específicos para la página de detalle
  longDescription?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[]; // Array de URLs para galería de imágenes
  stock?: number; // O un estado de disponibilidad
}

export const electrodomesticosData: Electrodomestico[] = [
  {
    id: 'E001',
    slug: 'refrigerador-samsung-top-mount-382l',
    name: 'Refrigerador Samsung Top Mount 382L RT38K500JS9/ZS',
    shortDescription: 'Refrigerador No Frost con Twin Cooling Plus™ y dispensador de agua.',
    price: 489990,
    originalPrice: 529990,
    imageUrl: '/images/electrodomesticos/samsung-refri-1.jpg', // Necesitarás estas imágenes
    category: 'Refrigeradores',
    brand: 'Samsung',
    rating: 5,
    reviewCount: 25,
    longDescription: "Mantén tus alimentos frescos por más tiempo con el Refrigerador Samsung RT38K500JS9/ZS. Su tecnología Twin Cooling Plus™ optimiza la temperatura y humedad en el refrigerador y congelador de forma independiente. Cuenta con dispensador de agua y fábrica de hielo manual.",
    features: ["Tecnología Twin Cooling Plus™", "No Frost", "Dispensador de agua", "Motor Digital Inverter con 10 años de garantía", "Iluminación LED interior"],
    specifications: [
      { key: "Capacidad Neta Total", value: "382 Litros" },
      { key: "Tipo", value: "Top Mount (Congelador Superior)" },
      { key: "Eficiencia Energética", value: "A+" },
      { key: "Dimensiones (An x Al x Prof)", value: "67.5 x 178.5 x 66.8 cm" }
    ],
    images: ["/images/electrodomesticos/samsung-refri-1.jpg", "/images/electrodomesticos/samsung-refri-2.jpg"],
    stock: 8
  },
  {
    id: 'E002',
    slug: 'lavadora-lg-carga-frontal-9kg',
    name: 'Lavadora LG Carga Frontal 9kg WM9000HVA AI DD™',
    shortDescription: 'Lavadora inteligente con motor AI DD™ para un cuidado óptimo de la ropa y Steam™.',
    price: 399990,
    imageUrl: '/images/electrodomesticos/lg-lavadora-1.jpg', // Necesitarás estas imágenes
    category: 'Lavadoras',
    brand: 'LG',
    rating: 4,
    reviewCount: 18,
    longDescription: "Experimenta un lavado superior con la Lavadora LG WM9000HVA. Su motor AI DD™ detecta el peso y la suavidad del tejido para optimizar los movimientos de lavado. La tecnología Steam™ elimina alérgenos y reduce las arrugas.",
    features: ["Motor Inverter AI DD™", "Tecnología Steam™", "Capacidad de 9kg", "6 Motion DD", "Smart Diagnosis™"],
    specifications: [
      { key: "Tipo de Carga", value: "Frontal" },
      { key: "Capacidad de Lavado", value: "9 kg" },
      { key: "Programas de Lavado", value: "14" },
      { key: "Eficiencia Energética", value: "A+++" }
    ],
    images: ["/images/electrodomesticos/lg-lavadora-1.jpg", "/images/electrodomesticos/lg-lavadora-2.jpg"],
    stock: 5
  },
  // ... más electrodomésticos
];