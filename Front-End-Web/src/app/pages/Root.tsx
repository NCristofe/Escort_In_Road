import { Suspense } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LoadingScreen } from "../components/LoadingScreen";

export function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/*
         * A key por rota monta uma boundary nova a cada navegacao. Sem ela, como o
         * React Router navega dentro de uma transicao, a pagina anterior ficaria
         * congelada na tela enquanto o chunk da proxima baixa, sem feedback nenhum.
         */}
        <Suspense key={location.pathname} fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
