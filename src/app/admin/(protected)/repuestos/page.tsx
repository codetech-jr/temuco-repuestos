// src/app/admin/repuestos/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner'; // Ajusta la ruta si es necesario

// 1. Define o importa la interfaz Repuesto
export interface Repuesto {
  id: string;
  name: string;
  price: number;
  stock?: number;
  category: string;
  brand: string;
  is_original?: boolean;
  is_active?: boolean;
  // Añade otros campos que quieras mostrar en la tabla
}

// 2. Función para hacer fetch a la API de REPUESTOS
async function fetchAdminRepuestos(): Promise<Repuesto[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos?limit=100`, { // O implementa paginación
      cache: 'no-store',
    });
    if (!res.ok) {
      // En un caso real, podrías lanzar un error o devolverlo para mostrarlo en la UI
      console.error('Error al cargar repuestos para admin:', await res.text());
      return [];
    }
    const responseData = await res.json();
    return responseData.data || [];
  } catch (error) {
    console.error("Error en fetchAdminRepuestos:", error);
    return [];
  }
}

// 3. Función para ELIMINAR un REPUESTO vía API
async function deleteRepuestoAPI(id: string): Promise<boolean> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  // Necesitarás obtener el token JWT si tus rutas DELETE están protegidas
  // import { supabase } from '@/lib/supabase/client'; // Asume que tienes este cliente
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) { alert("No autenticado"); return false; }
  // const token = session.access_token;

  try {
    const res = await fetch(`${API_BASE_URL}/repuestos/${id}`, {
      method: 'DELETE',
      // headers: { 'Authorization': `Bearer ${token}` }, // Descomenta si la ruta está protegida
    });
    if (!res.ok && res.status !== 204) {
        const errorData = await res.json().catch(() => ({ message: 'Error al eliminar, respuesta no JSON' }));
        console.error('Error al eliminar repuesto:', res.status, errorData);
        alert(`Error al eliminar: ${errorData.message || res.statusText}`);
        return false;
    }
    return true;
  } catch (error) {
    console.error("Excepción al eliminar repuesto:", error);
    alert('Excepción al eliminar repuesto.');
    return false;
  }
}

// 4. Componente de Página Admin para Repuestos
export default function AdminRepuestosPage() {
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [loading, setLoading] = useState(true); // Inicia en true

  const loadRepuestos = async () => {
    setLoading(true); // Establece loading a true antes de la petición
    const data = await fetchAdminRepuestos();
    setRepuestos(data);
    setLoading(false); // Establece loading a false después de obtener los datos
  };

  useEffect(() => {
    loadRepuestos();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el repuesto "${name}"? Esta acción no se puede deshacer.`)) {
      // Podrías setear un estado de "eliminando específico" aquí si quieres
      const success = await deleteRepuestoAPI(id);
      if (success) {
        // En lugar de alert, usa toast si ya lo tienes configurado
        // toast.success('Repuesto eliminado exitosamente.');
        alert('Repuesto eliminado exitosamente.'); 
        loadRepuestos(); // Recargar la lista para reflejar el cambio
      }
      // El alert/toast de error ya se maneja en deleteRepuestoAPI
    }
  };

  if (loading) {
    // Muestra el spinner mientras los datos se cargan
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Ajusta min-h según tu layout */}
        <LoadingSpinner size={60} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F]">
          Gestión de Repuestos
        </h1>
        <Link href="/admin/repuestos/nuevo" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            + Crear Nuevo Repuesto
          </a>
        </Link>
      </div>

      {repuestos.length === 0 ? (
        <p className="text-center text-gray-600 py-8">No hay repuestos para mostrar. ¡Crea uno nuevo!</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">¿Original?</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repuestos.map((repuesto) => (
                <tr key={repuesto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{repuesto.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repuesto.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repuesto.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(repuesto.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repuesto.stock ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {repuesto.is_original !== undefined ? (repuesto.is_original ? 'Sí' : 'No') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      repuesto.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {repuesto.is_active ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href={`/admin/repuestos/editar/${repuesto.id}`} legacyBehavior>
                      <a className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</a>
                    </Link>
                    <button
                      onClick={() => handleDelete(repuesto.id, repuesto.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Aquí podrías añadir controles de paginación si fetchAdminRepuestos la implementa 
          y devuelve totalPages, currentPage etc. */}
    </div>
  );
}