type EstadoReporteAdmin =
  | "PENDIENTE"
  | "EN_REVISION"
  | "ATENDIDO"
  | "RECHAZADO";

type UsuarioAdmin = {
  id: number;
  nombre: string;
  correo: string;
};

type SesionAdmin = {
  usuario: UsuarioAdmin;
  csrfToken: string;
};

type ReporteAdmin = {
  id: number;
  codigo: string;
  solicitante: string;
  correoSolicitante: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: EstadoReporteAdmin;
  imagenUrl: string;
};

type ComunicadoAdmin = {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl: string;
  activo: boolean;
};

type AtributoAveAdmin = {
  id?: number;
  nombre: string;
  valor: string;
  destacado: boolean;
};

type AveAdmin = {
  id: number;
  nombre: string;
  nombreCientifico: string;
  etiqueta: string;
  caracteristicas: string;
  descripcion: string;
  imagenUrl: string;
  imagenes: string[];
  atributos: AtributoAveAdmin[];
  activa: boolean;
};

type PublicacionAdmin = {
  id: number;
  autor: string;
  correoAutor: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenUrl: string;
  imagenes: string[];
  activa: boolean;
};

type DatosAdmin = {
  reportes: ReporteAdmin[];
  comunicados: ComunicadoAdmin[];
  aves: AveAdmin[];
  publicaciones: PublicacionAdmin[];
};

type NuevoComunicadoAdmin = {
  titulo: string;
  descripcion: string;
  fecha: string;
  imagen: File | null;
};

type NuevaAveAdmin = {
  nombre: string;
  nombreCientifico: string;
  etiqueta: string;
  caracteristicas: string;
  descripcion: string;
  atributos: AtributoAveAdmin[];
  imagenes: File[];
};

export type {
  AtributoAveAdmin,
  AveAdmin,
  ComunicadoAdmin,
  DatosAdmin,
  EstadoReporteAdmin,
  NuevaAveAdmin,
  NuevoComunicadoAdmin,
  PublicacionAdmin,
  ReporteAdmin,
  SesionAdmin,
  UsuarioAdmin,
};
