import { FaExclamationCircle } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import FormularioReporteComp from "../components/FormularioReporteComp";
import MenuModulosComp from "../components/MenuModulosComp";
import MiniReporteComp from "../components/MiniReporteComp";
import { useReportes } from "../hooks/usarReportes";
import { FlechitaRetrocede } from "../ui/BotonUi";

function ReportarPages() {
  return (
    <AdaptadoMobil>
      <section className="flex min-h-full flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-5 py-6">
          <header className="flex items-center gap-3">
            <FlechitaRetrocede ruta="/noticias" />
            <div>
              <h1 className="text-[20px] font-bold text-[#006f6c]">
                Nuevo reporte
              </h1>
              <p className="text-[11px] leading-4 text-slate-500">
                Cuenta que sucede para comunicarlo a la Municipalidad.
              </p>
            </div>
          </header>

          <FormularioReporteComp />
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

function VerReportesPages() {
  const { reportes, cargando, error, cargarReportes } = useReportes();

  return (
    <AdaptadoMobil>
      <section className="flex min-h-full flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-5 py-6">
          <header className="flex items-center gap-3">
            <FlechitaRetrocede ruta="/noticias" />
            <h1 className="text-[20px] font-bold text-[#006f6c]">
              Mis reportes
            </h1>
          </header>

          {cargando && (
            <p className="py-8 text-center text-[12px] text-slate-500">
              Cargando tus reportes...
            </p>
          )}

          {!cargando && error && (
            <div className="rounded-[16px] bg-white px-4 py-5 text-center shadow-sm">
              <p className="text-[12px] text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => void cargarReportes()}
                className="mt-3 text-[12px] font-bold text-[#006f6c]"
              >
                Volver a intentar
              </button>
            </div>
          )}

          {!cargando && !error && reportes.length === 0 && (
            <p className="rounded-[16px] bg-white px-4 py-8 text-center text-[12px] text-slate-500 shadow-sm">
              Aun no has enviado reportes.
            </p>
          )}

          {!cargando &&
            !error &&
            reportes.map((reporte) => (
              <MiniReporteComp key={reporte.id_reporte} reporte={reporte} />
            ))}
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

function QuejasReportePages() {
  return (
    <AdaptadoMobil>
      <section className="flex min-h-full flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-5 py-6">
          <header className="flex items-center gap-3">
            <FlechitaRetrocede ruta="/noticias" />
            <div>
              <h1 className="text-[20px] font-bold text-[#006f6c]">Quejas</h1>
              <p className="text-[11px] leading-4 text-slate-500">
                Reporta inconvenientes con el servicio, atencion o convivencia.
              </p>
            </div>
          </header>

          <section className="rounded-[18px] bg-white px-4 py-4 shadow-sm">
            <FaExclamationCircle className="mb-3 h-9 w-9 text-[#006f6c]" />
            <h2 className="text-[15px] font-bold text-[#006f6c]">
              ¿Que debes incluir?
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-[12px] leading-5 text-slate-600">
              <li>Lugar donde ocurrio el problema.</li>
              <li>Fecha aproximada del inconveniente.</li>
              <li>Descripcion clara de lo sucedido.</li>
            </ul>
          </section>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export { QuejasReportePages, ReportarPages, VerReportesPages };
