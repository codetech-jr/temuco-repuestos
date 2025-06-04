// src/components/admin/RepuestoForm.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners"; // Importa el spinner que usarás

// Interfaz para los datos del formulario
export interface RepuestoFormData {
  slug: string;
  name: string;
  short_description?: string;
  price: number | string;
  original_price?: number | string;
  image_url?: string;
  category: string;
  brand: string;
  is_original: boolean; // Specific to Repuesto
  long_description?: string;
  features?: string;
  specifications?: string;
  images?: string;
  stock?: number | string;
  is_active: boolean;
  id?: string;
  created_at?: string;
  // rating y review_count no están en la interfaz de repuesto
}

// Esquema Zod para validación del lado del cliente
const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string().min(3, "El slug es muy corto").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo letras minúsculas, números y guiones)"),
  price: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val))),
    z.number({ required_error: "El precio es requerido", invalid_type_error: "El precio debe ser un número" }).positive("El precio debe ser positivo")
  ),
  category: z.string().min(1, "La categoría es requerida"),
  brand: z.string().min(1, "La marca es requerida"),
  is_original: z.boolean().optional().default(false),
  stock: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseInt(String(val), 10)),
    z.number({ invalid_type_error: "El stock debe ser un número entero" }).int("El stock debe ser un entero").min(0, "El stock no puede ser negativo").optional()
  ),
  short_description: z.string().optional().or(z.literal('')),
  original_price: z.preprocess(
    (val) => (String(val).trim() === "" ? undefined : parseFloat(String(val))),
    z.number({ invalid_type_error: "El precio original debe ser un número" }).positive("El precio original debe ser positivo").optional()
  ),
  image_url: z.string().optional().or(z.literal('')),
  features: z.string().optional().or(z.literal('')),
  specifications: z.string().optional().or(z.literal('')),
  images: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
});

// Interfaz para el objeto que se envía a la API
interface RepuestoApiData {
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
  features: string[];
  specifications: Array<{ key: string; value: string }>;
  images: string[];
  stock?: number;
  is_active: boolean;
}

interface RepuestoFormProps {
  initialData?: Partial<RepuestoFormData>;
  onSubmit: (data: RepuestoApiData) => Promise<boolean>;
  isEditing?: boolean;
}

