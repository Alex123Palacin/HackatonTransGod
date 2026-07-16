import { FaClipboardList, FaRegEdit } from "react-icons/fa";
import { useRedireccion } from "../hooks/redireccion";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";

function HazReporteComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="rounded-[18px] border border-gray-200 bg-white px-4 py-4 shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e4f3ed] text-[#006f6c]">
          <FaClipboardList className="h-8 w-8" />
        </span>

        <div className="min-w-0">
          <h2 className="text-[17px] font-bold leading-5 text-[#006f6c]">
            Reporta un problema
          </h2>
          <p className="mt-1 text-[11px] leading-4 text-slate-600">
            ¿Tienes una queja o inconveniente? Aqui puedes reportarlo
            facilmente.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        <BtnBlanco
          informacion="Nuevo reporte"
          icono={<FaRegEdit className="h-3.5 w-3.5" />}
          onClick={() => redirigir("/noticias/Reportar")}
          estilos="!min-h-0 !rounded-full !px-4 !py-2.5 !text-[12px]"
        />
        <BtnVerde
          informacion="Ver estado de mis reportes"
          icono={<FaClipboardList className="h-3.5 w-3.5" />}
          onClick={() => redirigir("/noticias/verReport")}
          estilos="!min-h-0 !rounded-full !border !border-gray-300 !px-4 !py-2.5 !text-[11px]"
        />
      </div>
    </section>
  );
}

export default HazReporteComp;
