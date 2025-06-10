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
  rating?: number | null;
  review_count?: number | null;
  long_description?: string | null;
  features?: string[] | string | null;
  specifications?: { key: string; value: string }[] | string | null;
  images?: string[] | string | null;
  stock?: number | null;
  is_active?: boolean;
  created_at?: string;
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
    short_description: apiData.short_description || '',
    long_description: apiData.long_description || '',
    is_active: apiData.is_active === undefined ? true : apiData.is_active,
    created_at: apiData.created_at,
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
  };
}

export default function EditarElectrodomesticoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<Partial<ElectrodomesticoFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de electrodoméstico no válido.");
      setLoading(false);
      toast.error("ID de electrodoméstico no encontrado en la URL.");
      notFound();
      return;
    }
    if (!supabase) {
      setError("Error de configuración: Cliente Supabase no disponible.");
      setLoading(false);
      toast.error("Error de configuración del cliente.");
      notFound();
      return;
    }

    const fetchElectrodomestico = async () => {
      setLoading(true);
      setError(null);
      setFormSubmitError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, { cache: 'no-store' });
        
        if (response.status === 404) {
            notFound();
            return;
        }
        if (!response.ok) {
          let errorMessage = `Error al cargar datos: ${response.statusText}`;
          try { const errorData = await response.json(); errorMessage = errorData.message || errorMessage; } catch (e) {}
          throw new Error(errorMessage);
        }
        const dataFromAPI: ElectrodomesticoFromAPI = await response.json();
        setInitialData(adaptApiDataToInitialFormData(dataFromAPI));
      } catch (err: unknown) {
        let message = 'Ocurrió un error desconocido al cargar los datos.';
        if (err instanceof Error) message = err.message;
        console.error("Error fetching electrodomestico para editar:", err);
        setError(message);
        toast.error(message);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchElectrodomestico();
  }, [id]);

  const handleUpdateElectrodomestico = async (formData: FormData | any): Promise<boolean> => {
    setFormSubmitError(null);
    toast.dismiss();
    let operationSuccessful = false;

    if (!supabase) {
      const errorMsg = "Error de configuración: Cliente Supabase no disponible.";
      toast.error(errorMsg);
      setFormSubmitError(errorMsg);
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      const errorMsg = "No estás autenticado o tu sesión ha expirado.";
      toast.error(errorMsg);
      setFormSubmitError(errorMsg);
      router.push('/admin/login');
      return false;
    }
    
    const token = session.access_token;
    const endpoint = `${API_BASE_URL}/electrodomesticos/${id}`;
    const loadingToastId = toast.loading('Actualizando electrodoméstico...');
    
    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData), // formData ya debe estar preparada por ElectrodomesticoForm
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
      } else {
          if (response.ok) { responseData = { success: true, message: '¡Electrodoméstico actualizado! (Respuesta no JSON)'}; }
          else { const textResponse = await response.text(); responseData = { message: `Error ${response.status}: ${response.statusText || textResponse.substring(0,100)}`, fieldErrors: null, success: false }; }
      }
      
      toast.dismiss(loadingToastId);

  if (!response.ok) {
        console.error('Error API al actualizar electrodoméstico:', response.status, responseData);
        let errorMessage = responseData?.message || `Error al actualizar electrodoméstico: ${response.statusText}`;
        if (responseData?.fieldErrors) {
          const fieldErrorMessages = Object.entries(responseData.fieldErrors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ');
          if (fieldErrorMessages) errorMessage += ` Detalles: ${fieldErrorMessages}`;
        } else if (responseData?.details) {
            errorMessage += ` Detalles: ${responseData.details}`;
        }
        toast.error(errorMessage, { duration: 6000 });
        setFormSubmitError(errorMessage);
        return false;
      } else {
        toast.success(responseData?.message || '¡Electrodoméstico actualizado exitosamente!');
        operationSuccessful = true;
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToastId);
      let errorMessage = 'Ocurrió una excepción al intentar actualizar el electrodoméstico.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Excepción en handleUpdateElectrodomestico:', error);
      toast.error(errorMessage);
      setFormSubmitError(errorMessage);
      return false;
    }

    if (operationSuccessful) {
      try {
        const currentSlug = initialData?.slug || (formData as ElectrodomesticoFormData).slug;
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
        // router.refresh(); // Podría ser necesario si la revalidación no es inmediata o para UI admin
      } catch (revalidateError) {
        console.error("Error durante la revalidación:", revalidateError);
        toast.error('Actualizado, pero falló revalidación de caché.');
        router.push('/admin/electrodomesticos');
      }
    }
    return operationSuccessful;
  };

  if (loading) return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  
  if (error && !initialData) return ( // Mostrar error solo si initialData no se cargó
    <div className="container mx-auto p-4 text-red-600 text-center">
      <p className="font-semibold">Error al cargar datos:</p>
      <p>{error}</p>
      <Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline mt-4 inline-block">Volver a la lista</Link>
    </div>
  );
  
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
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
          <p className="font-bold">Error al actualizar:</p>
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