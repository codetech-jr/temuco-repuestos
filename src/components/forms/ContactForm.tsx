// src/components/forms/ContactForm.tsx
"use client"; // Este componente manejará estado y eventos

import { useState, FormEvent } from 'react';

// Interfaz para los datos del formulario
interface FormData {
  name: string;
  email: string;
  phone: string; // Aunque opcional en backend, el input estará
  subject: string; // Aunque opcional en backend, el input estará
  message: string;
}

// Interfaz para el estado de envío
interface SubmissionStatus {
  submitted: boolean;
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>; // Para errores de Zod del backend
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<SubmissionStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (status) setStatus(null); // Limpiar mensaje de estado al cambiar
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    console.log("Enviando datos del formulario de contacto:", formData);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, { // Apunta al endpoint de contacto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error API al enviar mensaje de contacto:", responseData);
        setStatus({
          submitted: true,
          success: false,
          message: responseData.message || 'Hubo un error al enviar tu mensaje. Por favor, revisa los campos e intenta de nuevo.',
          fieldErrors: responseData.fieldErrors, // Si el backend devuelve fieldErrors de Zod
        });
      } else {
        console.log("Respuesta API contacto (éxito):", responseData);
        setStatus({
          submitted: true,
          success: true,
          message: responseData.message || '¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.',
        });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); // Limpiar formulario
      }
    } catch (error) {
      console.error("Excepción al enviar mensaje de contacto:", error);
      setStatus({
        submitted: true,
        success: false,
        message: 'No se pudo conectar con el servidor. Por favor, intenta más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`mt-1 block w-full px-3 py-2 border ${status?.fieldErrors?.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm`}
          disabled={isSubmitting}
        />
        {status?.fieldErrors?.name && <p className="mt-1 text-xs text-red-500">{status.fieldErrors.name.join(', ')}</p>}
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
          className={`mt-1 block w-full px-3 py-2 border ${status?.fieldErrors?.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm`}
          disabled={isSubmitting}
        />
        {status?.fieldErrors?.email && <p className="mt-1 text-xs text-red-500">{status.fieldErrors.email.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono (Opcional)
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${status?.fieldErrors?.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm`}
          disabled={isSubmitting}
        />
        {status?.fieldErrors?.phone && <p className="mt-1 text-xs text-red-500">{status.fieldErrors.phone.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Asunto (Opcional)
        </label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`mt-1 block w-full px-3 py-2 border ${status?.fieldErrors?.subject ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm`}
          disabled={isSubmitting}
        />
        {status?.fieldErrors?.subject && <p className="mt-1 text-xs text-red-500">{status.fieldErrors.subject.join(', ')}</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          className={`mt-1 block w-full px-3 py-2 border ${status?.fieldErrors?.message ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-[#002A7F] focus:border-[#002A7F] sm:text-sm`}
          disabled={isSubmitting}
        ></textarea>
        {status?.fieldErrors?.message && <p className="mt-1 text-xs text-red-500">{status.fieldErrors.message.join(', ')}</p>}
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

      {status && status.submitted && (
        <div className={`mt-4 p-3 rounded-md text-sm ${status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
}