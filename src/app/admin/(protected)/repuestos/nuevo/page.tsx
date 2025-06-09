// src/app/admin/repuestos/nuevo/page.tsx
"use client";

import RepuestoForm from '@/components/admin/RepuestoForm';
import supabase from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CrearRepuestoPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData): Promise<boolean> => {
    setErrorMessage(null);
    toast.dismiss();

    if (!supabase) {
      const error = "Error de configuración: Cliente Supabase no disponible.";
      toast.error(error);
      setErrorMessage(error);
      return false;
    }
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      toast.error("No estás autenticado o tu sesión ha expirado. Redirigiendo a login...");
      setErrorMessage("No estás autenticado o tu sesión ha expirado.");
      router.push('/admin/login');
      return false;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    const loadingToastId = toast.loading('Creando repuesto...');

    try {
      const response = await fetch(`${API_BASE_URL}/repuestos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      toast.dismiss(loadingToastId);

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        if (response.status === 201) {
          toast.success('¡Repuesto creado exitosamente!');
          router.push('/admin/repuestos');
          router.refresh();
          return true;
        }
        const textResponse = await response.text();
        const error = `Error del servidor: ${response.status} - ${textResponse.substring(0, 100)}`;
        toast.error(error);
        setErrorMessage(error);
        return false;
      }

      const responseData = await response.json();
      if (!response.ok) {
        let error = responseData?.message || `Error al crear repuesto: ${response.statusText}`;
        if (responseData?.fieldErrors) {
          error += ` Detalles: ${Object.values(responseData.fieldErrors).flat().join(', ')}`;
        } else if (responseData?.details) {
          error += ` Detalles: ${responseData.details}`;
        }
        toast.error(error);
        setErrorMessage(error);
        return false;
      }

      toast.success(responseData?.message || '¡Repuesto creado exitosamente!');
      router.push('/admin/repuestos');
      router.refresh();
      return true;

    } catch (error: any) {
      toast.dismiss(loadingToastId);
      const errorMsg = error.message || 'Ocurrió una excepción al intentar crear el repuesto.';
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Crear Nuevo Repuesto
      </h1>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}
      <RepuestoForm 
        onSubmit={handleSubmit} 
        isEditing={false} 
      />
    </div>
  );
}