type LoadingScreenProps = {
  /** Texto principal exibido abaixo do spinner. */
  message?: string;
  /** Linha de apoio, em tom mais discreto. Omitida quando nao ha o que explicar. */
  detail?: string;
  /**
   * "page": ocupa a area de conteudo (primeira carga do app).
   * "overlay": cobre a tela e bloqueia interacao (ex.: pagamento em andamento).
   */
  variant?: "page" | "overlay";
};

/**
 * Uma animacao so, e nenhuma marca piscando: telas de espera aparecem por
 * fracoes de segundo, e qualquer coisa alem de um spinner sobra na tela.
 */
export function LoadingScreen({ message = "Carregando", detail, variant = "page" }: LoadingScreenProps) {
  const content = (
    <div
      role="status"
      aria-live="polite"
      className="loading-appear flex flex-col items-center text-center px-4"
    >
      <div className="loading-spinner w-10 h-10 rounded-full border-[3px] border-gray-200 border-t-orange-600" />
      <p className="mt-5 font-bold text-gray-900">{message}</p>
      {detail && <p className="mt-1 text-sm text-gray-600">{detail}</p>}
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
