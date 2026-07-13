import ImagenLoginPozo from "../assets/ImagenLoginPozo.png";
import AdaptadoMobil from "../components/AdaptadoMobil";
import CuadroRegistrarComp from "../components/CuadroRegistrarComp";
import { H1Login } from "../ui/TextoUi";

function LoginRegistrarPages() {
  return (
    <AdaptadoMobil>
      <section
        className="flex min-h-screen w-full flex-col justify-end overflow-hidden bg-cover bg-center px-5 pb-6 pt-16 [overflow-wrap:normal] [word-break:normal]"
        style={{ backgroundImage: `url(${ImagenLoginPozo})` }}
      >
        <div className="mb-5 [overflow-wrap:normal] [word-break:normal]">
          <span className="inline-flex rounded-full bg-white px-3 py-2 text-xs font-bold text-[#006f6c] shadow-sm [overflow-wrap:normal] [word-break:normal]">
            Guia interactiva
          </span>

          <H1Login
            informacion="Poza de la Arenilla"
            estilos="mt-4 max-w-[260px] text-[30px] font-bold leading-[34px] [overflow-wrap:normal] [word-break:normal]"
          />

          <p className="mt-3 max-w-[330px] text-[13px] font-bold leading-4 text-white [overflow-wrap:normal] [word-break:normal]">
            Ingresa para explorar lugares, noticias, album de aves, scanner IA
            y guia por voz o mensajes.
          </p>
        </div>

        <CuadroRegistrarComp />
      </section>
    </AdaptadoMobil>
  );
}

export default LoginRegistrarPages;
