type BotonProps = {
  informacion: string;
  estilos?: string;
  onClick?: () => void;
};

function BtnVerde({ informacion, estilos = "", onClick }: BotonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[72px] w-full rounded-[22px] bg-white px-6 py-4 font-[Arial] text-[30px] font-bold text-[#006f6c] shadow-sm ${estilos}`}
    >
      {informacion}
    </button>
  );
}

function BtnBlanco({ informacion, estilos = "", onClick }: BotonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[72px] w-full rounded-[22px] bg-[#006f6c] px-6 py-4 font-[Arial] text-[30px] font-bold text-white shadow-sm ${estilos}`}
    >
      {informacion}
    </button>
  );
}

export { BtnVerde, BtnBlanco };
