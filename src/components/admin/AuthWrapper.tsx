// src/components/admin/AuthWrapper.tsx
"use client";

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Este componente envuelve las páginas protegidas
export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigir si no estamos cargando y no hay usuario
    if (!isLoading && !user) {
      console.log("AuthWrapper: No hay usuario, redirigiendo a /admin/login");
      router.replace('/admin/login'); // .replace() es mejor para login que .push()
    }
  }, [user, isLoading, router]);

  // Mientras se carga la sesión, podemos mostrar un loader o nada
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando sesión...</div>;
  }

  // Si hay un usuario, renderizamos la página hija
  if (user) {
    return <>{children}</>;
  }
  
  // Si no hay usuario y no está cargando, no renderiza nada porque ya se está redirigiendo
  // o muestra el loader para evitar un parpadeo de contenido no protegido
  return <div className="flex items-center justify-center min-h-screen">Redirigiendo...</div>;
}