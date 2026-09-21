import { Navigate, useLocation } from "react-router";
import { useAuth, type Role } from "./AuthContext";

type ProtectedRouteProps = {
  children: JSX.Element;
  roles?: Role[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }

  return children;
}
