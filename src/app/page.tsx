// src/app/page.tsx
import HeroSection from "@/components/sections/HeroSliderSection";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import FeaturedProducts from "@/components/sections/FeatureProducts";
import OurServices from "@/components/sections/OurServices";
import Testimonials from "@/components/sections/Testimonials";
import Brands from "@/components/sections/Brands";
import ContactFormSection from "@/components/sections/ContactFormSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <OurServices />
      <Testimonials />
      <Brands />
      <ContactFormSection />
    </>
  );
}