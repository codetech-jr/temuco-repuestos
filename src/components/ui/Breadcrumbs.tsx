// src/components/ui/Breadcrumbs.tsx

'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import { IoChevronForward } from 'react-icons/io5';

// --- DEFINICIÓN DE COLORES (copiada para este ejemplo, idealmente sería importada) ---
const COLORS = {
  backgroundPrimary: "#F7FAFC", // Bone White (Para el fondo de la página donde se mostraría esto)
  temucoBlue: "#002A7F",        // Primary Color (Para hovers de enlaces)
  // secondaryBackground: "#EBF4FF", // No directamente usado en breadcrumbs, pero sí el fondo general
  // accentRed: "#C8102E",
  // accentOrange: "#DD6B20",
  mainText: "#2D3748",          // Charcoal Gray (Para el texto de la página actual)
  secondaryText: "#718096",     // Slate Gray (Para enlaces de breadcrumbs y separadores)
};

// Función para capitalizar la primera letra de un string
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Mapeo opcional para traducir segmentos de la URL a un texto más amigable
const pathTranslations: { [key: string]: string } = {
  'repuestos': 'Repuestos',
  'electrodomesticos': 'Electrodomésticos',
  'servicios': 'Servicios',
  'favoritos': 'Mis Favoritos',
  'search': 'Búsqueda',
  'quienes-somos': 'Quiénes Somos', // Añadido para consistencia
  'contacto': 'Contacto',         // Añadido para consistencia
};

export const Breadcrumbs = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const pathSegments = pathname.split('/').filter(segment => segment);

  return (
    // El fondo general de la página sería COLORS.backgroundPrimary
    // El componente Breadcrumbs en sí no necesita un fondo específico si se asienta sobre ese fondo
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
      {/* Usamos COLORS.secondaryText para el color base de las migas y separadores */}
      <ol className={`flex items-center space-x-2 text-sm text-[${COLORS.secondaryText}]`}>
        <li>
          {/* Enlaces usan COLORS.secondaryText, y COLORS.temucoBlue en hover */}
          <Link
            href="/"
            className={`hover:text-[${COLORS.temucoBlue}] hover:underline`}
          >
            Inicio
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const href = '/' + pathSegments.slice(0, index + 1).join('/');
          const isLast = index === pathSegments.length - 1;
          const decodedSegment = decodeURIComponent(segment);
          const text = pathTranslations[decodedSegment.toLowerCase()] || capitalize(decodedSegment);

          return (
            <Fragment key={href}>
              <li>
                {/* El separador también usa COLORS.secondaryText (heredado de <ol>) */}
                <IoChevronForward size={16} />
              </li>
              <li>
                {isLast ? (
                  // El texto de la página actual usa COLORS.mainText para mayor énfasis
                  <span className={`font-semibold text-[${COLORS.mainText}]`}>{text}</span>
                ) : (
                  <Link
                    href={href}
                    // Enlaces usan COLORS.secondaryText, y COLORS.temucoBlue en hover
                    className={`hover:text-[${COLORS.temucoBlue}] hover:underline`}
                  >
                    {text}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};