export default function RepuestoForm({ initialData, onSubmit, isEditing = false }: RepuestoFormProps) {
  const [formData, setFormData] = useState<RepuestoFormData>({
    name: '', slug: '', price: '', category: '', brand: '', stock: '',
    short_description: '', original_price: '', image_url: '',
    features: '', specifications: '', images: '',
    is_active: true, is_original: false, // Default para is_original
    // No es necesario id ni created_at en el estado del formulario para los inputs
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Ya tenías este estado
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      const formReadyData: RepuestoFormData = {
        name: initialData.name || '',
        slug: initialData.slug || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        short_description: initialData.short_description || '',
        original_price: initialData.original_price !== undefined ? String(initialData.original_price) : '',
        image_url: initialData.image_url || '',
        features: Array.isArray(initialData.features) ? initialData.features.join(', ') : (initialData.features || ''),
        specifications: typeof initialData.specifications === 'string'
                        ? initialData.specifications
                        : (typeof initialData.specifications === 'object' && initialData.specifications !== null
                            ? JSON.stringify(initialData.specifications, null, 2)
                            : ''),
        images: Array.isArray(initialData.images) ? initialData.images.join(', ') : (initialData.images || ''),
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        is_original: initialData.is_original === undefined ? false : initialData.is_original,
        id: initialData.id,
        created_at: initialData.created_at,
      };
      setFormData(formReadyData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  type SpecificationItem = { key: string; value: string };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // alert("RepuestoForm: handleSubmit INVOCADO"); // Quita o comenta los alerts de depuración
    e.preventDefault();
    setErrors({});
    
    const validationResult = formSchema.safeParse(formData);

    if (!validationResult.success) {
      // alert("RepuestoForm: Falló la validación Zod del frontend!");
      console.error("Errores de validación Zod (RepuestoForm):", validationResult.error.flatten().fieldErrors);
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false); // Asegúrate de resetear
      return;
    }

    // alert("RepuestoForm: Validación Zod del frontend EXITOSA");
    setIsSubmitting(true); // Establece isSubmitting a true
    
    const dataFromZod = validationResult.data;
    const finalDataToSubmit: RepuestoApiData = {
      slug: dataFromZod.slug,
      name: dataFromZod.name,
      price: dataFromZod.price,
      category: dataFromZod.category,
      brand: dataFromZod.brand,
      is_active: dataFromZod.is_active,
      is_original: dataFromZod.is_original,
      short_description: dataFromZod.short_description || undefined,
      original_price: dataFromZod.original_price,
      image_url: dataFromZod.image_url || undefined,
      stock: dataFromZod.stock,
      long_description: formData.long_description?.trim() ? formData.long_description.trim() : undefined,
      features: dataFromZod.features ? dataFromZod.features.split(',').map(f => f.trim()).filter(f => f) : [],
      images: dataFromZod.images ? dataFromZod.images.split(',').map(i => i.trim()).filter(i => i) : [],
      specifications: [],
    };

    if (dataFromZod.specifications && typeof dataFromZod.specifications === 'string' && dataFromZod.specifications.trim() !== '') {
        try {
            const parsedSpecs = JSON.parse(dataFromZod.specifications);
            if (Array.isArray(parsedSpecs) && parsedSpecs.every(s => typeof s === 'object' && s !== null && 'key' in s && typeof s.key === 'string' && 'value' in s && typeof s.value === 'string')) {
                finalDataToSubmit.specifications = parsedSpecs as SpecificationItem[];
            } else {
                setErrors(prev => ({...prev, specifications: ["El formato debe ser un array de objetos: [{key: 'nombre', value: 'valor'}]"]}));
                setIsSubmitting(false); return;
            }
        } catch (jsonErr: any) {
            console.error("Error parseando JSON de especificaciones (RepuestoForm):", jsonErr);
            setErrors(prev => ({...prev, specifications: ["JSON inválido para especificaciones. Revise la sintaxis."]}));
            setIsSubmitting(false); return;
        }
    }

    // alert("RepuestoForm: dataToSubmit (para la API): " + JSON.stringify(finalDataToSubmit, null, 2));
    // alert("RepuestoForm: A punto de llamar a la prop onSubmit");
    try {
        const success = await onSubmit(finalDataToSubmit);
        // alert("RepuestoForm: prop onSubmit devolvió: " + success);
        if (success) {
            router.push('/admin/repuestos'); // CAMBIO: Redirigir a la lista de repuestos
            router.refresh();
        }
    } catch (apiError: any) {
        // alert("RepuestoForm: EXCEPCIÓN al llamar a la prop onSubmit: " + apiError.message);
        console.error("RepuestoForm: EXCEPCIÓN al llamar a la prop onSubmit:", apiError);
        // El toast de error debería manejarse en la página contenedora si onSubmit devuelve false
    } finally {
        setIsSubmitting(false); // Asegura que se resetee isSubmitting
    }
  };

  const generateSlugFromName = () => {
    if (formData.name && (!isEditing || !formData.slug) ) {
        const generated = formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '').substring(0, 100);
        setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* --- Campos del Formulario para Repuesto --- */}
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Repuesto <span className="text-red-500">*</span></label>
        <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} onBlur={generateSlugFromName}
               className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.join(', ')}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL amigable) <span className="text-red-500">*</span></label>
        <input type="text" name="slug" id="slug" value={formData.slug || ''} onChange={handleChange}
               className={`mt-1 block w-full px-3 py-2 border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.join(', ')}</p>}
        <p className="mt-1 text-xs text-gray-500">Ej: filtro-aceite-universal-xyz. Usar minúsculas, números y guiones.</p>
      </div>
      
      {/* Precio */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="1"
               className={`mt-1 block w-full px-3 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.join(', ')}</p>}
      </div>

      {/* Precio Original (Opcional) */}
      <div>
        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Precio Original (Opcional)</label>
        <input type="number" name="original_price" id="original_price" value={formData.original_price || ''} onChange={handleChange} step="1"
               className={`mt-1 block w-full px-3 py-2 border ${errors.original_price ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.original_price && <p className="mt-1 text-xs text-red-500">{errors.original_price.join(', ')}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
        <input type="text" name="category" id="category" value={formData.category || ''} onChange={handleChange}
               className={`mt-1 block w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.join(', ')}</p>}
      </div>

      {/* Marca */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
        <input type="text" name="brand" id="brand" value={formData.brand || ''} onChange={handleChange}
               className={`mt-1 block w-full px-3 py-2 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.join(', ')}</p>}
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (Opcional)</label>
        <input type="number" name="stock" id="stock" value={formData.stock || ''} onChange={handleChange} min="0" step="1"
               className={`mt-1 block w-full px-3 py-2 border ${errors.stock ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.join(', ')}</p>}
      </div>

      {/* Is Original Checkbox */}
      <div className="flex items-center">
        <input 
          id="is_original" 
          name="is_original" 
          type="checkbox" 
          checked={!!formData.is_original} // Asegurar que sea booleano para el input
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_original" className="ml-2 block text-sm text-gray-900">¿Repuesto Original?</label>
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta (Opcional)</label>
        <textarea name="short_description" id="short_description" value={formData.short_description || ''} onChange={handleChange} rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      {/* Long Description */}
       <div>
        <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga (Opcional)</label>
        <textarea name="long_description" id="long_description" value={formData.long_description || ''} onChange={handleChange} rows={5}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      
      {/* Image URL (Principal) */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen Principal (Opcional)</label>
        <input type="text" name="image_url" id="image_url" value={formData.image_url || ''} onChange={handleChange}
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        <p className="mt-1 text-xs text-gray-500">Ej: /images/repuestos/mi-repuesto.jpg</p>
      </div>
      
      {/* Omitir Rating y Review Count para Repuestos, a menos que los necesites */}

      {/* Features (como string separado por comas) */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por comas, opcional)</label>
        <textarea name="features" id="features" value={formData.features || ''} onChange={handleChange} rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        {/* {errors.features && <p className="mt-1 text-xs text-red-500">{typeof errors.features === 'string' ? errors.features : errors.features?.join(', ')}</p>} */}
      </div>

      {/* Specifications (como string JSON) */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (JSON, opcional)</label>
        <textarea name="specifications" id="specifications" value={formData.specifications || ''} onChange={handleChange} rows={5}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.specifications ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono`}></textarea>
        <p className="mt-1 text-xs text-gray-500"> Ej: {'[{"key":"Material","value":"Acero"}, {"key":"Compatibilidad","value":"Modelo XYZ"}]'}</p>
        {errors.specifications && <p className="mt-1 text-xs text-red-500">{errors.specifications.join(', ')}</p>}
      </div>
      
      {/* Images (URLs adicionales como string separado por comas) */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (URLs separadas por comas, opcional)</label>
        <textarea name="images" id="images" value={formData.images || ''} onChange={handleChange} rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        {/* {errors.images && <p className="mt-1 text-xs text-red-500">{typeof errors.images === 'string' ? errors.images : errors.images?.join(', ')}</p>} */}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">¿Repuesto activo?</label>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={() => router.back()}
                disabled={isSubmitting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
          Cancelar
        </button>
        <button type="submit"
                disabled={isSubmitting}
                className="bg-[#002A7F] hover:bg-[#002266] text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <PulseLoader size={8} color="#FFFFFF" className="mr-2" />
              <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
            </>
          ) : (
            isEditing ? 'Guardar Cambios' : 'Crear Repuesto'
          )}
        </button>
      </div>
    </form>
  );
}