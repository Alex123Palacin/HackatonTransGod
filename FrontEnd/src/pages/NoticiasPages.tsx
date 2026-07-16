import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { useCambiarSecionNoticia } from "../hooks/cambiarsecionNoticia";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import PaginaComunicado from "./PaginaComunicado";
import type { Comunicado } from "./PaginaComunicado";
import PaginaPublicacion from "./PaginaPublicacion";
import type { Publicacion } from "./PaginaPublicacion";
import PaginaReporte from "./PaginaReporte";

const imagenesDragonBall = [
  "https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2021/05/Dragon-Ball_-Fanart-imagina-como-se-veria-Goku-super-saiyajin-3-en-la-vida-real-.jpg?fit=768%2C432&ssl=1",
  "https://img2.wallspic.com/previews/4/1/9/4/7/174914/174914-dragon_ball-goku-cartel-saiyajin-super_saiyajin-x750.jpg",
  "https://depor.com/resizer/dptHJIHtEDqOmZq8cB_Nfy1ga7A=/1200x900/smart/filters:format(jpeg):quality(90)/arc-anglerfish-arc2-prod-elcomercio.s3.amazonaws.com/public/SCBNAPNKZVCT5P3SHNS5CPJ3CI.jpg",
  "https://i.pinimg.com/736x/ea/c2/b7/eac2b7844ad390cd510dc94bb4e7a7ab.jpg",
];

const comunicadosEjemplo: Comunicado[] = [
  {
    id: 1,
    categoria: "Comunicado",
    titulo: "Hoy vino Goku al malecon",
    fecha: "12/07/2026",
    imagenUrl: imagenesDragonBall[0],
  },
  {
    id: 2,
    categoria: "Comunicado",
    titulo: "Jornada de limpieza en el lugar",
    fecha: "12/07/2026",
    imagenUrl: imagenesDragonBall[1],
  },
  {
    id: 3,
    categoria: "Comunicado",
    titulo: "Falta de mantenimiento en el malecon",
    fecha: "12/07/2026",
    imagenUrl: imagenesDragonBall[2],
  },
  {
    id: 4,
    categoria: "Comunicado",
    titulo: "Goku invita a cuidar la Arenilla",
    fecha: "12/07/2026",
    imagenUrl: imagenesDragonBall[3],
  },
];

const publicacionesEjemplo: Publicacion[] = [
  {
    id: 1,
    titulo: "Hoy visite la Arenilla",
    descripcion:
      "Hoy pase un momento bonito con Antonella. Caminamos cerca del agua, vimos aves y tomamos fotos para recordar la visita.",
    imagenes: [...imagenesDragonBall, ...imagenesDragonBall.slice(0, 4)],
  },
  {
    id: 2,
    titulo: "Un dia con Goku",
    descripcion:
      "La comunidad se junto para recorrer el malecon. Fue una experiencia tranquila, divertida y perfecta para compartir en familia.",
    imagenes: [...imagenesDragonBall, ...imagenesDragonBall.slice(0, 4)],
  },
  {
    id: 3,
    titulo: "Paseo familiar",
    descripcion:
      "Disfrutamos de una caminata bonita, respiramos aire fresco y encontramos un lugar especial para volver otro dia.",
    imagenes: [...imagenesDragonBall, ...imagenesDragonBall.slice(0, 4)],
  },
];

function NoticiasPages() {
  const { secionActiva, cambiarSecion, esComunicados, esPublicaciones } =
    useCambiarSecionNoticia();

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
            <PaginaComunicado comunicados={comunicadosEjemplo} />
          ) : esPublicaciones ? (
            <PaginaPublicacion publicaciones={publicacionesEjemplo} />
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
