type ReporteApi = {
  id_reporte: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  estado: "PENDIENTE" | "EN_REVISION" | "ATENDIDO" | "RECHAZADO";
  imagen: string | null;
};

type DatosReporte = {
  titulo: string;
  descripcion: string;
  imagen?: File;
};

export type { DatosReporte, ReporteApi };
