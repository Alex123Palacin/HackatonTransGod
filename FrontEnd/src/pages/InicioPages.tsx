import ComparteVisitaComp from "../components/ComparteVisitaComp";
import CuadroInicioComp from "../components/CuadroInicioComp";
import CuadroRegistrarComp from "../components/CuadroRegistrarComp";
import FormularioHistoriaComp from "../components/FormularioHistoriaComp";
import MenuModulosComp from "../components/MenuModulosComp";
import MiniComunicadoComp from "../components/MiniComunicadoComp";
import MiniExperienciaComp from "../components/MiniExperienciaComp";
import PasosInicio from "../components/PasosInicio";


function InicioPages() {
  return (
    <div className="flex min-h-screen flex-col gap-4 bg-slate-100 p-4" >
      <MenuModulosComp />
      <CuadroRegistrarComp />
      <CuadroInicioComp />
      <PasosInicio
        numero={1}
        titulo="aleex"
        descripcion="En mapas toca una zona turistica y veras la foto, descripcion y mas blablñablablabka"
      />
      <ComparteVisitaComp />
      <FormularioHistoriaComp />
      <MiniComunicadoComp />
      <MiniExperienciaComp />
    </div>
  );
}

export default InicioPages;
