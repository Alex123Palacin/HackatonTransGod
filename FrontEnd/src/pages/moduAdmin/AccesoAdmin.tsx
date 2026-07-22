import { useState, type FormEvent } from "react";
import { FaLeaf, FaLock, FaUser } from "react-icons/fa";
import { iniciarSesionAdmin } from "../../api/adminmodulos/adminSesionApi";
import type { SesionAdmin } from "../../api/adminmodulos/tipos";

type AccesoAdminProps = {
  alIngresar: (sesion: SesionAdmin) => void;
};

function AccesoAdmin({ alIngresar }: AccesoAdminProps) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function ingresar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError("");
    setEnviando(true);

    try {
      const sesion = await iniciarSesionAdmin(usuario, password);
      alIngresar(sesion);
    } catch (errorDesconocido) {
      setError(
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "No se pudo iniciar sesion.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#e9f3ef] px-5 py-10 font-[Arial]">
      <section className="w-full max-w-[420px] rounded-lg border border-[#c9ddd6] bg-white p-7 shadow-[0_18px_45px_rgba(5,75,70,0.12)] sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#006f6c] text-white">
            <FaLeaf className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#075f5c]">
              Sistema administrativo
            </h1>
            <p className="mt-1 text-sm text-slate-500">Poza de La Arenilla</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={ingresar}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">
              Correo o nombre administrativo
            </span>
            <span className="flex items-center gap-3 rounded-md border border-slate-300 px-3 focus-within:border-[#007d78] focus-within:ring-2 focus-within:ring-[#007d78]/15">
              <FaUser className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={usuario}
                onChange={(evento) => setUsuario(evento.target.value)}
                autoComplete="username"
                required
                disabled={enviando}
                placeholder="administrador@correo.com"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-slate-700">
              Contrasena
            </span>
            <span className="flex items-center gap-3 rounded-md border border-slate-300 px-3 focus-within:border-[#007d78] focus-within:ring-2 focus-within:ring-[#007d78]/15">
              <FaLock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                autoComplete="current-password"
                required
                disabled={enviando}
                placeholder="Ingresa tu contrasena"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </span>
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="flex h-11 w-full items-center justify-center rounded-md bg-[#006f6c] px-4 text-sm font-bold text-white transition-colors hover:bg-[#005a57] focus:outline-none focus:ring-2 focus:ring-[#006f6c]/30 disabled:opacity-60"
          >
            {enviando ? "Ingresando..." : "Ingresar al sistema"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AccesoAdmin;
