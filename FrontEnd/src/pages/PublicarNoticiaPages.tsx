import AdaptadoMobil from "../components/AdaptadoMobil";
import FormularioHistoriaComp from "../components/FormularioHistoriaComp";
import MenuModulosComp from "../components/MenuModulosComp";
import { useFormularioPublicacion } from "../hooks/usarFormularioPublicacion";
import { useRedireccion } from "../hooks/redireccion";

function PublicarNoticiaPages() {
  const { publicar, enviando, error } = useFormularioPublicacion();
  const { redirigir } = useRedireccion();

  return (
    <AdaptadoMobil>
      <section className="flex min-h-screen flex-col bg-[#dbeee8] [overflow-wrap:normal] [word-break:normal]">
        <main className="flex flex-1 flex-col px-6 pb-7 pt-8 [overflow-wrap:normal] [word-break:normal]">
          <h1 className="text-[20px] font-bold text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
            Publicar historia
          </h1>
          <p className="mt-4 max-w-[310px] text-[12px] leading-4 text-gray-500 [overflow-wrap:normal] [word-break:normal]">
            Sube una foto del lugar y agrega una descripcion para compartirla
            con visitantes.
          </p>

          <div className="mt-7">
            <FormularioHistoriaComp
              onSubirHistoria={(historia) => void publicar(historia)}
              onCancelar={() => redirigir("/noticias?seccion=publicaciones")}
              enviando={enviando}
              error={error}
            />
          </div>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default PublicarNoticiaPages;
