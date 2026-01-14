import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Checking authentication...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
