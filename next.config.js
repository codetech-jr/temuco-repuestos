/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qmzjiipijvbrzoavnbjjz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Añade aquí cualquier otro dominio de imágenes que necesites
    ],
  },
};

module.exports = nextConfig;