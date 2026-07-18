import { FaMapMarkedAlt, FaVolumeUp } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AdaptadoMobil from "../components/AdaptadoMobil";
import CararteristicasDetalleComp from "../components/CararteristicasDetallecomp";
import type {
  ChipDetalle,
  ItemDetalle,
} from "../components/CararteristicasDetallecomp";
import MenuModulosComp from "../components/MenuModulosComp";
import { useDetalleAve } from "../hooks/usarDetalleAve";
import { FlechitaRetrocede } from "../ui/BotonUi";

const tiposChip: ChipDetalle["tipo"][] = ["agua", "verde", "simple"];

function DescripcionAvePages() {
  const { idAve } = useParams();
  const { ave, cargando, error } = useDetalleAve(Number(idAve));

  const chips: ChipDetalle[] =
    ave?.atributos_destacados.map((atributo, index) => ({
      texto: atributo.texto,
      tipo: tiposChip[index % tiposChip.length],
    })) ?? [];
  const detalles: ItemDetalle[] =
    ave?.detalles.map((detalle) => ({
      titulo: detalle.etiqueta,
      descripcion: detalle.descripcion,
    })) ?? [];

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-3 px-3 py-3">
          {cargando && (
            <p className="py-12 text-center text-[12px] text-slate-500">
              Cargando informacion del ave...
            </p>
          )}

          {!cargando && error && (
            <section className="rounded-[18px] bg-white px-5 py-8 text-center shadow-sm">
              <p className="text-[12px] text-red-600">{error}</p>
              <div className="mt-4 flex justify-center">
                <FlechitaRetrocede ruta="/catalogo" />
              </div>
            </section>
          )}

          {!cargando && !error && ave && (
            <>
              <section className="relative h-[285px] overflow-hidden rounded-[22px] bg-slate-300 shadow-sm">
                <div className="absolute left-3 top-3 z-10">
                  <FlechitaRetrocede ruta="/catalogo" />
                </div>

                {ave.fotos.length > 0 ? (
                  <div className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
                    {ave.fotos.map((foto, index) => (
                      <img
                        key={foto.id_foto}
                        src={foto.imagen}
                        alt={foto.descripcion || `${ave.nombre} ${index + 1}`}
                        className="h-full min-w-full snap-center object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full bg-slate-300" />
                )}

                {ave.fotos.length > 1 && (
                  <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">
                    {ave.fotos.map((foto) => (
                      <span
                        key={`punto-${foto.id_foto}`}
                        className="h-1.5 w-1.5 rounded-full bg-white/85 shadow-sm"
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-[22px] bg-white px-4 pb-4 pt-4 shadow-md">
                <header className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="text-[20px] font-bold leading-6 text-[#006f6c]">
                      {ave.nombre}
                    </h1>
                    {ave.nombre_cientifico && (
                      <p className="text-[12px] italic text-slate-600">
                        {ave.nombre_cientifico}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 rounded-full bg-[#e1f3e8] px-3 py-1.5 text-[10px] font-bold text-[#287a45]">
                    Registrada
                  </span>
                </header>

                {ave.descripcion && (
                  <p className="mt-3 text-[11px] leading-4 text-slate-600">
                    {ave.descripcion}
                  </p>
                )}

                <div className="mt-3">
                  <CararteristicasDetalleComp
                    chips={chips}
                    detalles={detalles}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border-2 border-[#006f6c] bg-white px-2 text-[12px] font-bold text-[#006f6c]"
                  >
                    <FaVolumeUp />
                    Escuchar canto
                  </button>
                  <button
                    type="button"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-[#006f6c] px-2 text-[12px] font-bold text-white shadow-sm"
                  >
                    <FaMapMarkedAlt />
                    Ver en el mapa
                  </button>
                </div>
              </section>
            </>
          )}
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default DescripcionAvePages;
