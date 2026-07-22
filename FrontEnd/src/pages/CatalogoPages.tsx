import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import MenuPerfilComp from "../components/MenuPerfilComp";
import PorcentajeAveComp from "../components/porcentajeAveComp";
import VistaAnimalComp from "../components/vistanimalComp";
import type { AveDesconocida } from "../components/secicionDesconocidos";
import type { AveRegistrada } from "../components/seccionRegistrados";
import { useCatalogo } from "../hooks/usarCatalogo";
import { useRedireccion } from "../hooks/redireccion";
import { BuscaTuAve } from "../ui/TextoUi";

const formateadorFecha = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function CatalogoPages() {
  const { redirigir } = useRedireccion();
  const {
    resumen,
    aves,
    desconocidas,
    busqueda,
    setBusqueda,
    cargando,
    error,
    cargarCatalogo,
  } = useCatalogo();

  const avesRegistradas: AveRegistrada[] = aves.map((ave) => ({
    id: ave.id_ave,
    nombre: ave.nombre,
    imagenUrl: ave.imagen_principal,
    encontrada: ave.encontrada,
  }));
  const avesDesconocidas: AveDesconocida[] = desconocidas.map((ave) => ({
    id: ave.id_escaneo,
    imagenUrl: ave.imagen,
    fecha: formateadorFecha.format(new Date(ave.fecha)),
  }));

  return (
    <AdaptadoMobil>
      <section className="flex min-h-full flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-3 py-5">
          <header className="flex items-center justify-between px-2">
            <h1 className="text-[18px] font-bold text-[#006f6c]">
              Mi Catalogo
            </h1>
            <MenuPerfilComp />
          </header>

          <PorcentajeAveComp
            encontradas={resumen.encontradas}
            total={resumen.total}
            porcentaje={resumen.porcentaje}
          />
          <BuscaTuAve valor={busqueda} onChange={setBusqueda} />

          {cargando && (
            <p className="py-5 text-center text-[12px] text-slate-500">
              Actualizando catalogo...
            </p>
          )}

          {!cargando && error && (
            <div className="rounded-xl bg-white px-4 py-5 text-center shadow-sm">
              <p className="text-[12px] text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => void cargarCatalogo()}
                className="mt-3 text-[12px] font-bold text-[#006f6c]"
              >
                Volver a intentar
              </button>
            </div>
          )}

          {!cargando && !error && (
            <VistaAnimalComp
              registradas={avesRegistradas}
              desconocidas={avesDesconocidas}
              totalRegistradas={resumen.total}
              totalDesconocidas={avesDesconocidas.length}
              onSeleccionarAve={(ave) =>
                redirigir(`/descripcion-ave/${ave.id}`)
              }
            />
          )}
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default CatalogoPages;
