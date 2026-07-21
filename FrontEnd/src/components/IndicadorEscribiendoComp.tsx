function IndicadorEscribiendoComp() {
  return (
    <div
      role="status"
      aria-label="La guia esta escribiendo"
      className="flex w-fit items-center gap-1.5 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-4 py-4 shadow-md"
    >
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#006f6c] [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#006f6c] [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-[#006f6c]" />
    </div>
  );
}

export default IndicadorEscribiendoComp;
