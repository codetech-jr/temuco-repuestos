// src/components/admin/ElectrodomesticoForm.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners";

// Interfaces
export interface ElectrodomesticoFormData {
  slug: string;
  name: string;
  short_description?: string;
  price: number | string;
  original_price?: number | string;
  image_url?: string;
  category: string;
  brand: string;
  rating?: number | string;
  review_count?: number | string;
  long_description?: string;
  features?: string[] | string;
  specifications?: string;
  images?: string[] | string;
  stock?: number | string;
  is_active: boolean;
  id?: string;
  created_at?: string;
}

type SpecificationItem = { key: string; value: string };

interface ElectrodomesticoFormProps {
  initialData?: Partial<ElectrodomesticoFormData>;
  onSubmit: (data: any) => Promise<boolean>;
  isEditing?: boolean;
}

// Schema
const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string().min(3, "El slug es muy corto").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo letras minúsculas, números y guiones)"),
  price: z.preprocess(
    (val) => parseNumberInput(val),
    z.number({ required_error: "El precio es requerido", invalid_type_error: "El precio debe ser un número" })
     .positive("El precio debe ser positivo")
  ),
  category: z.string().min(1, "La categoría es requerida"),
  brand: z.string().min(1, "La marca es requerida"),
  stock: z.preprocess(
    (val) => parseNumberInput(val, true),
    z.number({ invalid_type_error: "El stock debe ser un número entero" })
     .int("El stock debe ser un entero")
     .min(0, "El stock no puede ser negativo")
     .optional()
  ),
  short_description: z.string().optional(),
  original_price: z.preprocess(
    (val) => parseNumberInput(val),
    z.number({ invalid_type_error: "El precio original debe ser un número" })
     .positive("El precio original debe ser positivo")
     .optional()
  ),
  image_url: z.string().optional().or(z.literal('')),
  features: z.array(z.string().min(1, "La característica no puede estar vacía")).optional().default([]),
  specifications: z.string().optional(),
  images: z.array(z.string().min(1, "La URL de imagen no puede estar vacía")).optional().default([]),
  is_active: z.boolean(),
  rating: z.preprocess(
    (val) => parseNumberInput(val),
    z.number({ invalid_type_error: "Rating debe ser un número" })
     .min(0, "Rating no puede ser negativo")
     .max(5, "Rating no puede ser mayor a 5")
     .optional()
  ),
  review_count: z.preprocess(
    (val) => parseNumberInput(val, true),
    z.number({ invalid_type_error: "El conteo de reseñas debe ser un número entero" })
     .int("El conteo de reseñas debe ser un entero")
     .min(0, "El conteo de reseñas no puede ser negativo")
     .optional()
  ),
});

// Helper functions
const parseNumberInput = (val: unknown, isInteger = false): number | undefined => {
  const sVal = String(val).trim();
  if (sVal === "" || val === null || val === undefined) return undefined;
  const num = isInteger ? parseInt(sVal, 10) : parseFloat(sVal);
  return isNaN(num) ? undefined : num;
};

const formatInitialFeatures = (features: string[] | string | undefined): string => {
  if (Array.isArray(features)) return features.join(', ');
  if (typeof features === 'string') return features;
  return '';
};

const formatInitialImages = (images: string[] | string | undefined): string => {
  if (Array.isArray(images)) return images.join(', ');
  if (typeof images === 'string') return images;
  return '';
};

