import { FaClipboardCheck, FaExclamationCircle, FaRegFileAlt } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { FlechitaRetrocede } from "../ui/BotonUi";

function ReportarPages() {
  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
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

          <section className="rounded-[18px] bg-white px-4 py-4 shadow-sm">
            <label className="text-[12px] font-bold text-[#006f6c]">
              Tipo de problema
            </label>
            <input
              type="text"
              placeholder="Ejemplo: limpieza, queja o seguridad"
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-[12px] outline-none"
            />

            <label className="mt-4 block text-[12px] font-bold text-[#006f6c]">
              Descripcion
            </label>
            <textarea
              placeholder="Describe brevemente el problema..."
              className="mt-2 h-36 w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-[12px] outline-none"
            />

            <button
              type="button"
              className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#006f6c] text-[13px] font-bold text-white"
            >
              <FaRegFileAlt />
              Enviar reporte
            </button>
          </section>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

function VerReportesPages() {
  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-5 py-6">
          <header className="flex items-center gap-3">
            <FlechitaRetrocede ruta="/noticias" />
            <h1 className="text-[20px] font-bold text-[#006f6c]">
              Mis reportes
            </h1>
          </header>

          {["En revision", "Recibido", "Atendido"].map((estado, index) => (
            <article
              key={estado}
              className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-4 shadow-sm"
            >
              <FaClipboardCheck className="h-8 w-8 shrink-0 text-[#006f6c]" />
              <div className="min-w-0">
                <h2 className="text-[13px] font-bold text-[#006f6c]">
                  Reporte #{index + 1}
                </h2>
                <p className="text-[11px] leading-4 text-slate-500">
                  Estado actual: {estado}
                </p>
              </div>
            </article>
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
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
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
