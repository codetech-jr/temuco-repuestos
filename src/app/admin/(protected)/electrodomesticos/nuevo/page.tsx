// src/app/admin/electrodomesticos/nuevo/page.tsx
"use client";

import ElectrodomesticoForm from '@/components/admin/ElectrodomesticoForm';
// Ya no necesitamos ElectrodomesticoFormData aquí si el form maneja su tipo interno
// y onSubmit espera FormData
import { useRouter } from 'next/navigation'; 
import supabase from '@/lib/supabase/client'; // Asegúrate que la ruta a tu cliente Supabase sea correcta
import toast from 'react-hot-toast';
import { useState } from 'react'; // Para manejar el estado de error del formulario

export default function NuevoElectrodomesticoPage() {
  const router = useRouter();
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  // Esta función ahora espera FormData directamente desde ElectrodomesticoForm
  // El segundo parámetro 'isFormDataIndeed' que definimos en la prop onSubmit del formulario
  // nos asegura que 'data' aquí es FormData.
  const handleCreateElectrodomestico = async (data: FormData /*, isFormDataIndeed: true*/): Promise<boolean> => {
    setFormSubmitError(null); // Limpiar errores previos
    toast.dismiss(); 

    if (!supabase) {
      const errorMsg = "Error de configuración: Cliente Supabase no disponible.";
      toast.error(errorMsg);
      setFormSubmitError(errorMsg);
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      const errorMsg = "No estás autenticado o tu sesión ha expirado. Redirigiendo a login...";
      toast.error(errorMsg);
      setFormSubmitError(errorMsg);
      router.push('/admin/login'); // Ajusta tu ruta de login si es diferente
      return false;
    }
    const token = session.access_token;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const endpoint = `${API_BASE_URL}/electrodomesticos`; // O /admin/electrodomesticos si así está en tu backend

    const loadingToastId = toast.loading('Creando electrodoméstico...');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          // NO ESTABLECER 'Content-Type' manualmente cuando se envía FormData.
          // El navegador lo hará automáticamente con 'multipart/form-data' y el boundary.
          'Authorization': `Bearer ${token}`,
        },
        body: data, // 'data' es el objeto FormData que viene de ElectrodomesticoForm
      });

      toast.dismiss(loadingToastId);

      let responseData;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
      } else {
          if (response.status === 201) { // Created
              toast.success('¡Electrodoméstico creado exitosamente! (Respuesta no JSON)');
              router.push('/admin/electrodomesticos'); // Redirigir a la lista
              router.refresh(); // Revalidar datos en Next.js App Router
              return true;
          }
          const textResponse = await response.text();
          console.error('Error API (respuesta no JSON) al crear electrodoméstico:', response.status, textResponse);
          const errorMessage = `Error del servidor: ${response.status} - ${response.statusText || textResponse.substring(0,100)}`;
          toast.error(errorMessage);
          setFormSubmitError(errorMessage);
          return false;
      }
      
      if (!response.ok) {
        console.error('Error API al crear electrodoméstico:', response.status, responseData);
        let errorMessage = responseData?.message || `Error al crear electrodoméstico: ${response.statusText}`;
        if (responseData?.fieldErrors) {
          const fieldErrorMessages = Object.entries(responseData.fieldErrors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ');
          if (fieldErrorMessages) errorMessage += ` Detalles: ${fieldErrorMessages}`;
        } else if (responseData?.details) {
            errorMessage += ` Detalles: ${responseData.details}`;
        }
        toast.error(errorMessage, { duration: 6000 }); // Mostrar error por más tiempo
        setFormSubmitError(errorMessage);
        return false;
      }

      console.log('Electrodoméstico creado:', responseData);
      toast.success(responseData?.message || '¡Electrodoméstico creado exitosamente!');
      router.push('/admin/electrodomesticos');
      router.refresh();
      return true; // Indica éxito para que ElectrodomesticoForm pueda resetearse si es necesario

    } catch (error: unknown) { // Tipar error como unknown
      toast.dismiss(loadingToastId);
      let errorMessage = 'Ocurrió una excepción al intentar crear el electrodoméstico.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Excepción en handleCreateElectrodomestico:', error);
      toast.error(errorMessage);
      setFormSubmitError(errorMessage); // Mostrar el error en la UI
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Crear Nuevo Electrodoméstico
      </h1>
      {formSubmitError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md" role="alert">
          <p className="font-bold">Error al enviar:</p>
          <p>{formSubmitError}</p>
        </div>
      )}
      <ElectrodomesticoForm 
        onSubmit={handleCreateElectrodomestico} 
        isEditing={false} 
      />
    </div>
  );
}