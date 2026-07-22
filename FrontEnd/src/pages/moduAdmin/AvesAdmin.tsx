import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  FaDove,
  FaEye,
  FaEyeSlash,
  FaPen,
  FaPlus,
  FaSearch,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import type { AveAdmin, NuevaAveAdmin } from "../../api/adminmodulos/tipos";

type AvesAdminProps = {
  aves: AveAdmin[];
  procesando: boolean;
  agregar: (nueva: NuevaAveAdmin) => Promise<boolean>;
  editar: (id: number, ave: NuevaAveAdmin) => Promise<boolean>;
  alternar: (id: number) => Promise<boolean>;
  borrar: (id: number) => Promise<boolean>;
};

const AVE_INICIAL: NuevaAveAdmin = {
  nombre: "",
  nombreCientifico: "",
  etiqueta: "",
  caracteristicas: "",
  descripcion: "",
  imagenes: [],
};

function AvesAdmin({
  aves,
  procesando,
  agregar,
  editar,
  alternar,
  borrar,
}: AvesAdminProps) {
  const inputImagenesRef = useRef<HTMLInputElement | null>(null);
  const [formulario, setFormulario] = useState<NuevaAveAdmin>(AVE_INICIAL);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [busqueda, setBusqueda] = useState("");

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return aves;
    return aves.filter((ave) =>
      [ave.nombre, ave.nombreCientifico, ave.etiqueta].some((texto) =>
        texto.toLowerCase().includes(termino),
      ),
    );
  }, [aves, busqueda]);

  function actualizar(
    campo: Exclude<keyof NuevaAveAdmin, "imagenes">,
    valor: string,
  ) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function limpiarFormulario() {
    setFormulario(AVE_INICIAL);
    setEditandoId(null);
    if (inputImagenesRef.current) inputImagenesRef.current.value = "";
  }

  function comenzarEdicion(ave: AveAdmin) {
    setEditandoId(ave.id);
    setFormulario({
      nombre: ave.nombre,
      nombreCientifico: ave.nombreCientifico,
      etiqueta: ave.etiqueta,
      caracteristicas: ave.caracteristicas,
      descripcion: ave.descripcion,
      imagenes: [],
    });
    if (inputImagenesRef.current) inputImagenesRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const datos: NuevaAveAdmin = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      nombreCientifico: formulario.nombreCientifico.trim(),
      etiqueta: formulario.etiqueta.trim(),
      caracteristicas: formulario.caracteristicas.trim(),
      descripcion: formulario.descripcion.trim(),
    };
    const guardada =
      editandoId === null
        ? await agregar(datos)
        : await editar(editandoId, datos);
    if (guardada) limpiarFormulario();
  }

  return (
    <div className="grid gap-5 2xl:grid-cols-[390px_minmax(0,1fr)]">
      <section className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm 2xl:sticky 2xl:top-24">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e6f3ef] text-[#006f6c]">
            <FaDove className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-slate-800">
              {editandoId === null ? "Registrar ave" : "Editar ave"}
            </h2>
            <p className="text-xs text-slate-500">
              Administra las especies del catalogo
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

        <form
          className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-1"
          onSubmit={enviar}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Nombre
            </span>
            <input
              type="text"
              value={formulario.nombre}
              onChange={(evento) => actualizar("nombre", evento.target.value)}
              maxLength={150}
              required
              disabled={procesando}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-[#007d78]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Nombre cientifico
            </span>
            <input
              type="text"
              value={formulario.nombreCientifico}
              onChange={(evento) =>
                actualizar("nombreCientifico", evento.target.value)
              }
              maxLength={200}
              disabled={procesando}
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm italic outline-none focus:border-[#007d78]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Etiqueta principal
            </span>
            <input
              type="text"
              value={formulario.etiqueta}
              onChange={(evento) => actualizar("etiqueta", evento.target.value)}
              maxLength={100}
              required
              disabled={procesando}
              placeholder="Ej. Acuatica"
              className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#007d78]"
            />
          </label>

          <label className="block sm:col-span-2 2xl:col-span-1">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Fotografias {editandoId !== null && "(opcional para reemplazar)"}
            </span>
            <span className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border border-dashed border-[#78aaa1] bg-[#f4faf8] px-3 text-xs font-bold text-[#006f6c] hover:bg-[#eaf5f2]">
              <FaUpload className="shrink-0" />
              <span className="min-w-0 truncate">
                {formulario.imagenes.length > 0
                  ? `${formulario.imagenes.length} imagen(es) seleccionada(s)`
                  : "Seleccionar imagenes desde el equipo"}
              </span>
              <input
                ref={inputImagenesRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                required={editandoId === null}
                disabled={procesando}
                onChange={(evento) =>
                  setFormulario((actual) => ({
                    ...actual,
                    imagenes: Array.from(evento.target.files ?? []),
                  }))
                }
                className="sr-only"
              />
            </span>
            <span className="mt-1 block text-[10px] text-slate-400">
              Hasta 8 fotos, 8 MB cada una. La primera sera la principal.
              {editandoId !== null &&
                " Si seleccionas nuevas fotos reemplazaran la galeria actual."}
            </span>
          </label>

          <label className="block sm:col-span-2 2xl:col-span-1">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Caracteristicas
            </span>
            <textarea
              value={formulario.caracteristicas}
              onChange={(evento) =>
                actualizar("caracteristicas", evento.target.value)
              }
              rows={3}
              required
              disabled={procesando}
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#007d78]"
            />
          </label>
          <label className="block sm:col-span-2 2xl:col-span-1">
            <span className="mb-1.5 block text-xs font-bold text-slate-600">
              Descripcion
            </span>
            <textarea
              value={formulario.descripcion}
              onChange={(evento) => actualizar("descripcion", evento.target.value)}
              rows={3}
              disabled={procesando}
              className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#007d78]"
            />
          </label>
          <button
            type="submit"
            disabled={procesando}
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#006f6c] px-4 text-sm font-bold text-white hover:bg-[#005a57] disabled:opacity-60 sm:col-span-2 2xl:col-span-1"
          >
            {editandoId === null ? (
              <FaPlus className="h-3.5 w-3.5" />
            ) : (
              <FaPen className="h-3.5 w-3.5" />
            )}
            {editandoId === null ? "Agregar al catalogo" : "Guardar cambios"}
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">Catalogo de aves</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {aves.length} especies en PostgreSQL
            </p>
          </div>
          <label className="flex h-9 w-full max-w-[300px] items-center gap-2 rounded-md border border-slate-300 px-3 focus-within:border-[#007d78]">
            <FaSearch className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar especie"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>
        </header>

        <div className="grid gap-px bg-slate-100 sm:grid-cols-2 xl:grid-cols-3">
          {filtradas.map((ave) => (
            <article key={ave.id} className="flex min-w-0 gap-4 bg-white p-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#e6f3ef] text-[#006f6c]">
                {ave.imagenUrl ? (
                  <img
                    src={ave.imagenUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaDove className="h-7 w-7" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-slate-800">
                      {ave.nombre}
                    </h3>
                    <p className="truncate text-xs italic text-slate-500">
                      {ave.nombreCientifico || "Sin nombre cientifico"}
                    </p>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      ave.activa ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={ave.activa ? "Activa" : "Oculta"}
                  />
                </div>
                <span className="mt-2 inline-flex rounded-full bg-[#edf7f4] px-2 py-1 text-[10px] font-bold text-[#006f6c]">
                  {ave.etiqueta}
                </span>
                <p className="mt-1 text-[10px] text-slate-400">
                  {ave.imagenes.length} foto(s)
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    title="Editar"
                    aria-label="Editar ave"
                    disabled={procesando}
                    onClick={() => comenzarEdicion(ave)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <FaPen className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    title={ave.activa ? "Ocultar" : "Publicar"}
                    aria-label={ave.activa ? "Ocultar ave" : "Publicar ave"}
                    disabled={procesando}
                    onClick={() => void alternar(ave.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-[#006f6c] hover:bg-[#edf7f4] disabled:opacity-50"
                  >
                    {ave.activa ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <button
                    type="button"
                    title="Eliminar"
                    aria-label="Eliminar ave"
                    disabled={procesando}
                    onClick={() => {
                      if (window.confirm("¿Eliminar esta ave del catalogo?")) {
                        void borrar(ave.id);
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <FaTrash className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtradas.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-slate-500">
            No se encontraron especies.
          </p>
        )}
      </section>
    </div>
  );
}

export default AvesAdmin;
