// src/app/admin/(protected)/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext'; // Ajusta la ruta
import AuthWrapper from '@/components/admin/AuthWrapper'; // Ajusta la ruta


export default function ProtectedAdminLayout({ // Renombrado para claridad
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/* Aquí puedes tener un div general para el layout del admin si quieres un fondo o algo */}
      <div className="min-h-screen bg-gray-100"> {/* Fondo gris claro para el admin */}
        <main className="pt-4"> {/* Añade padding si el header es sticky */}
            <AuthWrapper>
                {children}
            </AuthWrapper>
        </main>
        {/* Podrías tener un AdminFooter aquí también */}
      </div>
    </AuthProvider>
  );
}