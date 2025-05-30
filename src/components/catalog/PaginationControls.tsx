// src/components/catalog/PaginationControls.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number; // Para referencia, no se usa directamente para la navegación aquí
}

const PaginationControls = ({ currentPage, totalPages }: PaginationControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null; // No mostrar paginación si solo hay una página o ninguna
  }

  // Generar números de página (lógica simple, se puede mejorar para muchos números)
  const pageNumbers = [];
  const maxPageButtons = 5; // Máximo de botones de número de página a mostrar
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons && totalPages >= maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  return (
    <nav aria-label="Paginación de resultados" className="flex items-center justify-center space-x-2 mt-10 md:mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        aria-label="Página anterior"
      >
        <IoChevronBack className="mr-1 h-5 w-5" />
        Anterior
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2 py-2 text-sm text-gray-500">...</span>}
        </>
      )}


      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-4 py-2 text-sm font-medium border rounded-md
            ${currentPage === pageNumber
              ? 'bg-brand-blue text-white border-brand-blue z-10'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <>
         {endPage < totalPages -1 && <span className="px-2 py-2 text-sm text-gray-500">...</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        aria-label="Página siguiente"
      >
        Siguiente
        <IoChevronForward className="ml-1 h-5 w-5" />
      </button>
    </nav>
  );
};

export default PaginationControls;