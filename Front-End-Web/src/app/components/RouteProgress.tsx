import { useEffect, useState } from "react";
import { useNavigation } from "react-router";

/**
 * Barra fina no topo enquanto a proxima rota carrega.
 *
 * O React Router mantem a pagina atual na tela durante a troca, entao o unico
 * feedback necessario e discreto. A barra so aparece se a navegacao passar de
 * 200ms: no caso normal, em que o chunk vem em poucos milissegundos, a pessoa
 * nao ve indicador nenhum — apenas a pagina nova.
 */
export function RouteProgress() {
  const navigation = useNavigation();
  const pending = navigation.state !== "idle";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!pending) {
      setVisible(false);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), 200);
    return () => window.clearTimeout(timer);
  }, [pending]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Carregando página"
      className="fixed top-0 left-0 right-0 z-[4000] h-0.5 bg-orange-100"
    >
      <div className="route-progress-bar h-full bg-orange-600" />
    </div>
  );
}