export default function ElectrodomesticoForm({ initialData, onSubmit, isEditing = false }: ElectrodomesticoFormProps) {
  // State
  const [formData, setFormData] = useState<ElectrodomesticoFormData>({
    name: '', slug: '', price: '', category: '', brand: '', stock: '',
    short_description: '', original_price: '', image_url: '',
    features: '', specifications: '', images: '',
    is_active: true, rating: '', review_count: '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Effects
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        slug: initialData.slug || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        category: initialData.category || '',
        brand: initialData.brand || '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        short_description: initialData.short_description || '',
        original_price: initialData.original_price !== undefined ? String(initialData.original_price) : '',
        image_url: initialData.image_url || '',
        features: formatInitialFeatures(initialData.features),
        specifications: typeof initialData.specifications === 'object' && initialData.specifications !== null
                      ? JSON.stringify(initialData.specifications, null, 2)
                      : (initialData.specifications || ''),
        images: formatInitialImages(initialData.images),
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        rating: initialData.rating !== undefined ? String(initialData.rating) : '',
        review_count: initialData.review_count !== undefined ? String(initialData.review_count) : '',
        id: initialData.id,
        created_at: initialData.created_at,
      });
    }
  }, [initialData]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const generateSlugFromName = () => {
    if (formData.name && (!isEditing || !formData.slug)) {
      const generated = formData.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .substring(0, 100);
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    // Preprocess form data
    const processedFormData = {
      ...formData,
      features: typeof formData.features === 'string' 
        ? formData.features.split(',').map(f => f.trim()).filter(f => f)
        : formData.features || [],
      images: typeof formData.images === 'string'
        ? formData.images.split(',').map(i => i.trim()).filter(i => i)
        : formData.images || []
    };

    // Validate with Zod
    const validationResult = formSchema.safeParse(processedFormData);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Prepare data for submission
    const dataFromZod = validationResult.data;
    const dataToSubmit = {
      slug: dataFromZod.slug,
      name: dataFromZod.name,
      short_description: dataFromZod.short_description || undefined,
      price: dataFromZod.price,
      original_price: dataFromZod.original_price,
      image_url: dataFromZod.image_url || undefined,
      category: dataFromZod.category,
      brand: dataFromZod.brand,
      rating: dataFromZod.rating,
      review_count: dataFromZod.review_count,
      long_description: formData.long_description?.trim() || undefined,
      features: dataFromZod.features,
      images: dataFromZod.images,
      specifications: [] as SpecificationItem[],
      stock: dataFromZod.stock,
      is_active: dataFromZod.is_active,
    };

    // Process specifications if present
    if (formData.specifications && typeof formData.specifications === 'string' && formData.specifications.trim() !== '') {
      try {
        const parsedSpecs = JSON.parse(formData.specifications);
        if (Array.isArray(parsedSpecs) && parsedSpecs.every(isValidSpecification)) {
          dataToSubmit.specifications = parsedSpecs as SpecificationItem[];
        } else {
          setErrors(prev => ({...prev, specifications: ["El formato debe ser un array de objetos: [{key: 'nombre', value: 'valor'}]"]}));
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        setErrors(prev => ({...prev, specifications: ["JSON inválido para especificaciones. Revise la sintaxis."]}));
        setIsSubmitting(false);
        return;
      }
    }

    // Submit data
    try {
      const success = await onSubmit(dataToSubmit);
      if (success) {
        router.push('/admin/electrodomesticos');
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidSpecification = (s: any): boolean => {
    return typeof s === 'object' && s !== null && 
           'key' in s && typeof s.key === 'string' &&
           'value' in s && typeof s.value === 'string';
  };

  // Render
  return (
 <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto <span className="text-red-500">*</span></label>
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
        <p className="mt-1 text-xs text-gray-500">Ej: lavadora-carga-frontal-lg-8kg. Usar minúsculas, números y guiones.</p>
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
        <p className="mt-1 text-xs text-gray-500">Ej: /images/productos/mi-producto.jpg</p>
      </div>
      
      {/* Features (como string separado por comas) */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por comas, opcional)</label>
        <textarea name="features" id="features" value={typeof formData.features === 'string' ? formData.features : (Array.isArray(formData.features) ? formData.features.join(', ') : '')} onChange={handleChange} rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        {errors.features && <p className="mt-1 text-xs text-red-500">{typeof errors.features === 'string' ? errors.features : errors.features?.join(', ')}</p>}
      </div>

      {/* Specifications (como string JSON) */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (JSON, opcional)</label>
        <textarea name="specifications" id="specifications" value={formData.specifications || ''} onChange={handleChange} rows={5}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.specifications ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono`}></textarea>
        <p className="mt-1 text-xs text-gray-500"> Ej: {'[{"key":"Color","value":"Rojo"}, {"key":"Material","value":"Acero"}]'}</p>
        {errors.specifications && <p className="mt-1 text-xs text-red-500">{errors.specifications.join(', ')}</p>}
      </div>
      
      {/* Images (URLs adicionales como string separado por comas) */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (URLs separadas por comas, opcional)</label>
        <textarea name="images" id="images" value={typeof formData.images === 'string' ? formData.images : (Array.isArray(formData.images) ? formData.images.join(', ') : '')} onChange={handleChange} rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        {errors.images && <p className="mt-1 text-xs text-red-500">{typeof errors.images === 'string' ? errors.images : errors.images?.join(', ')}</p>}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">¿Producto activo?</label>
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
                className="bg-[#002A7F] hover:bg-[#002266] text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center">
          {isSubmitting ? (
            <>
              <PulseLoader size={8} color="#FFFFFF" className="mr-2" />
              <span>{isEditing ? 'Actualizando...' : 'Creando...'}</span>
            </>
          ) : (
            isEditing ? 'Guardar Cambios' : 'Crear Electrodoméstico'
          )}
        </button>
      </div>
    </form>
  );
}