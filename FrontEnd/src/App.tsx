import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import './App.css';
import RutaProtegida from './components/RutaProtegida';
import InicioPages from './pages/InicioPages';
import GuiaPages from './pages/GuiaPages';
import LoginIniciarPages from './pages/LoginIniciarPages';
import LoginRegistrarPages from './pages/LoginRegistrarPages';
import MapaPage from './pages/MapaPage';
import ScanPages from './pages/ScanPages';
import CatalogoPages from './pages/CatalogoPages';
import DescripcionAvePages from './pages/DescripcionAvePages';
import DetalleScanerPages from './pages/DetalleScanerPages';
import NoticiasPages from './pages/NoticiasPages';
import PublicarNoticiaPages from './pages/PublicarNoticiaPages';
import {
  QuejasReportePages,
  ReportarPages,
  VerReportesPages,
} from './pages/ReporteDestinoPages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />
        <Route path='/login' element={<LoginIniciarPages />} />
        <Route path='/registro' element={<LoginRegistrarPages />} />
        <Route element={<RutaProtegida />}>
          <Route path='/Inicio' element={<InicioPages />} />
          <Route path='/guia' element={<GuiaPages />} />
          <Route path='/mapas' element={<MapaPage />} />
          <Route path='/scan' element={<ScanPages />} />
          <Route path='/scan/detalle' element={<DetalleScanerPages />} />
          <Route path='/catalogo' element={<CatalogoPages />} />
          <Route path='/descripcion-ave' element={<Navigate to='/catalogo' replace />} />
          <Route path='/descripcion-ave/:idAve' element={<DescripcionAvePages />} />
          <Route path='/noticias' element={<NoticiasPages />} />
          <Route path='/noticias/publicar' element={<PublicarNoticiaPages />} />
          <Route path='/noticias/Reportar' element={<ReportarPages />} />
          <Route path='/noticias/verReport' element={<VerReportesPages />} />
          <Route path='/reporte/quejas' element={<QuejasReportePages />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
