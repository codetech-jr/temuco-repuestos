// src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const emailTo = process.env.EMAIL_TO;
const emailFrom = process.env.EMAIL_FROM;

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY) {
    console.error('Resend API Key no está configurada.');
    return NextResponse.json({ error: 'Error de configuración del servidor.' }, { status: 500 });
  }
  if (!emailTo || !emailFrom) {
    console.error('EMAIL_TO o EMAIL_FROM no están configurados.');
    return NextResponse.json({ error: 'Error de configuración del servidor para emails.' }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Validación simple de campos (puedes expandirla)
    if (!name || !phone || !email || !message) {
      return NextResponse.json({ error: 'Todos los campos son requeridos.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: emailFrom, // Ej: 'Acme <onboarding@resend.dev>' o tu email verificado
      to: [emailTo],   // Email donde recibirás la notificación
      subject: `Nuevo Mensaje de Contacto de ${name}`,
      reply_to: email, // Para poder responder directamente al remitente
      html: `
        <h1>Nuevo Mensaje de Contacto</h1>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      // También puedes usar `text` para una versión de texto plano
      // text: `Nombre: ${name}\nTeléfono: ${phone}\nEmail: ${email}\nMensaje: ${message}`,
    });

    if (error) {
      console.error('Error al enviar email con Resend:', error);
      return NextResponse.json({ error: 'Error al enviar el mensaje.', details: error.message }, { status: 500 });
    }

    // Opcional: Enviar un email de confirmación al usuario
    // await resend.emails.send({
    //   from: emailFrom,
    //   to: [email], // Email del usuario
    //   subject: 'Hemos recibido tu mensaje - Temuco Repuestos',
    //   html: `<p>Hola ${name},</p><p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos a la brevedad.</p><p>Saludos,<br/>El equipo de Temuco Repuestos</p>`,
    // });


    return NextResponse.json({ message: 'Mensaje enviado exitosamente!', data }, { status: 200 });

  } catch (err: any) {
    console.error('Error en la función API:', err);
    return NextResponse.json({ error: 'Error interno del servidor.', details: err.message }, { status: 500 });
  }
}