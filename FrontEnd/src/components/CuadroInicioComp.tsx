import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { iniciarSesion } from "../api/LoginApi/authApi";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";

type EstadoNavegacion = {
  cuentaCreada?: boolean;
  correo?: string;
};

function CuadroInicioComp() {
  const navigate = useNavigate();
  const location = useLocation();
  const estado = location.state as EstadoNavegacion | null;
  const [correo, setCorreo] = useState(estado?.correo ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEnviando(true);

    try {
      await iniciarSesion({ correo, password });
      navigate("/Inicio", { replace: true });
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo iniciar sesion. Intenta nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[360px] rounded-[20px] border-2 border-white bg-[#b9c4c5]/70 px-4 py-4 shadow-md backdrop-blur-[2px]">
      <form className="flex flex-col gap-3" onSubmit={enviarLogin}>
        {estado?.cuentaCreada && !error && (
          <p
            role="status"
            className="rounded-lg bg-white/90 px-3 py-2 text-center text-[12px] font-bold text-[#006f6c] [overflow-wrap:normal] [word-break:normal]"
          >
            Cuenta creada. Ya puedes iniciar sesion.
          </p>
        )}

        <InputLogin
          tipo="email"
          nombre="correo"
          informacion="Correo"
          valor={correo}
          onChange={setCorreo}
          autoComplete="email"
          requerido
          deshabilitado={enviando}
          longitudMaxima={254}
          estilos="h-10 rounded-xl px-4 text-sm"
        />
        <InputLogin
          tipo="password"
          nombre="password"
          informacion="********"
          valor={password}
          onChange={setPassword}
          autoComplete="current-password"
          requerido
          deshabilitado={enviando}
          estilos="h-10 rounded-xl px-4 text-sm"
        />

        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded-lg bg-red-50/95 px-3 py-2 text-center text-[12px] font-bold leading-4 text-red-700 [overflow-wrap:normal] [word-break:normal]"
          >
            {error}
          </p>
        )}

        <BtnBlanco
          informacion={enviando ? "Ingresando..." : "Iniciar Sesion"}
          tipo="submit"
          deshabilitado={enviando}
          estilos="min-h-10 rounded-xl py-2 text-base"
        />
        <BtnVerde
          informacion="Registrarme"
          deshabilitado={enviando}
          estilos="min-h-10 rounded-xl py-2 text-base"
          onClick={() => navigate("/registro")}
        />
      </form>
    </section>
  );
}

export default CuadroInicioComp;
