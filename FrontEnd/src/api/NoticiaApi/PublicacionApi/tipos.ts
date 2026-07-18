type PublicacionApi = {
  id_publicacion: number;
  autor: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  imagenes: string[];
};

type DatosPublicacion = {
  titulo: string;
  descripcion: string;
  imagenes: File[];
};

export type { DatosPublicacion, PublicacionApi };
