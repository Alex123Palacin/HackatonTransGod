import { BtnBlanco } from "../ui/BotonUi";

type MiniComunicadoCompProps = {
  categoria?: string;
  titulo: string;
  fecha: string;
  imagenUrl?: string;
  onVer?: () => void;
};

function MiniComunicadoComp({
  categoria = "Comunicado",
  titulo,
  fecha,
  imagenUrl,
  onVer,
}: MiniComunicadoCompProps) {
  return (
    <article className="grid w-full max-w-full grid-cols-[1fr_88px] gap-3 rounded-xl border border-gray-400 bg-white p-3 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="flex min-w-0 flex-col">
        <span className="text-[9px] font-bold text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">{categoria}</span>
        <h3 className="mt-2 text-[15px] font-bold leading-5 text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
          {titulo}
        </h3>
        <span className="mt-2 text-[11px] text-gray-500">{fecha}</span>
      </div>

      {imagenUrl ? (
        <img
          src={imagenUrl}
          alt={titulo}
          className="h-[88px] w-[88px] rounded-sm object-cover"
        />
      ) : (
        <div className="h-[88px] w-[88px] rounded-sm bg-gray-300" />
      )}

      <div className="col-span-2 flex justify-center">
        <BtnBlanco
          informacion="Ver"
          estilos="!min-h-7 !w-[160px] !rounded-full !px-3 !py-1 !text-[12px] leading-none"
          onClick={onVer}
        />
      </div>
    </article>
  );
}

export default MiniComunicadoComp;
