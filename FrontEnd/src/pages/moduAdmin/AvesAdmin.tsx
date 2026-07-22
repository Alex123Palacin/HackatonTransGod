import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  FaDove,
  FaEye,
  FaEyeSlash,
  FaListUl,
  FaPen,
  FaPlus,
  FaSearch,
  FaStar,
  FaTimes,
  FaTrash,
  FaUpload,
} from "react-icons/fa";
import type {
  AtributoAveAdmin,
  AveAdmin,
  NuevaAveAdmin,
} from "../../api/adminmodulos/tipos";

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
  atributos: [],
  imagenes: [],
};

const ATRIBUTO_VACIO: AtributoAveAdmin = {
  nombre: "",
  valor: "",
  destacado: false,
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
      [
        ave.nombre,
        ave.nombreCientifico,
        ave.etiqueta,
        ...ave.atributos.flatMap((atributo) => [
          atributo.nombre,
          atributo.valor,
        ]),
      ].some((texto) => texto.toLowerCase().includes(termino)),
    );
  }, [aves, busqueda]);

  function actualizar(
    campo: Exclude<keyof NuevaAveAdmin, "imagenes" | "atributos">,
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
      atributos:
        ave.atributos.length > 0
          ? ave.atributos.map((atributo) => ({ ...atributo }))
          : [],
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
      atributos: formulario.atributos
        .map((atributo) => ({
          ...atributo,
          nombre: atributo.nombre.trim(),
          valor: atributo.valor.trim(),
        }))
        .filter((atributo) => atributo.nombre || atributo.valor),
    };
    const guardada =
      editandoId === null
        ? await agregar(datos)
        : await editar(editandoId, datos);
    if (guardada) limpiarFormulario();
  }

  function agregarAtributo(destacado = false) {
    setFormulario((actual) => ({
      ...actual,
      atributos: [...actual.atributos, { ...ATRIBUTO_VACIO, destacado }],
    }));
  }

  function actualizarAtributo(
    indice: number,
    campo: keyof AtributoAveAdmin,
    valor: string | boolean,
  ) {
    setFormulario((actual) => ({
      ...actual,
      atributos: actual.atributos.map((atributo, posicion) =>
        posicion === indice ? { ...atributo, [campo]: valor } : atributo,
      ),
    }));
  }

  function quitarAtributo(indice: number) {
    setFormulario((actual) => ({
      ...actual,
      atributos: actual.atributos.filter((_, posicion) => posicion !== indice),
    }));
  }

  const atributosDestacados = formulario.atributos.filter(
    (atributo) => atributo.destacado,
  ).length;
  const atributosDetalle = formulario.atributos.length - atributosDestacados;

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

          <section className="sm:col-span-2 2xl:col-span-1">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="block text-xs font-bold text-slate-600">
                  Atributos y etiquetas
                </span>
                <span className="text-[10px] text-slate-400">
                  {atributosDestacados} destacado(s), {atributosDetalle} detalle(s)
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => agregarAtributo(true)}
                  disabled={procesando || formulario.atributos.length >= 12}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#b7dad2] bg-[#edf7f4] px-2 text-[11px] font-bold text-[#006f6c] hover:bg-[#e2f1ed] disabled:opacity-50"
                >
                  <FaStar className="h-3 w-3" />
                  Chip
                </button>
                <button
                  type="button"
                  onClick={() => agregarAtributo(false)}
                  disabled={procesando || formulario.atributos.length >= 12}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-2 text-[11px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <FaListUl className="h-3 w-3" />
                  Detalle
                </button>
              </div>
            </div>

            <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-2">
              {formulario.atributos.map((atributo, indice) => (
                <div
                  key={`atributo-${indice}`}
                  className="grid gap-2 rounded-md bg-white p-2 shadow-sm sm:grid-cols-[120px_minmax(0,1fr)_auto] 2xl:grid-cols-1"
                >
                  <input
                    type="text"
                    value={atributo.nombre}
                    onChange={(evento) =>
                      actualizarAtributo(indice, "nombre", evento.target.value)
                    }
                    maxLength={100}
                    disabled={procesando}
                    placeholder={atributo.destacado ? "Ej. Tipo" : "Ej. Habitat"}
                    className="h-9 rounded-md border border-slate-300 px-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#007d78]"
                  />
                  <input
                    type="text"
                    value={atributo.valor}
                    onChange={(evento) =>
                      actualizarAtributo(indice, "valor", evento.target.value)
                    }
                    maxLength={250}
                    disabled={procesando}
                    placeholder={
                      atributo.destacado
                        ? "Ej. Acuatica"
                        : "Ej. Humedales y lagunas"
                    }
                    className="h-9 rounded-md border border-slate-300 px-2 text-xs outline-none placeholder:text-slate-400 focus:border-[#007d78]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <label className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-2 text-[11px] font-bold text-slate-600">
                      <input
                        type="checkbox"
                        checked={atributo.destacado}
                        disabled={procesando}
                        onChange={(evento) =>
                          actualizarAtributo(
                            indice,
                            "destacado",
                            evento.target.checked,
                          )
                        }
                        className="h-3.5 w-3.5 accent-[#006f6c]"
                      />
                      Chip
                    </label>
                    <button
                      type="button"
                      onClick={() => quitarAtributo(indice)}
                      disabled={procesando}
                      className="flex h-9 w-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
                      aria-label="Quitar atributo"
                    >
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}

              {formulario.atributos.length === 0 && (
                <p className="px-2 py-3 text-center text-[11px] text-slate-400">
                  Agrega chips como "Acuatica" o detalles como "Habitat".
                </p>
              )}
            </div>
          </section>

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
                  {ave.imagenes.length} foto(s) · {ave.atributos.length} atributo(s)
                </p>
                {ave.atributos.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ave.atributos.slice(0, 3).map((atributo) => (
                      <span
                        key={`${ave.id}-${atributo.nombre}-${atributo.valor}`}
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          atributo.destacado
                            ? "bg-[#edf7f4] text-[#006f6c]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {atributo.destacado ? atributo.valor : atributo.nombre}
                      </span>
                    ))}
                    {ave.atributos.length > 3 && (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                        +{ave.atributos.length - 3}
                      </span>
                    )}
                  </div>
                )}
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
