import { useState } from "react";
import SeccionRegistrados from "./seccionRegistrados";
import type { AveRegistrada } from "./seccionRegistrados";
import SecicionDesconocidos from "./secicionDesconocidos";
import type { AveDesconocida } from "./secicionDesconocidos";

type VistaAnimal = "registradas" | "desconocidas";

type VistaAnimalCompProps = {
  registradas: AveRegistrada[];
  desconocidas: AveDesconocida[];
  totalRegistradas: number;
  totalDesconocidas: number;
  onSeleccionarAve?: (ave: AveRegistrada) => void;
};

function VistaAnimalComp({
  registradas,
  desconocidas,
  totalRegistradas,
  totalDesconocidas,
  onSeleccionarAve,
}: VistaAnimalCompProps) {
  const [vista, setVista] = useState<VistaAnimal>("registradas");
  const estaRegistradas = vista === "registradas";

  return (
    <section className="rounded-[22px] bg-white px-3 py-5 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="mb-5 flex justify-center gap-9">
        <button
          type="button"
          onClick={() => setVista("registradas")}
          className={`pb-2 text-[12px] font-bold ${
            estaRegistradas
              ? "border-b-2 border-[#006f6c] text-[#006f6c]"
              : "text-gray-600"
          }`}
        >
          Registradas{" "}
          <span className="rounded-full bg-[#e6eeee] px-2 py-1 text-[10px]">
            {totalRegistradas}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setVista("desconocidas")}
          className={`pb-2 text-[12px] font-bold ${
            !estaRegistradas
              ? "border-b-2 border-[#006f6c] text-[#006f6c]"
              : "text-gray-600"
          }`}
        >
          Desconocidas{" "}
          <span className="rounded-full bg-[#e6eeee] px-2 py-1 text-[10px]">
            {totalDesconocidas}
          </span>
        </button>
      </div>

      {estaRegistradas ? (
        <SeccionRegistrados
          aves={registradas}
          onSeleccionarAve={onSeleccionarAve}
        />
      ) : (
        <SecicionDesconocidos aves={desconocidas} />
      )}
    </section>
  );
}

export default VistaAnimalComp;
