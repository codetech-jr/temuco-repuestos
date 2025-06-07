'use client';

import { FaFacebookF, FaTwitter, FaWhatsapp, FaLinkedinIn } from 'react-icons/fa'; // Necesitarás 'react-icons'
import { MdEmail } from "react-icons/md";

interface ShareButtonsProps {
  url: string;      // URL completa de la página del producto
  title: string;    // Nombre del producto para el texto
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Echa un vistazo a este producto:%20${encodedUrl}`,
  };

  return (
    <div className="flex items-center gap-3 my-4">
      <span className="text-sm font-semibold text-gray-700">Compartir:</span>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600"><FaFacebookF size={20} /></a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400"><FaTwitter size={20} /></a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500"><FaWhatsapp size={20} /></a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700"><FaLinkedinIn size={20} /></a>
      <a href={shareLinks.email} className="text-gray-500 hover:text-red-500"><MdEmail size={22} /></a>
    </div>
  );
};