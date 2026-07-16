import { useState, type ReactNode } from "react";
import { FaXmark } from "react-icons/fa6";

type DetalleLugar = {
  etiqueta: string;
  valor: string;
};

type DescripcionLugarCompProps = {
  numero?: number;
  titulo: string;
  descripcion: string;
  imagenes: string[];
  detalles?: DetalleLugar[];
  children?: ReactNode; 
};

function DescripcionLugarComp({
  numero,
  titulo,
  descripcion,
  imagenes,
  detalles = [],
  children,
}: DescripcionLugarCompProps) {
  const [galeriaAbierta, setGaleriaAbierta] = useState(false);
  const imagenesVisibles = imagenes.slice(0, 3);
  const cantidadExtra = Math.max(0, imagenes.length - 3);

  return (
    <article className="rounded-[22px] bg-white px-4 py-4 shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <header className="flex items-start gap-3">
        {numero !== undefined && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#006f6c] text-[16px] font-bold text-white">
            {numero}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-[16px] font-bold text-[#006f6c]">{titulo}</h2>
          <p className="mt-3 text-[11px] leading-4 text-slate-500">
            {descripcion}
          </p>
        </div>
      </header>

      <button
        type="button"
        onClick={() => setGaleriaAbierta(true)}
        className="mx-auto mt-4 grid w-[215px] grid-cols-2 gap-1 overflow-hidden rounded-sm"
      >
        {imagenesVisibles.map((imagen, index) => (
          <span
            key={`${imagen}-${index}`}
            className={`relative overflow-hidden ${
              index === 0 ? "row-span-2 h-[110px]" : "h-[53px]"
            }`}
          >
            <img
              src={imagen}
              alt={`${titulo} ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {index === 2 && cantidadExtra > 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-[22px] font-bold text-white">
                +{cantidadExtra}
              </span>
            )}
          </span>
        ))}
      </button>

      <div className="mt-4 flex flex-col gap-2.5">
        {detalles.map((detalle) => (
          <div
            key={`${detalle.etiqueta}-${detalle.valor}`}
            className="rounded-full bg-[#dfeceb] px-4 py-2.5 text-center text-[12px] text-slate-600"
          >
            <strong className="text-[#006f6c]">{detalle.etiqueta} :</strong>{" "}
            {detalle.valor}
          </div>
        ))}
      </div>

      {children && (
        <div className="w-full flex justify-center mt-6">
          {children}
        </div>
      )}

      {galeriaAbierta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5">
          <div className="max-h-[85vh] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#006f6c]">
                {titulo}
              </h3>
              <button
                type="button"
                onClick={() => setGaleriaAbierta(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dfeceb] text-[#006f6c]"
              >
                <FaXmark />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {imagenes.map((imagen, index) => (
                <img
                  key={`${imagen}-galeria-${index}`}
                  src={imagen}
                  alt={`${titulo} galeria ${index + 1}`}
                  className="h-28 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default DescripcionLugarComp;
export type { DetalleLugar };