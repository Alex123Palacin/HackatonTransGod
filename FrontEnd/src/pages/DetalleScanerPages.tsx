import { useEffect, useState, useRef } from "react";
import { FaBolt, FaCheckCircle, FaTimes } from "react-icons/fa";
import AdaptadoMobil from "../components/AdaptadoMobil";
import MenuModulosComp from "../components/MenuModulosComp";
import { useRedireccion } from "../hooks/redireccion";

const imagenRespaldo = "https://images.unsplash.com/photo-1444464666168-49d633b86797?q=80&w=500&auto=format&fit=cover";

function DetalleScanerPages() {
  const { redirigir } = useRedireccion();
  const [fotoReal, setFotoReal] = useState<string>(imagenRespaldo);

  const [posicionX, setPosicionX] = useState<number>(130);
  const [posicionY, setPosicionY] = useState<number>(130);
  const [tamanoMarco, setTamanoMarco] = useState<number>(240);
  
  const inicioTouchX = useRef<number>(0);
  const inicioTouchY = useRef<number>(0);
  const posicionInicialMarcoX = useRef<number>(0);
  const posicionInicialMarcoY = useRef<number>(0);
  
  const distanciaInicialDedos = useRef<number>(0);
  const tamanoInicialMarco = useRef<number>(0);

  const [porcentajeX, setPorcentajeX] = useState<number>(50);
  const [porcentajeY, setPorcentajeY] = useState<number>(50);

  const [aveInfo, setAveInfo] = useState({
    nombre: "Gaviota peruana",
    cientifico: "Larus belcheri",
    descripcion: "Ave comun en costas rocosas y playas. Se alimenta de peces y restos marinos.",
    precision: "92%"
  });

  useEffect(() => {
    const fotoGuardada = localStorage.getItem("fotoCapturadaAve");
    if (fotoGuardada) {
      setFotoReal(fotoGuardada);
    }
    
    return () => {
      if (localStorage.getItem("fotoCapturadaAve")) {
        try {
          const peso = localStorage.getItem("fotoCapturadaAve")?.length || 0;
          if (peso > 500000) {
            localStorage.removeItem("fotoCapturadaAve");
          }
        } catch {
          localStorage.removeItem("fotoCapturadaAve");
        }
      }
    };
  }, []);

  useEffect(() => {
    const limiteMaxX = 500 - tamanoMarco;
    const limiteMaxY = 500 - tamanoMarco;

    const pX = limiteMaxX > 0 ? (posicionX / limiteMaxX) * 100 : 50;
    const pY = limiteMaxY > 0 ? (posicionY / limiteMaxY) * 100 : 50;
    
    setPorcentajeX(Math.min(Math.max(pX, 0), 100));
    setPorcentajeY(Math.min(Math.max(pY, 0), 100));

    if (posicionY < 100) {
      setAveInfo({
        nombre: "Pelicano Peruano",
        cientifico: "Pelecanus thagus",
        descripcion: "Ave de gran tamaño con una bolsa gular característica. Habita en bandadas cerca a muelles.",
        precision: "95%"
      });
    } else if (posicionY > 180) {
      setAveInfo({
        nombre: "Zarcillo",
        cientifico: "Larosterna inca",
        descripcion: "Ave marina llamativa por sus plumas blancas en forma de bigotes. Habita acantilados marinos.",
        precision: "88%"
      });
    } else {
      setAveInfo({
        nombre: "Gaviota peruana",
        cientifico: "Larus belcheri",
        descripcion: "Ave comun en costas rocosas y playas. Se alimenta de peces y restos marinos.",
        precision: "92%"
      });
    }
  }, [posicionX, posicionY, tamanoMarco]);

  const obtenerDistancia = (t1: React.Touch, t2: React.Touch) => {
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
  };

  const manejarTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      inicioTouchX.current = e.touches[0].clientX;
      inicioTouchY.current = e.touches[0].clientY;
      posicionInicialMarcoX.current = posicionX;
      posicionInicialMarcoY.current = posicionY;
    } else if (e.touches.length === 2) {
      distanciaInicialDedos.current = obtenerDistancia(e.touches[0], e.touches[1]);
      tamanoInicialMarco.current = tamanoMarco;
      
      inicioTouchX.current = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      inicioTouchY.current = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      posicionInicialMarcoX.current = posicionX;
      posicionInicialMarcoY.current = posicionY;
    }
  };

  const manejarTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && distanciaInicialDedos.current === 0) {
      const deltaX = e.touches[0].clientX - inicioTouchX.current;
      const deltaY = e.touches[0].clientY - inicioTouchY.current;
      
      let nuevaPosicionX = posicionInicialMarcoX.current + deltaX;
      let nuevaPosicionY = posicionInicialMarcoY.current + deltaY;

      const limiteMaxX = 500 - tamanoMarco;
      const limiteMaxY = 500 - tamanoMarco;

      if (nuevaPosicionX < 0) nuevaPosicionX = 0;
      if (nuevaPosicionX > limiteMaxX) nuevaPosicionX = limiteMaxX;

      if (nuevaPosicionY < 0) nuevaPosicionY = 0;
      if (nuevaPosicionY > limiteMaxY) nuevaPosicionY = limiteMaxY;

      setPosicionX(nuevaPosicionX);
      setPosicionY(nuevaPosicionY);
    } else if (e.touches.length === 2) {
      const nuevaDistancia = obtenerDistancia(e.touches[0], e.touches[1]);
      const factorEscala = nuevaDistancia / distanciaInicialDedos.current;
      
      let nuevoTamano = Math.round(tamanoInicialMarco.current * factorEscala);
      
      if (nuevoTamano < 120) nuevoTamano = 120;
      if (nuevoTamano > 360) nuevoTamano = 360;

      const centroActualX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centroActualY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      const deltaX = centroActualX - inicioTouchX.current;
      const deltaY = centroActualY - inicioTouchY.current;

      let nuevaPosicionX = posicionInicialMarcoX.current + deltaX;
      let nuevaPosicionY = posicionInicialMarcoY.current + deltaY;

      const limiteMaxX = 500 - nuevoTamano;
      const limiteMaxY = 500 - nuevoTamano;

      if (nuevaPosicionX < 0) nuevaPosicionX = 0;
      if (nuevaPosicionX > limiteMaxX) nuevaPosicionX = limiteMaxX;

      if (nuevaPosicionY < 0) nuevaPosicionY = 0;
      if (nuevaPosicionY > limiteMaxY) nuevaPosicionY = limiteMaxY;

      setTamanoMarco(nuevoTamano);
      setPosicionX(nuevaPosicionX);
      setPosicionY(nuevaPosicionY);
    }
  };

  const manejarTouchEnd = () => {
    distanciaInicialDedos.current = 0;
  };

  return (
    <AdaptadoMobil>
      <section className="relative flex min-h-full flex-col overflow-hidden bg-white [overflow-wrap:normal] [word-break:normal]">
        <main className="relative flex flex-1 flex-col overflow-hidden">
          
          <div 
            className="relative h-[500px] w-full overflow-hidden bg-slate-300 select-none touch-none mx-auto"
            style={{ maxWidth: "500px" }}
            onTouchStart={manejarTouchStart}
            onTouchMove={manejarTouchMove}
            onTouchEnd={manejarTouchEnd}
          >
            <img
              src={fotoReal}
              alt="Ave escaneada"
              className="h-full w-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
              <button
                type="button"
                onClick={() => redirigir("/scan")}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006f6c] shadow-md"
              >
                <FaTimes />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#006f6c] shadow-md"
              >
                <FaBolt />
              </button>
            </header>

            <div 
              className="absolute z-10 pointer-events-none border border-transparent"
              style={{ 
                left: `${posicionX}px`,
                top: `${posicionY}px`,
                width: `${tamanoMarco}px`,
                height: `${tamanoMarco}px`
              }}
            >
              <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-lg border-l-4 border-t-4 border-white" />
              <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-lg border-r-4 border-t-4 border-white" />
              <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-b-4 border-l-4 border-white" />
              <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-lg border-b-4 border-r-4 border-white" />
            </div>

            <div className="absolute bottom-[118px] left-12 right-12 rounded-xl bg-black/60 px-4 py-2 text-center text-[12px] font-bold text-white backdrop-blur-xs pointer-events-none">
              1 dedo mueve • 2 dedos hacen zoom al marco
            </div>
          </div>

          <section className="-mt-14 z-10 mx-3 rounded-t-[24px] bg-white px-4 pb-5 pt-5 shadow-lg">
            <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-slate-300" />
            <h1 className="text-[17px] font-bold text-[#006f6c]">
              Posible identificacion
            </h1>

            <article className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100">
              <div className="h-20 w-20 shrink-0 rounded-full overflow-hidden relative border border-slate-200 bg-slate-100">
                <img
                  src={fotoReal}
                  alt="Vista miniatura"
                  className="absolute h-full w-full object-cover scale-[2.5] transition-all duration-75"
                  style={{
                    objectPosition: `${porcentajeX}% ${porcentajeY}%`
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold leading-5 text-[#006f6c]">
                  {aveInfo.nombre}
                </h2>
                <p className="text-[12px] italic text-slate-500">
                  {aveInfo.cientifico}
                </p>
                <p className="mt-2 text-[11px] leading-4 text-slate-600">
                  {aveInfo.descripcion}
                </p>
              </div>

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dff3e9] text-[13px] font-bold text-[#006f6c]">
                {aveInfo.precision}
              </span>
            </article>

            <button
              type="button"
              onClick={() => redirigir("/descripcion-ave")}
              className="mx-auto mt-5 flex h-10 w-[260px] items-center justify-center gap-2 rounded-xl bg-[#006f6c] text-[15px] font-bold text-white shadow-sm"
            >
              <FaCheckCircle />
              Ver detalles
            </button>
          </section>
        </main>

        <MenuModulosComp />
      </section>
    </AdaptadoMobil>
  );
}

export default DetalleScanerPages;
