import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, 
  images: {
    remotePatterns: [
      {
        protocol: 'https', // O 'http' si es el caso, pero Supabase Storage usa https
        hostname: 'qmzjipijvbrzoavnbjjz.supabase.co',
        port: '', // Dejar vacío si es el puerto estándar (80 para http, 443 para https)
        pathname: '/storage/v1/object/public/product-images/**', // Sé específico si puedes, o usa '/**' para permitir cualquier ruta en ese host
      },
      // Puedes añadir más patrones para otros dominios si los necesitas
      // Ejemplo:
      // {
      //   protocol: 'https',
      //   hostname: 'otro.dominio.com',
      //   pathname: '/imagenes/**',
      // }
    ],
    // Si prefieres la sintaxis antigua (menos recomendada para Next.js >= 13.3):
    // domains: ['qmzjipijvbrzoavnbjjz.supabase.co'],
  },
  eslint: {
    // Advertencia: Esto permite que las compilaciones de producción se completen 
    // correctamente incluso si tu proyecto tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
  /* otras config options si las tienes */
};

export default nextConfig;