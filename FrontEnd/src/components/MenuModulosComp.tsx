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
    rutasActivas: ["/noticias"],
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
      className="flex w-full max-w-[794px] items-end justify-between gap-4 bg-white px-8 py-4 font-[Arial]"
    >
      {modulosMenu.map(({ nombre, ruta, rutasActivas, Icono, guia }) => {
        const activo = estaActivo(rutasActivas);

        if (guia) {
          return (
            <button
              key={nombre}
              type="button"
              onClick={() => redirigir(ruta)}
              className="flex w-[120px] flex-col items-center justify-end"
            >
              <span className="flex h-[136px] w-[136px] flex-col items-center justify-center rounded-full bg-[#006f6c] text-white">
                <Icono className="h-[58px] w-[58px]" />
                <span className="mt-1 text-[26px] font-bold leading-none">
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
            className={`flex w-[120px] flex-col items-center justify-end font-bold ${
              activo ? "text-[#006f6c]" : "text-[#5b5b5b] "
            }`}
          >
            <Icono className="h-[64px] w-[64px]" />
            <span className="mt-1 text-[26px] leading-none">{nombre}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MenuModulosComp;
