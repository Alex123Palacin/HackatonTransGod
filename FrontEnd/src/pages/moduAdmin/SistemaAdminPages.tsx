import { useEffect, useState, type ComponentType } from "react";
import {
  FaBars,
  FaBullhorn,
  FaChartPie,
  FaClipboardList,
  FaDove,
  FaImages,
  FaLeaf,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaSyncAlt,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  EVENTO_SESION_ADMIN_CERRADA,
  cerrarSesionAdmin,
  comprobarSesionAdmin,
} from "../../api/adminmodulos/adminSesionApi";
import type { SesionAdmin } from "../../api/adminmodulos/tipos";
import { useAdminModulos } from "../../hooks/usarAdminModulos";
import AccesoAdmin from "./AccesoAdmin";
import AvesAdmin from "./AvesAdmin";
import ComunicadosAdmin from "./ComunicadosAdmin";
import MapasAdmin from "./MapasAdmin";
import PublicacionesAdmin from "./PublicacionesAdmin";
import ReportesAdmin from "./ReportesAdmin";
import ResumenAdmin from "./ResumenAdmin";

type ModuloAdmin =
  | "resumen"
  | "reportes"
  | "comunicados"
  | "aves"
  | "publicaciones"
  | "mapas";

type OpcionAdmin = {
  id: ModuloAdmin;
  nombre: string;
  descripcion: string;
  Icono: ComponentType<{ className?: string }>;
};

const opciones: OpcionAdmin[] = [
  {
    id: "resumen",
    nombre: "Resumen",
    descripcion: "Estado general",
    Icono: FaChartPie,
  },
  {
    id: "reportes",
    nombre: "Reportes",
    descripcion: "Solicitudes ciudadanas",
    Icono: FaClipboardList,
  },
  {
    id: "comunicados",
    nombre: "Comunicados",
    descripcion: "Avisos oficiales",
    Icono: FaBullhorn,
  },
  {
    id: "aves",
    nombre: "Aves",
    descripcion: "Catalogo de especies",
    Icono: FaDove,
  },
  {
    id: "publicaciones",
    nombre: "Publicaciones",
    descripcion: "Contenido de usuarios",
    Icono: FaImages,
  },
  {
    id: "mapas",
    nombre: "Mapas",
    descripcion: "Proximamente",
    Icono: FaMapMarkedAlt,
  },
];

function esModulo(valor: string | null): valor is ModuloAdmin {
  return opciones.some((opcion) => opcion.id === valor);
}

type PanelSistemaAdminProps = {
  sesion: SesionAdmin;
  alCerrar: () => void;
};

