import { Truck } from "lucide-react";

type LoadingScreenProps = {
  /** Texto principal exibido abaixo da animacao. */
  message?: string;
  /** Linha de apoio, em tom mais discreto. */
  detail?: string;
  /**
   * "page": ocupa a area de conteudo entre o header e o footer.
   * "overlay": cobre a tela inteira, bloqueando interacao (ex.: pagamento em andamento).
   */
  variant?: "page" | "overlay";
};

export function LoadingScreen({
  message = "Carregando",
  detail = "Preparando a rota para você...",
  variant = "page",
}: LoadingScreenProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className="loading-appear flex flex-col items-center text-center px-4"
    >
      {/* Caminhao sobre a estrada */}
      <div className="relative w-64 max-w-full mb-8">
        <div className="loading-truck relative z-10 mx-auto w-fit bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-600/30">
          <Truck className="w-9 h-9 text-white" aria-hidden="true" />
        </div>
        <div className="relative h-6 -mt-1 rounded-full bg-gray-800 overflow-hidden">
          <div className="loading-road absolute inset-0" />
        </div>
      </div>

      <div className="font-bold text-2xl text-gray-900">
        ESCORT<span className="text-orange-600">in</span>Road
      </div>
      <p className="mt-3 font-bold text-gray-900">{message}</p>
      <p className="text-sm text-gray-600">{detail}</p>

      {/* Barra de progresso indeterminada */}
      <div className="mt-6 w-48 h-1.5 rounded-full bg-orange-100 overflow-hidden">
        <div className="loading-progress h-full w-2/5 rounded-full bg-orange-600" />
      </div>
    </div>
  );

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-white/90 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100vh-220px)] bg-gray-50 flex items-center justify-center py-16">
      {content}
    </section>
  );
}
