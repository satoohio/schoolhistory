import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Aperture, Mail, Phone, MapPin, ExternalLink, Share2 } from "lucide-react";

const DEFAULTS = {
  address: "г. Москва, ул. Арбат, 12",
  phone: "+7 (495) 123-45-67",
  email: "hello@luminas.ru",
  instagram: "",
  telegram: "",
};

export default function Footer() {
  const [info, setInfo] = useState(DEFAULTS);

  useEffect(() => {
    fetch("/api/pages/contacts")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.content) return;
        try {
          const parsed = JSON.parse(d.content);
          setInfo({ ...DEFAULTS, ...parsed });
        } catch {}
      })
      .catch(() => {});
  }, []);

  const contactRows = [
    { Icon: MapPin, text: info.address },
    { Icon: Phone,  text: info.phone   },
    { Icon: Mail,   text: info.email   },
  ];

  const socialLinks = [
    info.instagram && { href: info.instagram, icon: ExternalLink, label: "Instagram" },
    info.telegram  && { href: info.telegram,  icon: Share2,        label: "Telegram"  },
  ].filter(Boolean);

  return (
    <footer style={{ background: "#110e08", color: "#7a6a56", marginTop: "auto" }}>
      <div className="wrap" style={{ padding: "56px 24px 0" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          paddingBottom: "40px",
        }}>

          {/* ── Brand ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, background: "#1e1810", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1px solid #2e2418",
              }}>
                <Aperture size={19} color="#b5702a" />
              </div>
              <span style={{ color: "#f5efe6", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em" }}>
                LUMINAS
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#5a4e3e", maxWidth: 220 }}>
              Фотостудия, где каждый кадр становится историей. Свадьбы, школьные и личные фотосессии.
            </p>

            {/* Social icons */}
            {socialLinks.length > 0 && (
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    title={label}
                    style={{
                      width: 34, height: 34, background: "#1e1810",
                      border: "1px solid #2e2418", borderRadius: 8,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#b5702a")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2e2418")}
                  >
                    <Icon size={15} color="#b5702a" />
                  </a>
                ))}
              </div>
            )}

          </div>

          {/* ── Navigation ── */}
          <div>
            <h3 style={{
              color: "#c9b89e", fontWeight: 600, fontSize: "0.8rem",
              marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Навигация
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["/",         "Главная"  ],
                ["/gallery",  "Галерея"  ],
                ["/about",    "О студии" ],
                ["/contacts", "Контакты" ],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to}
                    style={{ fontSize: "0.875rem", transition: "color 0.15s", color: "#7a6a56" }}
                    onMouseEnter={(e) => (e.target.style.color = "#b5702a")}
                    onMouseLeave={(e) => (e.target.style.color = "#7a6a56")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services ── */}
          <div>
            <h3 style={{
              color: "#c9b89e", fontWeight: 600, fontSize: "0.8rem",
              marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Услуги
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {["Свадебная съёмка", "Школьные фотосессии", "Личные портреты", "Семейная съёмка"].map((s) => (
                <li key={s}>
                  <Link to="/gallery"
                    style={{ fontSize: "0.875rem", transition: "color 0.15s", color: "#7a6a56" }}
                    onMouseEnter={(e) => (e.target.style.color = "#b5702a")}
                    onMouseLeave={(e) => (e.target.style.color = "#7a6a56")}
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contacts (dynamic) ── */}
          <div>
            <h3 style={{
              color: "#c9b89e", fontWeight: 600, fontSize: "0.8rem",
              marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Контакты
            </h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {contactRows.map(({ Icon, text }) => (
                <li key={text} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <Icon size={14} color="#b5702a" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: "1px solid #1e1810", padding: "20px 0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 8, fontSize: "0.8rem", color: "#3d3326",
        }}>
          <span>© {new Date().getFullYear()} LUMINAS Studio. Все права защищены.</span>
          <span style={{ color: "#b5702a", fontWeight: 500, letterSpacing: "0.05em" }}>
            Свет. Момент. Вечность.
          </span>
        </div>
      </div>
    </footer>
  );
}
