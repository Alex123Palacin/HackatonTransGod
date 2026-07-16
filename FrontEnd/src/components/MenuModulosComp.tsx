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
    <nav
      aria-label="Menu de modulos"
      className="flex w-full items-end justify-between gap-1 border-t border-gray-300 bg-white px-3 pb-2 pt-2 font-[Arial]"
    >
      {modulosMenu.map(({ nombre, ruta, rutasActivas, Icono, guia }) => {
        const activo = estaActivo(rutasActivas);

        if (guia) {
          return (
            <button
              key={nombre}
              type="button"
              onClick={() => redirigir(ruta)}
              className="flex w-[58px] flex-col items-center justify-end"
            >
              <span className="flex h-[58px] w-[58px] flex-col items-center justify-center rounded-full bg-[#006f6c] text-white">
                <Icono className="h-7 w-7" />
                <span className="mt-1 text-[11px] font-bold leading-none">
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
            className={`flex w-[58px] flex-col items-center justify-end font-bold ${
              activo ? "text-[#006f6c]" : "text-[#5b5b5b] "
            }`}
          >
            <Icono className="h-6 w-6" />
            <span className="mt-1 text-[10px] leading-none">{nombre}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MenuModulosComp;
