import EditarElectrodomesticoPage from './EditarElectrodomesticoPage';

export default function Page(props: any) {
  const { params } = props;
  return <EditarElectrodomesticoPage id={params.id} />;
}
