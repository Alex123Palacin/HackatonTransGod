import ComparteVisitaComp from "../components/ComparteVisitaComp";
import MiniExperienciaComp from "../components/MiniExperienciaComp";
import { usePublicaciones } from "../hooks/usarPublicaciones";

function PaginaPublicacion() {
  const { publicaciones, cargando, error, cargarPublicaciones } =
    usePublicaciones();

  return (
    <section className="flex flex-col gap-4 [overflow-wrap:normal] [word-break:normal]">
      <ComparteVisitaComp />

      <h2 className="px-2 text-[18px] font-bold text-[#006f6c]">
        Experiencias
      </h2>

      {cargando && (
        <p className="py-6 text-center text-[12px] text-slate-500">
          Cargando publicaciones...
        </p>
      )}

      {!cargando && error && (
        <div className="rounded-xl bg-white px-4 py-5 text-center shadow-sm">
          <p className="text-[12px] text-red-600">{error}</p>
          <button
            type="button"
            className="mt-3 text-[12px] font-bold text-[#006f6c]"
            onClick={() => void cargarPublicaciones()}
          >
            Volver a intentar
          </button>
        </div>
      )}

      {!cargando && !error && publicaciones.length === 0 && (
        <p className="rounded-xl bg-white px-4 py-6 text-center text-[12px] text-slate-500 shadow-sm">
          Aun no hay experiencias publicadas.
        </p>
      )}

      {!cargando && !error && publicaciones.map((publicacion) => (
        <MiniExperienciaComp
          key={publicacion.id_publicacion}
          titulo={publicacion.titulo}
          descripcion={publicacion.descripcion}
          imagenes={publicacion.imagenes}
        />
      ))}
    </section>
  );
}

export default PaginaPublicacion;
