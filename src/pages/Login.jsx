import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Aperture, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }
      login(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      paddingTop: 64,
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 55%, #241a0d 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60,
            height: 60,
            background: "rgba(181,112,42,0.12)",
            border: "1px solid rgba(181,112,42,0.25)",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 18px",
          }}>
            <Aperture size={28} color="#b5702a" />
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f5efe6", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Вход в аккаунт
          </h1>
          <p style={{ color: "rgba(245,239,230,0.4)", fontSize: "0.9rem" }}>
            LUMINAS · Фотостудия
          </p>
        </div>

        <div style={{
          background: "#fff",
          borderRadius: 20,
          padding: "36px 32px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        }}>
          {error && (
            <div style={{
              marginBottom: 18,
              padding: "12px 16px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              color: "#dc2626",
              fontSize: "0.875rem",
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Email
              </label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.ru" className="input" autoComplete="email"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Пароль
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"} required value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" className="input"
                  style={{ paddingRight: 44 }} autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#9a8a76", padding: 2,
                }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{
              width: "100%", justifyContent: "center", marginTop: 4,
              padding: "13px", fontSize: "0.95rem", opacity: loading ? 0.7 : 1,
            }}>
              <LogIn size={17} /> {loading ? "Входим..." : "Войти"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#9a8a76", marginTop: 20 }}>
            Нет аккаунта?{" "}
            <Link to="/register" style={{ color: "#b5702a", fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
