import AdaptadoMobil from "../components/AdaptadoMobil";
import { useLocation } from "react-router-dom";
import MenuModulosComp from "../components/MenuModulosComp";
import { useCambiarSecionNoticia } from "../hooks/cambiarsecionNoticia";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import PaginaComunicado from "./PaginaComunicado";
import PaginaPublicacion from "./PaginaPublicacion";
import PaginaReporte from "./PaginaReporte";

function NoticiasPages() {
  const location = useLocation();
  const secionSolicitada = new URLSearchParams(location.search).get("seccion");
  const secionInicial =
    secionSolicitada === "publicaciones" || secionSolicitada === "reportes"
      ? secionSolicitada
      : "comunicados";
  const { secionActiva, cambiarSecion, esComunicados, esPublicaciones } =
    useCambiarSecionNoticia(secionInicial);

  const pestañas = [
    { id: "comunicados" as const, texto: "Comunicados" },
    { id: "publicaciones" as const, texto: "Publicaciones" },
    { id: "reportes" as const, texto: "Reportes" },
  ];

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <div className="grid grid-cols-3 gap-2 px-4 pb-3 pt-6">
          {pestañas.map((pestaña) => {
            const activo = secionActiva === pestaña.id;
            const Boton = activo ? BtnBlanco : BtnVerde;

            return (
              <Boton
                key={pestaña.id}
                informacion={pestaña.texto}
                estilos={`!min-h-0 !rounded-full !px-2 !py-2 !text-[11px] !leading-none ${
                  activo ? "" : "!border !border-gray-300"
                }`}
                onClick={() => cambiarSecion(pestaña.id)}
              />
            );
          })}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-4 pb-5">
          {esComunicados ? (
            <PaginaComunicado />
          ) : esPublicaciones ? (
            <PaginaPublicacion />
          ) : (
            <PaginaReporte />
          )}
        </div>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default NoticiasPages;
