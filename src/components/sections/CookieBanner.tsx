// components/sections/CookieBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365, path: '/' }); // Añadido path: '/'
    setShowBanner(false);
  };

  const handleDecline = () => {
    // Opcional: podrías setear una cookie 'cookie_consent_declined' para la sesión
    // Cookies.set('cookie_consent_declined', 'true', { path: '/' });
    setShowBanner(false);
  };
  
  if (!showBanner) {
    return null;
  }

  // Colores de la paleta
  const bannerBgColor = "bg-[#002266]/95"; // Azul muy oscuro con opacidad (o bg-[#2D3748]/95 para gris oscuro azulado)
  const mainTextColor = "text-[#F7FAFC]"; // Casi blanco azulado
  const linkTextColor = "text-[#EBF4FF]"; // Azul muy pálido para el enlace
  const linkHoverTextColor = "hover:text-white";

  const declineButtonBg = "bg-[#718096]"; // Gris medio
  const declineButtonHoverBg = "hover:bg-[#2D3748]"; // Gris oscuro azulado
  const declineButtonText = "text-white"; // O text-[#F7FAFC]

  const acceptButtonBg = "bg-[#002A7F]"; // Azul oscuro principal
  const acceptButtonHoverBg = "hover:bg-[#002266]"; // Azul muy oscuro
  const acceptButtonText = "text-white"; // O text-[#F7FAFC]

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 ${bannerBgColor} ${mainTextColor} p-4 shadow-lg backdrop-blur-sm`}
      role="dialog" // Mejor para accesibilidad
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4">
        <div> {/* Div para agrupar el texto y el enlace */}
          <h2 id="cookie-banner-title" className="sr-only">Aviso de Cookies</h2> {/* Para accesibilidad */}
          <p id="cookie-banner-description" className="text-sm text-center md:text-left">
            Este sitio web utiliza cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestro uso de cookies.
            <Link 
              href="/politica-de-cookies" // Asegúrate que esta página exista
              className={`underline ${linkTextColor} ${linkHoverTextColor} ml-2 transition-colors duration-150`}
            >
              Leer más
            </Link>
          </p>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0"> {/* flex-shrink-0 para que no se achiquen los botones */}
          <button
            onClick={handleDecline}
            className={`text-sm px-4 py-2 rounded-md ${declineButtonBg} ${declineButtonText} ${declineButtonHoverBg} transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#002266] focus:ring-[#718096]`}
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className={`text-sm font-semibold px-5 py-2 rounded-md ${acceptButtonBg} ${acceptButtonText} ${acceptButtonHoverBg} transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#002266] focus:ring-[#002A7F]`}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;