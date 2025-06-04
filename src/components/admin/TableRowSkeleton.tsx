// src/components/admin/TableRowSkeleton.tsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Importar estilos una vez, puede ser aquí o en un layout

interface TableRowSkeletonProps {
  columns: number; // Número de columnas en tu tabla
}

export default function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm">
          <Skeleton height={20} />
        </td>
      ))}
    </tr>
  );
}