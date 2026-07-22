import type { ComponentType } from "react";
import { useLocation } from "react-router-dom";
import {
  FaCamera,
  FaDove,
  FaMapMarkerAlt,
  FaMicrophone,
  FaRegNewspaper,
} from "react-icons/fa";
import { useRedireccion } from "../hooks/redireccion";

type ModuloMenu = {
  nombre: string;
  ruta: string;
  rutasActivas: string[];
  Icono: ComponentType<{ className?: string }>;
  guia?: boolean;
};

const modulosMenu: ModuloMenu[] = [
  {
    nombre: "Mapa",
    ruta: "/mapas",
    rutasActivas: ["/mapa", "/mapas"],
    Icono: FaMapMarkerAlt,
  },
  {
    nombre: "Scanear",
    ruta: "/scan",
    rutasActivas: ["/scan", "/scanear"],
    Icono: FaCamera,
  },
  {
    nombre: "Guia",
    ruta: "/guia",
    rutasActivas: ["/guia"],
    Icono: FaMicrophone,
    guia: true,
  },
  {
    nombre: "Catalogo",
    ruta: "/catalogo",
    rutasActivas: ["/catalogo"],
    Icono: FaDove,
  },
  {
    nombre: "Noticias",
    ruta: "/noticias",
    rutasActivas: ["/noticias", "/reporte"],
    Icono: FaRegNewspaper,
  },
];

function MenuModulosComp() {
  const { pathname } = useLocation();
  const { redirigir } = useRedireccion();
  const rutaActual = pathname.toLowerCase();

  function estaActivo(rutasActivas: string[]) {
    return rutasActivas.some(
      (ruta) => rutaActual === ruta || rutaActual.startsWith(`${ruta}/`),
    );
  }

  return (
    <>
      <div aria-hidden="true" className="h-[67px] shrink-0" />
      <nav
        aria-label="Menu de modulos"
        className="fixed bottom-0 left-0 z-50 grid w-full shrink-0 grid-cols-5 items-end gap-1 border-t border-gray-300 bg-white px-3 pb-2 pt-2 font-[Arial] shadow-[0_-4px_12px_rgba(15,71,68,0.08)] sm:bottom-1 sm:left-1/2 sm:w-[calc(clamp(400px,30vw,500px)-8px)] sm:-translate-x-1/2"
      >
        {modulosMenu.map(({ nombre, ruta, rutasActivas, Icono, guia }) => {
          const activo = estaActivo(rutasActivas);

          if (guia) {
            return (
              <button
                key={nombre}
                type="button"
                onClick={() => redirigir(ruta)}
                className="flex min-w-0 flex-col items-center justify-end"
              >
                <span className="flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full bg-[#006f6c] text-white">
                  <Icono className="h-6 w-6" />
                  <span className="mt-0.5 text-[10px] font-bold leading-none">
                    {nombre}
                  </span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={nombre}
              type="button"
              onClick={() => redirigir(ruta)}
              className={`flex min-w-0 flex-col items-center justify-end font-bold ${
                activo ? "text-[#006f6c]" : "text-[#5b5b5b] "
              }`}
            >
              <Icono className="h-5 w-5" />
              <span className="mt-1 max-w-full truncate text-[9px] leading-none">
                {nombre}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default MenuModulosComp;
