type ResumenCatalogoApi = {
  encontradas: number;
  total: number;
  porcentaje: number;
};

type AveCatalogoApi = {
  id_ave: number;
  nombre: string;
  nombre_cientifico: string;
  imagen_principal: string | null;
  encontrada: boolean;
};

type FotoAveApi = {
  id_foto: number;
  imagen: string;
  descripcion: string;
  es_principal: boolean;
};

type AtributoDestacadoApi = {
  id: number;
  texto: string;
};

type DetalleCaracteristicaApi = {
  id: number | string;
  etiqueta: string;
  descripcion: string;
};

type DetalleAveApi = {
  id_ave: number;
  nombre: string;
  nombre_cientifico: string;
  descripcion: string;
  encontrada: boolean;
  fotos: FotoAveApi[];
  atributos_destacados: AtributoDestacadoApi[];
  detalles: DetalleCaracteristicaApi[];
};

type AveDesconocidaApi = {
  id_escaneo: number;
  imagen: string;
  fecha: string;
};

export type {
  AveCatalogoApi,
  AveDesconocidaApi,
  DetalleAveApi,
  ResumenCatalogoApi,
};
