import { BtnBlanco } from "../ui/BotonUi";

type ComparteVisitaCompProps = {
  onSubirHistoria?: () => void;
};

function ComparteVisitaComp({ onSubirHistoria }: ComparteVisitaCompProps) {
  return (
    <section className="flex w-full max-w-full items-center gap-3 rounded-[20px] bg-white px-4 py-5 font-[Arial] shadow-sm [overflow-wrap:normal] [word-break:normal]">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#e4f1ed] text-[#006f6c]">
        <div className="relative h-9 w-9 rounded-md border-2 border-[#006f6c]">
          <div className="absolute bottom-2 left-2 h-4 w-6 rotate-[-35deg] border-b-2 border-l-2 border-[#006f6c]" />
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#006f6c]" />
          <div className="absolute -bottom-2 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-[#006f6c] text-lg font-bold text-white">
            +
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="[overflow-wrap:normal] [word-break:normal]">
          <h2 className="text-[20px] font-bold leading-none text-[#006f6c]">
            Comparte tu visita
          </h2>
          <p className="mt-3 text-[13px] font-semibold leading-5 text-gray-500 [overflow-wrap:normal] [word-break:normal]">
            Sube una imagen, escribe una descripcion y crea una historia
            turistica para la comunidad.
          </p>
        </div>

        <div className="flex w-full justify-center">
          <BtnBlanco
            informacion="Subir Historia"
            estilos="!min-h-9 !w-[150px] !rounded-xl !px-3 !py-1 !text-sm leading-none whitespace-nowrap [overflow-wrap:normal] [word-break:normal]"
            onClick={onSubirHistoria}
          />
        </div>
      </div>
    </section>
  );
}

export default ComparteVisitaComp;
