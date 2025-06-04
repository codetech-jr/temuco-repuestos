// src/app/admin/repuestos/editar/[id]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RepuestoForm, { RepuestoFormData } from '@/components/admin/RepuestoForm';
import supabase from '@/lib/supabase/client'; // Ajusta la ruta a tu cliente Supabase
import toast from 'react-hot-toast'; // Asumiendo que usas react-hot-toast
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // IMPORTA EL SPINNER

// Interfaz Repuesto (debe coincidir con tu API)
export interface Repuesto {
  id: string;
  slug: string;
  name: string;
  short_description?: string;
  price: number;
  original_price?: number;
  image_url?: string;
  category: string;
  brand: string;
  is_original?: boolean;
  long_description?: string;
  features?: string[];
  specifications?: { key: string; value: string }[];
  images?: string[];
  stock?: number;
  is_active?: boolean;
  created_at?: string;
}

export default function EditarRepuestoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialData, setInitialData] = useState<Partial<RepuestoFormData> | null>(null);
  const [loading, setLoading] = useState(true); // Inicia en true para el fetch inicial
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && supabase) {
      const fetchRepuesto = async () => {
        setLoading(true); // Indicar que la carga ha comenzado
        setError(null);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        
        // Para GET /:id, asumo que no está protegido o que el fetch global maneja tokens
        // Si está protegido, necesitarías el token aquí también.
        try {
          const response = await fetch(`${API_BASE_URL}/repuestos/${id}`, { cache: 'no-store' });
          
          if (!response.ok) {
            if (response.status === 404) {
              setError('Repuesto no encontrado.');
              toast.error('Repuesto no encontrado.');
            } else {
              const errorData = await response.json().catch(() => ({ message: 'Error desconocido al cargar datos del repuesto' }));
              setError(errorData.message || `Error al cargar datos del repuesto: ${response.statusText}`);
              toast.error(errorData.message || `Error al cargar datos del repuesto: ${response.statusText}`);
            }
            // setLoading(false); // Se maneja en finally
            return; // Salir si hay error
          }
          
          const dataFromAPI: Repuesto = await response.json();
          
          const adaptedData: Partial<RepuestoFormData> = {
            ...dataFromAPI,
            price: dataFromAPI.price !== undefined ? String(dataFromAPI.price) : '',
            original_price: dataFromAPI.original_price !== undefined ? String(dataFromAPI.original_price) : '',
            stock: dataFromAPI.stock !== undefined ? String(dataFromAPI.stock) : '',
            features: Array.isArray(dataFromAPI.features) ? dataFromAPI.features.join(', ') : (dataFromAPI.features || ''),
            specifications: typeof dataFromAPI.specifications === 'object' && dataFromAPI.specifications !== null
                            ? JSON.stringify(dataFromAPI.specifications, null, 2)
                            : (dataFromAPI.specifications || ''),
            images: Array.isArray(dataFromAPI.images) ? dataFromAPI.images.join(', ') : (dataFromAPI.images || ''),
            is_active: dataFromAPI.is_active === undefined ? true : dataFromAPI.is_active,
            is_original: dataFromAPI.is_original === undefined ? false : dataFromAPI.is_original,
          };
          setInitialData(adaptedData);

        } catch (err: any) {
          console.error("Error fetching repuesto para editar:", err);
          setError(err.message || 'Error al cargar los datos del repuesto.');
          toast.error(err.message || 'Error al cargar los datos del repuesto.');
        } finally {
          setLoading(false); // Asegura que loading se ponga en false siempre
        }
      };
      fetchRepuesto();
    } else if (!supabase) {
        toast.error("Error de configuración: Cliente Supabase no disponible.");
        setLoading(false);
        setError("Error de configuración del cliente.");
    } else if (!id) { // Si el ID no está presente por alguna razón (no debería pasar con rutas dinámicas bien configuradas)
        setLoading(false);
        setError("ID de repuesto no encontrado en la URL.");
        toast.error("ID de repuesto no encontrado.");
    }
  }, [id]); // Dependencia 'id'

  const handleUpdateRepuesto = async (formDataFromForm: RepuestoFormData): Promise<boolean> => {
    console.log("Datos a enviar a la API para actualizar repuesto:", formDataFromForm);
    toast.dismiss(); 

    if (!supabase) {
      toast.error("Error de configuración: Cliente Supabase no disponible.");
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("No estás autenticado. Redirigiendo a login...");
      router.push('/admin/login'); // Ajusta tu ruta de login si es diferente
      return false;
    }
    const token = session.access_token;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const loadingToastId = toast.loading('Actualizando repuesto...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/repuestos/${id}`, { // Usa el 'id' de params
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formDataFromForm),
      });

      // ... (resto de tu lógica de handleUpdateRepuesto, que ya usa toasts) ...
      const responseData = await response.json().catch(() => { /* ... */ }); // Tu manejo existente
      toast.dismiss(loadingToastId);
      if (!response.ok) { /* ... tu manejo de error con toast ... */ return false; }
      toast.success('¡Repuesto actualizado exitosamente!');
      return true;

    } catch (error: any) {
      toast.dismiss(loadingToastId);
      console.error('Excepción al actualizar repuesto:', error);
      toast.error(error.message || 'Ocurrió un error de red o excepción al actualizar el repuesto.');
      return false;
    }
  };

  // RENDERIZADO CONDICIONAL CON EL SPINNER PRINCIPAL
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner size={60} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600 text-center">
        <p>Error: {error}</p>
        <Link href="/admin/repuestos" className="text-blue-600 hover:underline mt-4 inline-block">
            Volver a la lista de repuestos
        </Link>
      </div>
    );
  }

  if (!initialData) { // Si no está cargando y no hay datos (después del fetch)
    // Este caso podría cubrir el 404 si setError no se llamó, o si id no estaba presente
    return (
        <div className="container mx-auto p-4 text-center">
            <p>No se pudieron cargar los datos del repuesto o el repuesto no existe.</p>
            <Link href="/admin/repuestos" className="text-blue-600 hover:underline mt-4 inline-block">
                Volver a la lista de repuestos
            </Link>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Editar Repuesto: <span className="text-gray-700">{initialData?.name || ''}</span>
      </h1>
      {/* Renderiza el formulario solo si initialData está disponible */}
      <RepuestoForm 
        onSubmit={handleUpdateRepuesto} 
        initialData={initialData} 
        isEditing={true} 
      />
    </div>
  );
}