// src/app/admin/repuestos/editar/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
// RepuestoFormData (de RepuestoForm) es la interfaz que el FORMULARIO usa para su estado y initialData
import RepuestoForm, { RepuestoFormData } from '@/components/admin/RepuestoForm';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Interfaz para los datos tal como vienen de TU API GET /:id
export interface RepuestoFromAPI {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  price: number;
  original_price?: number | null;
  image_url?: string | null; // URL de la imagen principal
  category: string;
  brand: string;
  is_original?: boolean;
  long_description?: string | null;
  features?: string[] | string | null; // Puede ser array de strings o un solo string (separado por comas)
  specifications?: { key: string; value: string }[] | string | null; // Puede ser array de objetos o string JSON
  images?: string[] | string | null;   // Puede ser array de URLs o un solo string (separado por comas)
  stock?: number | null;
  is_active?: boolean;
  created_at?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Función helper para adaptar los datos de la API al formato que espera RepuestoFormData
function adaptApiDataToInitialFormData(apiData: RepuestoFromAPI): Partial<RepuestoFormData> {
  // RepuestoForm espera que los campos numéricos sean strings para los inputs,
  // y que features e images (para el textarea) sean strings separados por comas.
  // image_url se pasa tal cual para la previsualización inicial en RepuestoForm.
  // Las previsualizaciones de 'images' (múltiples) también se manejan dentro de RepuestoForm
  // a partir de initialData.images (que aquí lo pasamos como string o array).
  return {
    // Campos que probablemente no necesitan mucha transformación si los tipos coinciden con RepuestoFormData
    id: apiData.id,
    slug: apiData.slug,
    name: apiData.name,
    category: apiData.category,
    brand: apiData.brand,
    is_original: apiData.is_original === undefined ? false : apiData.is_original,
    is_active: apiData.is_active === undefined ? true : apiData.is_active,
    short_description: apiData.short_description || '',
    long_description: apiData.long_description || '',
    
    // Convertir números a string para los inputs del formulario
    price: String(apiData.price ?? ''),
    original_price: apiData.original_price != null ? String(apiData.original_price) : '',
    stock: apiData.stock != null ? String(apiData.stock) : '',

    // Para RepuestoForm (que tiene textareas para estos)
    features: Array.isArray(apiData.features) ? apiData.features.join(', ') : (typeof apiData.features === 'string' ? apiData.features : ''),
    specifications: typeof apiData.specifications === 'string' 
      ? apiData.specifications 
      : (apiData.specifications ? JSON.stringify(apiData.specifications, null, 2) : ''),
    
    // `image_url` para la previsualización de la imagen principal en RepuestoForm
    image_url: apiData.image_url || '', 

    // `images` para RepuestoForm:
    // Si tu RepuestoForm espera un string separado por comas para `initialData.images` (para un textarea opcional):
    // images: Array.isArray(apiData.images) ? apiData.images.join(', ') : (typeof apiData.images === 'string' ? apiData.images : ''),
    // Si tu RepuestoForm puede tomar directamente el array de URLs para inicializar sus previews de 'additionalImagesPreview':
    // (Esto es mejor si RepuestoForm maneja la inicialización de additionalImagesPreview desde un array de URLs)
    images: Array.isArray(apiData.images) ? apiData.images.join(', ') : (typeof apiData.images === 'string' ? apiData.images : ''),
    
    created_at: apiData.created_at, // No es un campo de formulario pero puede ser útil
  };
}

export default function EditarRepuestoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // RepuestoFormData es la interfaz que usa RepuestoForm para su estado y `initialData`
  const [initialData, setInitialData] = useState<Partial<RepuestoFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de repuesto no válido."); setLoading(false); toast.error("ID de repuesto no válido."); return;
    }
    if (!supabase) {
      setError("Error de configuración del cliente Supabase."); setLoading(false); toast.error("Error de config."); return;
    }

    const fetchRepuesto = async () => {
      setLoading(true); setError(null); setFormSubmitError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/repuestos/${id}`, { cache: 'no-store' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(response.status === 404 ? 'Repuesto no encontrado.' : errorData.message || `Error ${response.status}`);
        }
        const dataFromAPI: RepuestoFromAPI = await response.json();
        setInitialData(adaptApiDataToInitialFormData(dataFromAPI)); // Usar la función adaptadora
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar el repuesto';
        console.error("Error fetching repuesto para editar:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchRepuesto();
  }, [id]);

  const handleUpdateRepuesto = async (data: FormData): Promise<boolean> => {
    // ... (tu lógica de handleUpdateRepuesto que ya maneja FormData y el token es correcta) ...
    setFormSubmitError(null); toast.dismiss();
    if (!supabase) { /* ... */ return false; }
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) { /* ... */ router.push('/admin/login'); return false; }
    const loadingToastId = toast.loading('Actualizando repuesto...');
    try {
      const response = await fetch(`${API_BASE_URL}/repuestos/${id}`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${session.access_token}` }, body: data,
      });
      toast.dismiss(loadingToastId);
      // ... (resto de tu manejo de respuesta y errores para el PUT) ...
      // (El código que tenías para esto era bueno)
      if (!response.ok) {
        let errorMessage = `Error del servidor: ${response.status}`; let responseData: any;
        try { responseData = await response.json(); /* ... */ } catch { /* ... */ }
        toast.error(errorMessage); setFormSubmitError(errorMessage); return false;
      }
      toast.success('¡Repuesto actualizado exitosamente!');
      router.push('/admin/repuestos'); router.refresh(); return true;
    } catch (err: unknown) { /* ... */ return false; }
  };

  if (loading) return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  if (error) return <div className="container mx-auto p-4 text-red-600 text-center"><p>Error: {error}</p><Link href="/admin/repuestos" className="text-blue-600 hover:underline mt-4 inline-block">Volver</Link></div>;
  if (!initialData) return <div className="container mx-auto p-4 text-center"><p>No se pudieron cargar datos del repuesto.</p><Link href="/admin/repuestos" className="text-blue-600 hover:underline mt-4 inline-block">Volver</Link></div>;
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Editar Repuesto: <span className="text-gray-700">{initialData.name || ''}</span>
      </h1>
      {formSubmitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{formSubmitError}</p>
        </div>
      )}
      {/* El componente RepuestoForm ya debería tener los inputs type="file"
          y la lógica para previsualizaciones basada en initialData.image_url e initialData.images */}
      <RepuestoForm 
        onSubmit={handleUpdateRepuesto} 
        initialData={initialData} 
        isEditing={true} 
      />
    </div>
  );
}