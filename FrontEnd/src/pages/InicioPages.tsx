import ImagenInicioPozo from "../assets/ImagenInicioPozo.png";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import PasosInicio from "../components/PasosInicio";
import { useRedireccion } from "../hooks/redireccion";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import { H1Login } from "../ui/TextoUi";

function InicioPages() {
  const { redirigir } = useRedireccion();

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <div
          className="mx-5 mt-5 rounded-[22px] bg-cover bg-center px-5 pb-4 pt-44 text-white shadow-md [overflow-wrap:normal] [word-break:normal]"
          style={{ backgroundImage: `url(${ImagenInicioPozo})` }}
        >
          <span className="inline-flex rounded-full border border-white bg-black/10 px-3 py-1 text-[13px] font-bold text-white shadow-sm [overflow-wrap:normal] [word-break:normal]">
            Bienvenido
          </span>

          <H1Login
            informacion="Guia de la Arenilla"
            estilos="mt-2 max-w-[230px] text-[27px] font-bold leading-8 [overflow-wrap:normal] [word-break:normal]"
          />

          <p className="mt-2 max-w-[315px] text-[11px] font-bold leading-4 [overflow-wrap:normal] [word-break:normal]">
            Una app turistica y ambiental para conocer la Poza de La Arenilla,
            registrar aves y recibir ayuda de IA durante la visita.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <BtnBlanco
              informacion="Abrir Mapas"
              estilos="min-h-9 rounded-xl py-2 text-base"
              onClick={() => redirigir("/mapas")}
            />
            <BtnVerde
              informacion="Probar Guia"
              estilos="min-h-9 rounded-xl py-2 text-base"
              onClick={() => redirigir("/guia")}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 px-5 py-4 [overflow-wrap:normal] [word-break:normal]">
          <span className="w-fit rounded-full bg-white px-4 py-2 text-[11px] font-bold text-[#006f6c] shadow-sm">
            Como Usar
          </span>

          <h2 className="text-[17px] font-bold text-[#006f6c]">
            Recorre la guia
          </h2>

          <PasosInicio
            numero={1}
            titulo="Elige un lugar"
            descripcion="En mapas toca una zona turistica y veras la foto, descripcion y mas"
          />
          <PasosInicio
            numero={2}
            titulo="Escanea aves"
            descripcion="Usa el Scaner para simular una foto y obtener una sugerencia de IA"
          />
          <PasosInicio
            numero={3}
            titulo="Completa el album"
            descripcion="Las aves pendientes aparecen en gris y se colorean al capturarlas"
          />
          <PasosInicio
            numero={4}
            titulo="Consulta a la IA"
            descripcion="Pregunta por voz o mensaje y pide mas informacion cuando necesites"
          />
        </div>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default InicioPages;
