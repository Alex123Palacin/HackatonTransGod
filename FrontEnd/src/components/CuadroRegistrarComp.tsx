import { BtnBlanco } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";
import { useRedireccion } from "../hooks/redireccion";

function CuadroRegistrarComp() {
  const { redirigir } = useRedireccion();

  return (
    <section className="w-full max-w-[520px] rounded-[24px] border-2 border-white bg-[#b9c4c5]/70 px-7 py-6 shadow-md backdrop-blur-[2px]">
      <h2 className="mb-5 text-center font-[Arial] text-[32px] font-bold leading-none text-[#006f6c]">
        Registrate
      </h2>

      <div className="flex flex-col gap-[30px]">
        <InputLogin tipo="text" informacion="Nombre" />
        <InputLogin tipo="email" informacion="Correo" />
        <InputLogin
          tipo="password"
          informacion="contraseña"
        />

        <BtnBlanco
          informacion="Crear Cuenta"
          onClick={() => redirigir("/alex")}
        />
      </div>
    </section>
  );
}

export default CuadroRegistrarComp;
