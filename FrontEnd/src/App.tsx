import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import InicioPages from './assets/pages/InicioPages';

function App() {


  return (
    <Router>
      <Routes>
        {<Route path='/Inicio' element={<InicioPages/>}/>}

      </Routes>
    </Router>
    

  )
}

export default App
