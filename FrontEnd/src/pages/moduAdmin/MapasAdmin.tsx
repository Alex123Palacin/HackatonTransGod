import { FaMapMarkedAlt } from "react-icons/fa";

function MapasAdmin() {
  return (
    <section className="flex min-h-[420px] items-center justify-center rounded-lg border border-dashed border-[#9fc7bf] bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-[#e6f3ef] text-[#006f6c]">
          <FaMapMarkedAlt className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-lg font-bold text-slate-800">Mapas</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Este modulo esta preparado para conectarse cuando se definan los
          modelos y datos administrables de los lugares del mapa.
        </p>
      </div>
    </section>
  );
}

export default MapasAdmin;
