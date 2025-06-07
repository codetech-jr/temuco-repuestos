const USER_ID_KEY = 'anonymousUserId';

/**
 * Obtiene el ID de usuario anónimo desde localStorage.
 * Si no existe, crea uno nuevo, lo guarda y lo devuelve.
 * @returns {string} El ID del usuario anónimo.
 */
export const getAnonymousUserId = (): string => {
  // 1. Intenta obtener el ID que ya podría estar guardado.
  let userId = localStorage.getItem(USER_ID_KEY);

  // 2. Si no existe (es la primera visita del usuario)...
  if (!userId) {
    // ...crea un nuevo ID único y seguro.
    // crypto.randomUUID() es el estándar moderno del navegador para esto.
    userId = crypto.randomUUID();
    
    // ...y guárdalo en localStorage para futuras visitas.
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('Nuevo ID de usuario anónimo creado:', userId);
  }

  // 3. Devuelve el ID (sea el antiguo o el recién creado).
  return userId;
};