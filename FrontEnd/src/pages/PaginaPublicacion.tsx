import ComparteVisitaComp from "../components/ComparteVisitaComp";
import MiniExperienciaComp from "../components/MiniExperienciaComp";

type Publicacion = {
  id: number;
  titulo: string;
  descripcion: string;
  imagenes: string[];
};

type PaginaPublicacionProps = {
  publicaciones: Publicacion[];
};

function PaginaPublicacion({ publicaciones }: PaginaPublicacionProps) {
  return (
    <section className="flex flex-col gap-4 [overflow-wrap:normal] [word-break:normal]">
      <ComparteVisitaComp />

      <h2 className="px-2 text-[18px] font-bold text-[#006f6c]">
        Experiencias
      </h2>

      {publicaciones.map((publicacion) => (
        <MiniExperienciaComp
          key={publicacion.id}
          titulo={publicacion.titulo}
          descripcion={publicacion.descripcion}
          imagenes={publicacion.imagenes}
        />
      ))}
    </section>
  );
}

export default PaginaPublicacion;
export type { Publicacion };
