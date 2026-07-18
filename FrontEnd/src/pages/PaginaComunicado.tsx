import MiniComunicadoComp from "../components/MiniComunicadoComp";
import { useComunicados } from "../hooks/usarComunicados";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";


function PaginaComunicado() {
  const {
    comunicados,
    comunicadoSeleccionado,
    cargando,
    error,
    cargarComunicados,
    abrirComunicado,
    cerrarComunicado,
  } = useComunicados();

  if (cargando) {
    return (
      <p className="rounded-xl bg-white px-4 py-8 text-center text-[12px] font-bold text-[#006f6c]">
        Cargando comunicados...
      </p>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl bg-white px-4 py-6 text-center">
        <p className="text-[12px] font-bold leading-4 text-red-700">{error}</p>
        <BtnBlanco
          informacion="Reintentar"
          estilos="mx-auto mt-4 !min-h-8 !w-[160px] !rounded-full !px-3 !py-2 !text-[12px]"
          onClick={() => void cargarComunicados()}
        />
      </section>
    );
  }

  if (comunicados.length === 0) {
    return (
      <p className="rounded-xl bg-white px-4 py-8 text-center text-[12px] font-bold text-[#006f6c]">
        No hay comunicados disponibles.
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-4 [overflow-wrap:normal] [word-break:normal]">
      {comunicados.map((comunicado) => (
        <MiniComunicadoComp
          key={comunicado.id}
          categoria={comunicado.categoria}
          titulo={comunicado.titulo}
          fecha={comunicado.fecha}
          imagenUrl={comunicado.imagenUrl}
          onVer={() => abrirComunicado(comunicado)}
        />
      ))}

      {comunicadoSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
          <article className="w-full max-w-[360px] rounded-xl bg-white p-4 font-[Arial] shadow-xl">
            {comunicadoSeleccionado.imagenUrl && (
              <img
                src={comunicadoSeleccionado.imagenUrl}
                alt={comunicadoSeleccionado.titulo}
                className="h-40 w-full rounded-md object-cover"
              />
            )}
            <span className="mt-4 block text-[10px] font-bold text-[#006f6c]">
              {comunicadoSeleccionado.categoria}
            </span>
            <h2 className="mt-1 text-[18px] font-bold leading-6 text-[#006f6c] [overflow-wrap:normal] [word-break:normal]">
              {comunicadoSeleccionado.titulo}
            </h2>
            <span className="mt-1 block text-[11px] text-gray-500">
              {comunicadoSeleccionado.fecha}
            </span>
            <p className="mt-4 max-h-48 overflow-y-auto text-[13px] leading-5 text-gray-700 [overflow-wrap:normal] [word-break:normal]">
              {comunicadoSeleccionado.descripcion}
            </p>
            <BtnVerde
              informacion="Cerrar"
              estilos="mt-5 !min-h-9 !rounded-full !px-4 !py-2 !text-[13px]"
              onClick={cerrarComunicado}
            />
          </article>
        </div>
      )}
    </section>
  );
}

export default PaginaComunicado;
