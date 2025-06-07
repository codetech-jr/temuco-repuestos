// src/hooks/useFetchData.ts
"use client"; // Si el hook va a ser usado en Client Components que disparan el fetch

import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// El hook aceptará una URL y opcionalmente un array de dependencias para el useEffect
// y un transformador de datos opcional
function useFetchData<T>(
  url: string | null, // Hacemos la URL opcional para poder controlar cuándo se hace el fetch
  dependencies: any[] = [], // Dependencias para re-ejecutar el fetch
  transformData?: (data: any) => T // Función opcional para transformar la data cruda
): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Inicia cargando si la URL se provee inicialmente
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) { // Si no hay URL, no hacer fetch y resetear
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    console.log(`useFetchData: Fetching from ${url}`);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const responseText = await response.text();
        console.error(`useFetchData: Error fetching data from ${url}. Status: ${response.status}. Response: ${responseText.substring(0, 200)}`);
        throw new Error(`Error ${response.status}: ${response.statusText || 'Failed to fetch data'}`);
      }
      const rawData = await response.json();
      const transformedData = transformData ? transformData(rawData) : rawData as T;
      setData(transformedData);
      console.log(`useFetchData: Data received successfully from ${url}`, transformedData);
    } catch (err: any) {
      console.error(`useFetchData: Exception while fetching data from ${url}`, err);
      setError(err.message || 'An unknown error occurred');
      setData(null); // Limpiar datos en caso de error
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, transformData, ...dependencies]); // Incluye 'dependencies' pasadas al hook

  useEffect(() => {
    fetchData();
  }, [fetchData]); // El useEffect ahora depende de la función memoizada 'fetchData'

  return { data, loading, error };
}

export default useFetchData;