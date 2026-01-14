import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { logoutUser } from "../api/auth";
import "../styles/navbar.css";
import avatar from "../assets/avatar-placeholder.png";

export default function Navbar() {
  const { user, setUser } = useAuth();
  console.log("NAVBAR USER:", user);
  const navigate = useNavigate();

  const avatarUrl = user?.profile_photo
    ? `http://localhost:5000${user.profile_photo}`
    : avatar;

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
      <div className="brand">
        <Link to="/">ForgeGrid</Link>
      </div>

      <div className="links">
        {user ? (
          <>
            <img src={avatarUrl} alt="avatar" className="navbar-avatar" />
            <span className="user-email">
              {user.name}
            </span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
