import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function Contacts() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success: boolean, message: string }

  const info = [
    {
      icon: MapPin,
      label: "Адрес",
      value: "г. Москва, ул. Школьная, д. 1",
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      icon: Phone,
      label: "Телефон",
      value: "+7 (495) 000-00-00",
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      icon: Mail,
      label: "Email",
      value: "school@example.ru",
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      icon: Clock,
      label: "Режим работы",
      value: "Пн–Пт: 8:00 – 18:00",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: data.message || "Сообщение отправлено!" });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitResult({ success: false, message: data.error || "Ошибка при отправке" });
      }
    } catch (err) {
      setSubmitResult({ success: false, message: "Ошибка сети. Попробуйте позже." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f4c75 0%, #1b6ca8 100%)",
          padding: "64px 0 60px",
        }}
      >
        <div className="wrap" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#7dd3fc",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            Мы всегда на связи
          </div>
          <h1
            style={{
              fontSize: "2.4rem",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            Контакты
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
            Ответим на все ваши вопросы
          </p>
        </div>
      </div>

      <div className="wrap-sm" style={{ padding: "56px 24px 72px" }}>
        {/* Info cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 14,
            marginBottom: 40,
          }}
          className="contacts-grid"
        >
          {info.map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="card"
              style={{
                padding: "24px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background: bg,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={20} color={color} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.73rem",
                    fontWeight: 600,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "0.95rem",
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="card" style={{ padding: "36px 40px" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 24,
            }}
          >
            Написать нам
          </h2>

          {/* Result message */}
          {submitResult && (
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 10,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: submitResult.success ? "#ecfdf5" : "#fef2f2",
                border: `1px solid ${submitResult.success ? "#a7f3d0" : "#fecaca"}`,
              }}
            >
              {submitResult.success ? (
                <CheckCircle size={20} color="#10b981" />
              ) : (
                <AlertCircle size={20} color="#ef4444" />
              )}
              <span
                style={{
                  color: submitResult.success ? "#065f46" : "#991b1b",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {submitResult.message}
              </span>
            </div>
          )}

          <form
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
            onSubmit={handleSubmit}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
              className="form-row"
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
                  Ваше имя
                </label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={submitting}
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
                  Email
                </label>
                <input
                  type="email"
                  placeholder="ivan@example.ru"
                  required
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={submitting}
                />
              </div>
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
                Сообщение
              </label>
              <textarea
                rows={5}
                placeholder="Ваш вопрос или предложение..."
                required
                className="input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? (
                  <>
                    <span style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Отправить сообщение
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contacts-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
