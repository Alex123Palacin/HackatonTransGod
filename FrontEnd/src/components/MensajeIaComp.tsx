function horaMensaje(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

function MensajeIaComp({ mensaje, fecha }: { mensaje: string; fecha: string }) {
  return (
    <article className="max-w-[285px] rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-3 text-[13px] leading-5 text-slate-700 shadow-md">
      <p className="whitespace-pre-wrap">{mensaje}</p>
      <time className="mt-2 block text-right text-[10px] text-slate-500">
        {horaMensaje(fecha)}
      </time>
    </article>
  );
}

export default MensajeIaComp;
