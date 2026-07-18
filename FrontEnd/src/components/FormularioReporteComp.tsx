import { FaCamera, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useFormularioReporte } from "../hooks/usarFormularioReporte";
import { BtnBlanco } from "../ui/BotonUi";

function FormularioReporteComp() {
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    inputImagenRef,
    vistaPrevia,
    seleccionarImagen,
    abrirSelectorImagen,
    quitarImagen,
    enviarReporte,
    enviando,
    error,
  } = useFormularioReporte();

  return (
    <section className="rounded-[16px] bg-white px-4 py-5 shadow-sm">
      <label className="text-[12px] font-bold text-[#006f6c]">
        Titulo del reporte
      </label>
      <input
        type="text"
        value={titulo}
        maxLength={200}
        disabled={enviando}
        onChange={(event) => setTitulo(event.target.value)}
        placeholder="Ejemplo: baranda danada"
        className="mt-2 h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-[12px] text-slate-700 outline-none focus:border-[#006f6c]"
      />

      <label className="mt-4 block text-[12px] font-bold text-[#006f6c]">
        Descripcion
      </label>
      <textarea
        value={descripcion}
        disabled={enviando}
        onChange={(event) => setDescripcion(event.target.value)}
        placeholder="Describe brevemente el problema..."
        className="mt-2 h-32 w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-[12px] text-slate-700 outline-none focus:border-[#006f6c]"
      />

      <input
        ref={inputImagenRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={enviando}
        onChange={seleccionarImagen}
      />

      {vistaPrevia ? (
        <div className="relative mt-4 overflow-hidden rounded-xl">
          <img
            src={vistaPrevia}
            alt="Imagen seleccionada para el reporte"
            className="h-36 w-full object-cover"
          />
          <button
            type="button"
            aria-label="Quitar imagen"
            disabled={enviando}
            onClick={quitarImagen}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <FaTimes className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={enviando}
          onClick={abrirSelectorImagen}
          className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#006f6c] text-[12px] font-bold text-[#006f6c]"
        >
          <FaCamera className="h-4 w-4" />
          Adjuntar imagen (opcional)
        </button>
      )}

      {error && (
        <p role="alert" className="mt-3 text-center text-[11px] text-red-600">
          {error}
        </p>
      )}

      <BtnBlanco
        informacion={enviando ? "Enviando..." : "Enviar reporte"}
        icono={<FaPaperPlane className="h-3.5 w-3.5" />}
        estilos="mx-auto mt-5 !min-h-0 !w-[210px] !rounded-full !px-4 !py-2.5 !text-[12px]"
        onClick={() => void enviarReporte()}
        deshabilitado={enviando}
      />
    </section>
  );
}

export default FormularioReporteComp;
