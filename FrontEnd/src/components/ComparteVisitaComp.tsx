import { BtnBlanco } from "../ui/BotonUi";
import { useRedireccion } from "../hooks/redireccion";

type ComparteVisitaCompProps = {
  onSubirHistoria?: () => void;
};

function ComparteVisitaComp({ onSubirHistoria }: ComparteVisitaCompProps) {
  const { redirigir } = useRedireccion();

  function abrirFormulario() {
    if (onSubirHistoria) {
      onSubirHistoria();
      return;
    }
    redirigir("/noticias/publicar");
  }

  return (
    <section className="flex w-full max-w-full items-center gap-3 rounded-[16px] bg-white px-4 py-4 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e4f1ed] text-[#006f6c]">
        <div className="relative h-8 w-8 rounded-md border-2 border-[#006f6c]">
          <div className="absolute bottom-2 left-2 h-4 w-6 rotate-[-35deg] border-b-2 border-l-2 border-[#006f6c]" />
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#006f6c]" />
          <div className="absolute -bottom-2 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#006f6c] text-lg font-bold text-white">
            +
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="[overflow-wrap:normal] [word-break:normal]">
          <h2 className="text-[16px] font-bold leading-none text-[#006f6c]">
            Comparte tu visita
          </h2>
          <p className="mt-2 text-[11px] font-semibold leading-4 text-gray-500 [overflow-wrap:normal] [word-break:normal]">
            Sube una imagen, escribe una descripcion y crea una historia
            turistica para la comunidad.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <BtnBlanco
            informacion="Subir Historia"
            estilos="!min-h-8 !w-[140px] !rounded-xl !px-3 !py-1 !text-xs leading-none whitespace-nowrap [overflow-wrap:normal] [word-break:normal]"
            onClick={abrirFormulario}
          />
        </div>
      </div>
    </section>
  );
}

export default ComparteVisitaComp;
