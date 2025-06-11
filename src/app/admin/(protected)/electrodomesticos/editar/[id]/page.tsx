import EditarElectrodomesticoPage from './EditarElectrodomesticoPage';

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <EditarElectrodomesticoPage id={params.id} />;
}
