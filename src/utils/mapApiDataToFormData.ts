// src/utils/mapApiDataToFormData.ts

import { ElectrodomesticoFormData } from '@/components/admin/ElectrodomesticoForm';

export interface ElectrodomesticoFromAPI {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category: string;
  brand: string;
  long_description?: string | null;
  features?: string[] | string | null;
  specifications?: { key: string; value: string }[] | string | null;
  images?: string[] | string | null;
  stock?: number | null;
  is_active?: boolean;
  created_at?: string;
}

export function mapApiDataToFormData(apiData: ElectrodomesticoFromAPI): ElectrodomesticoFormData {
  return {
    id: apiData.id,
    slug: apiData.slug || '',
    name: apiData.name || '',
    short_description: apiData.short_description || '',
    price: apiData.price,
    original_price: apiData.original_price ?? '',
    image_url: apiData.image_url || '',
    category: apiData.category || '',
    brand: apiData.brand || '',
    long_description: apiData.long_description || '',
    features: Array.isArray(apiData.features)
      ? apiData.features.join(', ')
      : (apiData.features || ''),
    specifications: Array.isArray(apiData.specifications)
      ? JSON.stringify(apiData.specifications)
      : (apiData.specifications || '[]'),
    images: Array.isArray(apiData.images)
      ? apiData.images.join(', ')
      : (apiData.images || ''),
    stock: apiData.stock ?? '',
    is_active: apiData.is_active ?? true,
    created_at: apiData.created_at,
  };
}
