import { FaBolt, FaCheckCircle, FaTimes } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { useRedireccion } from "../hooks/redireccion";

const imagenResultado =
  "https://static.wikia.nocookie.net/fakemon/images/c/c7/Raichu_anime.png/revision/latest?cb=20091217140920&path-prefix=es";

function DetalleScanerPages() {
  const { redirigir } = useRedireccion();

  return (
    <AdaptadoMobil>
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-white [overflow-wrap:normal] [word-break:normal]">
        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="relative h-[500px] overflow-hidden bg-slate-300">
            <img
              src={imagenResultado}
              alt="Ave escaneada"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />

            <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 pt-4">
              <button
                type="button"
                onClick={() => redirigir("/scan")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006f6c] shadow-md"
              >
                <FaTimes />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006f6c] shadow-md"
              >
                <FaBolt />
              </button>
            </header>

            <div className="absolute left-8 right-8 top-[100px] z-10 h-[250px]">
              <span className="absolute left-0 top-0 h-12 w-12 rounded-tl-lg border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-12 w-12 rounded-tr-lg border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-lg border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-12 w-12 rounded-br-lg border-b-4 border-r-4 border-white" />
            </div>

            <div className="absolute bottom-[118px] left-16 right-16 rounded-xl bg-black/45 px-4 py-2 text-center text-[12px] font-bold text-white">
              Centra el ave en el marco
            </div>
          </div>

          <section className="-mt-14 z-10 mx-3 rounded-t-[24px] bg-white px-4 pb-5 pt-5 shadow-lg">
            <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-slate-300" />
            <h1 className="text-[17px] font-bold text-[#006f6c]">
              Posible identificacion
            </h1>

            <article className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <img
                src={imagenResultado}
                alt="Gaviota peruana"
                className="h-20 w-20 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold leading-5 text-[#006f6c]">
                  Gaviota peruana
                </h2>
                <p className="text-[12px] italic text-slate-500">
                  Larus belcheri
                </p>
                <p className="mt-2 text-[11px] leading-4 text-slate-600">
                  Ave comun en costas rocosas y playas. Se alimenta de peces y
                  restos marinos.
                </p>
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dff3e9] text-[13px] font-bold text-[#006f6c]">
                90%
              </span>
            </article>

            <button
              type="button"
              onClick={() => redirigir("/descripcion-ave")}
              className="mx-auto mt-5 flex h-10 w-[260px] items-center justify-center gap-2 rounded-xl bg-[#006f6c] text-[15px] font-bold text-white shadow-sm"
            >
              <FaCheckCircle />
              Ver detalles
            </button>
          </section>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default DetalleScanerPages;
