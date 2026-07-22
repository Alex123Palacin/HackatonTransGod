import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaHome, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { cerrarSesion } from "../api/LoginApi/authApi";
import { obtenerSesion } from "../api/LoginApi/authStorage";

type MenuPerfilCompProps = {
  estilos?: string;
};

function MenuPerfilComp({ estilos = "" }: MenuPerfilCompProps) {
  const navigate = useNavigate();
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const usuario = obtenerSesion()?.usuario;

  useEffect(() => {
    if (!abierto) return;

    function cerrarAlPulsarFuera(evento: PointerEvent) {
      if (!contenedorRef.current?.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }

    function cerrarConEscape(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAbierto(false);
    }

    document.addEventListener("pointerdown", cerrarAlPulsarFuera);
    document.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.removeEventListener("pointerdown", cerrarAlPulsarFuera);
      document.removeEventListener("keydown", cerrarConEscape);
    };
  }, [abierto]);

  async function manejarCierreSesion() {
    if (cerrando) return;
    setCerrando(true);

    try {
      await cerrarSesion();
    } catch {
      // cerrarSesion siempre elimina los datos locales aunque la red falle.
    } finally {
      navigate("/login", { replace: true });
    }
  }

  function irAInicio() {
    setAbierto(false);
    navigate("/Inicio");
  }

  return (
    <div ref={contenedorRef} className={`relative z-[60] ${estilos}`}>
      <button
        type="button"
        aria-label="Abrir menu de perfil"
        aria-expanded={abierto}
        aria-controls="menu-perfil"
        onClick={() => setAbierto((valor) => !valor)}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#cfe4df] bg-white shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006f6c] ${
          abierto
            ? "bg-[#006f6c] text-white"
            : "text-[#006f6c] hover:bg-[#edf7f4]"
        }`}
        title="Perfil"
      >
        <span className="relative">
          <FaUserCircle className="h-6 w-6" />
          <FaChevronDown
            className={`absolute -right-2 -bottom-0.5 h-2.5 w-2.5 rounded-full ${
              abierto ? "bg-[#006f6c]" : "bg-white"
            }`}
          />
        </span>
      </button>

      {abierto && (
        <div
          id="menu-perfil"
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[220px] overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-xl [overflow-wrap:normal] [word-break:normal]"
        >
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-[12px] font-bold text-[#075f5c]">
              {usuario?.nombre || "Mi cuenta"}
            </p>
            {usuario?.correo && (
              <p className="mt-0.5 truncate text-[10px] text-slate-500">
                {usuario.correo}
              </p>
            )}
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={irAInicio}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-[12px] font-bold text-slate-700 transition-colors hover:bg-[#edf7f4] focus:bg-[#edf7f4] focus:outline-none"
          >
            <FaHome className="h-4 w-4 text-[#006f6c]" />
            Inicio
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => void manejarCierreSesion()}
            disabled={cerrando}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-3 py-2.5 text-[12px] font-bold text-red-600 transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:opacity-60"
          >
            <FaSignOutAlt className="h-4 w-4" />
            {cerrando ? "Cerrando..." : "Cerrar sesion"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuPerfilComp;
