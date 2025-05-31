// app/search/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Interfaces (podrías moverlas a un archivo types.ts si las usas en más sitios)
interface NavLinkItem {
  href: string;
  label: string;
}

interface ServicioItem {
  slug: string;
  title: string;
  // Asumimos que serviciosDetalleData tiene al menos estas propiedades
  // Añade otras propiedades si las usas para mostrar más detalles
}

// --- DATOS DE EJEMPLO (Idealmente importados de archivos de datos) ---
// Copiados/adaptados de tu Header.tsx para este ejemplo
const repuestosData: NavLinkItem[] = [
  { href: "/repuestos?category=Compresores", label: "Compresores" },
  { href: "/repuestos?category=Termostatos", label: "Termostatos" },
  { href: "/repuestos?category=Filtros", label: "Filtros Secadores" },
  { href: "/repuestos?category=Capacitores", label: "Capacitores" },
  { href: "/repuestos?tipo=originales", label: "Repuestos Originales de Fábrica" },
  // Podrías añadir más repuestos individuales aquí si quisieras que aparezcan en la búsqueda
  // Ejemplo: { href: "/repuestos/compresor-modelo-xyz", label: "Compresor Modelo XYZ" }
];

const electrodomesticosData: NavLinkItem[] = [
  { href: "/electrodomesticos?category=Refrigeradores", label: "Refrigeradores" },
  { href: "/electrodomesticos?category=Lavadoras", label: "Lavadoras" },
  { href: "/electrodomesticos?category=Secadoras", label: "Secadoras" },
  { href: "/electrodomesticos?category=Cocinas", label: "Cocinas y Encimeras" },
  { href: "/electrodomesticos?category=Aires Acondicionados", label: "Aires Acondicionados Split" },
  { href: "/electrodomesticos?category=Hornos", label: "Hornos Eléctricos y Microondas" },
  // Ejemplo: { href: "/electrodomesticos/lavadora-super-eco", label: "Lavadora Súper Eco Carga Frontal" }
];

// Asumimos que puedes importar serviciosDetalleData
// Si no, tendrías que definirlo aquí también o adaptar
import { serviciosDetalleData } from '@/app/data/servicios'; // Asegúrate que esta ruta sea correcta


export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [filteredRepuestos, setFilteredRepuestos] = useState<NavLinkItem[]>([]);
  const [filteredElectrodomesticos, setFilteredElectrodomesticos] = useState<NavLinkItem[]>([]);
  const [filteredServicios, setFilteredServicios] = useState<ServicioItem[]>([]);

  useEffect(() => {
    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      // Filtrar Repuestos
      const repuestosResult = repuestosData.filter(item =>
        item.label.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredRepuestos(repuestosResult);

      // Filtrar Electrodomésticos
      const electrodomesticosResult = electrodomesticosData.filter(item =>
        item.label.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredElectrodomesticos(electrodomesticosResult);

      // Filtrar Servicios
      // serviciosDetalleData es tu array importado
      const serviciosResult = serviciosDetalleData.filter((item: ServicioItem) =>
        item.title.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredServicios(serviciosResult);

    } else {
      // Si no hay query, limpiar resultados
      setFilteredRepuestos([]);
      setFilteredElectrodomesticos([]);
      setFilteredServicios([]);
    }
  }, [query]); // Este efecto se ejecuta cada vez que 'query' cambia

  const noResults =
    query &&
    filteredRepuestos.length === 0 &&
    filteredElectrodomesticos.length === 0 &&
    filteredServicios.length === 0;

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Resultados de Búsqueda</h1>

      {query ? (
        <>
          <p className="mb-8 text-lg">
            Resultados para: <strong className="text-[#002A7F]">{query}</strong>
          </p>

          {filteredRepuestos.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 text-gray-700">Repuestos Encontrados</h2>
              <ul className="list-disc pl-5 space-y-1">
                {filteredRepuestos.map((item, index) => (
                  <li key={`repuesto-${index}`}>
                    <Link href={item.href} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {filteredElectrodomesticos.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 text-gray-700">Electrodomésticos Encontrados</h2>
              <ul className="list-disc pl-5 space-y-1">
                {filteredElectrodomesticos.map((item, index) => (
                  <li key={`electro-${index}`}>
                    <Link href={item.href} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {filteredServicios.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3 text-gray-700">Servicios Encontrados</h2>
              <ul className="list-disc pl-5 space-y-1">
                {filteredServicios.map((item, index) => (
                  <li key={`servicio-${index}`}>
                    <Link href={`/servicios/${item.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {noResults && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <p className="text-yellow-700">
                No se encontraron resultados para "<strong>{query}</strong>". Intenta con otros términos.
              </p>
            </div>
          )}
        </>
      ) : (
        <p className="text-lg text-gray-600">
          Por favor, ingresa un término en la barra de búsqueda.
        </p>
      )}

      <div className="mt-12">
        <Link href="/" className="text-[#002A7F] hover:underline font-medium">
          ← Volver al Inicio
        </Link>
      </div>
    </div>
  );
}