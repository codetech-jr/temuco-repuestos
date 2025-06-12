// src/app/page.tsx

// Paso 1: Importa 'dynamic' y los componentes que NO usan Swiper
import dynamic from 'next/dynamic';
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import OurServices from "@/components/sections/OurServices";
import ContactFormSection from "@/components/sections/ContactFormSection";

// Paso 2: Define un componente de carga genérico (opcional, pero útil)
const LoadingSkeleton = () => <div className="h-[400px] w-full bg-gray-200 rounded-lg animate-pulse" />;

// Paso 3: Carga dinámica de TODOS los componentes que usan Swiper
const HeroSliderSection = dynamic(
  () => import('@/components/sections/HeroSliderSection'),
  { ssr: false, loading: () => <LoadingSkeleton /> }
);

const MostViewedProducts = dynamic(
  () => import('@/components/sections/MostViewedProducts'),
  { ssr: false, loading: () => <LoadingSkeleton /> }
);

const Testimonials = dynamic(
  () => import('@/components/sections/Testimonials'),
  { ssr: false, loading: () => <LoadingSkeleton /> }
);

const Brands = dynamic(
  () => import('@/components/sections/Brands'),
  { ssr: false, loading: () => <div className="h-[150px] w-full bg-gray-200 rounded-lg animate-pulse" /> } // Un loading más pequeño para los logos
);


export default function HomePage() {
  return (
    <main>
      {/* Paso 4: Usa los componentes como si fueran normales. Next.js se encarga del resto. */}
      <HeroSliderSection />
      <FeaturedCategories />
      <MostViewedProducts />
      <OurServices />
      <Testimonials />
      <Brands />
      <ContactFormSection />
    </main>
  );
}