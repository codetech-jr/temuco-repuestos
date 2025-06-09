// src/components/admin/ElectrodomesticoForm.tsx
"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners";

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
  features?: string;       // String para el textarea
  specifications?: string; // String JSON para el textarea
  images?: string;         // String para el textarea de URLs
  stock?: number | string;
  is_active: boolean;
  id?: string;
  created_at?: string;
}

interface ElectrodomesticoFormProps {
  initialData?: Partial<ElectrodomesticoFormData & { images?: string[] | string; features?: string[] | string; specifications?: any[] | string }>;
  onSubmit: (data: FormData, isFormDataIndeed: true) => Promise<boolean>;
  isEditing?: boolean;
}

const CATEGORY_OPTIONS = [
  "Lavadoras", "Refrigeradores", "Cocinas", "Hornos", 
  "Microondas", "Aires Acondicionados", "Televisores", 
  "Aspiradoras", "Licuadoras", "Batidoras", "Cafeteras", 
  "Otros Electrodomésticos"
];
const BRAND_OPTIONS = [
  "LG", "Samsung", "Whirlpool", "Mabe", "Electrolux", 
  "Bosch", "Sony", "Panasonic", "Oster", "Sindelen", 
  "Thomas", "Otra Marca"
];
const parseNumberInput = (val: unknown, isInteger = false): number | undefined | string => {
  const sVal = String(val).trim();
  if (sVal === "" || val === null || val === undefined) return undefined;
  const num = isInteger ? parseInt(sVal, 10) : parseFloat(sVal);
  return isNaN(num) ? (typeof val === 'string' ? val : String(val)) : num;
};

const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string().min(3, "El slug es muy corto").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  price: z.preprocess(parseNumberInput, z.number({ required_error: "El precio es requerido", invalid_type_error: "Precio debe ser número" }).positive("Precio debe ser positivo")),
  category: z.string().min(1, "Categoría es requerida").refine(val => CATEGORY_OPTIONS.includes(val), { message: "Seleccione categoría válida." }),
  brand: z.string().min(1, "Marca es requerida").refine(val => BRAND_OPTIONS.includes(val), { message: "Seleccione marca válida." }),
  stock: z.preprocess(val => parseNumberInput(val, true), z.number({invalid_type_error: "Stock debe ser entero"}).int("Stock debe ser entero").min(0, "Stock no puede ser negativo").optional().nullable()),
  short_description: z.string().max(255, "Max 255 caracteres").optional().nullable(),
  original_price: z.preprocess(parseNumberInput, z.number({invalid_type_error: "Precio original debe ser número"}).positive("Precio original debe ser positivo").optional().nullable()),
  image_url: z.string().url("URL de imagen principal (texto) inválida").optional().nullable().or(z.literal('')),
  features: z.string().optional().transform(val => val ? val.split(',').map(f => f.trim()).filter(f => f) : []),
  specifications: z.string().optional().nullable().transform(val => {
    if (!val || val.trim() === '' || val.trim() === '[]') return []; // Si es vacío o '[]', array vacío
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
  }),
  images: z.string().optional().transform(val => val ? val.split(',').map(i => i.trim()).filter(i => i.length > 0 && /^https?:\/\/.+/.test(i)) : []),
  is_active: z.boolean().optional().default(true),
  rating: z.preprocess(parseNumberInput, z.number({invalid_type_error: "Rating debe ser número"}).min(0,"Rating >= 0").max(5,"Rating <= 5").optional().nullable()),
  review_count: z.preprocess(val => parseNumberInput(val, true), z.number({invalid_type_error: "Conteo reseñas debe ser entero"}).int().min(0).optional().nullable()),
  long_description: z.string().optional().nullable(),
});

