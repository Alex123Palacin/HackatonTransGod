import { useRef, useState, type FormEvent } from "react";
import {
  FaBullhorn,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaPlus,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import type {
  ComunicadoAdmin,
  NuevoComunicadoAdmin,
} from "../../api/adminmodulos/tipos";
import { formatearFecha } from "./estilosAdmin";

type ComunicadosAdminProps = {
  comunicados: ComunicadoAdmin[];
  procesando: boolean;
  agregar: (nuevo: NuevoComunicadoAdmin) => Promise<boolean>;
  editar: (id: number, comunicado: NuevoComunicadoAdmin) => Promise<boolean>;
  alternar: (id: number) => Promise<boolean>;
  borrar: (id: number) => Promise<boolean>;
};

function fechaActual() {
  return new Date().toISOString().slice(0, 10);
}

const FORMULARIO_INICIAL: NuevoComunicadoAdmin = {
  titulo: "",
  descripcion: "",
  fecha: fechaActual(),
  imagen: null,
};

function ComunicadosAdmin({
  comunicados,
  procesando,
  agregar,
  editar,
  alternar,
  borrar,
}: ComunicadosAdminProps) {
  const inputImagenRef = useRef<HTMLInputElement | null>(null);
  const [formulario, setFormulario] =
    useState<NuevoComunicadoAdmin>(FORMULARIO_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  function actualizar(
    campo: "titulo" | "descripcion" | "fecha",
    valor: string,
  ) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function limpiarFormulario() {
    setFormulario({ ...FORMULARIO_INICIAL, fecha: fechaActual() });
    setEditandoId(null);
    if (inputImagenRef.current) inputImagenRef.current.value = "";
  }

  function comenzarEdicion(comunicado: ComunicadoAdmin) {
    setEditandoId(comunicado.id);
    setFormulario({
      titulo: comunicado.titulo,
      descripcion: comunicado.descripcion,
      fecha: comunicado.fecha,
      imagen: null,
    });
    if (inputImagenRef.current) inputImagenRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos = {
      ...formulario,
      titulo: formulario.titulo.trim(),
      descripcion: formulario.descripcion.trim(),
    };
    const guardado =
      editandoId === null
        ? await agregar(datos)
        : await editar(editandoId, datos);
    if (guardado) limpiarFormulario();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-24">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e6f3ef] text-[#006f6c]">
            <FaBullhorn className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-slate-800">
              {editandoId === null ? "Nuevo comunicado" : "Editar comunicado"}
            </h2>
            <p className="text-xs text-slate-500">
              Los cambios se guardan en la base de datos
            </p>
          </div>
          {editandoId !== null && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Cancelar edicion"
            >
              <FaTimes />
            </button>
          )}
        </div>

        <form className="mt-5 space-y-4" onSubmit={enviar}>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Titulo
            </span>
            <input
              type="text"
              value={formulario.titulo}
              onChange={(evento) => actualizar("titulo", evento.target.value)}
              maxLength={200}
              required
              disabled={procesando}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#007d78] focus:ring-2 focus:ring-[#007d78]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Fecha
            </span>
            <input
              type="date"
              value={formulario.fecha}
              onChange={(evento) => actualizar("fecha", evento.target.value)}
              required
              disabled={procesando}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#007d78]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Descripcion
            </span>
            <textarea
              value={formulario.descripcion}
              onChange={(evento) => actualizar("descripcion", evento.target.value)}
              rows={5}
              required
              disabled={procesando}
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#007d78] focus:ring-2 focus:ring-[#007d78]/10"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Imagen {editandoId !== null && "(opcional para reemplazar)"}
            </span>
            <span className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-dashed border-[#78aaa1] bg-[#f4faf8] px-3 text-xs font-bold text-[#006f6c] hover:bg-[#eaf5f2]">
              <FaUpload className="shrink-0" />
              <span className="min-w-0 truncate">
                {formulario.imagen?.name || "Seleccionar imagen desde el equipo"}
              </span>
              <input
                ref={inputImagenRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={procesando}
                onChange={(evento) =>
                  setFormulario((actual) => ({
                    ...actual,
                    imagen: evento.target.files?.[0] ?? null,
                  }))
                }
                className="sr-only"
              />
            </span>
            <span className="mt-1 block text-[10px] text-slate-400">
              JPG, PNG o WEBP; maximo 8 MB.
            </span>
          </label>

          <button
            type="submit"
            disabled={procesando}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#006f6c] px-4 text-sm font-bold text-white hover:bg-[#005a57] disabled:opacity-60"
          >
            {editandoId === null ? (
              <FaPlus className="h-3.5 w-3.5" />
            ) : (
              <FaPen className="h-3.5 w-3.5" />
            )}
            {editandoId === null ? "Publicar comunicado" : "Guardar cambios"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-800">Comunicados</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {comunicados.length} registros en PostgreSQL
            </p>
          </div>
        </header>

        <div className="divide-y divide-slate-100">
          {comunicados.map((comunicado) => (
            <article
              key={comunicado.id}
              className="grid gap-4 px-5 py-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="flex h-[58px] w-[72px] items-center justify-center overflow-hidden rounded-md bg-[#e6f3ef] text-[#006f6c]">
                {comunicado.imagenUrl ? (
                  <img
                    src={comunicado.imagenUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaBullhorn className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {comunicado.titulo}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      comunicado.activo
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {comunicado.activo ? "Visible" : "Oculto"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                  {comunicado.descripcion}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {formatearFecha(comunicado.fecha)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Editar"
                  aria-label="Editar comunicado"
                  disabled={procesando}
                  onClick={() => comenzarEdicion(comunicado)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FaPen className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title={comunicado.activo ? "Ocultar" : "Mostrar"}
                  aria-label={
                    comunicado.activo
                      ? "Ocultar comunicado"
                      : "Mostrar comunicado"
                  }
                  disabled={procesando}
                  onClick={() => void alternar(comunicado.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-[#006f6c] hover:bg-[#edf7f4] disabled:opacity-50"
                >
                  {comunicado.activo ? <FaEyeSlash /> : <FaEye />}
                </button>
                <button
                  type="button"
                  title="Eliminar"
                  aria-label="Eliminar comunicado"
                  disabled={procesando}
                  onClick={() => {
                    if (window.confirm("¿Eliminar este comunicado?")) {
                      void borrar(comunicado.id);
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}

          {comunicados.length === 0 && (
            <p className="px-5 py-12 text-center text-sm text-slate-500">
              Todavia no hay comunicados.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ComunicadosAdmin;
