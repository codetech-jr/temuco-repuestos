// src/components/tracking/ProductViewTracker.tsx
"use client";

import { useEffect } from 'react';

// Interfaz para los detalles del producto que queremos guardar
export interface RecentlyViewedProductInfo {
  id: string;
  slug?: string; // Si lo tienes disponible al llamar al tracker
  name: string;
  image_url: string;
  price: number; // Guardemos el precio como número si es posible
  product_type: 'electrodomestico' | 'repuesto';
}

interface ProductViewTrackerProps {
  productInfo: RecentlyViewedProductInfo; // Ahora pasamos un objeto con info del producto
}

const MAX_RECENTLY_VIEWED = 5; // ¿Cuántos productos recientes mostrar?

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('userSessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('userSessionId', sessionId);
  }
  return sessionId;
}

async function trackProductViewBackend(productType: string, productId: string, sessionId: string) {
  // --- VERIFICA ESTA LÍNEA ---
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'; // Asume que esto ya tiene /api/v1
  const apiUrl = `${baseUrl}/views/track`; // Solo añade /views/track
  // --- FIN DE LA VERIFICACIÓN ---
  
  console.log("ProductViewTracker: Intentando rastrear vista (backend) en:", apiUrl); // Añade este log
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: productType, productId, sessionId }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Respuesta no es JSON o vacía' }));
      console.error(`Error al rastrear vista (backend) (${productId}, ${productType}):`, response.status, errorData);
    } else {
      console.log(`Vista (backend) del producto (${productId}, ${productType}) rastreada.`);
    }
  } catch (error) {
    console.error(`Error de red (backend) para (${productId}, ${productType}):`, error);
  }
}

function addProductToRecentlyViewedStorage(productInfo: RecentlyViewedProductInfo) {
  try {
    let recentlyViewed: RecentlyViewedProductInfo[] = JSON.parse(sessionStorage.getItem('recentlyViewedProducts') || '[]');
    
    // Eliminar si ya existe para moverlo al principio
    recentlyViewed = recentlyViewed.filter(p => p.id !== productInfo.id);
    
    // Añadir el nuevo producto al principio
    recentlyViewed.unshift(productInfo);
    
    // Limitar la cantidad de productos
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }
    
    sessionStorage.setItem('recentlyViewedProducts', JSON.stringify(recentlyViewed));
    console.log("Producto añadido a vistos recientemente (sessionStorage):", productInfo.name);

    // Disparar un evento personalizado para que otros componentes (como RecentlyViewedProducts) puedan actualizarse
    window.dispatchEvent(new Event('recentlyViewedUpdated'));

  } catch (error) {
    console.error("Error guardando en sessionStorage (vistos recientemente):", error);
  }
}

const ProductViewTracker: React.FC<ProductViewTrackerProps> = ({ productInfo }) => {
  useEffect(() => {
    if (productInfo && productInfo.id && productInfo.product_type && productInfo.name) {
      const sessionId = getOrCreateSessionId();
      // 1. Enviar al backend
      trackProductViewBackend(productInfo.product_type, productInfo.id, sessionId);
      // 2. Guardar en sessionStorage
      addProductToRecentlyViewedStorage(productInfo);
    }
  }, [productInfo]); // El efecto se re-ejecuta si productInfo cambia

  return null; // Este componente no renderiza nada visible
};

export default ProductViewTracker;