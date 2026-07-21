import { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import AdaptadoMobil from "../components/AdaptadoMobil";
import DescripcionLugarComp from "../components/DescripcionLugarComp";
import MenuModulosComp from "../components/MenuModulosComp";
import { useRedireccion } from "../hooks/redireccion";

import "leaflet/dist/leaflet.css";

const limitesLaPunta = L.latLngBounds(
  [-12.0790, -77.1710],
  [-12.0640, -77.1470]
);

const lugares = [
  {
    numero: 1,
    titulo: "Malecón Wiese de alex",
    coordenadas: [-12.07074, -77.15954] as [number, number],
    descripcion: "Mirador costero ideal para observar aves marinas y contemplar la bahía de La Punta. Es un punto recomendado para disfrutar del paisaje, tomar fotografías y conectarse con la naturaleza.",
    imagenes: [
      "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293086", 
      "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293088",
      "https://consultasenlinea.mincetur.gob.pe/fichaInventario//foto.aspx?cod=293087"
    ],
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Malecón Wiese" },
      { etiqueta: "Atractivo", valor: "Mirador de aves" }
    ]
  },
  {
    numero: 2,
    titulo: "La Isla de Gilligan",
    coordenadas: [-12.07209, -77.15756] as [number, number],
    descripcion: "Punto de observación natural en la zona de arena y canto rodado que bordea la poza, ofreciendo vistas panorámicas únicas de la bahía.",
    imagenes: [
      "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl5eQQAsMfLT-UI0sW4Ex8fOT1G4Hl-zx-lcAkycVua1JTDhYt-yPHmvCZJ2j9MiFTjZ8uJSYyJFUkYWmZYAomtgULXBpOjBN9OFHIQIQLgT4U2WLBXm8I3i4ak0h6StNA6CFMihw=s1360-w1360-h1020-rw",
      "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk5UcRzBNGrSQ-abcg_sPSiCC2rk535b6F4dU_nw0pECjRRy2UWVy8_FcI9vuqomnzHyu7MnoSFSzG7MxV-xvkcIrySrJuWNbXg0y9qzjgdAOE6TkBLm6grBMKpgJy3-BSn4H6LAQ=s1360-w1360-h1020-rw",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4nH28qepnbBcFLp7lb4NiVYbMFFT2MtQMn38bExxG6e06cSzRFjkBTLc&s=10"
    ],
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Zona Este" },
      { etiqueta: "Atractivo", valor: "Paisaje natural" }
    ]
  },
  {
    numero: 3,
    titulo: "Mirador del Parque",
    coordenadas: [-12.07235, -77.16053] as [number, number],
    descripcion: "Mirador estratégico ubicado junto al Parque Gonzalo Fernández. Excelente punto de partida para observar la transición hacia la Poza de La Arenilla.",
    imagenes: [
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/c0/33/04/mirador-la-punta.jpg?w=900&h=-1&s=1",
      "https://images.mnstatic.com/2c/9f/2c9f60ba756905bd8b5941ee6d1540bf.jpg",
      "https://www.ytuqueplanes.com/imagenes/fotos/novedades/interna-no-vayas-a-la-punta_2.jpg"
    ],
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "Parque Gonzalo Fernández" },
      { etiqueta: "Atractivo", valor: "Vista a la poza" }
    ]
  },
  {
    numero: 4,
    titulo: "Poza de La Arenilla",
    coordenadas: [-12.07295, -77.15952] as [number, number],
    descripcion: "Espejo de agua principal donde habitan y descansan diversas especies de aves nativas y migratorias en la Poza de La Arenilla.",
    imagenes: [
      "https://avesdeperu.org/wp-content/uploads/2019/01/low-tide_optimized.jpg",
      "https://avesdeperu.org/wp-content/uploads/2019/01/jeti_optimized.jpg",
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiw7M2lIg4Q4IJ-TBGvqwt43eSFk8hyphLIB5vI5VAeDzO806gMR7JY2YpGwXxV_P-59544ufZqoNaFwhfeoHJG3TUGx90nJYMVzD6wNjGFixDJmoir7jXGPwqh9gwFLPiccaRfVbKJr0Xd/s1600/poza.jpg"
    ],
    detalles: [
      { etiqueta: "Lugar", valor: "La Punta" },
      { etiqueta: "Ubicación", valor: "La Arenilla" },
      { etiqueta: "Atractivo", valor: "Avistamiento de aves" }
    ]
  }
];

const crearIconoHtml = (numero: number, activo: boolean) => {
  return L.divIcon({
    html: `<div class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-white transition-all shadow-md ${
      activo ? "bg-[#004a48] scale-110 shadow-lg" : "bg-[#006f6c]"
    }">${numero}</div>`,
    className: "custom-leaflet-pin",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

function MapaPage() {
  const [lugarSeleccionado, setLugarSeleccionado] = useState<any>(lugares[0]);
  const { redirigir } = useRedireccion();

  return (
    <AdaptadoMobil>
      <div className="w-full relative overflow-hidden h-[340px] border-b border-gray-100 z-10">
        <MapContainer
          center={[-12.0715, -77.1610]} 
          zoom={16}
          minZoom={15}
          maxZoom={18}
          maxBounds={limitesLaPunta}
          maxBoundsViscosity={1.0}
          zoomControl={false} 
          className="w-full h-full"
        >
          <TileLayer
            attribution='© Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />

          {lugares.map((lugar) => (
            <Marker
              key={lugar.numero}
              position={lugar.coordenadas}
              icon={crearIconoHtml(lugar.numero, lugarSeleccionado?.numero === lugar.numero)}
              eventHandlers={{
                click: () => {
                  setLugarSeleccionado(lugar);
                },
              }}
            />
          ))}
        </MapContainer>
      </div>

      {lugarSeleccionado && (
        <div className="w-full flex flex-col items-center px-4 mt-4 pb-16 box-border">
          <div className="w-full max-w-md flex flex-col items-center">
            <DescripcionLugarComp
              numero={lugarSeleccionado.numero}
              titulo={lugarSeleccionado.titulo}
              descripcion={lugarSeleccionado.descripcion}
              imagenes={lugarSeleccionado.imagenes}
              detalles={lugarSeleccionado.detalles}
            >
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => redirigir("/mapa/conoceMas")}
                  className="w-[230px] py-[8px] bg-gradient-to-b from-[#005e5a] to-[#004744] text-[#e5f5f4] font-semibold text-[15px] tracking-wide rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.15)] border-t border-[#00736f]/30 active:scale-95 hover:brightness-110 transition-all duration-200"
                >
                  Conoce más
                </button>
              </div>
            </DescripcionLugarComp>
          </div>
        </div>
      )}

      <MenuModulosComp />
    </AdaptadoMobil>
  );
}

export default MapaPage;
