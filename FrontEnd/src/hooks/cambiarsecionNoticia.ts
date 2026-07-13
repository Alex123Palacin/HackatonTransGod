import { useState } from "react";

type SecionNoticia = "comunicados" | "publicaciones";

function useCambiarSecionNoticia(secionInicial: SecionNoticia = "comunicados") {
  const [secionActiva, setSecionActiva] = useState<SecionNoticia>(secionInicial);

  function cambiarSecion(nuevaSecion: SecionNoticia) {
    setSecionActiva(nuevaSecion);
  }

  return {
    secionActiva,
    cambiarSecion,
    esComunicados: secionActiva === "comunicados",
    esPublicaciones: secionActiva === "publicaciones",
  };
}

export { useCambiarSecionNoticia };
export type { SecionNoticia };
