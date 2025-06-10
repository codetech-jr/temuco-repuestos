// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin'; // Usando el alias @, es más limpio. Si no funciona, usa '../../lib/supabase/admin'
import nodemailer from 'nodemailer';

// En el App Router, se exportan funciones con el nombre del método HTTP (POST, GET, etc.)
export async function POST(request: Request) {
  
  // 1. Extraer los datos del cuerpo de la petición
  // En el App Router se usa request.json()
  const { nombre, email, asunto, mensaje } = await request.json();

  // 2. Validación de los datos
  if (!nombre || !email || !asunto || !mensaje) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
  }

  // --- PRIMERA TAREA: GUARDAR EN LA BASE DE DATOS ---
  try {
    const { error } = await supabaseAdmin
      .from('mensajes')
      .insert([{ nombre, email, asunto, mensaje }]);

    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
      return NextResponse.json({ error: 'Hubo un problema al guardar tu mensaje.' }, { status: 500 });
    }

  } catch (dbError) {
    console.error('Error de conexión con la base de datos:', dbError);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }

  // --- SEGUNDA TAREA: ENVIAR EL CORREO AL ADMINISTRADOR ---
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Formulario de tu Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_ADMIN_EMAIL,
      subject: `Nuevo mensaje de contacto: ${asunto}`,
      html: `
        <h1>Nuevo Mensaje Recibido</h1>
        <p>Se ha enviado un mensaje a través del formulario de contacto.</p>
        <hr>
        <ul>
          <li><strong>Nombre:</strong> ${nombre}</li>
          <li><strong>Email de contacto:</strong> ${email}</li>
          <li><strong>Asunto:</strong> ${asunto}</li>
        </ul>
        <h3>Mensaje:</h3>
        <p>${mensaje.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="font-size: 12px; color: #777;">Este mensaje también ha sido guardado en la base de datos de Supabase.</p>
      `,
    });

    // Éxito total: guardado en BD y correo enviado
    return NextResponse.json({ message: 'Mensaje enviado y guardado correctamente.' }, { status: 200 });

  } catch (emailError) {
    console.error('Error al enviar el correo:', emailError);
    // El mensaje ya se guardó, así que devolvemos un éxito parcial.
    return NextResponse.json({ message: 'Tu mensaje fue guardado, pero no se pudo enviar la notificación por correo.' }, { status: 200 });
  }
}