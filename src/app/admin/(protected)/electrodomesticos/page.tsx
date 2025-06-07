// src/app/admin/electrodomesticos/page.tsx
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Electrodomestico {
  id: string;
  name: string;
  price: number;
  stock?: number;
  category: string;
  brand: string;
  is_active?: boolean;
}

const fetchAdminElectrodomesticos = async (): Promise<Electrodomestico[]> => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  
  try {
    const response = await fetch(`${API_BASE_URL}/electrodomesticos?limit=200`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Error fetching appliances:', await response.text());
      throw new Error('Failed to load appliances');
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Failed to load appliances");
    return [];
  }
};

const deleteElectrodomesticoAPI = async (id: string) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error("Auth error:", sessionError);
    toast.error("Authentication required");
    return { success: false, message: "Not authenticated" };
  }

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const loadingToastId = toast.loading('Deleting appliance...');

  try {
    const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    toast.dismiss(loadingToastId);

    if (!response.ok && response.status !== 204) {
      const errorData = await response.json().catch(() => ({ message: 'Deletion failed' }));
      console.error('API error:', response.status, errorData);
      return { success: false, message: errorData.message || `Error: ${response.statusText}` };
    }

    return { success: true };
  } catch (error) {
    toast.dismiss(loadingToastId);
    console.error("Deletion error:", error);
    return { success: false, message: 'Failed to delete appliance' };
  }
};

const AdminElectrodomesticosPage = () => {
  const [appliances, setAppliances] = useState<Electrodomestico[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppliances = async () => {
    setIsLoading(true);
    const data = await fetchAdminElectrodomesticos();
    setAppliances(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppliances();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    
    const result = await deleteElectrodomesticoAPI(id);
    if (result.success) {
      toast.success('Appliance deleted successfully');
      fetchAppliances();
    } else {
      toast.error(result.message || 'Failed to delete appliance');
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F]">
          Gestión de Electrodomésticos
        </h1>
        <Link
          href="/admin/electrodomesticos/nuevo"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          + Crear Nuevo
        </Link>
      </div>

      {appliances.length === 0 ? (
        <p>No appliances available</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Nombre', 'Categoría', 'Marca', 'Precio', 'Stock', 'Activo', 'Acciones'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appliances.map((appliance) => (
                <tr key={appliance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appliance.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appliance.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appliance.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP',
                      minimumFractionDigits: 0
                    }).format(appliance.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appliance.stock ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appliance.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {appliance.is_active ? 'Si' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link
                      href={`/admin/electrodomesticos/editar/${appliance.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(appliance.id, appliance.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminElectrodomesticosPage;