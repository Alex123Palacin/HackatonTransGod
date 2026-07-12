import { BtnBlanco } from "../ui/BotonUi";

type MiniComunicadoCompProps = {
  categoria?: string;
  titulo?: string;
  fecha?: string;
  imagenUrl?: string;
  onVer?: () => void;
};

function MiniComunicadoComp({
  categoria = "Comunicado",
  titulo = "Falta de mantenimiento en el malecon",
  fecha = "11/07/2026",
  imagenUrl,
  onVer,
}: MiniComunicadoCompProps) {
  return (
    <article className="grid w-full max-w-full grid-cols-[1fr_92px] gap-3 rounded-lg border border-gray-400 bg-white p-3 font-[Arial] shadow-sm">
      <div className="flex min-w-0 flex-col">
        <span className="text-[9px] font-bold text-[#006f6c]">{categoria}</span>
        <h3 className="mt-3 text-[16px] font-bold leading-5 text-[#006f6c]">
          {titulo}
        </h3>
        <span className="mt-2 text-[11px] text-gray-500">{fecha}</span>
      </div>

      {imagenUrl ? (
        <img
          src={imagenUrl}
          alt={titulo}
          className="h-[98px] w-[92px] object-cover"
        />
      ) : (
        <div className="h-[98px] w-[92px] bg-gray-300" />
      )}

      <div className="col-span-2 flex justify-center">
        <BtnBlanco
          informacion="Ver"
          estilos="min-h-[24px] max-w-[175px] rounded-full py-1 text-[12px]"
          onClick={onVer}
        />
      </div>
    </article>
  );
}

export default MiniComunicadoComp;
