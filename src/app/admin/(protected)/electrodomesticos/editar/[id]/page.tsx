import EditarElectrodomesticoPage from './EditarElectrodomesticoPage';

export default function Page({ params }: { params: { id: string } }) {
  return <EditarElectrodomesticoPage id={params.id} />;
}
