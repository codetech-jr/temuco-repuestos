// src/components/admin/RepuestoForm.tsx
"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners";

// Interfaz para el estado interno del formulario y initialData
export interface RepuestoFormData {
  slug: string;
  name: string;
  short_description?: string;
  price: number | string; // Los inputs numéricos se manejan como string en el estado
  original_price?: number | string;
  image_url?: string;      // Para la URL existente o el input de texto de URL
  category: string;
  brand: string;
  is_original: boolean;
  long_description?: string;
  features?: string;       // String separado por comas para el textarea
  specifications?: string; // String JSON para el textarea
  images?: string;         // String separado por comas para el textarea de URLs
  stock?: number | string;
  is_active: boolean;
  id?: string;
  created_at?: string;
}

const REPUESTO_CATEGORY_OPTIONS = [
  "Filtros (Agua, Aire, Aceite)", "Correas y Bandas", "Motores y Componentes de Motor",
  "Tarjetas Electrónicas y Módulos de Control", "Bombas (Agua, Drenaje, Combustible)",
  "Mangueras, Tubos y Conexiones", "Sensores, Interruptores y Termostatos",
  "Perillas, Botones y Manijas", "Sellos y Juntas", "Rodamientos y Bujes",
  "Componentes de Suspensión y Dirección", "Partes de Carrocería y Estructura",
  "Herramientas Específicas", "Otros Repuestos"
];

const REPUESTO_BRAND_OPTIONS = [
  "Bosch (Repuestos)", "LG (Repuestos)", "Samsung (Repuestos)", "Whirlpool (Repuestos)",
  "Mabe (Repuestos)", "Electrolux (Repuestos)", "Oster (Repuestos)", "Sindelen (Repuestos)",
  "Thomas (Repuestos)", "Honda (Repuestos)", "Yamaha (Repuestos)", "Stihl (Repuestos)",
  "Makita (Repuestos)", "Genérico / Compatible", "Original del Fabricante (OEM)", "Otra Marca (Repuestos)"
];

// Helper para parsear números (importante para Zod preprocess)
const parseNumberInput = (val: unknown, isInteger = false): number | undefined | string => {
  const sVal = String(val).trim();
  if (sVal === "" || val === null || val === undefined) return undefined;
  const num = isInteger ? parseInt(sVal, 10) : parseFloat(sVal);
  return isNaN(num) ? (typeof val === 'string' ? val : String(val)) : num; // Devuelve original si NaN para que Zod falle
};

// Esquema Zod
const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string().min(3, "El slug es muy corto").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  price: z.preprocess(parseNumberInput, z.number({ required_error: "El precio es requerido", invalid_type_error: "Precio debe ser número" }).positive("Precio debe ser positivo")),
  category: z.string().min(1, "Categoría es requerida").refine(value => REPUESTO_CATEGORY_OPTIONS.includes(value), { message: "Seleccione categoría válida."}),
  brand: z.string().min(1, "Marca es requerida").refine(value => REPUESTO_BRAND_OPTIONS.includes(value), { message: "Seleccione marca válida."}),
  is_original: z.boolean().optional().default(false),
  stock: z.preprocess(val => parseNumberInput(val, true), z.number({invalid_type_error: "Stock debe ser entero"}).int("Stock debe ser entero").min(0, "Stock no puede ser negativo").optional().nullable()),
  short_description: z.string().max(255, "Máx 255 caracteres").optional().nullable(),
  original_price: z.preprocess(parseNumberInput, z.number({invalid_type_error: "Precio original debe ser número"}).positive("Precio original debe ser positivo").optional().nullable()),
  image_url: z.string().url("URL de imagen principal inválida").optional().nullable().or(z.literal('')), // Para el input de URL de texto
  features: z.string().optional().transform(val => val ? val.split(',').map(f => f.trim()).filter(f => f) : []), // Transforma string del textarea a array
  specifications: z.string().optional().nullable(), // El backend parseará el string JSON
  images: z.string().optional().transform(val => val ? val.split(',').map(i => i.trim()).filter(i => i.length > 0 && /^https?:\/\/.+/.test(i)) : []), // Transforma string del textarea a array de URLs válidas
  is_active: z.boolean().optional().default(true),
});


// Props del componente ACTUALIZADA
interface RepuestoFormProps {
  initialData?: Partial<RepuestoFormData & { images?: string[] | string; features?: string[] | string }>;
  onSubmit: (data: FormData, isFormDataIndeed: true) => Promise<boolean>;
  isEditing?: boolean;
}

