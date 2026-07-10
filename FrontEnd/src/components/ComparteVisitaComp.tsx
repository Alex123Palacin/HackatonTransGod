import { BtnBlanco } from "../ui/BotonUi";

type ComparteVisitaCompProps = {
  onSubirHistoria?: () => void;
};

function ComparteVisitaComp({ onSubirHistoria }: ComparteVisitaCompProps) {
  return (
    <section className="flex w-full max-w-[565px] items-center gap-7 rounded-[24px] bg-white px-12 py-10 font-[Arial] shadow-sm">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#e4f1ed] text-[#006f6c]">
        <div className="relative h-12 w-12 rounded-md border-2 border-[#006f6c]">
          <div className="absolute bottom-2 left-2 h-4 w-6 rotate-[-35deg] border-b-2 border-l-2 border-[#006f6c]" />
          <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#006f6c]" />
          <div className="absolute -bottom-2 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#006f6c] text-xl font-bold text-white">
            +
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <div>
          <h2 className="text-[28px] font-bold leading-none text-[#006f6c]">
            Comparte tu visita
          </h2>
          <p className="mt-5 max-w-[350px] text-[18px] font-semibold leading-7 text-gray-500">
            Sube una imagen, escribe una descripcion y crea una historia
            turistica para la comunidad.
          </p>
        </div>

        <BtnBlanco
          informacion="Subir Historia"
          estilos="max-w-[295px] min-h-[54px] rounded-[22px] py-2 text-[22px]"
          onClick={onSubirHistoria}
        />
      </div>
    </section>
  );
}

export default ComparteVisitaComp;
