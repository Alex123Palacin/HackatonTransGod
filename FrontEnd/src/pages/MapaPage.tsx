import React, { useState } from "react";
import AdaptadoMobil from "../components/AdaptadoMobil";
import DescripcionLugarComp from "../components/DescripcionLugarComp";
import MenuModulosComp from "../components/MenuModulosComp";
import { useRedireccion } from "../hooks/redireccion"; 

const imagenesDetalle = [
  "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293086", 
  "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293088",
  "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293087"
];

const lugares = [
  {
    numero: 1,
    titulo: "Malecón Wiese",
    descripcion: "Mirador costero ideal para observar aves marinas y contemplar la bahía de La Punta. Es un punto recomendado para disfrutar del paisaje, tomar fotografías y conectarse con la naturaleza.",
    imagenes: imagenesDetalle,
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Malecón Wiese" },
      { etiqueta: "Atractivo", valor: "Mirador de aves" }
    ]
  },
  {
    numero: 2,
    titulo: "La Isla de Gilligan",
    descripcion: "Punto de observación natural en la zona de arena y canto rodado que bordea la poza, ofreciendo vistas panorámicas únicas de la bahía.",
    imagenes: imagenesDetalle,
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Zona Este" },
      { etiqueta: "Atractivo", valor: "Paisaje natural" }
    ]
  },
  {
    numero: 3,
    titulo: "Mirador del Parque",
    descripcion: "Mirador estratégico ubicado junto al Parque Gonzalo Fernández. Excelente punto de partida para observar la transición hacia la Poza de La Arenilla.",
    imagenes: imagenesDetalle,
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Parque Gonzalo Fernández" },
      { etiqueta: "Atractivo", valor: "Vista a la poza" }
    ]
  },
  {
    numero: 4,
    titulo: "Poza de La Arenilla",
    descripcion: "Espejo de agua principal donde habitan y descansan diversas especies de aves nativas y migratorias en la Poza de La Arenilla.",
    imagenes: imagenesDetalle,
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "La Arenilla" },
      { etiqueta: "Atractivo", valor: "Avistamiento de aves" }
    ]
  }
];

function MapaPage() {
  const [lugarSeleccionado, setLugarSeleccionado] = useState<any>(lugares[0]);
  const [mapKey, setMapKey] = useState<number>(0);
  const { redirigir } = useRedireccion();

  const mapUrl = "https://maps.google.com/maps?ll=-12.0725,-77.1596&z=16&output=embed";

  const seleccionarLugar = (lugar: any) => {
    setLugarSeleccionado(lugar);
    setMapKey((prevKey) => prevKey + 1);
  };

  const btnClasePin = "absolute w-9 h-9 rounded-full bg-[#006f6c] text-white border-[2.5px] border-white font-bold text-[16px] flex items-center justify-center shadow-[0_3px_6px_rgba(0,0,0,0.4)] -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 cursor-pointer transition-transform active:scale-95";

  return (
    <AdaptadoMobil>
      <div className="w-full relative overflow-hidden">
        <div className="w-full relative pb-[78%]">
          <iframe
            key={mapKey}
            title="Mapa de La Punta"
            src={mapUrl}
            className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto"
            allowFullScreen={true}
            loading="lazy"
          />

          <button 
            onClick={() => seleccionarLugar(lugares[0])} 
            className={`${btnClasePin} top-[22%] left-[57%]`}
          >
            1
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[1])} 
            className={`${btnClasePin} top-[35%] left-[67%]`}
          >
            2
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[2])} 
            className={`${btnClasePin} top-[35%] left-[47%]`}
          >
            3
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[3])} 
            className={`${btnClasePin} top-[58%] left-[53%]`}
          >
            4
          </button>
        </div>
      </div>

      {lugarSeleccionado && (
        <div className="flex flex-col items-center w-full mt-4">
          <DescripcionLugarComp
            numero={lugarSeleccionado.numero}
            titulo={lugarSeleccionado.titulo}
            descripcion={lugarSeleccionado.descripcion}
            imagenes={lugarSeleccionado.imagenes}
            detalles={lugarSeleccionado.detalles}
          />
          
          <button
            onClick={() => redirigir("/mapa/conoceMas")}
            className="my-6 px-10 py-3 bg-[#006f6c] text-white font-bold rounded-full text-lg shadow-md hover:bg-[#0b524e] active:scale-95 transition-all duration-200"
          >
            Conoce más
          </button>
        </div>
      )}

      <MenuModulosComp />
    </AdaptadoMobil>
  );
}

export default MapaPage;