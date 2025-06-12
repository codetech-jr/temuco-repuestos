"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { PulseLoader } from "react-spinners";
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export interface ElectrodomesticoFormData {
  slug: string; name: string; short_description?: string; price: number | string;
  original_price?: number | string; image_url?: string; category: string; brand: string;
  rating?: number | string; review_count?: number | string; long_description?: string;
  features?: string; specifications?: string; images?: string; stock?: number | string;
  is_active: boolean; id?: string; created_at?: string;
}

interface ElectrodomesticoFormProps {
  initialData?: Omit<Partial<ElectrodomesticoFormData>, 'images' | 'features' | 'specifications'> & {
    images?: string[] | string;
    features?: string[] | string;
    specifications?: any[] | string;
  };
  onSubmit: (data: FormData, isFormDataIndeed: true) => Promise<boolean>;
  isEditing?: boolean;
}

const CATEGORY_OPTIONS = [ "Lavadoras", "Refrigeradores", "Cocinas", "Hornos", "Microondas", "Aires Acondicionados", "Televisores", "Aspiradoras", "Licuadoras", "Batidoras", "Cafeteras", "Otros Electrodomésticos" ];
const BRAND_OPTIONS = [ "LG", "Samsung", "Whirlpool", "Mabe", "Electrolux", "Bosch", "Sony", "Panasonic", "Oster", "Sindelen", "Thomas", "Otra Marca" ];

const parseNumberInput = (val: unknown, isInteger = false): number | undefined | string => {
  const sVal = String(val).trim();
  if (sVal === "" || val === null || val === undefined) return undefined;
  const num = isInteger ? parseInt(sVal, 10) : parseFloat(sVal);
  return isNaN(num) ? (typeof val === 'string' ? val : String(val)) : num;
};

