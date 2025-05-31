// src/components/catalog/PaginationControls.tsx
"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const PaginationControls = ({ currentPage, totalPages }: PaginationControlsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false }); // { scroll: false } para UX
  };

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (totalPages >= maxPageButtons && endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Clases base para botones de paginación
  const baseButtonClass = "px-3 py-2 text-sm font-medium border rounded-md transition-colors duration-150";
  const disabledButtonClass = "disabled:opacity-60 disabled:cursor-not-allowed";

  // Clases para botones Anterior/Siguiente
  const navButtonTextClass = "text-[#002A7F] disabled:text-[#718096]"; // Azul oscuro, gris medio cuando está deshabilitado
  const navButtonBgClass = "bg-white hover:bg-[#EBF4FF] hover:text-[#002266] hover:border-[#002A7F]";
  const navButtonBorderClass = "border-[#718096]"; // Borde gris medio

  // Clases para botones de número de página inactivos
  const inactivePageButtonTextClass = "text-[#2D3748]"; // Gris oscuro azulado
  const inactivePageButtonBgClass = "bg-white hover:bg-[#EBF4FF] hover:text-[#002266] hover:border-[#002A7F]";
  const inactivePageButtonBorderClass = "border-[#EBF4FF]"; // Borde azul muy pálido

  // Clases para el botón de página activa
  const activePageButtonClass = "bg-[#002A7F] text-[#F7FAFC] border-[#002A7F] z-10"; // Fondo azul oscuro, texto casi blanco

  return (
    <nav aria-label="Paginación de resultados" className="flex items-center justify-center space-x-1 sm:space-x-2 mt-10 md:mt-12">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} ${navButtonTextClass} ${navButtonBgClass} ${navButtonBorderClass} ${disabledButtonClass} flex items-center`}
        aria-label="Página anterior"
      >
        <IoChevronBack className="mr-1 h-5 w-5" />
        Anterior
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`${baseButtonClass} ${inactivePageButtonTextClass} ${inactivePageButtonBgClass} ${inactivePageButtonBorderClass}`}
          >
            1
          </button>
          {/* Elipsis: Gris medio */}
          {startPage > 2 && <span className="px-1 sm:px-2 py-2 text-sm text-[#718096]">...</span>}
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`${baseButtonClass} 
            ${currentPage === pageNumber
              ? activePageButtonClass
              : `${inactivePageButtonTextClass} ${inactivePageButtonBgClass} ${inactivePageButtonBorderClass}`
            }`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}

      {endPage < totalPages && (
        <>
         {/* Elipsis: Gris medio */}
         {endPage < totalPages -1 && <span className="px-1 sm:px-2 py-2 text-sm text-[#718096]">...</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`${baseButtonClass} ${inactivePageButtonTextClass} ${inactivePageButtonBgClass} ${inactivePageButtonBorderClass}`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} ${navButtonTextClass} ${navButtonBgClass} ${navButtonBorderClass} ${disabledButtonClass} flex items-center`}
        aria-label="Página siguiente"
      >
        Siguiente
        <IoChevronForward className="ml-1 h-5 w-5" />
      </button>
    </nav>
  );
};

export default PaginationControls;