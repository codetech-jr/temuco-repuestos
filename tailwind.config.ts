// tailwind.config.ts
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography' // <--- Importa el plugin
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
              container: {
            center: true,
            padding:{
                DEFAULT: "1rem",
                md: "2rem"
            }, 
        },
        screens: {
            sm: '375px',
            md: '768px',
            lg: '1200px',
        },
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
  plugins: [ typography, 
    tailwindcssAnimate
  ],
}
export default config