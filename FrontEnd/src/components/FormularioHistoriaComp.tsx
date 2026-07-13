import { useState } from "react";
import { BtnBlanco, BtnVerde } from "../ui/BotonUi";
import { useMostrarImagenHistoria } from "../hooks/MostrarImagenHistoria";
import type { ImagenHistoria } from "../hooks/MostrarImagenHistoria";

type HistoriaFormulario = {
  titulo: string;
  descripcion: string;
  imagenes: ImagenHistoria[];
};

type FormularioHistoriaCompProps = {
  onSubirHistoria?: (historia: HistoriaFormulario) => void;
  onCancelar?: () => void;
};

function FormularioHistoriaComp({
  onSubirHistoria,
  onCancelar,
}: FormularioHistoriaCompProps) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const {
    imagenes,
    inputImagenesRef,
    abrirSelectorImagenes,
    mostrarImagenes,
    limpiarImagenes,
  } = useMostrarImagenHistoria();

  function subirHistoria() {
    onSubirHistoria?.({ titulo, descripcion, imagenes });
  }

  function cancelarFormulario() {
    setTitulo("");
    setDescripcion("");
    limpiarImagenes();
    onCancelar?.();
  }

  return (
    <section className="w-full max-w-full rounded-[14px] bg-white px-5 pb-8 pt-4 font-[Arial] shadow-sm">
      <input
        ref={inputImagenesRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={mostrarImagenes}
      />

      <button
        type="button"
        onClick={abrirSelectorImagenes}
        className="mx-auto block w-[88%] rounded-[28px] border-2 border-dashed border-[#006f6c] px-4 py-2 text-center text-[15px] font-bold text-[#006f6c]"
      >
        Seleccionar imagenes
      </button>

      {imagenes.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {imagenes.map((imagen) => (
            <img
              key={imagen.id}
              src={imagen.url}
              alt={imagen.nombre}
              className="h-20 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <label className="mt-4 block text-[15px] font-bold text-[#006f6c]">
        Titulo
      </label>
      <input
        type="text"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        className="mt-2 h-9 w-full rounded-md border border-gray-300 bg-gray-50 px-3 text-[#006f6c] outline-none focus:border-[#006f6c] focus:ring-2 focus:ring-[#006f6c]/20"
      />

      <label className="mt-4 block text-[15px] font-bold text-[#006f6c]">
        Descripcion
      </label>
      <textarea
        value={descripcion}
        onChange={(event) => setDescripcion(event.target.value)}
        className="mt-2 min-h-[180px] w-full resize-none rounded-md border border-gray-300 bg-gray-50 p-3 text-[#006f6c] outline-none focus:border-[#006f6c] focus:ring-2 focus:ring-[#006f6c]/20"
      />

      <div className="mx-auto mt-5 flex w-full max-w-[230px] flex-col gap-3">
        <BtnBlanco
          informacion="Subir Historia"
          estilos="!min-h-9 !rounded-full !px-4 !py-2 !text-sm leading-none"
          onClick={subirHistoria}
        />
        <BtnVerde
          informacion="Cancelar"
          estilos="!min-h-8 !rounded-full !bg-[#dce9e9] !px-4 !py-2 !text-sm leading-none"
          onClick={cancelarFormulario}
        />
      </div>
    </section>
  );
}

export default FormularioHistoriaComp;
