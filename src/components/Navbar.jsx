import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  X,
  Camera,
  LogOut,
  Settings,
  User,
  ChevronDown,
  Aperture,
} from "lucide-react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest("#user-menu")) setDropdown(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
    setDropdown(false);
  };

  const links = [
    { to: "/", label: "Главная" },
    { to: "/gallery", label: "Галерея" },
    { to: "/about", label: "О студии" },
    { to: "/contacts", label: "Контакты" },
  ];

  const GOLD = "#b5702a";
  const GOLD_BG = "#fdf5ec";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(250,248,245,0.97)" : "rgba(250,248,245,0.97)",
        boxShadow: scrolled
          ? "0 2px 20px rgba(0,0,0,0.10)"
          : "0 1px 0 rgba(181,112,42,0.12)",
        backdropFilter: "blur(16px)",
        transition: "box-shadow 0.3s",
      }}
    >
      <div
        className="wrap"
        style={{
          display: "flex",
          alignItems: "center",
          height: "64px",
          gap: "8px",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "#1a1208",
            marginRight: "8px",
            flexShrink: 0,
            letterSpacing: "-0.03em",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#1a1208",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Aperture size={19} color={GOLD} />
          </div>
          <span className="logo-text">
            LUMINAS
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{ display: "flex", gap: "2px", flex: 1 }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              style={({ isActive }) => ({
                padding: "7px 14px",
                borderRadius: 9,
                fontSize: "0.875rem",
                fontWeight: 500,
                color: isActive ? GOLD : "#4a3f32",
                background: isActive ? GOLD_BG : "transparent",
                transition: "all 0.15s",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes("fdf5ec"))
                  e.currentTarget.style.background = "#f5f0e8";
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes("fdf5ec"))
                  e.currentTarget.style.background = "transparent";
              }}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Auth */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
          className="desktop-auth"
        >
          {user ? (
            <div id="user-menu" style={{ position: "relative" }}>
              <button
                onClick={() => setDropdown(!dropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 12px",
                  borderRadius: 10,
                  border: "1.5px solid #e5ddd3",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: GOLD_BG,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={14} color={GOLD} />
                </div>
                {user.name}
                <ChevronDown size={13} color="#94a3b8" />
              </button>
              {dropdown && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 6px)",
                    width: 200,
                    background: "#fff",
                    borderRadius: 12,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.13)",
                    border: "1px solid #f0ebe3",
                    overflow: "hidden",
                    zIndex: 200,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid #f0ebe3",
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                    }}
                  >
                    {user.email}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdown(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 14px",
                        fontSize: "0.875rem",
                        color: "#374151",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#faf8f5")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <Settings size={14} /> Панель админа
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      fontSize: "0.875rem",
                      color: "#ef4444",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#fff5f5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <LogOut size={14} /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#4a3f32",
                  border: "1.5px solid #e5ddd3",
                  background: "#fff",
                }}
              >
                Войти
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "8px 18px",
                  borderRadius: 10,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#fff",
                  background: "#1a1208",
                }}
              >
                Записаться
              </Link>
            </>
          )}
        </div>

        {/* Burger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="burger-btn"
          style={{
            display: "none",
            padding: "8px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "#1a1208",
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid #ede9e2",
            background: "#faf8f5",
            padding: "12px 16px 16px",
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                display: "block",
                padding: "10px 14px",
                borderRadius: 9,
                marginBottom: 2,
                fontSize: "0.9rem",
                fontWeight: 500,
                color: isActive ? GOLD : "#4a3f32",
                background: isActive ? GOLD_BG : "transparent",
              })}
            >
              {l.label}
            </NavLink>
          ))}
          <div
            style={{
              borderTop: "1px solid #ede9e2",
              marginTop: 8,
              paddingTop: 12,
            }}
          >
            {user ? (
              <>
                <div
                  style={{
                    padding: "8px 14px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#374151",
                  }}
                >
                  {user.name}
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      color: GOLD,
                      fontSize: "0.875rem",
                    }}
                  >
                    Панель админа
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: "0.875rem",
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Выйти
                </button>
              </>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "10px",
                    border: "1.5px solid #e5ddd3",
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#4a3f32",
                  }}
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "10px",
                    background: "#1a1208",
                    borderRadius: 10,
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#fff",
                  }}
                >
                  Записаться
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-auth { display: none !important; }
          .burger-btn { display: flex !important; margin-left: auto; }
          .logo-text { display: block !important; }
        }
        @media (min-width: 769px) {
          .logo-text { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
