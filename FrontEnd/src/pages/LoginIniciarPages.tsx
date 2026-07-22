

import ImagenLoginPozo from "../assets/ImagenLoginPozo.png";
import AdaptadoMobil from "../components/AdaptadoMobil";
import CuadroInicioComp from "../components/CuadroInicioComp";
import { H1Login } from "../ui/TextoUi";

function LoginIniciarPages() {
  return (
    <AdaptadoMobil>
      <section
        className="flex min-h-full w-full flex-col justify-end overflow-hidden bg-cover bg-center px-4 pb-5 pt-12 [overflow-wrap:normal] [word-break:normal] sm:px-5 sm:pb-6"
        style={{ backgroundImage: `url(${ImagenLoginPozo})` }}
      >
        <div className="mx-auto mb-5 w-full max-w-[340px] [overflow-wrap:normal] [word-break:normal]">
          <span className="inline-flex rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#006f6c] shadow-sm [overflow-wrap:normal] [word-break:normal]">
            Guia interactiva
          </span>

          <H1Login
            informacion="Poza de la Arenilla"
            estilos="mt-3 max-w-[260px] text-[28px] font-bold leading-8 [overflow-wrap:normal] [word-break:normal]"
          />

          <p className="mt-2 max-w-[330px] text-[12px] font-bold leading-4 text-white [overflow-wrap:normal] [word-break:normal]">
            Ingresa para explorar lugares, noticias, album de aves, scanner IA
            y guia por voz o mensajes.
          </p>
        </div>

        <CuadroInicioComp />
      </section>
    </AdaptadoMobil>
  );
}

export default LoginIniciarPages;
