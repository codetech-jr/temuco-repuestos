import EditarElectrodomesticoPage from './EditarElectrodomesticoPage';

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <EditarElectrodomesticoPage id={params.id} />;
}
