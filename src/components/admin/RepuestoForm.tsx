// src/components/admin/RepuestoForm.tsx
"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners";

export interface RepuestoFormData {
  slug: string;
  name: string;
  short_description?: string;
  price: number | string;
  original_price?: number | string;
  image_url?: string;
  category: string; // Se mantiene como string para el valor del select
  brand: string;    // Se mantiene como string para el valor del select
  is_original: boolean;
  long_description?: string;
  features?: string;
  specifications?: string;
  images?: string;
  stock?: number | string;
  is_active: boolean;
  id?: string;
  created_at?: string;
}

// --- Definición de opciones para los desplegables de Repuestos ---
const REPUESTO_CATEGORY_OPTIONS = [
  "Filtros (Agua, Aire, Aceite)",
  "Correas y Bandas",
  "Motores y Componentes de Motor",
  "Tarjetas Electrónicas y Módulos de Control",
  "Bombas (Agua, Drenaje, Combustible)",
  "Mangueras, Tubos y Conexiones",
  "Sensores, Interruptores y Termostatos",
  "Perillas, Botones y Manijas",
  "Sellos y Juntas",
  "Rodamientos y Bujes",
  "Componentes de Suspensión y Dirección",
  "Partes de Carrocería y Estructura",
  "Herramientas Específicas",
  "Otros Repuestos"
  // Adapta esta lista a tus necesidades
];

const REPUESTO_BRAND_OPTIONS = [
  "Bosch (Repuestos)",
  "LG (Repuestos)",
  "Samsung (Repuestos)",
  "Whirlpool (Repuestos)",
  "Mabe (Repuestos)",
  "Electrolux (Repuestos)",
  "Oster (Repuestos)",
  "Sindelen (Repuestos)",
  "Thomas (Repuestos)",
  "Honda (Repuestos)",
  "Yamaha (Repuestos)",
  "Stihl (Repuestos)",
  "Makita (Repuestos)",
  "Genérico / Compatible",
  "Original del Fabricante (OEM)",
  "Otra Marca (Repuestos)"
  // Adapta esta lista a tus necesidades
];
// ----------------------------------------------------

const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string()
    .min(3, "El slug es muy corto")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo letras minúsculas, números y guiones)"),
  price: z.preprocess(
    (val) => {
      const sVal = String(val).trim();
      if (sVal === "") return undefined;
      const num = parseFloat(sVal);
      return isNaN(num) ? val : num; // Devuelve original si NaN para que z.number falle
    },
    z.number({ required_error: "El precio es requerido", invalid_type_error: "El precio debe ser un número" })
      .positive("El precio debe ser positivo")
  ),
  category: z.string().min(1, "La categoría es requerida")
    .refine(value => REPUESTO_CATEGORY_OPTIONS.includes(value), {
      message: "Por favor, seleccione una categoría válida de la lista."
    }),
  brand: z.string().min(1, "La marca es requerida")
    .refine(value => REPUESTO_BRAND_OPTIONS.includes(value), {
      message: "Por favor, seleccione una marca válida de la lista."
    }),
  is_original: z.boolean().optional().default(false),
  stock: z.preprocess(
    (val) => {
      const sVal = String(val).trim();
      if (sVal === "" || val === null || val === undefined) return undefined;
      const num = parseInt(sVal, 10);
      return isNaN(num) ? undefined : num;
    },
    z.number({ invalid_type_error: "El stock debe ser un número entero" })
      .int("El stock debe ser un entero")
      .min(0, "El stock no puede ser negativo")
      .optional()
  ),
  short_description: z.string().optional().or(z.literal('')),
  original_price: z.preprocess(
    (val) => {
      const sVal = String(val).trim();
      if (sVal === "" || val === null || val === undefined) return undefined;
      const num = parseFloat(sVal);
      return isNaN(num) ? undefined : num;
    },
    z.number({ invalid_type_error: "El precio original debe ser un número" })
      .positive("El precio original debe ser positivo")
      .optional()
  ),
  image_url: z.string().url({ message: "URL de imagen inválida" }).optional().or(z.literal('')),
  features: z.string().optional().or(z.literal('')),
  specifications: z.string().optional().or(z.literal('')),
  images: z.string().optional().or(z.literal('')),
  is_active: z.boolean(),
});

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

