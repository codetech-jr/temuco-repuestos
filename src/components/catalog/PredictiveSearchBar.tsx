'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';
import { IoSearch, IoClose } from 'react-icons/io5';
import apiClient from '@/app/api/axiosClient';

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  type: 'electrodomestico' | 'repuesto';
  link: string;
}

interface PredictiveSearchBarProps {
  placeholder?: string;
}

const PredictiveSearchBar = ({ placeholder = "Buscar productos..." }: PredictiveSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // --- NUEVO ESTADO PARA LA CORRECCIÓN ORTOGRÁFICA ---
  const [correction, setCorrection] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE BÚSQUEDA ACTUALIZADA ---
  const fetchSuggestions = useDebouncedCallback(async (searchTerm: string) => {
    setCorrection(null); // Reseteamos la corrección en cada nueva búsqueda

    if (searchTerm.length < 3) { // La corrección funciona mejor con 3+ caracteres
      setSuggestions([]);
      setIsLoading(false);
      setIsDropdownOpen(searchTerm.length >= 3);
      return;
    }

    try {
      // 1. Buscamos sugerencias de autocompletado
      const { data: suggestionData } = await apiClient.get<Suggestion[]>(`/search/suggestions?q=${searchTerm}`);
      
      if (suggestionData.length > 0) {
        // Si hay resultados, los mostramos
        setSuggestions(suggestionData);
      } else {
        // 2. Si NO hay resultados, buscamos una corrección
        setSuggestions([]); // Aseguramos que las sugerencias estén vacías
        try {
          const { data: spellcheckData } = await apiClient.get<{ suggestion: string | null }>(`/search/spellcheck?q=${searchTerm}`);
          // Solo mostramos la corrección si es diferente a lo que el usuario escribió
          if (spellcheckData.suggestion && spellcheckData.suggestion.toLowerCase() !== searchTerm.toLowerCase()) {
            setCorrection(spellcheckData.suggestion);
          }
        } catch (spellcheckError) {
          console.error('Error fetching spelling suggestion:', spellcheckError);
        }
      }
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsDropdownOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, 350); // Aumentamos un poco el debounce para dar tiempo a la posible segunda llamada

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length === 0) {
      setSuggestions([]);
      setIsLoading(false);
      setIsDropdownOpen(false);
      setCorrection(null); // Limpiar corrección
      return;
    }
    setIsLoading(true);
    setIsDropdownOpen(true);
    fetchSuggestions(value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsDropdownOpen(false);
      setSuggestions([]);
      setCorrection(null);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsLoading(false);
    setIsDropdownOpen(false);
    setCorrection(null);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const inputBaseClasses = "w-full px-4 py-2 border rounded-l-md sm:text-sm bg-white transition-colors duration-150";
  const inputColorClasses = "border-[#718096] placeholder-gray-400 text-[#2D3748]";
  const inputFocusClasses = "focus:outline-none focus:ring-2 focus:ring-[#002A7F] focus:border-[#002A7F]";

  return (
    <div className="relative w-full max-w-lg" ref={searchContainerRef}>
      <form onSubmit={handleFormSubmit} className="flex items-center">
        <div className="relative w-full">
          <input
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length > 0 && setIsDropdownOpen(true)}
            className={`${inputBaseClasses} ${inputColorClasses} ${inputFocusClasses}`}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#718096] hover:text-[#2D3748] transition-colors duration-150"
              aria-label="Limpiar búsqueda"
            >
              <IoClose size={20} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="bg-[#002A7F] text-white px-3 py-[9px] sm:px-4 rounded-r-md hover:bg-[#002266] transition-colors duration-300"
          aria-label="Buscar"
        >
          <IoSearch size={22} />
        </button>
      </form>

      {/* --- LÓGICA DEL DROPDOWN ACTUALIZADA --- */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 w-full bg-white border border-[#EBF4FF] rounded-md shadow-lg z-50">
          {isLoading ? (
            <div className="p-4 text-center text-[#718096]">Buscando...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto divide-y divide-[#EBF4FF]">
              {suggestions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={s.link}
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setQuery(s.name);
                        setSuggestions([]);
                    }}
                    className="flex items-center p-3 hover:bg-[#EBF4FF] transition-colors duration-150"
                  >
                    <Image 
                      src={s.image_url || '/images/placeholder/product-placeholder.png'}
                      alt={s.name} 
                      width={40} 
                      height={40}
                      className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0 bg-[#EBF4FF]"
                    />
                    <div className="flex-grow min-w-0">
                      <span className="font-semibold text-[#2D3748] block truncate">{s.name}</span>
                      <span className="block text-xs text-[#718096] capitalize">{s.type}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          // --- NUEVO BLOQUE PARA LA CORRECCIÓN ---
          ) : correction ? (
            <div className="p-4 text-sm text-[#718096]">
              Quizás quisiste decir:{" "}
              <Link 
                href={`/search?q=${encodeURIComponent(correction)}`} 
                onClick={() => setIsDropdownOpen(false)}
                className="font-semibold text-[#002A7F] hover:underline"
              >
                {correction}
              </Link>
            </div>
          ) : query.length >= 3 ? (
            <div className="p-4 text-center text-[#718096]">No se encontraron sugerencias.</div>
          ) : null }
        </div>
      )}
    </div>
  );
};

export default PredictiveSearchBar;