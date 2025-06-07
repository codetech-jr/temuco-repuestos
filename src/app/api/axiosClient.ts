import axios from 'axios';
import { getAnonymousUserId } from '@/utils/anonymousId'; // <-- Importamos nuestra función

// La URL base de tu API que configuraste en el backend.
const API_BASE_URL = 'http://localhost:3001/api/v1';

// Creamos una instancia de Axios con la configuración base.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// === ¡AQUÍ OCURRE LA MAGIA! ===
// Usamos un "interceptor de peticiones" para modificar cada petición ANTES de que se envíe.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Obtenemos el ID anónimo.
    const anonymousId = getAnonymousUserId();

    // 2. Lo añadimos a las cabeceras de la petición.
    config.headers['x-anonymous-id'] = anonymousId;

    // 3. Devolvemos la configuración modificada para que la petición continúe.
    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechazamos.
    return Promise.reject(error);
  }
);

// Exportamos la instancia configurada para usarla en toda la aplicación.
export default apiClient;