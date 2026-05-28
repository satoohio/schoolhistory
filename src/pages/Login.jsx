import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Eye, EyeOff, LogIn } from "lucide-react";

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
    <div
      style={{
        paddingTop: 64,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #fafbff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, #1d4ed8, #4f46e5)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(29,78,216,0.3)",
            }}
          >
            <GraduationCap size={26} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 6,
            }}
          >
            Вход в систему
          </h1>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
            Гимназия №11 · Личный кабинет
          </p>
        </div>

        <div className="card" style={{ padding: "36px 32px" }}>
          {error && (
            <div
              style={{
                marginBottom: 18,
                padding: "12px 16px",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 10,
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 7,
                }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.ru"
                className="input"
                autoComplete="email"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 7,
                }}
              >
                Пароль
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    padding: 2,
                  }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: 4,
                padding: "13px",
                fontSize: "0.95rem",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <LogIn size={17} /> {loading ? "Входим..." : "Войти"}
            </button>
          </form>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#64748b",
              marginTop: 20,
            }}
          >
            Нет аккаунта?{" "}
            <Link to="/register" style={{ color: "#1d4ed8", fontWeight: 600 }}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
