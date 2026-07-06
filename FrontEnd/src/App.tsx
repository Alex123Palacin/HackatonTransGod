import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import InicioPages from './assets/pages/InicioPages';
import GuiaPages from './assets/pages/GuiaPages';
import LoginIniciarPages from './assets/pages/LoginIniciarPages';
import LoginRegistrarPages from './assets/pages/LoginRegistrarPages';
import MapaPage from './assets/pages/MapaPage';
import ScanPages from './assets/pages/ScanPages';
import CatalogoPages from './assets/pages/CatalogoPages';
import DescripcionAvePages from './assets/pages/DescripcionAvePages';
import NoticiasPages from './assets/pages/NoticiasPages';
import PublicarNoticiaPages from './assets/pages/PublicarNoticiaPages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/Inicio' element={<InicioPages />} />
        <Route path='/guia' element={<GuiaPages />} />
        <Route path='/login' element={<LoginIniciarPages />} />
        <Route path='/registro' element={<LoginRegistrarPages />} />
        <Route path='/mapas' element={<MapaPage />} />
        <Route path='/scan' element={<ScanPages />} />
        <Route path='/catalogo' element={<CatalogoPages />} />
        <Route path='/descripcion-ave' element={<DescripcionAvePages />} />
        <Route path='/noticias' element={<NoticiasPages />} />
        <Route path='/publicar-noticia' element={<PublicarNoticiaPages />} />
      </Routes>
    </Router>
  );
}

export default App
