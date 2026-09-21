import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Tracking } from "./pages/Tracking";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { Careers } from "./pages/Careers";
import { Clients } from "./pages/Clients";
import { Coverage } from "./pages/Coverage";
import { FAQ } from "./pages/FAQ";
import { Quote } from "./pages/Quote";
import { CargoRegistration } from "./pages/CargoRegistration";
import { BulkUpload } from "./pages/BulkUpload";
import { OperationalMap } from "./pages/OperationalMap";
import { DocumentAdmin } from "./pages/DocumentAdmin";
import { UserManagement } from "./pages/UserManagement";
import { Subscription } from "./pages/Subscription";
import { PlanManagement } from "./pages/PlanManagement";
import { ApiKeys } from "./pages/ApiKeys";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Technology } from "./pages/Technology";
import { Units } from "./pages/Units";
import { PrivacyPolicy, TermsOfUse } from "./pages/Legal";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "sobre", element: <About /> },
      { path: "servicos", element: <Services /> },
      { path: "servicos/:slug", element: <ServiceDetail /> },
      { path: "rastreamento", element: <Tracking /> },
      { path: "cobertura", element: <Coverage /> },
      { path: "tecnologia", element: <Technology /> },
      { path: "clientes", element: <Clients /> },
      { path: "faq", element: <FAQ /> },
      { path: "cotacao", element: <Quote /> },
      { path: "login", element: <Login /> },
      { path: "cadastro", element: <Register /> },
      { path: "cadastro-cargas", element: <ProtectedRoute roles={["admin", "empresa"]}><CargoRegistration /></ProtectedRoute> },
      { path: "gestao-lotes", element: <ProtectedRoute roles={["admin", "empresa"]}><BulkUpload /></ProtectedRoute> },
      { path: "mapa-operacional", element: <ProtectedRoute><OperationalMap /></ProtectedRoute> },
      { path: "admin-documentos", element: <ProtectedRoute roles={["admin"]}><DocumentAdmin /></ProtectedRoute> },
      { path: "admin-usuarios", element: <ProtectedRoute roles={["admin"]}><UserManagement /></ProtectedRoute> },
      { path: "checkout-assinatura", element: <ProtectedRoute roles={["empresa"]}><Subscription /></ProtectedRoute> },
      { path: "gestao-planos", element: <ProtectedRoute roles={["empresa"]}><PlanManagement /></ProtectedRoute> },
      { path: "chaves-api", element: <ProtectedRoute roles={["empresa"]}><ApiKeys /></ProtectedRoute> },
      { path: "trabalhe-conosco", element: <Careers /> },
      { path: "blog", element: <Blog /> },
      { path: "unidades", element: <Units /> },
      { path: "contato", element: <Contact /> },
      { path: "politica-de-privacidade", element: <PrivacyPolicy /> },
      { path: "termos-de-uso", element: <TermsOfUse /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
