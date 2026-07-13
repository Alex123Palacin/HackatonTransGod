import { FaMapMarkedAlt, FaVolumeUp } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import CararteristicasDetalleComp from "../components/CararteristicasDetallecomp";
import DescripcionLugarComp from "../components/DescripcionLugarComp";
import MenuModulosComp from "../components/MenuModulosComp";
import { FlechitaRetrocede } from "../ui/BotonUi";

const imagenesDetalle = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYISqS21khx4P141UoH6dZU5qIpM8vl7yAgFt0uC2adw&s=10",
  "https://sg.portal-pokemon.com/play/resources/pokedex/img/pm/ca3db4aad5c85a525d9be86852b26db1db7a22c0.png",
  "https://i.pinimg.com/474x/08/49/c4/0849c426da6862d43591cd4b97583474.jpg",
  "https://static.wikia.nocookie.net/fakemon/images/c/c7/Raichu_anime.png/revision/latest?cb=20091217140920&path-prefix=es",
];

const detallesAve = [
  {
    titulo: "Caracteristicas",
    descripcion:
      "Grande, elegante y de cuello largo. Pico amarillo anaranjado y patas negras.",
  },
  {
    titulo: "Habitat",
    descripcion: "Humedales, lagunas, riberas y costas someras.",
  },
  {
    titulo: "Donde verla",
    descripcion:
      "En aguas tranquilas de la Poza Principal, miradores y orillas del humedal.",
  },
  {
    titulo: "Dato curioso",
    descripcion:
      "Puede permanecer inmovil por minutos antes de lanzar un rapido ataque para pescar.",
  },
];

function DescripcionAvePages() {
  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-3 px-3 py-3">
          <section className="relative h-[285px] overflow-hidden rounded-[22px] bg-slate-200 shadow-sm">
            <div className="absolute left-3 top-3 z-10">
              <FlechitaRetrocede ruta="/catalogo" />
            </div>

            <div className="flex h-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]">
              {imagenesDetalle.map((imagen, index) => (
                <img
                  key={`${imagen}-${index}`}
                  src={imagen}
                  alt={`Garza blanca ${index + 1}`}
                  className="h-full min-w-full snap-center object-cover"
                />
              ))}
            </div>

            <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2">
              {imagenesDetalle.map((imagen) => (
                <span
                  key={`punto-${imagen}`}
                  className="h-1.5 w-1.5 rounded-full bg-white/85 shadow-sm"
                />
              ))}
            </div>
          </section>

          <section className="rounded-[22px] bg-white px-4 pb-4 pt-4 shadow-md">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h1 className="text-[20px] font-bold leading-6 text-[#006f6c]">
                  Garza blanca
                </h1>
                <p className="text-[12px] italic text-slate-600">Ardea alba</p>
              </div>

              <span className="rounded-full bg-[#e1f3e8] px-3 py-1.5 text-[10px] font-bold text-[#287a45]">
                Registrada
              </span>
            </header>

            <div className="mt-3">
              <CararteristicasDetalleComp
                chips={[
                  { texto: "Acuatica", tipo: "agua" },
                  { texto: "Residente", tipo: "verde" },
                  { texto: "Color blanco", tipo: "simple" },
                ]}
                detalles={detallesAve}
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

          <section className="pb-3">
            <DescripcionLugarComp
              numero={2}
              titulo="Malecon Wiese"
              descripcion="Mirador costero ideal para observar aves marinas y contemplar la bahia de La Punta. Es un punto recomendado para disfrutar del paisaje, tomar fotografias y conectarse con la naturaleza."
              imagenes={imagenesDetalle}
              detalles={[
                { etiqueta: "Lugar", valor: "Malecon Wiese" },
                { etiqueta: "Ideal para", valor: "Observacion de aves" },
                { etiqueta: "Zona", valor: "Humedal y mirador" },
              ]}
            />
          </section>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default DescripcionAvePages;
