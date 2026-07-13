import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import PorcentajeAveComp from "../components/porcentajeAveComp";
import VistaAnimalComp from "../components/vistanimalComp";
import type { AveDesconocida } from "../components/secicionDesconocidos";
import type { AveRegistrada } from "../components/seccionRegistrados";
import { useRedireccion } from "../hooks/redireccion";
import { BuscaTuAve } from "../ui/TextoUi";

const imagenesAves = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYISqS21khx4P141UoH6dZU5qIpM8vl7yAgFt0uC2adw&s=10",
  "https://sg.portal-pokemon.com/play/resources/pokedex/img/pm/ca3db4aad5c85a525d9be86852b26db1db7a22c0.png",
  "https://i.pinimg.com/474x/08/49/c4/0849c426da6862d43591cd4b97583474.jpg",
  "https://static.wikia.nocookie.net/fakemon/images/c/c7/Raichu_anime.png/revision/latest?cb=20091217140920&path-prefix=es",
];

const avesRegistradas: AveRegistrada[] = [
  {
    id: 1,
    nombre: "Gaviota peruana",
    imagenUrl: imagenesAves[0],
    encontrada: true,
  },
  {
    id: 2,
    nombre: "Garza blanca",
    imagenUrl: imagenesAves[1],
    encontrada: true,
  },
  {
    id: 3,
    nombre: "Cormoran guanay",
    imagenUrl: imagenesAves[2],
    encontrada: true,
  },
  {
    id: 4,
    nombre: "Playero blanco",
    imagenUrl: imagenesAves[3],
    encontrada: true,
  },
  {
    id: 5,
    nombre: "Pelicano peruano",
    imagenUrl: imagenesAves[1],
    encontrada: true,
  },
  {
    id: 6,
    nombre: "Quisco peruano",
    imagenUrl: imagenesAves[2],
    encontrada: true,
  },
  {
    id: 7,
    nombre: "Piquero de patas azules",
    imagenUrl: imagenesAves[0],
    encontrada: false,
  },
  {
    id: 8,
    nombre: "Zarapito trinador",
    imagenUrl: imagenesAves[3],
    encontrada: false,
  },
  {
    id: 9,
    nombre: "Chorlo nevado",
    imagenUrl: imagenesAves[2],
    encontrada: false,
  },
];

const avesDesconocidas: AveDesconocida[] = [
  { id: 1, fecha: "11/07/2026", imagenUrl: imagenesAves[0] },
  { id: 2, fecha: "11/07/2026", imagenUrl: imagenesAves[1] },
  { id: 3, fecha: "11/07/2026", imagenUrl: imagenesAves[2] },
  { id: 4, fecha: "11/07/2026", imagenUrl: imagenesAves[3] },
  { id: 5, fecha: "11/07/2026", imagenUrl: imagenesAves[1] },
  { id: 6, fecha: "11/07/2026", imagenUrl: imagenesAves[2] },
  { id: 7, fecha: "11/07/2026", imagenUrl: imagenesAves[0] },
  { id: 8, fecha: "11/07/2026", imagenUrl: imagenesAves[1] },
];

function CatalogoPages() {
  const { redirigir } = useRedireccion();

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col gap-4 px-3 py-5">
          <h1 className="px-2 text-[18px] font-bold text-[#006f6c]">
            Mi Catalogo
          </h1>

          <PorcentajeAveComp encontradas={10} total={100} porcentaje={10} />
          <BuscaTuAve />

          <VistaAnimalComp
            registradas={avesRegistradas}
            desconocidas={avesDesconocidas}
            totalRegistradas={100}
            totalDesconocidas={8}
            onSeleccionarAve={() => redirigir("/descripcion-ave")}
          />
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default CatalogoPages;
