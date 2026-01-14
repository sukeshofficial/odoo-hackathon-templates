import { useAuth } from "../context/useAuth";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="card">
        <h3>User Profile</h3>
        <p><strong>Email:</strong> {user?.email || "—"}</p>
        <p><strong>User ID:</strong> {user?.userId || user?.id}</p>
      </div>

      <div className="card muted">
        <p>More features coming here…</p>
      </div>
    </div>
  );
}
