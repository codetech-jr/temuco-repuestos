// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': { // Puedes nombrar tus colores como quieras
          DEFAULT: '#0A4D8C', // Un azul principal (ejemplo)
          light: '#1E6BAF',
          dark: '#073B73',
          '700': '#073B73', // Si quieres usarlo como `bg-blue-700` directamente
          '800': '#052E5A',
          '900': '#031F3B', // El azul del footer
        },
        'brand-red': {
          DEFAULT: '#D92525', // Un rojo principal (ejemplo)
          dark: '#B81D1D',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config