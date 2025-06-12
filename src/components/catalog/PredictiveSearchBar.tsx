"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useDebouncedCallback } from 'use-debounce';
import { IoSearch, IoClose } from 'react-icons/io5';
import apiClient from '@/app/api/axiosClient';
import { motion, AnimatePresence } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

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
  onSearch?: () => void;
}

const PredictiveSearchBar = ({ placeholder = "Buscar productos...", onSearch }: PredictiveSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useDebouncedCallback(async (searchTerm: string) => {
    if (searchTerm.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const { data: suggestionData } = await apiClient.get<Suggestion[]>(`/search/suggestions?q=${searchTerm}`);
      setSuggestions(suggestionData);
      setIsDropdownOpen(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setIsDropdownOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, 350);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length === 0) {
      setSuggestions([]);
      setIsLoading(false);
      setIsDropdownOpen(false);
      return;
    }
    setIsLoading(true);
    setIsDropdownOpen(value.length >= 3);
    fetchSuggestions(value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsDropdownOpen(false);
      setSuggestions([]);
      if (onSearch) onSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsLoading(false);
    setIsDropdownOpen(false);
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

  const dropdownVariants = {
    open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
    closed: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.05 } },
    hidden: {},
  };

  const listItemVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 },
  };

  const inputBaseClasses = "w-full px-4 py-2 border rounded-l-md sm:text-sm bg-white transition-colors duration-150";
  const inputColorClasses = "border-gray-300 placeholder-gray-400 text-gray-800";
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
            <motion.button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              aria-label="Limpiar búsqueda"
            >
              <IoClose size={20} />
            </motion.button>
          )}
        </div>
        <motion.button
          type="submit"
          className="bg-[#002A7F] text-white px-3 py-[9px] sm:px-4 rounded-r-md hover:bg-[#002266]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label="Buscar"
        >
          <IoSearch size={22} />
        </motion.button>
      </form>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute top-full left-0 right-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 text-center text-gray-500 flex items-center justify-center">
                  <PulseLoader size={8} color="#9ca3af" />
                  <span className="ml-2">Buscando...</span>
                </motion.div>
              ) : suggestions.length > 0 ? (
                <motion.ul 
                  key="suggestions" 
                  initial="hidden"
                  animate="visible"
                  variants={listVariants}
                  className="max-h-80 overflow-y-auto divide-y divide-gray-100"
                >
                  {suggestions.map((s) => (
                    <motion.li key={s.id} variants={listItemVariants}>
                      <Link
                        href={s.link}
                        onClick={() => {
                            setIsDropdownOpen(false);
                            setQuery(s.name);
                            setSuggestions([]);
                            if (onSearch) onSearch();
                        }}
                        className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Image 
                          src={s.image_url || '/images/placeholder-product.png'}
                          alt={s.name} 
                          width={40} 
                          height={40}
                          className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0 bg-gray-100"
                          priority
                        />
                        <div className="flex-grow min-w-0">
                          <span className="font-semibold text-gray-800 block truncate">{s.name}</span>
                          <span className="block text-xs text-gray-500 capitalize">{s.type}</span>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : query.length >= 3 ? (
                <motion.div key="no-suggestions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 text-center text-gray-500">
                  No se encontraron sugerencias.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictiveSearchBar;