import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { logoutUser } from "../api/auth";
import "../styles/navbar.css";

import logo from "../assets/ForgeGrid.svg";
import avatarPlaceholder from "../assets/avatar-placeholder.png";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const avatarUrl = user?.profile_photo
    ? `http://localhost:5000${user.profile_photo}`
    : avatarPlaceholder;

  useEffect(() => {
    const escHandler = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      navigate("/login");
      setMenuOpen(false);
    }
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Team", to: "/team" },
    { label: "Services", to: "/services" },
    { label: "Product", to: "/product" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      <header className="glass-navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo">
            <img src={logo} alt="ForgeGrid" className="logo-img" />
            <span className="logo-text">ForgeGrid</span>
          </div>

          {/* Desktop Menu */}
          <nav className="navbar-links">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: user area + hamburger */}
          <div className="navbar-right">
            {/* Desktop user area */}
            <div className="user-area desktop-only">
              <img src={avatarUrl} alt="avatar" className="user-avatar" />
              <span className="user-name">{user?.name ?? "Guest"}</span>
              {user ? (
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="login-link">
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger (tablet/mobile) */}
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">

          <div className="mobile-links">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="mobile-link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mobile-divider" />

          <div className="mobile-user">
            <img src={avatarUrl} alt="avatar" className="mobile-avatar" />
            <div className="mobile-user-info">
              <div className="mobile-user-name">{user?.name ?? "Guest"}</div>
              {user ? (
                <button className="mobile-logout" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="mobile-login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
