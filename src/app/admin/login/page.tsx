// src/app/admin/login/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace('/admin/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      router.replace('/admin/dashboard'); // Redirige al dashboard si el login es exitoso
    }
    setLoading(false);
  };

  // Clases comunes para inputs
  const inputBaseClasses = "mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm sm:text-sm";
  const inputColorClasses = "border-[#718096] placeholder-gray-400 text-[#2D3748] bg-white"; // Borde gris medio, texto gris oscuro azulado
  const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F]"; // Focus con azul oscuro principal

  return (
    // Fondo general: Casi blanco azulado
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] bg-[#F7FAFC] p-4">
      {/* Tarjeta del formulario: Fondo blanco, sombra */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {/* Título: Azul oscuro principal */}
        <h2 className="text-3xl font-bold text-center text-[#002A7F]">
          Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            {/* Label: Gris oscuro azulado */}
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#2D3748]"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${inputBaseClasses} ${inputColorClasses} ${inputFocusClasses}`}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#2D3748]"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputBaseClasses} ${inputColorClasses} ${inputFocusClasses}`}
              placeholder="••••••••"
            />
          </div>

          {error && (
            // Mensaje de error: Texto rojo, fondo rojo muy pálido, borde rojo
            <p className="px-4 py-3 text-sm text-center text-[#C8102E] bg-[#FEE2E2] border border-[#C8102E] rounded-lg">
              {/* Alternativa para el fondo: bg-[#C8102E]/10 */}
              {error}
            </p>
          )}

          <div>
            {/* Botón de Login: Fondo azul oscuro principal, hover azul muy oscuro, texto blanco */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#002A7F] hover:bg-[#002266] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#002A7F] disabled:bg-[#A0AEC0] disabled:cursor-not-allowed transition-colors duration-150"
              // Para disabled:bg-brand-text-light, puedes usar un gris como #A0AEC0 (Tailwind gray-500) o tu #718096
            >
              {loading ? 'Iniciando sesión...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}