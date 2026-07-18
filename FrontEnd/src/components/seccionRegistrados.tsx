import CartillaAve from "../ui/CartillaAve";

type AveRegistrada = {
  id: number;
  nombre: string;
  imagenUrl: string | null;
  encontrada: boolean;
};

type SeccionRegistradosProps = {
  aves: AveRegistrada[];
  onSeleccionarAve?: (ave: AveRegistrada) => void;
};

function SeccionRegistrados({
  aves,
  onSeleccionarAve,
}: SeccionRegistradosProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      {aves.length === 0 && (
        <p className="col-span-3 py-8 text-center text-[12px] text-slate-500">
          No se encontraron aves con ese nombre.
        </p>
      )}
      {aves.map((ave) => (
        <CartillaAve
          key={ave.id}
          estado={ave.encontrada ? "encontrada" : "noEncontrada"}
          nombre={ave.nombre}
          imagenUrl={ave.imagenUrl}
          onClick={
            ave.encontrada && onSeleccionarAve
              ? () => onSeleccionarAve(ave)
              : undefined
          }
        />
      ))}
    </section>
  );
}

export default SeccionRegistrados;
export type { AveRegistrada };
