import CartillaAve from "../ui/CartillaAve";

type AveRegistrada = {
  id: number;
  nombre: string;
  imagenUrl: string;
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
      {aves.map((ave) => (
        <CartillaAve
          key={ave.id}
          estado={ave.encontrada ? "encontrada" : "noEncontrada"}
          nombre={ave.nombre}
          imagenUrl={ave.imagenUrl}
          onClick={onSeleccionarAve ? () => onSeleccionarAve(ave) : undefined}
        />
      ))}
    </section>
  );
}

export default SeccionRegistrados;
export type { AveRegistrada };
