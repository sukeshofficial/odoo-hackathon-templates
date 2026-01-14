import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { logoutUser } from "../api/auth";
import "../styles/navbar.css";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="brand"><Link to="/">AuthApp</Link></div>

      <div className="links">
        {user ? (
          <>
            <span className="user-email">{user.email || user.name || user.userId}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
