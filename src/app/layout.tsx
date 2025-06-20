// app/layout.tsx

import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/sections/CookieBanner"; 
import { WishlistProvider } from '@/contexts/WishlistContext';
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import Script from 'next/script';
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Temuco Repuestos y Servicios",
  description: "En Temuco encuentra repuestos originales, electrodomésticos de las mejores marcas y servicio técnico especializado para la reparación de tus aparatos. ¡Soluciones para tu hogar!",
  icons: {
    icon: '/icon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return(
    <html lang="es">
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "rvja0qyw78")
          `}
        </Script>
      </head>
      <body className={`${openSans.variable} ${montserrat.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <WishlistProvider>
          <Header />
          <Breadcrumbs />
          <main className="flex-grow">{children}</main>
          <Footer />
        </WishlistProvider>

        {/* --- COLOCA EL BANNER DE COOKIES AQUÍ --- */}
        <CookieBanner />
      </body>
    </html>
  );
}