export default function RepuestoForm({ initialData, onSubmit, isEditing = false }: RepuestoFormProps) {
  const [formData, setFormData] = useState<RepuestoFormData>({
    name: '', slug: '', price: '', category: '', brand: '', stock: '',
    short_description: '', original_price: '', image_url: '', features: '', specifications: '',
    images: '', // Para el textarea de URLs separadas por comas
    is_active: true, is_original: false, long_description: '',
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<FileList | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);

  const [errors, setErrors] = useState<Record<string, any>>({}); // Permitir any para fieldErrors de Zod
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
        features: typeof initialData.features === 'string' ? initialData.features : (Array.isArray(initialData.features) ? initialData.features.join(', ') : ''),
        specifications: typeof initialData.specifications === 'string' ? initialData.specifications : (initialData.specifications ? JSON.stringify(initialData.specifications, null, 2) : ''),
        images: typeof initialData.images === 'string' ? initialData.images : (Array.isArray(initialData.images) ? initialData.images.join(', ') : ''),
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        is_original: initialData.is_original === undefined ? false : initialData.is_original,
        long_description: initialData.long_description || '',
        id: initialData.id,
        created_at: initialData.created_at,
      });

      if (initialData.image_url) setMainImagePreview(initialData.image_url);
      if (initialData.images) {
        const imagesArray = Array.isArray(initialData.images) ? initialData.images : (typeof initialData.images === 'string' ? initialData.images.split(',').map(img => img.trim()).filter(img => img) : []);
        setAdditionalImagesPreview(imagesArray.filter(img => typeof img === 'string'));
      }
    } else {
      setFormData({ name: '', slug: '', price: '', category: '', brand: '', stock: '', short_description: '', original_price: '', image_url: '', features: '', specifications: '', images: '', is_active: true, is_original: false, long_description: ''});
      setMainImageFile(null); setMainImagePreview(null);
      setAdditionalImageFiles(null); setAdditionalImagesPreview([]);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? target.checked : undefined;
    setFormData(prev => ({ ...prev, [name]: checked !== undefined ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; setMainImageFile(file);
    if (file) { setMainImagePreview(URL.createObjectURL(file)); if (errors.image_url) setErrors(prev => ({ ...prev, image_url: undefined })); }
    else { setMainImagePreview(initialData?.image_url || null); (document.getElementById('mainImageFile_repuesto_input') as HTMLInputElement).value = '';}
  };

  const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; setAdditionalImageFiles(files);
    if (files && files.length > 0) { setAdditionalImagesPreview(Array.from(files).map(file => URL.createObjectURL(file))); if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));}
    else { 
        const initialImagesArray = Array.isArray(initialData?.images) && initialData.images.every(i => typeof i === 'string') ? initialData.images as string[] : (typeof initialData?.images === 'string' && initialData.images.trim() ? initialData.images.split(',').map(s=>s.trim()).filter(s=>s) : []);
        setAdditionalImagesPreview(initialImagesArray);
        (document.getElementById('additionalImageFiles_repuesto_input') as HTMLInputElement).value = '';
    }
  };
  
  const generateSlugFromName = () => {
    if (formData.name && (!isEditing || !formData.slug)) {
      const generated = formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').substring(0, 100);
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const dataForZod = {
        ...formData, // formData contiene los strings de los inputs
        // Los campos como price, stock, etc., son strings y Zod los preprocesará.
        // features e images (de los textareas) son strings; Zod los transformará.
        // image_url (del input de texto) es un string. Si se sube mainImageFile, esta URL no es tan relevante para Zod aquí.
    };
    
    const validationResult = formSchema.safeParse(dataForZod);
    if (!validationResult.success) {
      console.error("Errores Zod (RepuestoForm):", validationResult.error.flatten().fieldErrors);
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    const validatedDataFromZod = validationResult.data; // Datos ya parseados y transformados por Zod

    Object.entries(validatedDataFromZod).forEach(([key, value]) => {
      if (key === 'image_url' && mainImageFile) return; 
      if (key === 'images' && additionalImageFiles && additionalImageFiles.length > 0) return;

      if (Array.isArray(value)) {
        if (key === 'features') { 
            formDataToSend.append(key, value.join(','));
        } else if (key === 'images') { 
            if ((!additionalImageFiles || additionalImageFiles.length === 0) && value.length > 0) {
                value.forEach(url => formDataToSend.append('images', url));
            }
        } else if (key === 'specifications' && value.length > 0) { 
            formDataToSend.append(key, JSON.stringify(value));
        }
      } else if (typeof value === 'boolean') {
        formDataToSend.append(key, String(value));
      } else if (value !== null && value !== undefined) { 
        formDataToSend.append(key, String(value));
      }
    });
    
    if (formData.long_description && typeof validatedDataFromZod.long_description === 'undefined') {
        formDataToSend.append('long_description', formData.long_description);
    }
    if (formData.specifications && typeof validatedDataFromZod.specifications === 'string' && !Array.isArray(validatedDataFromZod.specifications) ) {
        formDataToSend.append('specifications', formData.specifications);
    } else if (formData.specifications && typeof validatedDataFromZod.specifications === 'undefined' ){
         formDataToSend.append('specifications', formData.specifications);
    }

    if (mainImageFile) formDataToSend.append('mainImage', mainImageFile);
    if (additionalImageFiles) {
      Array.from(additionalImageFiles).forEach((file) => formDataToSend.append('additionalImages', file));
    }

    try {
      const success = await onSubmit(formDataToSend, true);
      if (success && !isEditing) {
        setFormData({ name: '', slug: '', price: '', category: '', brand: '', stock: '', short_description: '', original_price: '', image_url: '', features: '', specifications: '', images: '', is_active: true, is_original: false, long_description: '' });
        setMainImageFile(null); setMainImagePreview(null);
        setAdditionalImageFiles(null); setAdditionalImagesPreview([]);
        const mainInput = document.getElementById('mainImageFile_repuesto_input') as HTMLInputElement; if (mainInput) mainInput.value = '';
        const additionalInput = document.getElementById('additionalImageFiles_repuesto_input') as HTMLInputElement; if (additionalInput) additionalInput.value = '';
      }
    } catch (error) { console.error("Error llamando a onSubmit desde RepuestoForm:", error); } 
    finally { setIsSubmitting(false); }
  };

  const inputClasses = (field: keyof RepuestoFormData) => `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  const selectClasses = (field: keyof RepuestoFormData) => `mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors[field] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`;
  const textAreaClasses = (field: keyof RepuestoFormData) => `mt-1 block w-full px-3 py-2 border ${errors[field] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Repuesto <span className="text-red-500">*</span></label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} onBlur={generateSlugFromName} className={inputClasses('name')} />
        {errors.name && <p className="mt-1 text-xs text-red-500">{typeof errors.name === 'string' ? errors.name : errors.name?.join(', ')}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
        <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={inputClasses('slug')} />
        {errors.slug && <p className="mt-1 text-xs text-red-500">{typeof errors.slug === 'string' ? errors.slug : errors.slug?.join(', ')}</p>}
      </div>
      
      {/* Precio */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="any" className={inputClasses('price')} />
        {errors.price && <p className="mt-1 text-xs text-red-500">{typeof errors.price === 'string' ? errors.price : errors.price?.join(', ')}</p>}
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Precio Original (Opcional)</label>
        <input type="number" name="original_price" id="original_price" value={formData.original_price} onChange={handleChange} step="any" className={inputClasses('original_price')} />
        {errors.original_price && <p className="mt-1 text-xs text-red-500">{typeof errors.original_price === 'string' ? errors.original_price : errors.original_price?.join(', ')}</p>}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className={selectClasses('category')}>
          <option value="" disabled>Seleccione...</option>
          {REPUESTO_CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-500">{typeof errors.category === 'string' ? errors.category : errors.category?.join(', ')}</p>}
      </div>

      {/* Brand */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
        <select id="brand" name="brand" value={formData.brand} onChange={handleChange} className={selectClasses('brand')}>
          <option value="" disabled>Seleccione...</option>
          {REPUESTO_BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.brand && <p className="mt-1 text-xs text-red-500">{typeof errors.brand === 'string' ? errors.brand : errors.brand?.join(', ')}</p>}
      </div>
      
      {/* Is Original */}
      <div className="flex items-center">
        <input id="is_original" name="is_original" type="checkbox" checked={formData.is_original} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_original" className="ml-2 block text-sm text-gray-900">¿Repuesto Original?</label>
        {errors.is_original && <p className="ml-2 text-xs text-red-500">{(errors.is_original as any)?.join?.(', ')}</p>}
      </div>

      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (Opcional)</label>
        <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" step="1" className={inputClasses('stock')} />
        {errors.stock && <p className="mt-1 text-xs text-red-500">{typeof errors.stock === 'string' ? errors.stock : errors.stock?.join(', ')}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta (Opcional)</label>
        <textarea name="short_description" id="short_description" value={formData.short_description} onChange={handleChange} rows={3} className={textAreaClasses('short_description')}></textarea>
        {errors.short_description && <p className="mt-1 text-xs text-red-500">{typeof errors.short_description === 'string' ? errors.short_description : errors.short_description?.join(', ')}</p>}
      </div>

      {/* Long Description */}
      <div>
        <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga (Opcional)</label>
        <textarea name="long_description" id="long_description" value={formData.long_description} onChange={handleChange} rows={5} className={textAreaClasses('long_description')}></textarea>
        {errors.long_description && <p className="mt-1 text-xs text-red-500">{typeof errors.long_description === 'string' ? errors.long_description : errors.long_description?.join(', ')}</p>}
      </div>

      {/* Main Image File Upload */}
      <div>
        <label htmlFor="mainImageFile_repuesto_input" className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal {isEditing && initialData?.image_url ? `(Reemplazar)` : ''}</label>
        <input type="file" id="mainImageFile_repuesto_input" onChange={handleMainImageChange} accept="image/*" className="input-file-styled" />
        {mainImagePreview && (
          <div className="mt-2">
            <img src={mainImagePreview} alt="Preview" className="preview-image" />
            <button type="button" onClick={() => { setMainImageFile(null); setMainImagePreview(initialData?.image_url || null); (document.getElementById('mainImageFile_repuesto_input') as HTMLInputElement).value = ''; }} className="btn-text-xs-red">Quitar</button>
          </div>
        )}
        {errors.image_url && !mainImageFile && !initialData?.image_url && <p className="error-text">{typeof errors.image_url === 'string' ? errors.image_url : errors.image_url?.join?.(', ')}</p>}
      </div>
      
      {/* URL de Imagen Principal (Alternativa) */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Imagen Principal (Alternativa)</label>
        <input type="url" name="image_url" id="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className={inputClasses('image_url')} />
        {errors.image_url && <p className="error-text">{typeof errors.image_url === 'string' ? errors.image_url : errors.image_url?.join?.(', ')}</p>}
      </div>

      {/* Additional Images File Upload */}
      <div>
        <label htmlFor="additionalImageFiles_repuesto_input" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (Múltiples)</label>
        <input type="file" id="additionalImageFiles_repuesto_input" multiple onChange={handleAdditionalImagesChange} accept="image/*" className="input-file-styled" />
        {additionalImagesPreview.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">{additionalImagesPreview.map((src, index) => (<img key={index} src={src} alt={`Preview ${index + 1}`} className="preview-image-sm" />))}</div>
            <button type="button" onClick={() => { setAdditionalImageFiles(null); const initialImagesArray = Array.isArray(initialData?.images) && initialData.images.every(i => typeof i === 'string') ? initialData.images as string[] : (typeof initialData?.images === 'string' && initialData.images.trim() ? initialData.images.split(',').map(s=>s.trim()).filter(s=>s) : []); setAdditionalImagesPreview(initialImagesArray); (document.getElementById('additionalImageFiles_repuesto_input') as HTMLInputElement).value = '';}} className="btn-text-xs-red">Quitar nuevas</button>
          </div>
        )}
        {errors.images && (!additionalImageFiles || additionalImageFiles.length === 0) && (!initialData?.images || (Array.isArray(initialData.images) && initialData.images.length === 0) || (typeof initialData.images === 'string' && !initialData.images.trim())) && <p className="error-text">{typeof errors.images === 'string' ? errors.images : (errors.images as any)?.join?.(', ')}</p>}
      </div>

      {/* Textarea para URLs de Imágenes Adicionales (Alternativa) */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (URLs - Alternativa)</label>
        <textarea name="images" id="images" value={formData.images} onChange={handleChange} rows={3} placeholder="url1.jpg, url2.png" className={textAreaClasses('images')}></textarea>
        {errors.images && <p className="error-text">{typeof errors.images === 'string' ? errors.images : (errors.images as any)?.join?.(', ')}</p>}
      </div>
      
      {/* Features */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por comas)</label>
        <textarea name="features" id="features" value={formData.features} onChange={handleChange} rows={3} className={textAreaClasses('features')}></textarea>
        {errors.features && <p className="error-text">{typeof errors.features === 'string' ? errors.features : (errors.features as any)?.join?.(', ')}</p>}
      </div>

      {/* Specifications */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (JSON)</label>
        <textarea name="specifications" id="specifications" value={formData.specifications} onChange={handleChange} rows={5} className={`${textAreaClasses('specifications')} font-mono`}></textarea>
        {errors.specifications && <p className="error-text">{typeof errors.specifications === 'string' ? errors.specifications : (errors.specifications as any)?.join?.(', ')}</p>}
      </div>

      {/* Is Active */}
      <div className="flex items-center">
        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">¿Repuesto activo?</label>
        {errors.is_active && <p className="ml-2 text-xs text-red-500">{(errors.is_active as any)?.join?.(', ')}</p>}
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary min-w-[150px] flex justify-center items-center">
          {isSubmitting ? <PulseLoader size={8} color="#FFFFFF" className="mr-2" /> : ''}
          <span>{isEditing ? 'Guardar Cambios' : 'Crear Repuesto'}</span>
        </button>
      </div>
    </form>
  );
}