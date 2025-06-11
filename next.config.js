/// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactiva el modo estricto de React si te causa dobles renders en desarrollo.
  // En producción no tiene efecto.
  reactStrictMode: false, 

  // Configuración para permitir imágenes de dominios externos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qmzjiipijvbrzoavnbjjz.supabase.co', // Tu dominio de Supabase
      },
      // Puedes añadir más dominios aquí si los necesitas
      // Ejemplo: { protocol: 'https', hostname: 'ejemplo.com' }
    ],
  },
};

module.exports = nextConfig;