export default function ElectrodomesticoForm({ initialData, onSubmit, isEditing = false }: ElectrodomesticoFormProps) {
  const [formData, setFormData] = useState<ElectrodomesticoFormData>({
    name: '', slug: '', price: '', category: '', brand: '', stock: '',
    short_description: '', original_price: '', image_url: '',
    features: '', specifications: '[]', images: '',
    is_active: true, rating: '', review_count: '', long_description: '',
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<FileList | null>(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, any>>({});
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
        specifications: typeof initialData.specifications === 'string' ? initialData.specifications : (initialData.specifications && Array.isArray(initialData.specifications) && initialData.specifications.length > 0 ? JSON.stringify(initialData.specifications, null, 2) : '[]'),
        images: typeof initialData.images === 'string' ? initialData.images : (Array.isArray(initialData.images) ? initialData.images.join(', ') : ''),
        is_active: initialData.is_active === undefined ? true : initialData.is_active,
        rating: initialData.rating !== undefined ? String(initialData.rating) : '',
        review_count: initialData.review_count !== undefined ? String(initialData.review_count) : '',
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
      setFormData({ name: '', slug: '', price: '', category: '', brand: '', stock: '', short_description: '', original_price: '', image_url: '', features: '', specifications: '[]', images: '', is_active: true, rating: '', review_count: '', long_description: ''});
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
  
  const generateSlugFromName = () => {
    if (formData.name && (!isEditing || !formData.slug)) {
      const generated = formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').substring(0, 100);
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; setMainImageFile(file);
    if (file) { setMainImagePreview(URL.createObjectURL(file)); if (errors.image_url) setErrors(prev => ({ ...prev, image_url: undefined })); }
    else { setMainImagePreview(initialData?.image_url || null); }
    e.target.value = ''; 
  };

  const handleAdditionalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; setAdditionalImageFiles(files);
    if (files && files.length > 0) { setAdditionalImagesPreview(Array.from(files).map(file => URL.createObjectURL(file))); if (errors.images) setErrors(prev => ({ ...prev, images: undefined }));}
    else { 
        const initialImagesArray = Array.isArray(initialData?.images) && initialData.images.every(i => typeof i === 'string') ? initialData.images as string[] : (typeof initialData?.images === 'string' && initialData.images.trim() ? initialData.images.split(',').map(s=>s.trim()).filter(s=>s) : []);
        setAdditionalImagesPreview(initialImagesArray);
    }
    e.target.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Pasar directamente formData a Zod.
    // Los campos numéricos serán strings, y Zod.preprocess los manejará.
    // features, images, specifications son strings de los textareas, y Zod.transform los manejará.
    const dataForZod = { 
        ...formData,
        // Asegurar que los campos que son opcionales y podrían ser null/undefined en formData
        // se pasen como string vacío si Zod espera un string antes del transform,
        // o dejar que Zod maneje el undefined si el campo es .optional() en el schema base.
        features: formData.features || "",
        images: formData.images || "", // Para el textarea, Zod lo transformará
        specifications: formData.specifications || "[]", // Default a '[]' si está vacío
        // image_url del input de texto. Si se sube archivo, esta URL es menos crítica para Zod aquí.
        // Zod validará si es una URL válida si se provee y no es string vacío.
        image_url: mainImageFile ? "" : (formData.image_url || ""), // Si hay archivo, Zod podría ignorar esto
    };
    
    console.log("ELECTRODOMESTICO FORM - Data for Zod:", JSON.stringify(dataForZod, null, 2));
    const validationResult = formSchema.safeParse(dataForZod);

    if (!validationResult.success) {
      console.error("Errores Zod (ElectrodomesticoForm):", validationResult.error.flatten().fieldErrors);
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    const validatedDataFromZod = validationResult.data; 

    Object.entries(validatedDataFromZod).forEach(([key, value]) => {
      if (key === 'image_url' && mainImageFile) return; 
      if (key === 'images' && additionalImageFiles && additionalImageFiles.length > 0) return;

      if (Array.isArray(value)) {
        if (key === 'features') { 
            if(value.length > 0) formDataToSend.append(key, value.join(','));
        } else if (key === 'images') { 
            if ((!additionalImageFiles || additionalImageFiles.length === 0) && value.length > 0) {
                value.forEach(url => formDataToSend.append('images', url));
            }
        } else if (key === 'specifications' && value.length > 0) { 
            formDataToSend.append(key, JSON.stringify(value));
        }
      } else if (typeof value === 'boolean') {
        formDataToSend.append(key, String(value));
      } else if (value !== null && value !== undefined && String(value).trim() !== '') { 
        formDataToSend.append(key, String(value));
      } else if (value === '' && (key === 'image_url' || key === 'short_description' || key === 'long_description')) {
        // Si quieres enviar strings vacíos explícitamente para ciertos campos opcionales de texto
        // formDataToSend.append(key, ''); 
        // Por ahora, la condición anterior (value !== null && value !== undefined && String(value).trim() !== '')
        // evita enviar strings vacíos, lo que usualmente significa "no valor" para el backend.
      } else if (value !== null && value !== undefined) { // Otros tipos como números ya parseados
        formDataToSend.append(key, String(value));
      }
    });
    
    // Considerar si long_description (si no está en Zod o es opcional y no se proveyó)
    // o specifications (si Zod no lo procesó) deben añadirse desde formData original.
    if (formData.long_description && typeof validatedDataFromZod.long_description === 'undefined') {
        formDataToSend.append('long_description', formData.long_description);
    }
    // Si specifications en Zod es solo z.string().optional() y no lo transforma a array,
    // y quieres enviar el string JSON original de formData si no está vacío y no es '[]'.
    if (formData.specifications && formData.specifications.trim() !== '[]' && 
        (typeof validatedDataFromZod.specifications === 'string' || typeof validatedDataFromZod.specifications === 'undefined')) {
        formDataToSend.append('specifications', formData.specifications);
    }


    if (mainImageFile) formDataToSend.append('mainImage', mainImageFile);
    if (additionalImageFiles) {
      Array.from(additionalImageFiles).forEach((file) => formDataToSend.append('additionalImages', file));
    }

    try {
      console.log("FRONTEND: Contenido de formDataToSend que se envía:");
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`FRONTEND: ${key}:`, value instanceof File ? value.name : value);
        }
      const success = await onSubmit(formDataToSend, true);
      if (success && !isEditing) {
        setFormData({ name: '', slug: '', price: '', category: '', brand: '', stock: '', short_description: '', original_price: '', image_url: '', features: '', specifications: '[]', images: '', is_active: true, rating: '', review_count: '', long_description: '' });
        setMainImageFile(null); setMainImagePreview(null);
        setAdditionalImageFiles(null); setAdditionalImagesPreview([]);
        const mainInput = document.getElementById('mainImageFile_electro_input') as HTMLInputElement; if (mainInput) mainInput.value = '';
        const additionalInput = document.getElementById('additionalImageFiles_electro_input') as HTMLInputElement; if (additionalInput) additionalInput.value = '';
      }
    } catch (error) { console.error("Error al llamar a onSubmit desde ElectrodomesticoForm:", error); } 
    finally { setIsSubmitting(false); }
  };

  const commonInputClasses = (hasError?: boolean) => `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  const commonSelectClasses = (hasError?: boolean) => `mt-1 block w-full pl-3 pr-10 py-2 text-base border ${hasError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`;
  const commonTextAreaClasses = (hasError?: boolean) => `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  const inputFileStyledClasses = "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer";
  const previewImageClasses = "h-32 w-auto object-contain rounded-md border border-gray-300 p-1";
  const previewImageSmClasses = "h-24 w-auto object-contain rounded-md border border-gray-300 p-1";
  const btnTextXsRedClasses = "mt-1 text-xs text-red-600 hover:text-red-800";
  const errorTextClasses = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto <span className="text-red-500">*</span></label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} onBlur={generateSlugFromName} className={commonInputClasses(!!errors.name)} />
        {errors.name && <p className={errorTextClasses}>{errors.name?._errors?.join?.(', ')}</p>}
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
        <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={commonInputClasses(!!errors.slug)} />
        {errors.slug && <p className={errorTextClasses}>{errors.slug?._errors?.join?.(', ')}</p>}
      </div>
      
      {/* Precio */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="any" className={commonInputClasses(!!errors.price)} />
        {errors.price && <p className={errorTextClasses}>{errors.price?._errors?.join?.(', ')}</p>}
      </div>

      {/* Precio Original */}
      <div>
        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Precio Original (Opcional)</label>
        <input type="number" name="original_price" id="original_price" value={formData.original_price} onChange={handleChange} step="any" className={commonInputClasses(!!errors.original_price)} />
        {errors.original_price && <p className={errorTextClasses}>{errors.original_price?._errors?.join?.(', ')}</p>}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className={commonSelectClasses(!!errors.category)}>
          <option value="" disabled>Seleccione...</option>
          {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.category && <p className={errorTextClasses}>{errors.category?._errors?.join?.(', ')}</p>}
      </div>

      {/* Marca */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
        <select id="brand" name="brand" value={formData.brand} onChange={handleChange} className={commonSelectClasses(!!errors.brand)}>
          <option value="" disabled>Seleccione...</option>
          {BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {errors.brand && <p className={errorTextClasses}>{errors.brand?._errors?.join?.(', ')}</p>}
      </div>
      
      {/* Stock */}
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (Opcional)</label>
        <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" step="1" className={commonInputClasses(!!errors.stock)} />
        {errors.stock && <p className={errorTextClasses}>{errors.stock?._errors?.join?.(', ')}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta (Opcional)</label>
        <textarea name="short_description" id="short_description" value={formData.short_description} onChange={handleChange} rows={3} className={commonTextAreaClasses(!!errors.short_description)}></textarea>
        {errors.short_description && <p className={errorTextClasses}>{errors.short_description?._errors?.join?.(', ')}</p>}
      </div>

      {/* Long Description */}
      <div>
        <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga (Opcional)</label>
        <textarea name="long_description" id="long_description" value={formData.long_description} onChange={handleChange} rows={5} className={commonTextAreaClasses(!!errors.long_description)}></textarea>
        {errors.long_description && <p className={errorTextClasses}>{errors.long_description?._errors?.join?.(', ')}</p>}
      </div>

      {/* Main Image File Upload */}
      <div>
        <label htmlFor="mainImageFile_electro_input" className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal {isEditing && initialData?.image_url ? `(Reemplazar)` : ''}</label>
        <input type="file" id="mainImageFile_electro_input" onChange={handleMainImageChange} accept="image/*" className={inputFileStyledClasses} />
        {mainImagePreview && (
          <div className="mt-2">
            <img src={mainImagePreview} alt="Preview" className={previewImageClasses} />
            <button type="button" onClick={() => { setMainImageFile(null); setMainImagePreview(initialData?.image_url || null); (document.getElementById('mainImageFile_electro_input') as HTMLInputElement).value = ''; }} className={btnTextXsRedClasses}>Quitar imagen</button>
          </div>
        )}
        {errors.image_url && !mainImageFile && !initialData?.image_url && <p className={errorTextClasses}>{errors.image_url?._errors?.join?.(', ')}</p>}
      </div>
      
      {/* URL de Imagen Principal (Alternativa) */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Imagen Principal (Alternativa)</label>
        <input type="url" name="image_url" id="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className={commonInputClasses(!!errors.image_url)} />
        {errors.image_url && <p className={errorTextClasses}>{errors.image_url?._errors?.join?.(', ')}</p>}
      </div>

      {/* Rating */}
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5, opcional)</label>
        <input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className={commonInputClasses(!!errors.rating)} />
        {errors.rating && <p className={errorTextClasses}>{errors.rating?._errors?.join?.(', ')}</p>}
      </div>

      {/* Review Count */}
      <div>
        <label htmlFor="review_count" className="block text-sm font-medium text-gray-700 mb-1">Conteo de Reseñas (opcional)</label>
        <input type="number" name="review_count" id="review_count" value={formData.review_count} onChange={handleChange} min="0" step="1" className={commonInputClasses(!!errors.review_count)} />
        {errors.review_count && <p className={errorTextClasses}>{errors.review_count?._errors?.join?.(', ')}</p>}
      </div>
      
      {/* Features */}
      <div>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por comas)</label>
        <textarea name="features" id="features" value={formData.features} onChange={handleChange} rows={3} placeholder="Potente, Silencioso" className={commonTextAreaClasses(!!errors.features)}></textarea>
        {errors.features && <p className={errorTextClasses}>{(errors.features?._errors || (Array.isArray(errors.features) ? errors.features : [errors.features])).join(', ')}</p>}
      </div>

      {/* Specifications */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (JSON)</label>
        <textarea name="specifications" id="specifications" value={formData.specifications} onChange={handleChange} rows={5} placeholder='[{"key":"Color","value":"Rojo"}]' className={`${commonTextAreaClasses(!!errors.specifications)} font-mono`}></textarea>
        {errors.specifications && <p className={errorTextClasses}>{errors.specifications?._errors?.join?.(', ')}</p>}
      </div>

      {/* Additional Images File Upload */}
      <div>
        <label htmlFor="additionalImageFiles_electro_input" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (Múltiples)</label>
        <input type="file" id="additionalImageFiles_electro_input" multiple onChange={handleAdditionalImagesChange} accept="image/*" className={inputFileStyledClasses} />
        {additionalImagesPreview.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">{additionalImagesPreview.map((src, index) => (<img key={index} src={src} alt={`Preview ${index + 1}`} className={previewImageSmClasses} />))}</div>
            <button type="button" onClick={() => { setAdditionalImageFiles(null); const initialImagesArray = Array.isArray(initialData?.images) && initialData.images.every(i => typeof i === 'string') ? initialData.images as string[] : (typeof initialData?.images === 'string' && initialData.images.trim() ? initialData.images.split(',').map(s=>s.trim()).filter(s=>s) : []); setAdditionalImagesPreview(initialImagesArray); (document.getElementById('additionalImageFiles_electro_input') as HTMLInputElement).value = '';}} className={btnTextXsRedClasses}>Quitar nuevas imágenes</button>
          </div>
        )}
        {errors.images && (!additionalImageFiles || additionalImageFiles.length === 0) && (!initialData?.images || (Array.isArray(initialData.images) && initialData.images.length === 0) || (typeof initialData.images === 'string' && !initialData.images.trim())) && <p className={errorTextClasses}>{(errors.images?._errors || (Array.isArray(errors.images) ? errors.images : [errors.images])).join(', ')}</p>}
      </div>

      {/* Textarea para URLs de Imágenes Adicionales (Alternativa) */}
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (URLs - Alternativa)</label>
        <textarea name="images" id="images" value={formData.images} onChange={handleChange} rows={3} placeholder="url1.jpg, url2.png" className={commonTextAreaClasses(!!errors.images)}></textarea>
        {errors.images && <p className={errorTextClasses}>{(errors.images?._errors || (Array.isArray(errors.images) ? errors.images : [errors.images])).join(', ')}</p>}
      </div>
      
      {/* Is Active */}
      <div className="flex items-center">
        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">¿Producto activo?</label>
        {errors.is_active && <p className="ml-2 text-xs text-red-500">{errors.is_active?._errors?.join?.(', ')}</p>}
      </div>
      
      {/* Botones de Acción */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#002A7F] text-white font-semibold rounded-md hover:bg-[#002266] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[180px]">
          {isSubmitting ? <PulseLoader size={8} color="#FFFFFF" className="mr-2" /> : ''}
          <span>{isEditing ? 'Guardar Cambios' : 'Crear Electrodoméstico'}</span>
        </button>
      </div>
    </form>
  );
}