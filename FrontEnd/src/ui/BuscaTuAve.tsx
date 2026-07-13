import { FaSearch } from "react-icons/fa";

type BuscaTuAveProps = {
  valor?: string;
  placeholder?: string;
  onChange?: (valor: string) => void;
};

function BuscaTuAve({
  valor = "",
  placeholder = "Buscar aves...",
  onChange,
}: BuscaTuAveProps) {
  return (
    <label className="flex h-12 w-full items-center gap-3 rounded-full bg-white px-5 font-[Arial] shadow-sm">
      <FaSearch className="h-5 w-5 shrink-0 text-gray-500" />
      <input
        type="text"
        value={valor}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[20px] text-[#006f6c] outline-none placeholder:text-gray-500 [overflow-wrap:normal] [word-break:normal]"
      />
    </label>
  );
}

export default BuscaTuAve;