const formSchema = z.object({
  name: z.string().min(3, "El nombre es muy corto"),
  slug: z.string().min(3, "El slug es muy corto").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido"),
  price: z.preprocess(val => parseNumberInput(val), z.number({ required_error: "El precio es requerido", invalid_type_error: "Precio debe ser número" }).positive("Precio debe ser positivo")),
  category: z.string().min(1, "Categoría es requerida").refine(val => CATEGORY_OPTIONS.includes(val), { message: "Seleccione categoría válida." }),
  brand: z.string().min(1, "Marca es requerida").refine(val => BRAND_OPTIONS.includes(val), { message: "Seleccione marca válida." }),
  stock: z.preprocess(val => parseNumberInput(val, true), z.number({invalid_type_error: "Stock debe ser entero"}).int("Stock debe ser entero").min(0, "Stock no puede ser negativo").optional().nullable()),
  short_description: z.string().max(255, "Max 255 caracteres").optional().nullable(),
  original_price: z.preprocess(val => parseNumberInput(val, false), z.number({invalid_type_error: "Precio original debe ser número"}).positive("Precio original debe ser positivo").optional().nullable()),
  image_url: z.string().url("URL de imagen principal (texto) inválida").optional().nullable().or(z.literal('')),
  features: z.string().optional().transform(val => val ? val.split(',').map(f => f.trim()).filter(f => f) : []),
  specifications: z.string().optional().nullable().transform(val => { try { const parsed = JSON.parse(val || '[]'); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }),
  images: z.string().optional().transform(val => val ? val.split(',').map(i => i.trim()).filter(i => i.length > 0 && /^https?:\/\/.+/.test(i)) : []),
  is_active: z.boolean().optional().default(true),
  rating: z.preprocess(val => parseNumberInput(val, false), z.number({invalid_type_error: "Rating debe ser número"}).min(0).max(5).optional().nullable()),
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
    setIsSubmitting(true);
    setErrors({});
    const dataForZod = { ...formData, features: formData.features || "", images: formData.images || "", specifications: formData.specifications || "[]", image_url: mainImageFile ? "" : (formData.image_url || ""), };
    const validationResult = formSchema.safeParse(dataForZod);

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(validationResult.data).forEach(([key, value]) => {
      if ((key === 'image_url' && mainImageFile) || (key === 'images' && additionalImageFiles && additionalImageFiles.length > 0)) return;
      if (Array.isArray(value)) {
        if (value.length > 0) formDataToSend.append(key, key === 'specifications' ? JSON.stringify(value) : value.join(','));
      } else if (value !== null && value !== undefined) {
        formDataToSend.append(key, String(value));
      }
    });

    if (mainImageFile) formDataToSend.append('mainImage', mainImageFile);
    if (additionalImageFiles) { Array.from(additionalImageFiles).forEach(file => formDataToSend.append('additionalImages', file)); }

    const success = await onSubmit(formDataToSend, true);
    if (success && !isEditing) {
        setFormData({ name: '', slug: '', price: '', category: '', brand: '', stock: '', short_description: '', original_price: '', image_url: '', features: '', specifications: '[]', images: '', is_active: true, rating: '', review_count: '', long_description: '' });
        setMainImageFile(null); setMainImagePreview(null); setAdditionalImageFiles(null); setAdditionalImagesPreview([]);
    }
    setIsSubmitting(false);
  };

  const commonInputClasses = (hasError?: boolean) => `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  const commonSelectClasses = (hasError?: boolean) => `mt-1 block w-full pl-3 pr-10 py-2 text-base border ${hasError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`;
  const commonTextAreaClasses = (hasError?: boolean) => `mt-1 block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`;
  const inputFileStyledClasses = "mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer";
  const previewImageClasses = "h-32 w-auto object-contain rounded-md border border-gray-300 p-1";
  const previewImageSmClasses = "h-24 w-auto object-contain rounded-md border border-gray-300 p-1";
  const btnTextXsRedClasses = "mt-1 text-xs text-red-600 hover:text-red-800";
  
  const formContainerVariants: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
  const formItemVariants: Variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 15, stiffness: 200 } } };
  const errorVariants: Variants = { initial: { opacity: 0, y: -10, height: 0 }, animate: { opacity: 1, y: 0, height: 'auto' }, exit: { opacity: 0, y: -10, height: 0 } };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-md"
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={formItemVariants}>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto <span className="text-red-500">*</span></label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} onBlur={generateSlugFromName} className={commonInputClasses(!!errors.name)} />
        <AnimatePresence>{errors.name && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.name?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
        <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} className={commonInputClasses(!!errors.slug)} />
        <AnimatePresence>{errors.slug && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.slug?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio <span className="text-red-500">*</span></label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} step="any" className={commonInputClasses(!!errors.price)} />
        <AnimatePresence>{errors.price && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.price?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Precio Original (Opcional)</label>
        <input type="number" name="original_price" id="original_price" value={formData.original_price} onChange={handleChange} step="any" className={commonInputClasses(!!errors.original_price)} />
        <AnimatePresence>{errors.original_price && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.original_price?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Categoría <span className="text-red-500">*</span></label>
        <select id="category" name="category" value={formData.category} onChange={handleChange} className={commonSelectClasses(!!errors.category)}>
          <option value="" disabled>Seleccione...</option>
          {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <AnimatePresence>{errors.category && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.category?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
        <select id="brand" name="brand" value={formData.brand} onChange={handleChange} className={commonSelectClasses(!!errors.brand)}>
          <option value="" disabled>Seleccione...</option>
          {BRAND_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <AnimatePresence>{errors.brand && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.brand?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>
      
      <motion.div variants={formItemVariants}>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock (Opcional)</label>
        <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} min="0" step="1" className={commonInputClasses(!!errors.stock)} />
        <AnimatePresence>{errors.stock && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.stock?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Corta (Opcional)</label>
        <textarea name="short_description" id="short_description" value={formData.short_description} onChange={handleChange} rows={3} className={commonTextAreaClasses(!!errors.short_description)}></textarea>
        <AnimatePresence>{errors.short_description && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.short_description?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">Descripción Larga (Opcional)</label>
        <textarea name="long_description" id="long_description" value={formData.long_description} onChange={handleChange} rows={5} className={commonTextAreaClasses(!!errors.long_description)}></textarea>
        <AnimatePresence>{errors.long_description && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.long_description?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="mainImageFile_electro_input" className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal {isEditing && initialData?.image_url ? `(Reemplazar)` : ''}</label>
        <input type="file" id="mainImageFile_electro_input" onChange={handleMainImageChange} accept="image/*" className={inputFileStyledClasses} />
        <AnimatePresence>
            {mainImagePreview && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mt-2">
                <img src={mainImagePreview} alt="Preview" className={previewImageClasses} />
                <button type="button" onClick={() => { setMainImageFile(null); setMainImagePreview(initialData?.image_url || null); (document.getElementById('mainImageFile_electro_input') as HTMLInputElement).value = ''; }} className={btnTextXsRedClasses}>Quitar imagen</button>
            </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>{errors.image_url && !mainImageFile && !initialData?.image_url && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.image_url?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>
      
      <motion.div variants={formItemVariants}>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">URL Imagen Principal (Alternativa)</label>
        <input type="url" name="image_url" id="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://ejemplo.com/imagen.jpg" className={commonInputClasses(!!errors.image_url)} />
        <AnimatePresence>{errors.image_url && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.image_url?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5, opcional)</label>
        <input type="number" name="rating" id="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className={commonInputClasses(!!errors.rating)} />
        <AnimatePresence>{errors.rating && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.rating?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="review_count" className="block text-sm font-medium text-gray-700 mb-1">Conteo de Reseñas (opcional)</label>
        <input type="number" name="review_count" id="review_count" value={formData.review_count} onChange={handleChange} min="0" step="1" className={commonInputClasses(!!errors.review_count)} />
        <AnimatePresence>{errors.review_count && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.review_count?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>
      
      <motion.div variants={formItemVariants}>
        <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-1">Características (separadas por comas)</label>
        <textarea name="features" id="features" value={formData.features} onChange={handleChange} rows={3} placeholder="Potente, Silencioso" className={commonTextAreaClasses(!!errors.features)}></textarea>
        <AnimatePresence>{errors.features && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{(errors.features?._errors || (Array.isArray(errors.features) ? errors.features : [errors.features])).join(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-1">Especificaciones (JSON)</label>
        <textarea name="specifications" id="specifications" value={formData.specifications} onChange={handleChange} rows={5} placeholder='[{"key":"Color","value":"Rojo"}]' className={`${commonTextAreaClasses(!!errors.specifications)} font-mono`}></textarea>
        <AnimatePresence>{errors.specifications && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{errors.specifications?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="additionalImageFiles_electro_input" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (Múltiples)</label>
        <input type="file" id="additionalImageFiles_electro_input" multiple onChange={handleAdditionalImagesChange} accept="image/*" className={inputFileStyledClasses} />
        <AnimatePresence>
            {additionalImagesPreview.length > 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="mt-2">
                <div className="flex flex-wrap gap-2">{additionalImagesPreview.map((src, index) => (<img key={index} src={src} alt={`Preview ${index + 1}`} className={previewImageSmClasses} />))}</div>
                <button type="button" onClick={() => { setAdditionalImageFiles(null); const initialImagesArray = Array.isArray(initialData?.images) && initialData.images.every(i => typeof i === 'string') ? initialData.images as string[] : (typeof initialData?.images === 'string' && initialData.images.trim() ? initialData.images.split(',').map(s=>s.trim()).filter(s=>s) : []); setAdditionalImagesPreview(initialImagesArray); (document.getElementById('additionalImageFiles_electro_input') as HTMLInputElement).value = '';}} className={btnTextXsRedClasses}>Quitar nuevas imágenes</button>
            </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>{errors.images && (!additionalImageFiles || additionalImageFiles.length === 0) && (!initialData?.images || (Array.isArray(initialData.images) && initialData.images.length === 0) || (typeof initialData.images === 'string' && !initialData.images.trim())) && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{(errors.images?._errors || (Array.isArray(errors.images) ? errors.images : [errors.images])).join(', ')}</motion.p>}</AnimatePresence>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales (URLs - Alternativa)</label>
        <textarea name="images" id="images" value={formData.images} onChange={handleChange} rows={3} placeholder="url1.jpg, url2.png" className={commonTextAreaClasses(!!errors.images)}></textarea>
        <AnimatePresence>{errors.images && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden mt-1 text-xs text-red-500">{(errors.images?._errors || (Array.isArray(errors.images) ? errors.images : [errors.images])).join(', ')}</motion.p>}</AnimatePresence>
      </motion.div>
      
      <motion.div variants={formItemVariants} className="flex items-center">
        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">¿Producto activo?</label>
        <AnimatePresence>{errors.is_active && <motion.p variants={errorVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden ml-2 text-xs text-red-500">{errors.is_active?._errors?.join?.(', ')}</motion.p>}</AnimatePresence>
      </motion.div>
      
      <motion.div variants={formItemVariants} className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
        <button type="button" onClick={() => router.back()} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#002A7F] text-white font-semibold rounded-md hover:bg-[#002266] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[180px]">
          <AnimatePresence mode="wait" initial={false}>
            {isSubmitting ? (
              <motion.div key="loader" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                <PulseLoader size={8} color="#FFFFFF" />
              </motion.div>
            ) : (
              <motion.span key="text" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                {isEditing ? 'Guardar Cambios' : 'Crear Electrodoméstico'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </motion.form>
  );
}