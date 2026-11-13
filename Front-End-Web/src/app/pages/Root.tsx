import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { RouteProgress } from "../components/RouteProgress";

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <RouteProgress />
      <Header />
      <main className="flex-1">
        {/*
         * A key muda a cada rota, o que remonta o conteudo e dispara a animacao
         * de entrada. Sem isso a pagina nova apareceria num corte seco.
         */}
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      {/*
       * Leva a pagina nova para o topo e devolve a altura antiga no voltar do
       * navegador. Sem isto, clicar num link com a pagina rolada abre a proxima
       * no meio do conteudo.
       */}
      <ScrollRestoration />
    </div>
  );
}
