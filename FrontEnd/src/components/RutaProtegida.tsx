import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { obtenerPerfil } from "../api/LoginApi/authApi";
import { limpiarSesion, obtenerSesion } from "../api/LoginApi/authStorage";
import { useSesionInactiva } from "../hooks/usarSesionInactiva";

type EstadoSesion = "comprobando" | "autenticada" | "sinSesion";

function RutaProtegida() {
  const [estado, setEstado] = useState<EstadoSesion>("comprobando");
  const sesionVencida = useSesionInactiva();

  useEffect(() => {
    let montado = true;

    async function comprobarSesion() {
      if (!obtenerSesion()) {
        if (montado) setEstado("sinSesion");
        return;
      }

      try {
        await obtenerPerfil();
        if (montado) setEstado("autenticada");
      } catch {
        limpiarSesion();
        if (montado) setEstado("sinSesion");
      }
    }

    void comprobarSesion();
    return () => {
      montado = false;
    };
  }, []);

  if (estado === "comprobando") {
    return (
      <div
        role="status"
        aria-label="Comprobando sesion"
        className="flex min-h-screen items-center justify-center bg-white"
      >
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-[#dbeee8] border-t-[#006f6c]" />
      </div>
    );
  }

  if (estado === "sinSesion" || sesionVencida) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
