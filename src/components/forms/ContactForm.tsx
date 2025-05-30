// src/components/forms/ContactForm.tsx
"use client";

import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: '¡Gracias! Tu mensaje ha sido enviado.' });
        setFormData({ name: '', phone: '', email: '', message: '' }); // Limpiar formulario
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.' });
        console.error("Error del servidor:", result);
      }
    } catch (error) {
      console.error('Error de red o al procesar la solicitud:', error);
      setSubmitStatus({ type: 'error', message: 'Error de conexión. Por favor, revisa tu red e intenta de nuevo.' });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... (campos del formulario como antes) ... */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          placeholder="Tu número de teléfono"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          placeholder="tu@ejemplo.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          ¿En qué podemos ayudarte?
        </label>
        <textarea
          name="message"
          id="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
          placeholder="Escribe tu mensaje aquí..."
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50 transition-colors duration-300"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </div>
      {submitStatus.message && (
        <p className={`mt-4 text-sm ${submitStatus.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {submitStatus.message}
        </p>
      )}
    </form>
  );
};

export default ContactForm;