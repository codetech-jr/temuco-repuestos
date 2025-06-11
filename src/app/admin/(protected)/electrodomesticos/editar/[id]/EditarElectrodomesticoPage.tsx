"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function adaptApiDataToInitialFormData(apiData: ElectrodomesticoFromAPI): Partial<ElectrodomesticoFormData> {
  return {
    id: apiData.id,
    slug: apiData.slug,
    name: apiData.name,
    category: apiData.category,
    brand: apiData.brand,
    is_active: apiData.is_active ?? true,
    short_description: apiData.short_description ?? '',
    long_description: apiData.long_description ?? '',
    price: String(apiData.price ?? ''),
    original_price: apiData.original_price != null ? String(apiData.original_price) : '',
    stock: apiData.stock != null ? String(apiData.stock) : '',
    features: Array.isArray(apiData.features) ? apiData.features.join(', ') : (typeof apiData.features === 'string' ? apiData.features : ''),
    specifications: typeof apiData.specifications === 'string'
      ? apiData.specifications
      : (apiData.specifications ? JSON.stringify(apiData.specifications, null, 2) : ''),
    image_url: apiData.image_url ?? '',
    images: Array.isArray(apiData.images) ? apiData.images : (typeof apiData.images === 'string' ? apiData.images.split(',').map(s => s.trim()).filter(Boolean) : undefined),
    created_at: apiData.created_at,
  };
}

type Props = {
  id: string;
};

export default function EditarElectrodomesticoPage({ id }: Props) {
  const router = useRouter();
  const [initialData, setInitialData] = useState<Partial<ElectrodomesticoFormData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID no válido.");
      setLoading(false);
      toast.error("ID no válido.");
      return;
    }

    const fetchElectrodomestico = async () => {
      setLoading(true);
      setError(null);
      setFormSubmitError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, { cache: 'no-store' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(response.status === 404 ? 'Electrodoméstico no encontrado.' : errorData.message || `Error ${response.status}`);
        }
        const dataFromAPI: ElectrodomesticoFromAPI = await response.json();
        setInitialData(adaptApiDataToInitialFormData(dataFromAPI));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Error al cargar el electrodoméstico';
        console.error("Error fetching electrodomestico para editar:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchElectrodomestico();
  }, [id]);

  const handleUpdate = async (data: FormData): Promise<boolean> => {
    setFormSubmitError(null);
    toast.dismiss();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/admin/login');
      return false;
    }
    const loadingToastId = toast.loading('Actualizando...');
    try {
      const response = await fetch(`${API_BASE_URL}/electrodomesticos/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${session.access_token}` },
        body: data,
      });
      toast.dismiss(loadingToastId);
      if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
          const responseData = await response.json();
          errorMessage = responseData.message || errorMessage;
        } catch { }
        toast.error(errorMessage);
        setFormSubmitError(errorMessage);
        return false;
      }
      toast.success('¡Actualizado exitosamente!');
      router.push('/admin/electrodomesticos');
      router.refresh();
      return true;
    } catch (err: unknown) {
      return false;
    }
  };

  if (loading) return <LoadingSpinner className="min-h-[calc(100vh-200px)]" />;
  if (error) return <div className="container mx-auto p-4 text-red-600 text-center"><p>Error: {error}</p><Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline mt-4 inline-block">Volver</Link></div>;
  if (!initialData) return <div className="container mx-auto p-4 text-center"><p>No se pudieron cargar los datos.</p><Link href="/admin/electrodomesticos" className="text-blue-600 hover:underline mt-4 inline-block">Volver</Link></div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F] mb-6">
        Editar Electrodoméstico: <span className="text-gray-700">{initialData.name || ''}</span>
      </h1>
      {formSubmitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{formSubmitError}</p>
        </div>
      )}
      <ElectrodomesticoForm onSubmit={handleUpdate} initialData={initialData} isEditing={true} />
    </div>
  );
}
