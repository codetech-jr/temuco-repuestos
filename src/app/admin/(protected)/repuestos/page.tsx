"use client";

import Link from 'next/link';
import { useEffect, useState, useCallback, ChangeEvent } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/utils/FadeIn';

export interface RepuestoListItem {
  id: string;
  name: string;
  price: number;
  stock?: number | null;
  category: string;
  brand: string;
  is_original?: boolean;
  is_active?: boolean;
  image_url?: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const ITEMS_PER_PAGE = 10;

async function fetchAdminRepuestosFromAPI(
  page: number = 1,
  limit: number = ITEMS_PER_PAGE,
  searchTerm: string = '',
  categoryFilter: string = '',
  brandFilter: string = '',
  statusFilter: string = '',
  originalFilter: string = ''
): Promise<{ data: RepuestoListItem[], totalItems: number, totalPages: number, currentPage: number, error: string | null }> {
  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (searchTerm.trim()) queryParams.append('q', searchTerm.trim());
  if (categoryFilter) queryParams.append('category', categoryFilter);
  if (brandFilter) queryParams.append('brand', brandFilter);
  if (statusFilter) queryParams.append('is_active', statusFilter);
  if (originalFilter) queryParams.append('is_original', originalFilter);

  const endpoint = `${API_BASE_URL}/repuestos?${queryParams.toString()}`;
  try {
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) {
      let errorDetail = `Error: ${res.status}`;
      try { const d = await res.json(); errorDetail = d.message || errorDetail; } catch (_e) {}
      return { data: [], totalItems: 0, totalPages: 0, currentPage: page, error: errorDetail };
    }
    const d = await res.json();
    return { data: d.data || [], totalItems: d.totalItems || 0, totalPages: d.totalPages || 0, currentPage: d.currentPage || page, error: null };
  } catch (e: any) {
    return { data: [], totalItems: 0, totalPages: 0, currentPage: page, error: e.message || "Error de red" };
  }
}

async function deleteRepuestoFromAPI(id: string): Promise<{ success: boolean, error: string | null }> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) return { success: false, error: "No autenticado" };
  try {
    const res = await fetch(`${API_BASE_URL}/repuestos/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${session.access_token}` } });
    if (res.ok) return { success: true, error: null };
    let errorDetail = `Error: ${res.status}`;
    try { const d = await res.json(); errorDetail = d.message || errorDetail; } catch (_e) {}
    return { success: false, error: errorDetail };
  } catch (e: any) {
    return { success: false, error: e.message || "Excepción" };
  }
}

