import { lazy, type ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { ProtectedRoute } from "./auth/ProtectedRoute";

/**
 * Cada pagina vira um chunk proprio e so e baixada quando a rota e acessada.
 * Enquanto o chunk chega, o <Suspense> do Root exibe o LoadingScreen.
 */
function page<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

const Home = page(() => import("./pages/Home"), "Home");
const Services = page(() => import("./pages/Services"), "Services");
const ServiceDetail = page(() => import("./pages/ServiceDetail"), "ServiceDetail");
const Tracking = page(() => import("./pages/Tracking"), "Tracking");
const Contact = page(() => import("./pages/Contact"), "Contact");
const About = page(() => import("./pages/About"), "About");
const Blog = page(() => import("./pages/Blog"), "Blog");
const Careers = page(() => import("./pages/Careers"), "Careers");
const Clients = page(() => import("./pages/Clients"), "Clients");
const Coverage = page(() => import("./pages/Coverage"), "Coverage");
const FAQ = page(() => import("./pages/FAQ"), "FAQ");
const Quote = page(() => import("./pages/Quote"), "Quote");
const CargoRegistration = page(() => import("./pages/CargoRegistration"), "CargoRegistration");
const BulkUpload = page(() => import("./pages/BulkUpload"), "BulkUpload");
const OperationalMap = page(() => import("./pages/OperationalMap"), "OperationalMap");
const DocumentAdmin = page(() => import("./pages/DocumentAdmin"), "DocumentAdmin");
const EsgDashboard = page(() => import("./pages/EsgDashboard"), "EsgDashboard");
const SubscriptionCheckout = page(() => import("./pages/SubscriptionCheckout"), "SubscriptionCheckout");
const PlanManagement = page(() => import("./pages/PlanManagement"), "PlanManagement");
const ApiKeys = page(() => import("./pages/ApiKeys"), "ApiKeys");
const FreightSavings = page(() => import("./pages/FreightSavings"), "FreightSavings");
const FleetPerformance = page(() => import("./pages/FleetPerformance"), "FleetPerformance");
const UserManagement = page(() => import("./pages/UserManagement"), "UserManagement");
const Login = page(() => import("./pages/Login"), "Login");
const Register = page(() => import("./pages/Register"), "Register");
const Technology = page(() => import("./pages/Technology"), "Technology");
const Units = page(() => import("./pages/Units"), "Units");
const PrivacyPolicy = page(() => import("./pages/Legal"), "PrivacyPolicy");
const TermsOfUse = page(() => import("./pages/Legal"), "TermsOfUse");
const NotFound = page(() => import("./pages/NotFound"), "NotFound");

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
      { path: "painel-esg", element: <ProtectedRoute><EsgDashboard /></ProtectedRoute> },
      { path: "economia-frete", element: <ProtectedRoute><FreightSavings /></ProtectedRoute> },
      { path: "performance", element: <ProtectedRoute><FleetPerformance /></ProtectedRoute> },
      { path: "assinatura", element: <ProtectedRoute roles={["empresa"]}><SubscriptionCheckout /></ProtectedRoute> },
      { path: "planos", element: <ProtectedRoute roles={["empresa"]}><PlanManagement /></ProtectedRoute> },
      { path: "chaves-api", element: <ProtectedRoute roles={["empresa"]}><ApiKeys /></ProtectedRoute> },
      { path: "admin-documentos", element: <ProtectedRoute roles={["admin"]}><DocumentAdmin /></ProtectedRoute> },
      { path: "admin-usuarios", element: <ProtectedRoute roles={["admin"]}><UserManagement /></ProtectedRoute> },
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
