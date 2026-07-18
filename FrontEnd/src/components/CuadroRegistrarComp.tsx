import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registrarUsuario } from "../api/LoginApi/authApi";
import { ErrorApi } from "../api/LoginApi/clienteApi";
import { BtnBlanco } from "../ui/BotonUi";
import { InputLogin } from "../ui/TextoUi";

function CuadroRegistrarComp() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviarRegistro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setEnviando(true);

    try {
      await registrarUsuario({ nombre, correo, password });
      navigate("/login", {
        replace: true,
        state: { cuentaCreada: true, correo: correo.trim().toLowerCase() },
      });
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof ErrorApi
          ? errorDesconocido.message
          : "No se pudo crear la cuenta. Intenta nuevamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[360px] rounded-[20px] border-2 border-white bg-[#b9c4c5]/70 px-4 py-4 shadow-md backdrop-blur-[2px]">
      <h2 className="mb-4 text-center font-[Arial] text-[20px] font-bold leading-none text-[#006f6c]">
        Registrate
      </h2>

      <form className="flex flex-col gap-3" onSubmit={enviarRegistro}>
        <InputLogin
          tipo="text"
          nombre="nombre"
          informacion="Nombre"
          valor={nombre}
          onChange={setNombre}
          autoComplete="name"
          requerido
          deshabilitado={enviando}
          longitudMaxima={150}
          estilos="h-10 rounded-xl px-4 text-sm"
        />
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
          informacion="Contrasena"
          valor={password}
          onChange={setPassword}
          autoComplete="new-password"
          requerido
          deshabilitado={enviando}
          longitudMinima={8}
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
          informacion={enviando ? "Creando..." : "Crear Cuenta"}
          tipo="submit"
          deshabilitado={enviando}
          estilos="min-h-10 rounded-xl py-2 text-base"
        />
      </form>
    </section>
  );
}

export default CuadroRegistrarComp;