export default function AdminRepuestosPage() {
  const [repuestos, setRepuestos] = useState<RepuestoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedOriginal, setSelectedOriginal] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [brandOptions, setBrandOptions] = useState<string[]>([]);

  const primaryButtonClasses = "bg-[#002A7F] hover:bg-[#002266] text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-150";
  const secondaryButtonClasses = "bg-white hover:bg-[#EBF4FF] text-[#002A7F] font-semibold py-2 px-3 border border-[#002A7F] rounded-lg shadow-sm hover:text-[#002266] transition-colors duration-150";
  const inputFormClasses = "block w-full mt-1 px-3 py-2 border border-[#718096] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm text-[#2D3748] bg-white";
  const labelFormClasses = "block text-sm font-medium text-[#2D3748] mb-0.5";
  const thAdminClasses = "px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#718096] uppercase tracking-wider";
  const tdAdminClasses = "px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-[#718096]";
  const statusBadgeBase = "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusActiveClasses = `${statusBadgeBase} bg-[#EBF4FF] text-[#002A7F]`;
  const statusInactiveClasses = `${statusBadgeBase} bg-[#FEE2E2] text-[#C8102E]`;
  const linkEditClasses = "text-[#002A7F] hover:text-[#002266] hover:underline";
  const linkDeleteClasses = "text-[#C8102E] hover:text-red-700 hover:underline";

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/repuestos/config/categories`),
          fetch(`${API_BASE_URL}/repuestos/config/brands`)
        ]);
        if (catRes.ok) { const data = await catRes.json(); if (Array.isArray(data)) setCategoryOptions(data); }
        if (brandRes.ok) { const data = await brandRes.json(); if (Array.isArray(data)) setBrandOptions(data); }
      } catch (_e) { toast.error("Error cargando opciones de filtro."); }
    };
    fetchOptions();
  }, []);

  const loadRepuestos = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminRepuestosFromAPI(pageToLoad, ITEMS_PER_PAGE, searchTerm, selectedCategory, selectedBrand, selectedStatus, selectedOriginal);
    if (result.error) {
      setError(result.error);
      setRepuestos([]);
      setTotalItems(0);
      setTotalPages(0);
    } else {
      setRepuestos(result.data);
      setTotalItems(result.totalItems);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    }
    setLoading(false);
  }, [searchTerm, selectedCategory, selectedBrand, selectedStatus, selectedOriginal]);

  useEffect(() => {
    loadRepuestos(currentPage);
  }, [currentPage, loadRepuestos]);

  const handleFilterAction = () => {
    if (currentPage !== 1) setCurrentPage(1);
    else loadRepuestos(1);
  };

  const clearFiltersAndReload = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedStatus('');
    setSelectedOriginal('');
    if (currentPage !== 1) setCurrentPage(1);
    else loadRepuestos(1);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Eliminar el repuesto "${name}"?`)) {
      const originalRepuestos = [...repuestos];
      setRepuestos(prev => prev.filter(r => r.id !== id));
      const toastId = toast.loading("Eliminando...");
      const result = await deleteRepuestoFromAPI(id);
      toast.dismiss(toastId);
      if (result.success) {
        toast.success("Repuesto eliminado exitosamente.");
        if (originalRepuestos.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } else {
        toast.error(result.error || "Error al eliminar el repuesto.");
        setRepuestos(originalRepuestos);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage && !loading) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationControls = () => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (totalPages >= maxPagesToShow && endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    } else if (totalPages < maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    }
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    const baseBtn = "px-3 py-1.5 text-sm font-medium border rounded-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150";
    const activeBtn = `bg-[#002A7F] text-[#F7FAFC] border-[#002A7F]`;
    const inactiveBtn = `bg-white text-[#002A7F] border-[#718096] hover:bg-[#EBF4FF] hover:text-[#002266] hover:border-[#002A7F]`;
    const ellipsisClass = "px-1 sm:px-2 py-1.5 text-sm text-[#718096]";

    return (
      <div className="mt-6 flex flex-wrap justify-center items-center space-x-1">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1 || loading} className={`${baseBtn} ${inactiveBtn}`}>{"<<"}</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || loading} className={`${baseBtn} ${inactiveBtn}`}>{"<"}</button>
        {startPage > 1 && (<><button onClick={() => handlePageChange(1)} disabled={loading} className={`${baseBtn} ${inactiveBtn}`}>1</button>{startPage > 2 && <span className={ellipsisClass}>...</span>}</>)}
        {pageNumbers.map(num => (<button key={num} onClick={() => handlePageChange(num)} disabled={loading} className={`${baseBtn} ${currentPage === num ? activeBtn : inactiveBtn}`}>{num}</button>))}
        {endPage < totalPages && (<>{endPage < totalPages - 1 && <span className={ellipsisClass}>...</span>}<button onClick={() => handlePageChange(totalPages)} disabled={loading} className={`${baseBtn} ${inactiveBtn}`}>{totalPages}</button></>)}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || loading} className={`${baseBtn} ${inactiveBtn}`}>{">"}</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages || loading} className={`${baseBtn} ${inactiveBtn}`}>{">>"}</button>
      </div>
    );
  };

  const tableContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const tableRowVariants = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, x: -50, transition: { duration: 0.3 } } };

  if (loading && repuestos.length === 0) return (<div className="flex justify-center items-center min-h-[calc(100vh-12rem)] bg-[#F7FAFC]"><LoadingSpinner size={50} /><p className="ml-3 text-[#718096] text-lg">Cargando repuestos...</p></div>);
  if (error && repuestos.length === 0) return (<div className="text-center p-6 bg-[#F7FAFC] min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center"><p className="text-[#C8102E] text-xl font-semibold mb-2">Error al Cargar</p><p className="text-[#C8102E] mb-4">{error}</p><button onClick={() => loadRepuestos(1)} className={primaryButtonClasses}>Reintentar</button></div>);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#002A7F]">Gestión de Repuestos ({totalItems})</h1>
          <Link href="/admin/repuestos/nuevo" legacyBehavior><a className={`${primaryButtonClasses} text-sm sm:text-base`}>+ Crear Nuevo</a></Link>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div><label htmlFor="searchTerm" className={labelFormClasses}>Buscar por nombre</label><input type="text" id="searchTerm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nombre, marca..." className={inputFormClasses} /></div>
            <div><label htmlFor="selectedCategory" className={labelFormClasses}>Categoría</label><select id="selectedCategory" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className={inputFormClasses}><option value="">Todas</option>{categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label htmlFor="selectedBrand" className={labelFormClasses}>Marca</label><select id="selectedBrand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={inputFormClasses}><option value="">Todas</option>{brandOptions.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
            <div><label htmlFor="selectedStatus" className={labelFormClasses}>Estado</label><select id="selectedStatus" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={inputFormClasses}><option value="">Todos</option><option value="true">Activo</option><option value="false">Inactivo</option></select></div>
            <div><label htmlFor="selectedOriginal" className={labelFormClasses}>Original</label><select id="selectedOriginal" value={selectedOriginal} onChange={(e) => setSelectedOriginal(e.target.value)} className={inputFormClasses}><option value="">Todos</option><option value="true">Sí</option><option value="false">No</option></select></div>
          </div>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <button onClick={clearFiltersAndReload} className={`${secondaryButtonClasses} text-xs sm:text-sm`}>Limpiar Filtros</button>
            <button onClick={handleFilterAction} className={`${primaryButtonClasses} text-xs sm:text-sm`}>Aplicar Filtros</button>
          </div>
        </div>
      </FadeIn>
      <AnimatePresence mode="wait">
        <motion.div key={loading ? "loading" : "content"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {loading && repuestos.length > 0 && <div className="my-4 flex justify-center items-center"><LoadingSpinner size={24} /> <span className="ml-2 text-[#718096]">Actualizando lista...</span></div>}
          {error && repuestos.length > 0 && <p className={`text-center text-[#C8102E] mb-4 p-3 bg-[#FEE2E2] border border-[#C8102E] rounded-md text-sm`}>{error}</p>}
        </motion.div>
      </AnimatePresence>
      {repuestos.length === 0 && !loading && !error ? (
        <FadeIn delay={0.2}><p className="text-center text-[#718096] py-12 text-lg">No hay repuestos que coincidan con los filtros aplicados.</p></FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-[#EBF4FF]">
              <thead className="bg-[#EBF4FF]">
                <tr>
                  <th className={`${thAdminClasses} w-16`}>Imagen</th>
                  <th className={thAdminClasses}>Nombre</th>
                  <th className={thAdminClasses}>Categoría</th>
                  <th className={thAdminClasses}>Marca</th>
                  <th className={`${thAdminClasses} text-right`}>Precio</th>
                  <th className={`${thAdminClasses} text-center`}>Stock</th>
                  <th className={`${thAdminClasses} text-center`}>Original</th>
                  <th className={`${thAdminClasses} text-center`}>Estado</th>
                  <th className={thAdminClasses}>Acciones</th>
                </tr>
              </thead>
              <motion.tbody className="bg-white divide-y divide-[#EBF4FF]" variants={tableContainerVariants} initial="hidden" animate="visible">
                <AnimatePresence>
                  {repuestos.map((item) => (
                    <motion.tr key={item.id} variants={tableRowVariants} exit="exit" layout className="hover:bg-[#EBF4FF] transition-colors duration-150">
                      <td className={`${tdAdminClasses} py-2 px-3 sm:px-4`}>
                        <div className="h-10 w-10 flex-shrink-0">
                          {item.image_url ? <Image src={item.image_url} alt={item.name} width={40} height={40} className="rounded-md object-cover h-full w-full" priority/> : <div className="h-10 w-10 rounded-md bg-[#EBF4FF] text-xs flex items-center justify-center text-[#718096]">N/A</div>}
                        </div>
                      </td>
                      <td className={`${tdAdminClasses} font-medium text-[#2D3748]`}>{item.name}</td>
                      <td className={tdAdminClasses}>{item.category}</td>
                      <td className={tdAdminClasses}>{item.brand}</td>
                      <td className={`${tdAdminClasses} text-right`}>{new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(item.price)}</td>
                      <td className={`${tdAdminClasses} text-center`}>{item.stock ?? 'N/A'}</td>
                      <td className={`${tdAdminClasses} text-center`}>{item.is_original === true ? 'Sí' : item.is_original === false ? 'No' : 'N/A'}</td>
                      <td className={`${tdAdminClasses} text-center`}><span className={item.is_active ? statusActiveClasses : statusInactiveClasses}>{item.is_active ? 'Activo' : 'Inactivo'}</span></td>
                      <td className={`${tdAdminClasses} space-x-2 whitespace-nowrap`}>
                        <Link href={`/admin/repuestos/editar/${item.id}`} legacyBehavior><a className={linkEditClasses}>Editar</a></Link>
                        <button onClick={() => handleDelete(item.id, item.name)} className={linkDeleteClasses}>Borrar</button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </motion.tbody>
            </table>
          </div>
          {renderPaginationControls()}
        </FadeIn>
      )}
    </div>
  );
}