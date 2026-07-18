import CartillaAve from "../ui/CartillaAve";

type AveDesconocida = {
  id: number;
  fecha: string;
  imagenUrl: string;
};

type SecicionDesconocidosProps = {
  aves: AveDesconocida[];
};

function SecicionDesconocidos({ aves }: SecicionDesconocidosProps) {
  return (
    <section className="grid grid-cols-3 gap-2">
      {aves.length === 0 && (
        <p className="col-span-3 py-8 text-center text-[12px] text-slate-500">
          No tienes escaneos desconocidos.
        </p>
      )}
      {aves.map((ave) => (
        <CartillaAve
          key={ave.id}
          estado="desconocido"
          fecha={ave.fecha}
          imagenUrl={ave.imagenUrl}
        />
      ))}
    </section>
  );
}

export default SecicionDesconocidos;
export type { AveDesconocida };
