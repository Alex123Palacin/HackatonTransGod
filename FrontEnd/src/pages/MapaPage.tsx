import React, { useState } from "react";
import AdaptadoMobil from "../components/AdaptadoMobil";
import DescripcionLugarComp from "../components/DescripcionLugarComp";
import MenuModulosComp from "../components/MenuModulosComp";

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

  const mapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2516.3656793352357!2d-77.16021857408383!3d-12.072547103927953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2spe!4v1784046905635!5m2!1ses!2spe";

  const seleccionarLugar = (lugar: any) => {
    setLugarSeleccionado(lugar);
    setMapKey((prevKey) => prevKey + 1);
  };

  return (
    <AdaptadoMobil>
      <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
        <div style={{ width: "100%", paddingTop: "78%", position: "relative" }}>
          
          <iframe
            key={mapKey}
            title="Mapa de La Punta"
            src={mapUrl}
            style={{ 
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
              pointerEvents: "auto"
            }}
            allowFullScreen={true}
            loading="lazy"
          />

          <button 
            onClick={() => seleccionarLugar(lugares[0])} 
            style={{ ...btnEstilo, top: "25%", left: "61%" }}
          >
            1
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[1])} 
            style={{ ...btnEstilo, top: "33%", left: "72%" }}
          >
            2
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[2])} 
            style={{ ...btnEstilo, top: "37%", left: "46%" }}
          >
            3
          </button>

          <button 
            onClick={() => seleccionarLugar(lugares[3])} 
            style={{ ...btnEstilo, top: "54%", left: "55%" }}
          >
            4
          </button>

        </div>
      </div>

      {lugarSeleccionado && (
        <DescripcionLugarComp
          numero={lugarSeleccionado.numero}
          titulo={lugarSeleccionado.titulo}
          descripcion={lugarSeleccionado.descripcion}
          imagenes={lugarSeleccionado.imagenes}
          detalles={lugarSeleccionado.detalles}
        />
      )}

      <MenuModulosComp />
    </AdaptadoMobil>
  );
}

const btnEstilo: React.CSSProperties = {
  position: "absolute",
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  backgroundColor: "#0F6E68", 
  color: "white",
  border: "2.5px solid white",
  fontWeight: "bold",
  fontSize: "16px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0px 3px 6px rgba(0,0,0,0.4)",
  transform: "translate(-50%, -50%)",
  pointerEvents: "auto",
  zIndex: 10
};

export default MapaPage;