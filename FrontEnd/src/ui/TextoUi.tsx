type Props = {
  informacion: string;
  estilos?: string;
};

function H1Login({ informacion, estilos = "" }: Props) {
  return (
    <h1 className={`font-[Arial] text-white ${estilos}`}>
      {informacion}
    </h1>
  );
}

type InputLoginProps = {
  tipo?: "email" | "text" | "password";
  informacion?: string;
  valor?: string;
  estilos?: string;
  onChange?: (valor: string) => void;
  nombre?: string;
  autoComplete?: string;
  requerido?: boolean;
  deshabilitado?: boolean;
  longitudMinima?: number;
  longitudMaxima?: number;
};

function InputLogin({
  tipo = "text",
  informacion = "",
  valor,
  estilos = "",
  onChange,
  nombre,
  autoComplete,
  requerido = false,
  deshabilitado = false,
  longitudMinima,
  longitudMaxima,
}: InputLoginProps) {
  return (
    <input
      type={tipo}
      name={nombre}
      placeholder={informacion}
      value={valor}
      aria-label={informacion}
      autoComplete={autoComplete}
      required={requerido}
      disabled={deshabilitado}
      minLength={longitudMinima}
      maxLength={longitudMaxima}
      onChange={(event) => onChange?.(event.target.value)}
      className={`h-[62px] w-full rounded-[22px] border-2 border-white bg-white/25 px-6 font-[Arial] text-[24px] text-white outline-none placeholder:text-white focus:border-white focus:ring-2 focus:ring-white/40 disabled:cursor-not-allowed disabled:opacity-70 ${estilos}`}
    />
  );
}




export { H1Login, InputLogin };
export { default as BuscaTuAve } from "./BuscaTuAve";
