// pages/api/contact.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase/admin'; // Importa el cliente admin que creamos
import nodemailer from 'nodemailer';

// Define un tipo para la respuesta de la API para mayor claridad
type ResponseData = {
  message?: string;
  error?: string;
};

// El manejador principal de la API Route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // 1. Filtrar para que solo se acepten peticiones POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 2. Extraer y validar los datos del cuerpo de la petición
  const { nombre, email, asunto, mensaje } = req.body;

  if (!nombre || !email || !asunto || !mensaje) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // --- PRIMERA TAREA: GUARDAR EN LA BASE DE DATOS ---
  try {
    const { error } = await supabaseAdmin
      .from('mensajes') // Asegúrate que 'mensajes' es el nombre exacto de tu tabla
      .insert([{ nombre, email, asunto, mensaje }]);

    // Si Supabase devuelve un error, lo manejamos
    if (error) {
      console.error('Error al guardar en Supabase:', error.message);
      return res.status(500).json({ error: 'Hubo un problema al guardar tu mensaje.' });
    }
    
    // Si la inserción fue exitosa, no devolvemos nada todavía y continuamos al paso del correo.

  } catch (dbError) {
    console.error('Error de conexión con la base de datos:', dbError);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }


  // --- SEGUNDA TAREA: ENVIAR EL CORREO AL ADMINISTRADOR ---
  try {
    // Configurar el transportador de Nodemailer con las variables de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // `true` si el puerto es 465, de lo contrario `false`
      auth: {
        user: process.env.SMTP_USER, // Tu email de autenticación SMTP
        pass: process.env.SMTP_PASS, // Tu contraseña de aplicación SMTP
      },
    });

    // Enviar el correo
    await transporter.sendMail({
      from: `"Formulario de tu Web" <${process.env.SMTP_USER}>`, // Remitente
      to: process.env.SMTP_ADMIN_EMAIL,                         // Correo del administrador
      subject: `Nuevo mensaje de contacto: ${asunto}`,           // Asunto del correo
      // Cuerpo del correo en HTML para un formato legible
      html: `
        <h1>Nuevo Mensaje desde el Formulario de Contacto</h1>
        <p>Has recibido un nuevo mensaje con los siguientes datos:</p>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; border: 1px solid #ddd; width: 100px;"><strong>Nombre:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${nombre}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background-color: #f2f2f2;">
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Asunto:</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${asunto}</td>
          </tr>
        </table>
        <h3 style="margin-top: 20px;">Mensaje:</h3>
        <div style="padding: 10px; border: 1px solid #ddd; background-color: #fafafa;">
          <p style="margin: 0;">${mensaje.replace(/\n/g, '<br>')}</p>
        </div>
        <hr style="margin-top: 20px;">
        <p style="font-size: 12px; color: #777;">Este mensaje fue guardado en la base de datos de Supabase.</p>
      `,
    });

    // Si todo ha ido bien (BD + Correo), enviamos una respuesta de éxito total.
    return res.status(200).json({ message: 'Mensaje enviado y guardado correctamente.' });

  } catch (emailError) {
    console.error('Error al enviar el correo:', emailError);
    // IMPORTANTE: El mensaje ya se guardó en la base de datos.
    // Aunque el correo falle, el dato no se pierde. Informamos al usuario del éxito
    // y registramos el error para que tú, como desarrollador, lo soluciones.
    return res.status(200).json({ message: 'Tu mensaje fue guardado, pero no se pudo enviar la notificación por correo.' });
  }
}