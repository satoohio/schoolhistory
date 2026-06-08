import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ExternalLink, Share2 } from "lucide-react";

export default function Contacts() {
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const info = [
    {
      icon: MapPin,
      label: "Студия",
      value: "г. Москва, ул. Арбат, 12",
      color: "#b5702a",
      bg: "#fdf5ec",
    },
    {
      icon: Phone,
      label: "Телефон",
      value: "+7 (495) 123-45-67",
      color: "#2ea87e",
      bg: "#ecfdf5",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@luminas.ru",
      color: "#7c5cbf",
      bg: "#f5f0ff",
    },
    {
      icon: Clock,
      label: "Режим работы",
      value: "Ежедневно: 10:00 – 20:00",
      color: "#e05a7a",
      bg: "#fff0f3",
    },
  ];

  const services = ["Свадебная съёмка", "Школьная фотосессия", "Личный портрет", "Семейная съёмка", "Другое"];

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
        setSubmitResult({ success: true, message: data.message || "Заявка отправлена! Мы свяжемся с вами в течение часа." });
        setFormData({ name: "", phone: "", service: "", message: "" });
      } else {
        setSubmitResult({ success: false, message: data.error || "Ошибка при отправке" });
      }
    } catch {
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
          background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 60%, #241a0d 100%)",
          padding: "72px 0 68px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "60%",
            transform: "translateY(-50%)",
            width: 280,
            height: 280,
            background: "radial-gradient(circle, rgba(181,112,42,0.10) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div className="wrap" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#b5702a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 14,
            }}
          >
            Запись на съёмку
          </div>
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#f5efe6",
              letterSpacing: "-0.025em",
              marginBottom: 14,
            }}
          >
            Свяжитесь с нами
          </h1>
          <p style={{ color: "rgba(245,239,230,0.40)", fontSize: "1rem" }}>
            Ответим в течение часа и обсудим детали вашей съёмки
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
                padding: "22px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
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
                    color: "#9a8a76",
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
                    color: "#1a1208",
                    fontSize: "0.95rem",
                  }}
                >
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social quick links */}
        <div
          className="card"
          style={{ padding: "20px 24px", marginBottom: 28, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
        >
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4a3f32" }}>Также пишите нам:</span>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { icon: ExternalLink, label: "Instagram", color: "#c13584" },
              { icon: Share2, label: "Telegram", color: "#2AABEE" },
            ].map(({ icon: Icon, label, color }) => (
              <a
                key={label}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #ede9e2",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color,
                  background: "#fff",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ede9e2")}
              >
                <Icon size={15} /> {label}
              </a>
            ))}
          </div>
        </div>

        {/* Booking form */}
        <div className="card" style={{ padding: "36px 40px" }}>
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1a1208",
              marginBottom: 6,
            }}
          >
            Оставить заявку
          </h2>
          <p style={{ color: "#9a8a76", fontSize: "0.875rem", marginBottom: 28 }}>
            Укажите удобное время — перезвоним и всё обсудим
          </p>

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
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
              className="form-row"
            >
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                  Ваше имя
                </label>
                <input
                  type="text"
                  placeholder="Анна Иванова"
                  required
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={submitting}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                  Телефон
                </label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  required
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Вид съёмки
              </label>
              <select
                className="input"
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                disabled={submitting}
                style={{ cursor: "pointer" }}
              >
                <option value="">Выберите категорию...</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Пожелания и детали
              </label>
              <textarea
                rows={4}
                placeholder="Расскажите о своей идее, желаемой дате, месте съёмки..."
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
                      display: "inline-block",
                    }} />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send size={17} />
                    Отправить заявку
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
