import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Spinner } from "./ui";

export function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="center-screen"><Spinner /></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" replace />;
  return <Outlet />;
}
