import { type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { type Role } from "./auth/AuthContext";

/**
 * Cada pagina vira um chunk proprio, carregado pelo `lazy` do React Router.
 *
 * Diferente de React.lazy + Suspense, o router nao desmonta a pagina atual ao
 * iniciar a navegacao: ela fica na tela enquanto o chunk da proxima baixa e a
 * troca acontece de uma vez. Nada esvazia nem salta no meio do caminho, e o
 * unico feedback e a <RouteProgress />, que aparece so em carga demorada.
 */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return async () => ({ Component: (await load())[name] });
}

/** Igual ao `page`, mas exige sessao e, quando informado, um dos perfis. */
function protectedPage<K extends string>(
  load: () => Promise<Record<K, ComponentType>>,
  name: K,
  roles?: Role[],
) {
  return async () => {
    const Page: ComponentType = (await load())[name];

    return {
      Component: () => (
        <ProtectedRoute roles={roles}>
          <Page />
        </ProtectedRoute>
      ),
    };
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // Primeira carga do app: o chunk da rota inicial ainda esta vindo.
    hydrateFallbackElement: <LoadingScreen />,
    children: [
      { index: true, lazy: page(() => import("./pages/Home"), "Home") },
      { path: "sobre", lazy: page(() => import("./pages/About"), "About") },
      { path: "servicos", lazy: page(() => import("./pages/Services"), "Services") },
      { path: "servicos/:slug", lazy: page(() => import("./pages/ServiceDetail"), "ServiceDetail") },
      { path: "rastreamento", lazy: page(() => import("./pages/Tracking"), "Tracking") },
      { path: "cobertura", lazy: page(() => import("./pages/Coverage"), "Coverage") },
      { path: "tecnologia", lazy: page(() => import("./pages/Technology"), "Technology") },
      { path: "clientes", lazy: page(() => import("./pages/Clients"), "Clients") },
      { path: "faq", lazy: page(() => import("./pages/FAQ"), "FAQ") },
      { path: "login", lazy: page(() => import("./pages/Login"), "Login") },
      { path: "cadastro", lazy: page(() => import("./pages/Register"), "Register") },
      { path: "trabalhe-conosco", lazy: page(() => import("./pages/Careers"), "Careers") },
      { path: "blog", lazy: page(() => import("./pages/Blog"), "Blog") },
      { path: "unidades", lazy: page(() => import("./pages/Units"), "Units") },
      { path: "contato", lazy: page(() => import("./pages/Contact"), "Contact") },
      { path: "politica-de-privacidade", lazy: page(() => import("./pages/Legal"), "PrivacyPolicy") },
      { path: "termos-de-uso", lazy: page(() => import("./pages/Legal"), "TermsOfUse") },

      { path: "cotacao", lazy: protectedPage(() => import("./pages/Quote"), "Quote") },
      {
        path: "cadastro-cargas",
        lazy: protectedPage(() => import("./pages/CargoRegistration"), "CargoRegistration", ["admin", "empresa"]),
      },
      {
        path: "gestao-lotes",
        lazy: protectedPage(() => import("./pages/BulkUpload"), "BulkUpload", ["admin", "empresa"]),
      },
      {
        path: "mapa-operacional",
        lazy: protectedPage(() => import("./pages/OperationalMap"), "OperationalMap"),
      },
      {
        path: "painel-esg",
        lazy: protectedPage(() => import("./pages/EsgDashboard"), "EsgDashboard", ["admin", "empresa"]),
      },
      {
        path: "economia-frete",
        lazy: protectedPage(() => import("./pages/FreightSavings"), "FreightSavings", ["admin", "empresa"]),
      },
      {
        path: "performance",
        lazy: protectedPage(() => import("./pages/FleetPerformance"), "FleetPerformance", ["admin", "empresa"]),
      },
      {
        path: "assinatura",
        lazy: protectedPage(() => import("./pages/SubscriptionCheckout"), "SubscriptionCheckout", ["empresa"]),
      },
      {
        path: "planos",
        lazy: protectedPage(() => import("./pages/PlanManagement"), "PlanManagement", ["empresa"]),
      },
      {
        path: "chaves-api",
        lazy: protectedPage(() => import("./pages/ApiKeys"), "ApiKeys", ["empresa"]),
      },
      {
        path: "admin-documentos",
        lazy: protectedPage(() => import("./pages/DocumentAdmin"), "DocumentAdmin", ["admin"]),
      },
      {
        path: "admin-usuarios",
        lazy: protectedPage(() => import("./pages/UserManagement"), "UserManagement", ["admin"]),
      },
      { path: "configuracoes", lazy: protectedPage(() => import("./pages/Settings"), "Settings") },

      { path: "*", lazy: page(() => import("./pages/NotFound"), "NotFound") },
    ],
  },
]);
