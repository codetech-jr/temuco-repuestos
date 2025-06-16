import axios from 'axios';
import { getAnonymousUserId } from '@/utils/anonymousId';

// --- ESTA ES LA PARTE CORREGIDA ---

// 1. Determinamos si el código se está ejecutando en el entorno de producción.
const isProduction = process.env.NODE_ENV === 'production';

// 2. Elegimos la URL base de la API dinámicamente.
//    - Si estamos en producción, usamos la variable de entorno para la URL de producción.
//    - Si estamos en desarrollo, usamos la variable para la URL local.
//    Asegúrate de que estas variables estén definidas en tus archivos .env.local y en la configuración de Vercel.
const API_URL = isProduction 
  ? process.env.NEXT_PUBLIC_API_URL_PRODUCTION || 'https://temuco-backend.onrender.com'
  : process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3001';

// 3. Construimos la URL base completa, añadiendo el prefijo /api/v1 que tu backend espera.
const API_BASE_URL = `${API_URL}/api/v1`;

// ------------------------------------


// Creamos una instancia de Axios con la configuración base dinámica.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// El interceptor para añadir el ID anónimo se mantiene exactamente igual.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Obtenemos el ID anónimo.
    const anonymousId = getAnonymousUserId();

    // 2. Lo añadimos a las cabeceras de la petición.
    if (anonymousId) {
      config.headers['x-anonymous-id'] = anonymousId;
    }
    
    // 3. Devolvemos la configuración modificada.
    return config;
  },
  (error) => {
    // Si hay un error, lo rechazamos.
    return Promise.reject(error);
  }
);

// Exportamos la instancia configurada para usarla en toda la aplicación.
export default apiClient;