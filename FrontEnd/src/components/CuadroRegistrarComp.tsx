import { BtnBlanco } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";
import { useRedireccion } from "../hooks/redireccion";

function CuadroRegistrarComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="mx-auto w-full max-w-[360px] rounded-[20px] border-2 border-white bg-[#b9c4c5]/70 px-4 py-4 shadow-md backdrop-blur-[2px]">
      <h2 className="mb-4 text-center font-[Arial] text-[20px] font-bold leading-none text-[#006f6c]">
        Registrate
      </h2>

      <div className="flex flex-col gap-3">
        <InputLogin
          tipo="text"
          informacion="Nombre"
          estilos="h-10 rounded-xl px-4 text-sm"
        />
        <InputLogin
          tipo="email"
          informacion="Correo"
          estilos="h-10 rounded-xl px-4 text-sm"
        />
        <InputLogin
          tipo="password"
          informacion="contraseña"
          estilos="h-10 rounded-xl px-4 text-sm"
        />

        <BtnBlanco
          informacion="Crear Cuenta"
          estilos="min-h-10 rounded-xl py-2 text-base"
          onClick={() => redirigir("/alex")}
        />
      </div>
    </section>
  );
}

export default CuadroRegistrarComp;
