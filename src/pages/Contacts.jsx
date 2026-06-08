import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, ExternalLink, Share2 } from "lucide-react";

const DEFAULT_INFO = {
  address: "г. Москва, ул. Арбат, 12",
  phone: "+7 (495) 123-45-67",
  email: "hello@luminas.ru",
  hours: "Ежедневно: 10:00 – 20:00",
  intro: "Ответим в течение часа и обсудим детали вашей съёмки",
  telegram: "",
  instagram: "",
};

export default function Contacts() {
  const [pageData, setPageData] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    fetch("/api/pages/contacts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPageData(d))
      .catch(() => {});
  }, []);

  function parseInfo(pd) {
    if (!pd) return DEFAULT_INFO;
    try {
      const parsed = JSON.parse(pd.content);
      return { ...DEFAULT_INFO, ...parsed };
    } catch {
      return DEFAULT_INFO;
    }
  }

  const info = parseInfo(pageData);
  const pageTitle = pageData?.title || "Свяжитесь с нами";

  const infoCards = [
    { icon: MapPin, label: "Студия",        value: info.address, color: "#b5702a", bg: "#fdf5ec" },
    { icon: Phone,  label: "Телефон",       value: info.phone,   color: "#2ea87e", bg: "#ecfdf5" },
    { icon: Mail,   label: "Email",         value: info.email,   color: "#7c5cbf", bg: "#f5f0ff" },
    { icon: Clock,  label: "Режим работы",  value: info.hours,   color: "#e05a7a", bg: "#fff0f3" },
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
      <div style={{
        background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 60%, #241a0d 100%)",
        padding: "72px 0 68px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "60%",
          transform: "translateY(-50%)", width: 280, height: 280,
          background: "radial-gradient(circle, rgba(181,112,42,0.10) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div className="wrap" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            fontSize: "0.78rem", fontWeight: 600, color: "#b5702a",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14,
          }}>
            Запись на съёмку
          </div>
          <h1 style={{
            fontSize: "2.6rem", fontWeight: 800, color: "#f5efe6",
            letterSpacing: "-0.025em", marginBottom: 14,
          }}>
            {pageTitle}
          </h1>
          <p style={{ color: "rgba(245,239,230,0.40)", fontSize: "1rem" }}>
            {info.intro}
          </p>
        </div>
      </div>

      <div className="wrap-sm" style={{ padding: "56px 24px 72px" }}>
        {/* Info cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
          gap: 14, marginBottom: 40,
        }} className="contacts-grid">
          {infoCards.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="card" style={{ padding: "22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 44, height: 44, background: bg, borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <div style={{
                  fontSize: "0.73rem", fontWeight: 600, color: "#9a8a76",
                  textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4,
                }}>
                  {label}
                </div>
                <div style={{ fontWeight: 600, color: "#1a1208", fontSize: "0.95rem" }}>
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Social links */}
        {(info.instagram || info.telegram) && (
          <div className="card" style={{
            padding: "20px 24px", marginBottom: 28,
            display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4a3f32" }}>Также пишите нам:</span>
            <div style={{ display: "flex", gap: 10 }}>
              {info.instagram && (
                <a href={info.instagram} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #ede9e2",
                    fontSize: "0.82rem", fontWeight: 600, color: "#c13584", background: "#fff",
                  }}>
                  <ExternalLink size={15} /> Instagram
                </a>
              )}
              {info.telegram && (
                <a href={info.telegram} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 14px", borderRadius: 8, border: "1.5px solid #ede9e2",
                    fontSize: "0.82rem", fontWeight: 600, color: "#2AABEE", background: "#fff",
                  }}>
                  <Share2 size={15} /> Telegram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Booking form */}
        <div className="card" style={{ padding: "36px 40px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1208", marginBottom: 6 }}>
            Оставить заявку
          </h2>
          <p style={{ color: "#9a8a76", fontSize: "0.875rem", marginBottom: 28 }}>
            Укажите удобное время — перезвоним и всё обсудим
          </p>

          {submitResult && (
            <div style={{
              padding: "14px 18px", borderRadius: 10, marginBottom: 20,
              display: "flex", alignItems: "center", gap: 10,
              background: submitResult.success ? "#ecfdf5" : "#fef2f2",
              border: `1px solid ${submitResult.success ? "#a7f3d0" : "#fecaca"}`,
            }}>
              {submitResult.success
                ? <CheckCircle size={20} color="#10b981" />
                : <AlertCircle size={20} color="#ef4444" />}
              <span style={{
                color: submitResult.success ? "#065f46" : "#991b1b",
                fontSize: "0.9rem", fontWeight: 500,
              }}>
                {submitResult.message}
              </span>
            </div>
          )}

          <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="form-row">
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                  Ваше имя
                </label>
                <input type="text" placeholder="Анна Иванова" required className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={submitting} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                  Телефон
                </label>
                <input type="tel" placeholder="+7 (___) ___-__-__" required className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={submitting} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Вид съёмки
              </label>
              <select className="input" required value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                disabled={submitting} style={{ cursor: "pointer" }}>
                <option value="">Выберите категорию...</option>
                {services.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#4a3f32", marginBottom: 7 }}>
                Пожелания и детали
              </label>
              <textarea rows={4} placeholder="Расскажите о своей идее, желаемой дате, месте съёмки..."
                className="input" value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                disabled={submitting} />
            </div>
            <button type="submit" className="btn-primary"
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                    borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block",
                  }} />
                  Отправка...
                </>
              ) : (
                <><Send size={17} /> Отправить заявку</>
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contacts-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
