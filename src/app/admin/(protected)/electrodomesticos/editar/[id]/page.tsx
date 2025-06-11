import EditarElectrodomesticoPage from './EditarElectrodomesticoPage';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import ElectrodomesticoForm, { ElectrodomesticoFormData } from '@/components/admin/ElectrodomesticoForm';
import { supabase } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface ElectrodomesticoFromAPI {
  id: string;
  slug: string;
  name: string;
  short_description?: string | null;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category: string;
  brand: string;
  rating?: number | null;
  review_count?: number | null;
  long_description?: string | null;
  features?: string[] | string | null;
  specifications?: { key: string; value: string }[] | string | null;
  images?: string[] | string | null;
  stock?: number | null;
  is_active?: boolean;
  created_at?: string;
=======
export default function Page(props: any) {
  const { params } = props;
  return <EditarElectrodomesticoPage id={params.id} />;
>>>>>>> 01fbc02198e4e5c9f461a4b0daceabe5f1953891
}
