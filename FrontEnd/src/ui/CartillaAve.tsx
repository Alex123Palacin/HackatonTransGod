import { FaCheck, FaLock } from "react-icons/fa";

type EstadoAve = "encontrada" | "noEncontrada" | "desconocido";

type CartillaAveProps = {
  estado: EstadoAve;
  imagenUrl: string | null;
  nombre?: string;
  fecha?: string;
  onClick?: () => void;
};

function CartillaAve({
  estado,
  imagenUrl,
  nombre,
  fecha,
  onClick,
}: CartillaAveProps) {
  const esDesconocido = estado === "desconocido";
  const encontrada = estado === "encontrada";

  const contenido = (
    <>
      <div className="relative h-[102px] w-full overflow-hidden">
        {imagenUrl ? (
          <img
            src={imagenUrl}
            alt={nombre ?? "Ave desconocida"}
            className={`h-full w-full object-cover ${
              estado === "noEncontrada" ? "grayscale opacity-60" : ""
            }`}
          />
        ) : (
          <div className="h-full w-full bg-gray-300" aria-hidden="true" />
        )}

        {!esDesconocido && (
          <span
            className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs text-white shadow-sm ${
              encontrada ? "bg-green-100 text-[#006f6c]" : "bg-gray-100 text-gray-500"
            }`}
          >
            {encontrada ? <FaCheck /> : <FaLock />}
          </span>
        )}
      </div>

      <div className="min-h-[44px] px-2 py-2">
        {esDesconocido ? (
          <p className="text-[12px] font-bold leading-4 text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
            {fecha}
          </p>
        ) : (
          <p className="text-[11px] font-bold leading-4 text-slate-700 [overflow-wrap:normal] [word-break:normal]">
            {nombre}
          </p>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition active:scale-[0.98] [overflow-wrap:normal] [word-break:normal]"
      >
        {contenido}
      </button>
    );
  }

  return (
    <article className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm [overflow-wrap:normal] [word-break:normal]">
      {contenido}
    </article>
  );
}

export default CartillaAve;
export type { EstadoAve };
