import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";
import { useRedireccion } from "../hooks/redireccion";

function CuadroInicioComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="w-full max-w-[520px] rounded-[24px] border-2 border-white bg-[#b9c4c5]/70 px-7 py-6 shadow-md backdrop-blur-[2px]">
      <div className="flex flex-col gap-[30px]">
        <InputLogin
          tipo="email"
          informacion="alex@gmail.com"
        />
        <InputLogin
          tipo="password"
          informacion="********"
        />

        <BtnBlanco
          informacion="Iniciar Seccion"
          onClick={() => redirigir("/alex")}
        />
        <BtnVerde
          informacion="Registrarme"
          onClick={() => redirigir("/alex")}
        />
      </div>
    </section>
  );
}

export default CuadroInicioComp;