function PanelSistemaAdmin({ sesion, alCerrar }: PanelSistemaAdminProps) {
  const [parametros, setParametros] = useSearchParams();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const parametroModulo = parametros.get("modulo");
  const modulo: ModuloAdmin = esModulo(parametroModulo)
    ? parametroModulo
    : "resumen";
  const opcionActiva = opciones.find((opcion) => opcion.id === modulo) ?? opciones[0];
  const {
    datos,
    cargando,
    procesando,
    error,
    recargar,
    limpiarError,
    cambiarEstadoReporte,
    borrarReporte,
    agregarComunicado,
    actualizarComunicado,
    agregarAve,
    actualizarAve,
    alternarEstadoComunicado,
    alternarEstadoAve,
    alternarEstadoPublicacion,
    borrarComunicado,
    borrarAve,
    borrarPublicacion,
  } = useAdminModulos();

  function cambiarModulo(nuevoModulo: string) {
    if (!esModulo(nuevoModulo)) return;
    limpiarError();
    setMenuAbierto(false);
    if (nuevoModulo === "resumen") {
      setParametros({}, { replace: true });
    } else {
      setParametros({ modulo: nuevoModulo }, { replace: true });
    }
  }

  function contenido() {
    if (modulo === "reportes") {
      return (
        <ReportesAdmin
          reportes={datos.reportes}
          procesando={procesando}
          cambiarEstado={cambiarEstadoReporte}
          borrar={borrarReporte}
        />
      );
    }
    if (modulo === "comunicados") {
      return (
        <ComunicadosAdmin
          comunicados={datos.comunicados}
          procesando={procesando}
          agregar={agregarComunicado}
          editar={actualizarComunicado}
          alternar={alternarEstadoComunicado}
          borrar={borrarComunicado}
        />
      );
    }
    if (modulo === "aves") {
      return (
        <AvesAdmin
          aves={datos.aves}
          procesando={procesando}
          agregar={agregarAve}
          editar={actualizarAve}
          alternar={alternarEstadoAve}
          borrar={borrarAve}
        />
      );
    }
    if (modulo === "publicaciones") {
      return (
        <PublicacionesAdmin
          publicaciones={datos.publicaciones}
          procesando={procesando}
          alternar={alternarEstadoPublicacion}
          borrar={borrarPublicacion}
        />
      );
    }
    if (modulo === "mapas") return <MapasAdmin />;
    return <ResumenAdmin datos={datos} irAModulo={cambiarModulo} />;
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#f3f7f5] font-[Arial] text-slate-800">
      <aside className="hidden h-full w-[250px] shrink-0 flex-col border-r border-[#d8e5e0] bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#006f6c] text-white">
            <FaLeaf className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#075f5c]">Poza La Arenilla</p>
            <p className="mt-0.5 text-[11px] text-slate-500">Administracion</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5" aria-label="Modulos administrativos">
          {opciones.map(({ id, nombre, descripcion, Icono }) => {
            const activa = modulo === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => cambiarModulo(id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition ${
                  activa
                    ? "bg-[#e5f2ee] text-[#006f6c]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icono className="h-4 w-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{nombre}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                    {descripcion}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
            <FaUserCircle className="h-8 w-8 shrink-0 text-[#006f6c]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-700">
                {sesion.usuario.nombre}
              </p>
              <p className="truncate text-[10px] text-slate-400">
                {sesion.usuario.correo}
              </p>
            </div>
            <button
              type="button"
              onClick={alCerrar}
              title="Cerrar sesion"
              aria-label="Cerrar sesion administrativa"
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-white hover:text-red-600"
            >
              <FaSignOutAlt className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-[#d8e5e0] bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuAbierto((abierto) => !abierto)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-[#006f6c] lg:hidden"
              aria-label={menuAbierto ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={menuAbierto}
            >
              {menuAbierto ? <FaTimes /> : <FaBars />}
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                {opcionActiva.nombre}
              </h1>
              <p className="hidden truncate text-xs text-slate-500 sm:block">
                {opcionActiva.descripcion}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void recargar()}
              disabled={cargando || procesando}
              title="Actualizar datos"
              aria-label="Actualizar datos"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#006f6c] disabled:opacity-50"
            >
              <FaSyncAlt className={`h-3.5 w-3.5 ${cargando ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={alCerrar}
              className="flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 lg:hidden"
            >
              <FaSignOutAlt />
              Salir
            </button>
          </div>
        </header>

        {menuAbierto && (
          <nav
            aria-label="Modulos administrativos"
            className="grid shrink-0 grid-cols-2 gap-2 border-b border-slate-200 bg-white p-3 sm:grid-cols-3 lg:hidden"
          >
            {opciones.map(({ id, nombre, Icono }) => (
              <button
                key={id}
                type="button"
                onClick={() => cambiarModulo(id)}
                className={`flex min-w-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${
                  modulo === id
                    ? "bg-[#006f6c] text-white"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                <Icono className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{nombre}</span>
              </button>
            ))}
          </nav>
        )}

        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {error && (
            <div
              role="alert"
              className="mb-5 flex items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={limpiarError}
                className="font-bold hover:underline"
              >
                Cerrar
              </button>
            </div>
          )}

          {cargando ? (
            <div className="flex min-h-[360px] items-center justify-center">
              <span
                className="h-10 w-10 animate-spin rounded-full border-4 border-[#cfe5df] border-t-[#006f6c]"
                aria-label="Cargando panel"
              />
            </div>
          ) : (
            contenido()
          )}
        </main>
      </div>
    </div>
  );
}

function SistemaAdminPages() {
  const [estado, setEstado] = useState<"comprobando" | "sinSesion" | "activa">(
    "comprobando",
  );
  const [sesion, setSesion] = useState<SesionAdmin | null>(null);

  useEffect(() => {
    let montado = true;

    async function comprobar() {
      try {
        const sesionActual = await comprobarSesionAdmin();
        if (montado) {
          setSesion(sesionActual);
          setEstado("activa");
        }
      } catch {
        if (montado) setEstado("sinSesion");
      }
    }

    function sesionCerrada() {
      setSesion(null);
      setEstado("sinSesion");
    }

    window.addEventListener(EVENTO_SESION_ADMIN_CERRADA, sesionCerrada);
    void comprobar();
    return () => {
      montado = false;
      window.removeEventListener(EVENTO_SESION_ADMIN_CERRADA, sesionCerrada);
    };
  }, []);

  async function cerrar() {
    await cerrarSesionAdmin();
    setSesion(null);
    setEstado("sinSesion");
  }

  if (estado === "comprobando") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#e9f3ef]">
        <span
          className="h-10 w-10 animate-spin rounded-full border-4 border-[#cfe5df] border-t-[#006f6c]"
          aria-label="Comprobando sesion administrativa"
        />
      </div>
    );
  }

  if (estado === "sinSesion" || !sesion) {
    return (
      <AccesoAdmin
        alIngresar={(nuevaSesion) => {
          setSesion(nuevaSesion);
          setEstado("activa");
        }}
      />
    );
  }

  return <PanelSistemaAdmin sesion={sesion} alCerrar={() => void cerrar()} />;
}

export default SistemaAdminPages;
