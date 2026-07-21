function horaMensaje(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(fecha));
}

function MensajeUsuarioComp({ mensaje, fecha }: { mensaje: string; fecha: string }) {
  return (
    <article className="ml-auto max-w-[255px] rounded-2xl rounded-tr-sm bg-[#dbeee8] px-4 py-3 text-[13px] leading-5 text-[#0b4f50] shadow-sm">
      <p className="whitespace-pre-wrap">{mensaje}</p>
      <time className="mt-2 block text-right text-[10px] text-slate-500">
        {horaMensaje(fecha)}
      </time>
    </article>
  );
}

export default MensajeUsuarioComp;
