import { useNavigate } from "react-router-dom";

function useRedireccion() {
  const navigate = useNavigate();

  function redirigir(ruta: string) {
    navigate(ruta);
  }

  return { redirigir };
}

export { useRedireccion };
