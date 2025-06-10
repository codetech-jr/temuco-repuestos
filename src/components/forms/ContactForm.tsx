// src/components/forms/ContactForm.tsx
"use client";

import { useState, FormEvent } from 'react';

// Interfaz ALINEADA con los campos que espera nuestra API (`route.ts`)
interface FormData {
  nombre: string;
  email: string;
  asunto: string; // El backend espera 'asunto'
  mensaje: string; // El backend espera 'mensaje'
}

// Interfaz para el estado de envío (la tuya estaba perfecta)
interface SubmissionStatus {
  success: boolean;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });
  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Usamos los nuevos nombres de campo: nombre, asunto, mensaje
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      // 1. APUNTAMOS DIRECTAMENTE A NUESTRA API INTERNA DE NEXT.JS
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setStatus({
          success: false,
          message: responseData.error || 'Hubo un error al enviar tu mensaje.',
        });
      } else {
        setStatus({
          success: true,
          message: responseData.message || '¡Gracias! Tu mensaje ha sido enviado.',
        });
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' }); // Limpiar formulario
      }
    } catch (error) {
      console.error("Error de red o fetch:", error);
      setStatus({
        success: false,
        message: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. ACTUALIZAMOS LOS ATRIBUTOS 'name' EN LOS INPUTS PARA QUE COINCIDAN
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="nombre" // <--- CAMBIO
          id="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F]"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F]"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-1">
          Asunto <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="asunto" // <--- CAMBIO
          id="asunto"
          value={formData.asunto}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F]"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          name="mensaje" // <--- CAMBIO
          id="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows={5}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F]"
          disabled={isSubmitting}
        ></textarea>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#C8102E] hover:bg-[#a80d26] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8102E] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando Mensaje...' : 'Enviar Mensaje'}
        </button>
      </div>

      {status && (
        <div className={`mt-4 p-3 rounded-md text-sm ${status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}