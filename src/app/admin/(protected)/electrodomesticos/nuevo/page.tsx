// src/app/admin/electrodomesticos/nuevo/page.tsx
"use client";
import ElectrodomesticoForm, { ElectrodomesticoFormData } from '@/components/admin/ElectrodomesticoForm';
import { useRouter } from 'next/navigation';
import  supabase  from '@/lib/supabase/client'; // Ajusta la ruta a tu cliente Supabase del frontend
import toast from 'react-hot-toast'; // Importa toast

export default function NuevoElectrodomesticoPage() {
  const router = useRouter();
  // No necesitas crear la instancia de supabase aquí si la importas directamente y ya está configurada.
  // const supabase = createClient(); 

  const handleCreateElectrodomestico = async (formData: Partial<ElectrodomesticoFormData>): Promise<boolean> => {
    if (!supabase) {
      toast.error("Error de configuración: Cliente Supabase no disponible.");
      return false;
    }

    // 1. Obtener la sesión y el token
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Error obteniendo sesión o no hay sesión:", sessionError);
      toast.error("No estás autenticado o tu sesión ha expirado. Redirigiendo a login...");
      router.push('/admin/login');
      return false;
    }

    const token = session.access_token;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    
    const loadingToastId = toast.loading('Creando electrodoméstico...'); // Mostrar toast de carga

    try {
      const response = await fetch(`${API_BASE_URL}/electrodomesticos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json().catch(() => {
        // Si responseData no es JSON, response.ok ya debería haber sido falso.
        // Pero es un buen fallback.
        toast.dismiss(loadingToastId);
        if (response.status === 201) { // Si fue un 201 pero el body no era JSON (no debería pasar)
            toast.success('¡Electrodoméstico creado exitosamente! (Respuesta no JSON)');
            return { success: true }; // Asumir éxito si el status es 201
        }
        toast.error(`Error del servidor: ${response.statusText} (Respuesta no JSON)`);
        return { message: `Error del servidor: ${response.statusText}`, fieldErrors: null, success: false };
      });
      
      toast.dismiss(loadingToastId); // Ocultar toast de carga

      if (!response.ok) {
        console.error('Error API al crear electrodoméstico:', response.status, responseData);
        let errorMessage = responseData.message || `Error al crear: ${response.statusText}`;
        if (responseData.fieldErrors) {
          // Opcional: Podrías intentar formatear los fieldErrors para el toast
          // Pero Zod en ElectrodomesticoForm ya debería haber atrapado la mayoría de estos.
          // Esto sería para errores de validación del backend que el frontend no atrapó.
          const fieldErrorMessages = Object.values(responseData.fieldErrors).flat().join(', ');
          if (fieldErrorMessages) {
            errorMessage += ` Detalles: ${fieldErrorMessages}`;
          }
        }
        toast.error(errorMessage);
        return false;
      }
      
      toast.success(responseData.message || '¡Electrodoméstico creado exitosamente!');
      // router.push('/admin/electrodomesticos'); // La redirección se hace en ElectrodomesticoForm
      // router.refresh();
      return true; // Indica éxito para que ElectrodomesticoForm redirija

    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error('Excepción al crear electrodoméstico:', error);
      toast.error('Ocurrió una excepción al intentar crear el electrodoméstico.');
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Crear Nuevo Electrodoméstico
      </h1>
      <ElectrodomesticoForm 
        onSubmit={handleCreateElectrodomestico} 
        isEditing={false} 
      />
    </div>
  );
}