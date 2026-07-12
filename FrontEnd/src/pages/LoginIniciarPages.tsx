import ComparteVisitaComp from "../components/ComparteVisitaComp";
import CuadroInicioComp from "../components/CuadroInicioComp";
import CuadroRegistrarComp from "../components/CuadroRegistrarComp";
import FormularioHistoriaComp from "../components/FormularioHistoriaComp";
import MenuModulosComp from "../components/MenuModulosComp";
import MiniComunicadoComp from "../components/MiniComunicadoComp";
import MiniExperienciaComp from "../components/MiniExperienciaComp";
import PasosInicio from "../components/PasosInicio";

function LoginIniciarPages() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div
        className="h-screen overflow-x-hidden overflow-y-auto border-4 border-black bg-[#dbeee8] p-4 font-[Arial]"
        style={{
          width: "30vw",
          minWidth: "400px",/*360  */
          maxWidth: "500px",/*430  */
          wordBreak: "break-all",
          overflowWrap: "anywhere",
          whiteSpace: "normal",
        }}
      >
        <h1>aaaaaaaaaaññññññññññññññññaaaaaaaaaaaaa</h1>

        <div className="mt-4 flex w-full min-w-0 flex-col gap-4">
          <MenuModulosComp />
          <CuadroRegistrarComp />
          <CuadroInicioComp />
          <PasosInicio
            numero={1}
            titulo="Elige un lugar"
            descripcion="En mapas toca una zona turistica y veras la foto, descripcion y mas"
          />
          <ComparteVisitaComp />
          <FormularioHistoriaComp />
          <MiniComunicadoComp />
          <MiniExperienciaComp />
        </div>
      </div>
    </div>
  );
}

export default LoginIniciarPages;
