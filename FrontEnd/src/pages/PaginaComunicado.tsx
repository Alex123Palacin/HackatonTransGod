import MiniComunicadoComp from "../components/MiniComunicadoComp";

type Comunicado = {
  id: number;
  categoria: string;
  titulo: string;
  fecha: string;
  imagenUrl: string;
};

type PaginaComunicadoProps = {
  comunicados: Comunicado[];
};

function PaginaComunicado({ comunicados }: PaginaComunicadoProps) {
  return (
    <section className="flex flex-col gap-4 [overflow-wrap:normal] [word-break:normal]">
      {comunicados.map((comunicado) => (
        <MiniComunicadoComp
          key={comunicado.id}
          categoria={comunicado.categoria}
          titulo={comunicado.titulo}
          fecha={comunicado.fecha}
          imagenUrl={comunicado.imagenUrl}
        />
      ))}
    </section>
  );
}

export default PaginaComunicado;
export type { Comunicado };
