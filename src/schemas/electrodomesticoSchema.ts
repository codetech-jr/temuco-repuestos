import * as z from 'zod';

export const electrodomesticoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  precio: z
    .string()
    .min(1, 'El precio es obligatorio')
    .regex(/^\d+(\.\d{1,2})?$/, 'El precio debe ser un número válido'),
  stock: z
    .string()
    .min(1, 'El stock es obligatorio')
    .regex(/^\d+$/, 'El stock debe ser un número entero válido'),
  specifications: z.string().optional(),
  image_url: z.string().optional(),
  images: z.union([
    z.string().optional(),
    z.array(z.string()).optional(),
  ]),
  created_at: z.string().optional(),
});

export type ElectrodomesticoFormData = z.infer<typeof electrodomesticoSchema>;

export function mapApiDataToFormData(apiData: any): ElectrodomesticoFormData {
  return {
    nombre: apiData.nombre || '',
    descripcion: apiData.descripcion || '',
    categoria: apiData.categoria || '',
    precio: apiData.price ? String(apiData.price) : '',
    stock: apiData.stock ? String(apiData.stock) : '',
    specifications: typeof apiData.specifications === 'string'
      ? apiData.specifications
      : (apiData.specifications ? JSON.stringify(apiData.specifications, null, 2) : ''),
    image_url: apiData.image_url || '',
    images: Array.isArray(apiData.images)
      ? apiData.images
      : (typeof apiData.images === 'string'
          ? apiData.images.split(',').map(s => s.trim()).filter(s => s)
          : undefined),
    created_at: apiData.created_at,
  };
}
