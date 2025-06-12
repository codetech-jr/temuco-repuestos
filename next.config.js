/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qmzjipijvbrzoavnbjjz.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Esto permite cualquier imagen de tus buckets públicos
      },
    ],
  },
};

module.exports = nextConfig;