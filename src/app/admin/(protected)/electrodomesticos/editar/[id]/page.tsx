"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import ElectrodomesticoForm, { ElectrodomesticoFormData } from '@/components/admin/ElectrodomesticoForm';
import supabase from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
  rating?: number | null; // Añadido para que coincida con el form
  review_count?: number | null; // Añadido para que coincida con el form
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || 'YOUR_DEFAULT_REVALIDATION_SECRET';

function adaptApiDataToInitialFormData(apiData: ElectrodomesticoFromAPI): Partial<ElectrodomesticoFormData> {
  return {
    id: apiData.id,
    slug: apiData.slug,
    name: apiData.name,
    category: apiData.category,
    brand: apiData.brand,
    is_active: apiData.is_active === undefined ? true : apiData.is_active,
    short_description: apiData.short_description || '',
    long_description: apiData.long_description || '',
    price: String(apiData.price ?? ''),
    original_price: apiData.original_price != null ? String(apiData.original_price) : '',
    stock: apiData.stock != null ? String(apiData.stock) : '',
    rating: apiData.rating != null ? String(apiData.rating) : '',
    review_count: apiData.review_count != null ? String(apiData.review_count) : '',
    image_url: apiData.image_url || '',
    features: typeof apiData.features === 'string' 
        ? apiData.features 
        : (Array.isArray(apiData.features) ? apiData.features.join(', ') : ''),
    specifications: typeof apiData.specifications === 'string' 
        ? apiData.specifications 
        : (apiData.specifications ? JSON.stringify(apiData.specifications, null, 2) : '[]'),
    images: typeof apiData.images === 'string' 
        ? apiData.images 
        : (Array.isArray(apiData.images) ? apiData.images.join(', ') : ''),
    created_at: apiData.created_at,
  };
}

interface EditarElectrodomesticoPageProps {
  params: { id: string };
}

export default function EditarElectrodomesticoPage({ params }: EditarElectrodomesticoPageProps) {
  const router = useRouter();
  const idFromParams = params.id;

  const [initialData, setInitialData] = useState<Partial<ElectrodomesticoFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!idFromParams) {
      toast.error("ID de electrodoméstico no válido.");
      setLoading(false);
      notFound();
      return;
    }
    if (!supabase) {
      toast.error("Error de configuración del cliente Supabase.");
      setLoading(false);
      notFound();
      return;
    }

    const fetchElectrodomestico = async () => {
      setLoading(true);
      setFormSubmitError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/electrodomesticos/${idFromParams}`, { cache: 'no-store' });
        
        if (response.status === 404) {
          notFound();
          return;
        }
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Error al cargar electrodoméstico' }));
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        const dataFromAPI: ElectrodomesticoFromAPI = await response.json();
        setInitialData(adaptApiDataToInitialFormData(dataFromAPI));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error desconocido al cargar el electrodoméstico.';
        console.error("Error fetching electrodomestico para editar:", err);
        toast.error(message);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchElectrodomestico();
  }, [idFromParams]);

  const handleUpdateElectrodomestico = async (formDataFromForm: any): Promise<boolean> => {
    setFormSubmitError(null);
    toast.dismiss();
    let operationSuccessful = false;

    if (!supabase) {
      toast.error("Error de config: Supabase no disponible.");
      return false;
    }    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      toast.error("No autenticado. Redirigiendo...");
      router.push('/admin/login');
      return false;
    }
    
    const token = session.access_token;
    const endpoint = `${API_BASE_URL}/electrodomesticos/${idFromParams}`;
    const loadingToastId = toast.loading('Actualizando electrodoméstico...');
    
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formDataFromForm),
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
      } else {
          if (response.ok) { responseData = { success: true, message: '¡Actualizado! (Respuesta no JSON)'}; }
          else { const textResponse = await response.text(); responseData = { message: `Error ${response.status}: ${response.statusText || textResponse.substring(0,100)}`, success: false }; }
      }
      
      toast.dismiss(loadingToastId);

      if (!response.ok) {
        let errorMessage = responseData?.message || `Error al actualizar: ${response.statusText}`;
        if (responseData?.fieldErrors) {
          const fieldErrorMessages = Object.entries(responseData.fieldErrors).map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`).join('; ');
          if (fieldErrorMessages) errorMessage += ` Detalles: ${fieldErrorMessages}`;
        }
        toast.error(errorMessage, { duration: 6000 });
        setFormSubmitError(errorMessage);
        operationSuccessful = false;
      } else {
        toast.success(responseData?.message || '¡Electrodoméstico actualizado exitosamente!');
        operationSuccessful = true;
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToastId);
      const message = error instanceof Error ? error.message : 'Excepción al actualizar.';
      toast.error(message);
      setFormSubmitError(message);
      operationSuccessful = false;
    }

    if (operationSuccessful) {
      try {
        const currentSlug = initialData?.slug || formDataFromForm.slug;
        if (currentSlug) {
            await fetch(`/api/revalidate?secret=${REVALIDATE_SECRET}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: `/electrodomesticos/${currentSlug}` })
            });
        }
        await fetch(`/api/revalidate?secret=${REVALIDATE_SECRET}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tag: 'lista-electrodomesticos' })
        });
        toast.success('Caché revalidada.');
        router.push('/admin/electrodomesticos');
      } catch (revalidateError) {
        console.error("Error durante la revalidación:", revalidateError);
        toast.error('Actualizado, pero falló revalidación de caché.');
        router.push('/admin/electrodomesticos');
      }
    }
    return operationSuccessful;
  };

  if (loading) return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  
  if (!initialData && !loading) return (
    <div className="container mx-auto p-4 text-center">
      <p>No se pudo cargar el electrodoméstico o no existe.</p>
      <Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline mt-4 inline-block">Volver a la lista</Link>
    </div>
  );
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Editar Electrodoméstico: <span className="text-gray-700">{initialData?.name || ''}</span>
      </h1>
      {formSubmitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{formSubmitError}</p>
        </div>
      )}
      {initialData && (
        <ElectrodomesticoForm 
          onSubmit={handleUpdateElectrodomestico} 
          initialData={initialData} 
          isEditing={true} 
        />
      )}
    </div>
  );
}