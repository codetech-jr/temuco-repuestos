export interface ProductFromAPI {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  image_url?: string;
  type: 'electrodomestico' | 'repuesto';
  tag?: 'Oferta' | 'Nuevo' | 'Más Vendido' | 'Original' | 'Alternativo';
  rating?: number;
  reviewCount?: number;
}

export interface ProductForCard {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  tag?: 'Oferta' | 'Nuevo' | 'Más Vendido' | 'Original' | 'Alternativo';
  altText: string;
  link: string;
  rating?: number;
  reviewCount?: number;
}