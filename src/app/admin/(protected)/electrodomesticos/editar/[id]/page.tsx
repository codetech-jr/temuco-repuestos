// src/app/admin/electrodomesticos/editar/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ElectrodomesticoForm, { ElectrodomesticoFormData } from '@/components/admin/ElectrodomesticoForm';
import supabase from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Electrodomestico {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url: string;
  category: string;
  brand: string;
  rating?: number;
  review_count?: number;
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  stock?: number;
  is_active?: boolean;
  created_at?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function EditarElectrodomesticoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<Partial<ElectrodomesticoFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchElectrodomestico = async () => {
    if (!id || !supabase) {
      if (!supabase) {
        toast.error("Error de configuración: Cliente Supabase no disponible.");
        setError("Error de configuración del cliente.");
      } else {
        setError("ID de electrodoméstico no válido o no proporcionado.");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, { cache: 'no-store' });
      
      if (!response.ok) {
        const errorMessage = response.status === 404 
          ? 'Electrodoméstico no encontrado.' 
          : (await response.json().catch(() => ({ message: 'Error desconocido al cargar datos' }))).message;
        
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      const data: Electrodomestico = await response.json();
      setInitialData(adaptElectrodomesticoToFormData(data));
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cargar los datos del electrodoméstico.';
      console.error("Error fetching electrodomestico:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectrodomestico();
  }, [id]);

  const handleUpdateElectrodomestico = async (formData: ElectrodomesticoFormData): Promise<boolean> => {
    toast.dismiss();

    if (!supabase) {
      toast.error("Error de configuración: Cliente Supabase no disponible.");
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("No estás autenticado o tu sesión ha expirado. Redirigiendo a login...");
      router.push('/admin/login');
      return false;
    }

    const loadingToastId = toast.loading('Actualizando electrodoméstico...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await parseResponse(response);

      toast.dismiss(loadingToastId);

      if (!response.ok) {
        handleUpdateError(response, responseData);
        return false;
      }

      toast.success('¡Electrodoméstico actualizado exitosamente!');
      return true;
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      console.error('Update error:', error);
      toast.error(error.message || 'Ocurrió un error de red o excepción al actualizar.');
      return false;
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {error} <Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline">Volver a la lista</Link>
      </div>
    );
  }

  if (!initialData && !loading) {
    return (
      <div className="container mx-auto p-4">
        No se pudieron cargar los datos para editar o el electrodoméstico no existe. 
        <Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline">Volver a la lista</Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Editar Electrodoméstico: <span className="text-gray-700">{initialData?.name || 'Cargando nombre...'}</span>
      </h1>
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

// Helper functions
function adaptElectrodomesticoToFormData(data: Electrodomestico): Partial<ElectrodomesticoFormData> {
  return {
    ...data,
    price: data.price,
    original_price: data.original_price,
    rating: data.rating,
    review_count: data.review_count,
    stock: data.stock,
    features: Array.isArray(data.features) ? data.features.join(', ') : '',
    specifications: typeof data.specifications === 'object' ? JSON.stringify(data.specifications, null, 2) : '',
    images: Array.isArray(data.images) ? data.images.join(', ') : '',
    is_active: data.is_active === undefined ? true : data.is_active,
  };
}

async function parseResponse(response: Response) {
  try {
    return await response.json();
  } catch {
    if (response.ok) {
      toast.success('¡Electrodoméstico actualizado! (Respuesta no JSON)');
      return { success: true };
    }
    toast.error(`Error del servidor: ${response.statusText} (Respuesta no JSON)`);
    return { message: `Error del servidor: ${response.statusText}`, fieldErrors: null, success: false };
  }
}

function handleUpdateError(response: Response, responseData: any) {
  console.error('API error:', response.status, responseData);
  let errorMessage = responseData.message || `Error al actualizar: ${response.statusText}`;
  
  if (responseData.fieldErrors) {
    const fieldErrorMessages = Object.values(responseData.fieldErrors).flat().join(', ');
    if (fieldErrorMessages) errorMessage += ` Detalles: ${fieldErrorMessages}`;
  }
  
  toast.error(errorMessage);
}