type SpecificationItem = { key: string; value: string };

export default function RepuestoForm({ initialData, onSubmit, isEditing = false }: RepuestoFormProps) {
  const [formData, setFormData] = useState<RepuestoFormData>({
    name: '',
    slug: '',
    price: '',
    category: '', // Valor inicial para el select
    brand: '',    // Valor inicial para el select
    stock: '',
    short_description: '',
    original_price: '',
    image_url: '',
    features: '',
    specifications: '',
    images: '',
    is_active: true,
    is_original: false,
    long_description: '', // Añadido aquí
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialData) {
      const formReadyData: RepuestoFormData = {
        name: initialData.name || '',
        slug: initialData.slug || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        category: initialData.category || '', // Se asigna para preseleccionar en el dropdown
        brand: initialData.brand || '',       // Se asigna para preseleccionar en el dropdown
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        short_description: initialData.short_description || '',
        original_price: initialData.original_price !== undefined ? String(initialData.original_price) : '',
        image_url: initialData.image_url || '',
        features: Array.isArray(initialData.features) 
          ? initialData.features.join(', ') 
          : (initialData.features || ''),
        specifications: typeof initialData.specifications === 'string'
          ? initialData.specifications
          : (typeof initialData.specifications === 'object' && initialData.specifications !== null
              ? JSON.stringify(initialData.specifications, null, 2)
              : ''),
        images: Array.isArray(initialData.images) 
          ? initialData.images.join(', ') 
          : (initialData.images || ''),
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        is_original: initialData.is_original === undefined ? false : initialData.is_original,
        long_description: initialData.long_description || '',
        id: initialData.id,
        created_at: initialData.created_at,
      };
      setFormData(formReadyData);
    } else {
      // Aseguramos que para un formulario nuevo, category y brand estén vacíos
      // para mostrar el placeholder del select correctamente.
      // El estado inicial de useState ya los tiene como '',
      // pero esto es para ser explícito si initialData puede volverse undefined después del montaje.
      setFormData(prev => ({
        ...prev,
        name: '', slug: '', price: '', category: '', brand: '', stock: '',
        short_description: '', original_price: '', image_url: '',
        features: '', specifications: '', images: '',
        is_active: true, is_original: false, long_description: '',
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (formSubmitError) {
      setFormSubmitError(null);
    }
  };

  const generateSlugFromName = () => {
    if (formData.name && (!isEditing || !formData.slug)) {
      const generated = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .substring(0, 100);
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setFormSubmitError(null);
    
    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      console.error("Errores de validación Zod:", validationResult.error.flatten().fieldErrors);
      setErrors(validationResult.error.flatten().fieldErrors);
      return;
    }

    setIsSubmitting(true);
    const dataFromZod = validationResult.data;

    try {
      const finalDataToSubmit: RepuestoApiData = {
        slug: dataFromZod.slug,
        name: dataFromZod.name,
        price: dataFromZod.price,
        category: dataFromZod.category, // Valor del select
        brand: dataFromZod.brand,       // Valor del select
        is_active: dataFromZod.is_active,
        is_original: dataFromZod.is_original ?? false, // Asegurar que sea boolean
        short_description: dataFromZod.short_description || undefined,
        original_price: dataFromZod.original_price,
        image_url: dataFromZod.image_url || undefined,
        stock: dataFromZod.stock,
        long_description: formData.long_description?.trim() || undefined,
        features: dataFromZod.features 
          ? dataFromZod.features.split(',').map(f => f.trim()).filter(f => f) 
          : [],
        images: dataFromZod.images 
          ? dataFromZod.images.split(',').map(i => i.trim()).filter(i => i) 
          : [],
        specifications: [],
      };

      if (dataFromZod.specifications?.trim()) {
        try {
          const parsedSpecs = JSON.parse(dataFromZod.specifications);
          if (Array.isArray(parsedSpecs) && parsedSpecs.every(s => isValidSpecItem(s) && s.key.trim() !== '')) {
            finalDataToSubmit.specifications = parsedSpecs.filter(s => s.key.trim() !== '');
          } else {
            setErrors(prev => ({
              ...prev,
              specifications: ["Formato de especificaciones inválido. Use: [{key: 'nombre', value: 'valor'}], y 'key' no debe estar vacío."]
            }));
            setIsSubmitting(false);
            return;
          }
        } catch (error) {
          setErrors(prev => ({
            ...prev,
            specifications: ["JSON inválido para especificaciones. Revise la sintaxis."]
          }));
          setIsSubmitting(false);
          return;
        }
      }

      const success = await onSubmit(finalDataToSubmit);
      if (success) {
        router.push('/admin/repuestos');
        router.refresh();
      } else {
        setFormSubmitError("No se pudo guardar el repuesto. Por favor, inténtelo de nuevo.");
      }
    } catch (apiError: any) {
      console.error("Error en onSubmit:", apiError);
      setFormSubmitError(`Error al procesar la solicitud: ${apiError.message || 'Ocurrió un error inesperado.'}`);
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  const isValidSpecItem = (item: any): item is SpecificationItem => {
    return typeof item === 'object' && item !== null && 
           'key' in item && typeof item.key === 'string' && 
           'value' in item && typeof item.value === 'string';
  };

  const inputClasses = (field: keyof RepuestoFormData, hasError?: boolean) => 
    `mt-1 block w-full px-3 py-2 border ${(hasError ?? errors[field]) ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  
  const selectClasses = (field: keyof RepuestoFormData, hasError?: boolean) => 
    `mt-1 block w-full pl-3 pr-10 py-2 text-base border ${(hasError ?? errors[field]) ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`;
  
  const textAreaClasses = (field: keyof RepuestoFormData, hasError?: boolean) => 
    `mt-1 block w-full px-3 py-2 border ${(hasError ?? errors[field]) ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;


  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Repuesto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name || ''}
          onChange={handleChange}
          onBlur={generateSlugFromName}
          className={inputClasses('name')}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.join(', ')}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
          Slug (URL amigable) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="slug"
          id="slug"
          value={formData.slug || ''}
          onChange={handleChange}
          className={inputClasses('slug')}
        />
        {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.join(', ')}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Ej: filtro-aceite-universal-xyz. Usar minúsculas, números y guiones.
        </p>
      </div>
      
      {/* Price */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Precio <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="price"
          id="price"
          value={formData.price}
          onChange={handleChange}
          step="any" // Permite decimales
          className={inputClasses('price')}
        />
        {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.join(', ')}</p>}
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">
          Precio Original (Opcional)
        </label>
        <input
          type="number"
          name="original_price"
          id="original_price"
          value={formData.original_price || ''}
          onChange={handleChange}
          step="any" // Permite decimales
          className={inputClasses('original_price')}
        />
        {errors.original_price && <p className="mt-1 text-xs text-red-500">{errors.original_price.join(', ')}</p>}
      </div>

      {/* --- Category (Desplegable) --- */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          className={selectClasses('category')}
        >
          <option value="" disabled>Seleccione una categoría...</option>
          {REPUESTO_CATEGORY_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.join(', ')}</p>}
      </div>

      {/* --- Brand (Desplegable) --- */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
          Marca <span className="text-red-500">*</span>
        </label>
        <select
          id="brand"
          name="brand"
          value={formData.brand || ''}
          onChange={handleChange}
          className={selectClasses('brand')}
        >
          <option value="" disabled>Seleccione una marca...</option>
          {REPUESTO_BRAND_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.join(', ')}</p>}
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
          Stock (Opcional)
        </label>
        <input
          type="number"
          name="stock"
          id="stock"
          value={formData.stock || ''}
          onChange={handleChange}
          min="0"
          step="1"
          className={inputClasses('stock')}
        />
        {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock.join(', ')}</p>}
      </div>

      {/* Is Original Checkbox */}
      <div className="flex items-center">
        <input
          id="is_original"
          name="is_original"
          type="checkbox"
          checked={!!formData.is_original}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="is_original" className="ml-2 block text-sm text-gray-900">
          ¿Repuesto Original?
        </label>
        {errors.is_original && <p className="ml-2 text-xs text-red-500">{errors.is_original.join(', ')}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción Corta (Opcional)
        </label>
        <textarea
          name="short_description"
          id="short_description"
          value={formData.short_description || ''}
          onChange={handleChange}
          rows={3}
          className={textAreaClasses('short_description')}
        />
        {errors.short_description && <p className="mt-1 text-xs text-red-500">{errors.short_description.join(', ')}</p>}
      </div>

      {/* Long Description */}
      <div>
        <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción Larga (Opcional)
        </label>
        <textarea
          name="long_description"
          id="long_description"
          value={formData.long_description || ''}
          onChange={handleChange}
          rows={5}
          className={textAreaClasses('long_description')}
        />
        {/* No hay errores Zod para long_description aquí, se podría añadir */}
      </div>
      
      {/* Image URL */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
          URL de Imagen Principal (Opcional)
        </label>
        <input
          type="url" // Cambiado a type="url" para validación básica del navegador
          name="image_url"
          id="image_url"
          value={formData.image_url || ''}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          className={inputClasses('image_url')}
        />
        {errors.image_url && <p className="mt-1 text-xs text-red-500">{errors.image_url.join(', ')}</p>}
        <p className="mt-1 text-xs text-gray-500">Debe ser una URL válida. Ej: /images/repuestos/mi-repuesto.jpg o https://...</p>
      </div>
      
      {/* Features */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">
          Características (separadas por comas, opcional)
        </label>
        <textarea
          name="features"
          id="features"
          value={formData.features || ''}
          onChange={handleChange}
          rows={3}
          className={textAreaClasses('features')}
        />
         {errors.features && <p className="mt-1 text-xs text-red-500">{typeof errors.features === 'string' ? errors.features : errors.features?.join(', ')}</p>}
      </div>

      {/* Specifications */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">
          Especificaciones (JSON, opcional)
        </label>
        <textarea
          name="specifications"
          id="specifications"
          value={formData.specifications || ''}
          onChange={handleChange}
          rows={5}
          placeholder='[{"key":"Material","value":"Acero"}, {"key":"Compatibilidad","value":"Modelo XYZ"}]'
          className={`${textAreaClasses('specifications')} font-mono`}
        />
        <p className="mt-1 text-xs text-gray-500">
          Ej: {'[{"key":"Material","value":"Acero"}, {"key":"Compatibilidad","value":"Modelo XYZ"}]'}
        </p>
        {errors.specifications && <p className="mt-1 text-xs text-red-500">{errors.specifications.join(', ')}</p>}
      </div>
      
      {/* Additional Images */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
          Imágenes Adicionales (URLs separadas por comas, opcional)
        </label>
        <textarea
          name="images"
          id="images"
          value={formData.images || ''}
          onChange={handleChange}
          rows={3}
          placeholder="url1.jpg, url2.png, /ruta/interna/imagen3.webp"
          className={textAreaClasses('images')}
        />
         {errors.images && <p className="mt-1 text-xs text-red-500">{typeof errors.images === 'string' ? errors.images : errors.images?.join(', ')}</p>}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          ¿Repuesto activo?
        </label>
        {errors.is_active && <p className="ml-2 text-xs text-red-500">{errors.is_active.join(', ')}</p>}
      </div>

      {/* Mensaje de error general del formulario */}
      {formSubmitError && (
        <div className="p-3 my-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="text-sm font-medium">Error al enviar el formulario:</p>
          <p className="text-sm">{formSubmitError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#002A7F] hover:bg-[#002266] text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center min-w-[150px]"
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