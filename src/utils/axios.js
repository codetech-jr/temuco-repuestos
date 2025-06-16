// En: src/utils/axios.js

import axios from 'axios';

// Tu instancia actual
const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
    withCredentials: true,
});

// === AQUÍ EMPIEZA LA MAGIA ===

// Interceptor de Respuesta
instance.interceptors.response.use(
    // 1. La primera función se ejecuta si la petición es exitosa (status 2xx)
    (response) => {
        // No hacemos nada, solo dejamos que la respuesta pase
        return response;
    },

    // 2. La segunda función se ejecuta si la petición falla
    (error) => {
        console.error('Error capturado por el interceptor:', error);

        // Podemos manejar diferentes tipos de errores aquí
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const status = error.response.status;

            switch (status) {
                case 401:
                    // No autorizado. El token puede ser inválido o haber expirado.
                    // Aquí podrías limpiar el localStorage y redirigir al login.
                    console.error('Error 401: No autorizado. Redirigiendo a login...');
                    // localStorage.removeItem('user'); // O como gestiones el estado
                    // window.location.href = '/login';
                    break;

                case 403:
                    // Prohibido. El usuario está autenticado pero no tiene permisos.
                    alert('No tienes permisos para realizar esta acción.');
                    break;
                
                case 404:
                    // No encontrado.
                    alert('El recurso solicitado no fue encontrado.');
                    break;

                case 500:
                    // Error interno del servidor.
                    alert('Ocurrió un error en el servidor. Por favor, intenta más tarde.');
                    break;

                default:
                    // Otros errores del servidor
                    alert(`Error ${status}: ${error.response.data.message || 'Ocurrió un error.'}`);
            }
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta (ej. el servidor está caído)
            alert('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        } else {
            // Ocurrió un error al configurar la petición
            console.error('Error de configuración de Axios:', error.message);
        }

        // Es MUY IMPORTANTE rechazar la promesa para que cualquier .catch()
        // en la llamada original (en el componente o hook) todavía se ejecute si es necesario.
        return Promise.reject(error);
    }
);

// Exportas la instancia con el interceptor ya "adjunto"
export default instance;