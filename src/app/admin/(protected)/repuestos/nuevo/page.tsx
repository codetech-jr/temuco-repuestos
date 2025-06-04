// src/app/admin/repuestos/nuevo/page.tsx
"use client";

import RepuestoForm, { RepuestoFormData } from '@/components/admin/RepuestoForm';
// No necesitamos useRouter aquí porque la redirección la maneja RepuestoForm
// import { useRouter } from 'next/navigation'; 
import  supabase  from '@/lib/supabase/client'; // Importa tu cliente Supabase del frontend
import toast from 'react-hot-toast';             // Importa toast

export default function CrearRepuestoPage() {
  // const router = useRouter(); // No es necesario aquí si RepuestoForm lo maneja

  const handleCreateRepuesto = async (formData: RepuestoFormData): Promise<boolean> => {
    // formData aquí ya está procesada por el handleSubmit de RepuestoForm
    // (validación Zod del cliente, conversión de strings a arrays/objetos)
    console.log("Datos a enviar a la API para crear REPUESTO:", formData);
    toast.dismiss(); // Limpiar toasts anteriores

    if (!supabase) {
      toast.error("Error de configuración: Cliente Supabase no disponible.");
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Error obteniendo sesión o no hay sesión:", sessionError);
      toast.error("No estás autenticado o tu sesión ha expirado. Redirigiendo a login...");
      // Idealmente, el layout de admin ya haría esta redirección si la sesión es null.
      // Pero como medida de seguridad extra:
      // router.push('/admin/login'); // Descomentar si quieres forzar redirección desde aquí
      return false;
    }
    const token = session.access_token;

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const loadingToastId = toast.loading('Creando repuesto...'); // Toast de carga

    try {
      const response = await fetch(`${API_BASE_URL}/repuestos`, { // CAMBIO: Endpoint /repuestos
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // AÑADIR TOKEN
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json().catch(() => {
          toast.dismiss(loadingToastId);
          if (response.status === 201) {
              toast.success('¡Repuesto creado exitosamente! (Respuesta no JSON)');
              return { success: true };
          }
          toast.error(`Error del servidor: ${response.statusText} (Respuesta no JSON)`);
          return { message: `Error del servidor: ${response.statusText}`, fieldErrors: null, success: false };
      });
      
      toast.dismiss(loadingToastId);

      if (!response.ok) {
        console.error('Error API al crear repuesto:', response.status, responseData);
        let errorMessage = responseData.message || `Error al crear repuesto: ${response.statusText}`;
        if (responseData.fieldErrors) {
          const fieldErrorMessages = Object.values(responseData.fieldErrors).flat().join(', ');
          if (fieldErrorMessages) errorMessage += ` Detalles: ${fieldErrorMessages}`;
        }
        toast.error(errorMessage);
        return false;
      }

      // const nuevoRepuesto = responseData; // Ya es el objeto parseado
      console.log('Repuesto creado:', responseData);
      toast.success(responseData.message || '¡Repuesto creado exitosamente!');
      return true; // Indica éxito para que RepuestoForm maneje la redirección

    } catch (error: any) {
      toast.dismiss(loadingToastId);
      console.error('Excepción al crear repuesto:', error);
      toast.error(error.message || 'Ocurrió una excepción al intentar crear el repuesto.');
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Crear Nuevo Repuesto
      </h1>
      <RepuestoForm 
        onSubmit={handleCreateRepuesto} 
        isEditing={false} 
      />
    </div>
  );
}