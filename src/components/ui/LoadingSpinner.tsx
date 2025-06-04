// src/components/ui/LoadingSpinner.tsx
"use client"; // Necesario porque react-spinners son componentes de cliente

import { ClipLoader } from "react-spinners"; // Puedes elegir otro tipo de spinner de la librería
// Otros ejemplos: BarLoader, BeatLoader, BounceLoader, CircleLoader, DotLoader, PuffLoader, PulseLoader, RiseLoader, ScaleLoader, SyncLoader

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean; // Para controlar la visibilidad externamente si es necesario
  className?: string; // Para añadir clases de estilo al contenedor
  fullPage?: boolean; // Nueva prop para centrarlo en toda la página
}

const LoadingSpinner = ({
  size = 50, // Tamaño por defecto más grande para full page
  color = "#002A7F", // Tu color azul principal
  loading = true,
  className = "",
  fullPage = false, // Por defecto no ocupa toda la página
}: LoadingSpinnerProps) => {
  if (!loading) return null;

  if (fullPage) {
    return (
      <div className={`fixed inset-0 flex justify-center items-center bg-white bg-opacity-75 z-50 ${className}`}>
        <ClipLoader color={color} loading={loading} size={size} aria-label="Cargando..." />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center py-10 ${className}`}> {/* py-10 para espaciado por defecto */}
      <ClipLoader color={color} loading={loading} size={size} aria-label="Cargando..." />
    </div>
  );
};

export default LoadingSpinner;