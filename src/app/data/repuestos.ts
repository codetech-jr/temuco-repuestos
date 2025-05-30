// src/data/repuestos.ts
export interface Repuesto {
  id: string;
  slug: string; // Para la URL ej: "compresor-embraco-1-4hp"
  name: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category: string; // ej: "Compresores", "Termostatos", "Filtros"
  brand: string; // ej: "Embraco", "Danfoss", "Genérico"
  isOriginal?: boolean; // <--- NUEVO CAMPO (opcional)
  // ... más campos para el detalle
  longDescription?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[]; // Array de URLs para galería de imágenes
  stock?: number;
}

export const repuestosData: Repuesto[] = [
  {
    id: 'R001',
    slug: 'compresor-embraco-emi70her',
    name: 'Compresor Embraco 1/4 HP EMI70HER R134a',
    shortDescription: 'Compresor hermético para refrigeración doméstica y comercial ligera.',
    price: 75000,
    imageUrl: '/img/rociador-cowplandt.jpg',
    category: 'Compresores',
    brand: 'Embraco',
    isOriginal: true, 
    longDescription: "El compresor Embraco EMI70HER es una unidad de alta eficiencia diseñada para sistemas de refrigeración que utilizan refrigerante R134a. Ideal para refrigeradores domésticos y pequeños equipos comerciales, ofrece un rendimiento confiable y bajo nivel de ruido.",
    features: ["Alta eficiencia energética", "Bajo nivel de ruido y vibración", "Diseño compacto y robusto", "Compatible con R134a"],
    specifications: [
        { key: "Modelo", value: "EMI70HER" },
        { key: "Capacidad", value: "1/4 HP" },
        { key: "Refrigerante", value: "R134a" },
        { key: "Voltaje", value: "220-240V/50Hz" }
    ],
    images: ["/img/rociador-cowplandt.jpg", "/img/rociador-cowplandt.jpg"],
    stock: 15
  },
  {
    id: 'R002',
    slug: 'termostato-generico-k59',
    name: 'Termostato Universal K59 para Refrigerador',
    shortDescription: 'Termostato de reemplazo compatible con múltiples modelos.',
    price: 12000,
    imageUrl: '/img/rociador-cowplandt.jpg',
    category: 'Termostatos',
    brand: 'Genérico',
    isOriginal: false, // <--- Ejemplo de repuesto no original (o dejar undefined)
    longDescription: "El compresor Embraco EMI70HER es una unidad de alta eficiencia diseñada para sistemas de refrigeración que utilizan refrigerante R134a. Ideal para refrigeradores domésticos y pequeños equipos comerciales, ofrece un rendimiento confiable y bajo nivel de ruido.",
    features: ["Alta eficiencia energética", "Bajo nivel de ruido y vibración", "Diseño compacto y robusto", "Compatible con R134a"],
    specifications: [
        { key: "Modelo", value: "EMI70HER" },
        { key: "Capacidad", value: "1/4 HP" },
        { key: "Refrigerante", value: "R134a" },
        { key: "Voltaje", value: "220-240V/50Hz" }
    ],
    images: ["/img/rociador-cowplandt.jpg", "/img/rociador-cowplandt.jpg"],
    stock: 15
  },
  {
    id: 'R003',
    slug: 'filtro-secador-original-lg',
    name: 'Filtro Secador Original LG para Refrigerador No Frost',
    shortDescription: 'Filtro secador original marca LG para sistemas No Frost.',
    price: 18500,
    imageUrl: '/img/rociador-cowplandt.jpg',
    category: 'Filtros',
    brand: 'LG',
    isOriginal: true, // <--- Ejemplo de repuesto original
    longDescription: "El compresor Embraco EMI70HER es una unidad de alta eficiencia diseñada para sistemas de refrigeración que utilizan refrigerante R134a. Ideal para refrigeradores domésticos y pequeños equipos comerciales, ofrece un rendimiento confiable y bajo nivel de ruido.",
    features: ["Alta eficiencia energética", "Bajo nivel de ruido y vibración", "Diseño compacto y robusto", "Compatible con R134a"],
    specifications: [
        { key: "Modelo", value: "EMI70HER" },
        { key: "Capacidad", value: "1/4 HP" },
        { key: "Refrigerante", value: "R134a" },
        { key: "Voltaje", value: "220-240V/50Hz" }
    ],
    images: ["/img/rociador-cowplandt.jpg", "/img/rociador-cowplandt.jpg"],
    stock: 15
  },
  // ... más repuestos
];