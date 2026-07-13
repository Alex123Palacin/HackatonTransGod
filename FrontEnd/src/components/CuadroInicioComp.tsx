import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";
import { useRedireccion } from "../hooks/redireccion";

function CuadroInicioComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="mx-auto w-full max-w-[360px] rounded-[20px] border-2 border-white bg-[#b9c4c5]/70 px-4 py-4 shadow-md backdrop-blur-[2px]">
      <div className="flex flex-col gap-3">
        <InputLogin
          tipo="email"
          informacion="alex@gmail.com"
          estilos="h-10 rounded-xl px-4 text-sm"
        />
        <InputLogin
          tipo="password"
          informacion="********"
          estilos="h-10 rounded-xl px-4 text-sm"
        />

        <BtnBlanco
          informacion="Iniciar Seccion"
          estilos="min-h-10 rounded-xl py-2 text-base"
          onClick={() => redirigir("/alex")}
        />
        <BtnVerde
          informacion="Registrarme"
          estilos="min-h-10 rounded-xl py-2 text-base"
          onClick={() => redirigir("/alex")}
        />
      </div>
    </section>
  );
}

export default CuadroInicioComp;
