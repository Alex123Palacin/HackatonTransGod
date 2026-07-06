import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import InicioPages from './pages/InicioPages';
import GuiaPages from './pages/GuiaPages';
import LoginIniciarPages from './pages/LoginIniciarPages';
import LoginRegistrarPages from './pages/LoginRegistrarPages';
import MapaPage from './pages/MapaPage';
import ScanPages from './pages/ScanPages';
import CatalogoPages from './pages/CatalogoPages';
import DescripcionAvePages from './pages/DescripcionAvePages';
import NoticiasPages from './pages/NoticiasPages';
import PublicarNoticiaPages from './pages/PublicarNoticiaPages';

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
