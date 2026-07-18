import type { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRedireccion } from "../hooks/redireccion";

type BotonProps = {
  informacion: string;
  estilos?: string;
  icono?: ReactNode;
  onClick?: () => void;
  tipo?: "button" | "submit";
  deshabilitado?: boolean;
};

function BtnVerde({
  informacion,
  estilos = "",
  icono,
  onClick,
  tipo = "button",
  deshabilitado = false,
}: BotonProps) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className={`flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-white px-6 py-4 font-[Arial] text-[30px] font-bold text-[#006f6c] shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${estilos}`}
    >
      {icono}
      {informacion}
    </button>
  );
}

function BtnBlanco({
  informacion,
  estilos = "",
  icono,
  onClick,
  tipo = "button",
  deshabilitado = false,
}: BotonProps) {
  return (
    <button
      type={tipo}
      onClick={onClick}
      disabled={deshabilitado}
      className={`flex min-h-[72px] w-full items-center justify-center gap-2 rounded-[22px] bg-[#006f6c] px-6 py-4 font-[Arial] text-[30px] font-bold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-70 ${estilos}`}
    >
      {icono}
      {informacion}
    </button>
  );
}

type FlechitaRetrocedeProps = {
  ruta?: string;
  estilos?: string;
};

function FlechitaRetrocede({
  ruta = "/Inicio",
  estilos = "",
}: FlechitaRetrocedeProps) {
  const { redirigir } = useRedireccion();

  return (
    <button
      type="button"
      aria-label="Retroceder"
      onClick={() => redirigir(ruta)}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006f6c] shadow-md ${estilos}`}
    >
      <FaArrowLeft className="h-4 w-4" />
    </button>
  );
}

export { BtnVerde, BtnBlanco, FlechitaRetrocede };
