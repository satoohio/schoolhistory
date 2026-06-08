import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Images,
  Heart,
  GraduationCap,
  User,
  ArrowRight,
  Camera,
  Star,
  Aperture,
  Clock,
} from "lucide-react";
import Lightbox from "../components/Lightbox";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [lbIndex, setLbIndex] = useState(null);

  useEffect(() => {
    fetch("/api/photos?featured=true&limit=6")
      .then((r) => r.json())
      .then((data) => (Array.isArray(data) ? setFeatured(data) : []))
      .catch(() => {});
  }, []);

  const stats = [
    { icon: Camera, value: "500+", label: "Фотосессий", color: "#b5702a" },
    { icon: Heart, value: "98%", label: "Довольных клиентов", color: "#e05a7a" },
    { icon: Clock, value: "8", label: "Лет опыта", color: "#7c5cbf" },
    { icon: Images, value: "12K+", label: "Обработанных фото", color: "#2ea87e" },
  ];

  const services = [
    {
      icon: Heart,
      title: "Свадебная съёмка",
      desc: "Самый важный день в вашей жизни — в объективе нашего фотографа. Полное сопровождение от сборов до банкета.",
      color: "#e05a7a",
      bg: "#fff0f3",
      tag: "Свадьбы",
    },
    {
      icon: GraduationCap,
      title: "Школьные фотосессии",
      desc: "Первый звонок, выпускной, портреты для документов — сохраним каждый важный школьный момент.",
      color: "#b5702a",
      bg: "#fdf5ec",
      tag: "Школьные",
    },
    {
      icon: User,
      title: "Личные портреты",
      desc: "Индивидуальная или семейная фотосессия. Деловые портреты, творческие образы, детская съёмка.",
      color: "#7c5cbf",
      bg: "#f5f0ff",
      tag: "Личное",
    },
  ];

  return (
    <div style={{ paddingTop: 64 }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 55%, #241a0d 100%)",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage:
              "radial-gradient(circle, rgba(181,112,42,0.9) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* warm glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "8%",
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(181,112,42,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        {/* bottom wave */}
        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0 }}>
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <path
              d="M0 80L1440 80L1440 35C1100 -5 640 75 0 18L0 80Z"
              fill="#faf8f5"
            />
          </svg>
        </div>

        <div
          className="wrap"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px 24px 120px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "center",
          }}
          className="wrap hero-grid"
        >
          <div>
            <div
              className="fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(181,112,42,0.12)",
                color: "#d4924a",
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: "0.82rem",
                fontWeight: 600,
                marginBottom: 28,
                border: "1px solid rgba(181,112,42,0.22)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              <Aperture size={12} />
              Фотостудия в Москве
            </div>

            <h1
              className="fade-up"
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                fontWeight: 800,
                color: "#f5efe6",
                lineHeight: 1.1,
                marginBottom: 20,
                letterSpacing: "-0.03em",
                animationDelay: "0.05s",
              }}
            >
              Каждый кадр —
              <br />
              <span style={{ color: "#b5702a" }}>это история.</span>
            </h1>

            <p
              className="fade-up"
              style={{
                fontSize: "1.05rem",
                color: "rgba(245,239,230,0.60)",
                lineHeight: 1.75,
                marginBottom: 36,
                maxWidth: 460,
                animationDelay: "0.1s",
              }}
            >
              Свадебная, школьная и личная фотосъёмка. Создаём снимки,
              которые хочется рассматривать снова и снова.
            </p>

            <div
              className="fade-up"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                animationDelay: "0.15s",
              }}
            >
              <Link
                to="/gallery"
                className="btn-primary"
              >
                <Camera size={17} /> Смотреть галерею
              </Link>
              <Link to="/contacts" className="btn-outline">
                Записаться на съёмку <ArrowRight size={16} />
              </Link>
            </div>

            {/* mini trust row */}
            <div
              className="fade-up"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 36,
                animationDelay: "0.2s",
              }}
            >
              <div style={{ display: "flex" }}>
                {["#f59e0b","#f59e0b","#f59e0b","#f59e0b","#f59e0b"].map((c, i) => (
                  <Star key={i} size={14} fill={c} color={c} style={{ marginLeft: i ? -2 : 0 }} />
                ))}
              </div>
              <span style={{ color: "rgba(245,239,230,0.45)", fontSize: "0.85rem" }}>
                500+ довольных клиентов
              </span>
            </div>
          </div>

          {/* right: camera visual */}
          <div
            className="hero-visual"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "rgba(181,112,42,0.08)",
                border: "1px solid rgba(181,112,42,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "rgba(181,112,42,0.10)",
                  border: "1px solid rgba(181,112,42,0.20)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Aperture size={80} color="#b5702a" strokeWidth={1} />
              </div>
              {/* floating badges */}
              {[
                { label: "Свадьбы", top: "10%", right: "-10%" },
                { label: "Школьные", bottom: "15%", left: "-12%" },
                { label: "Личное", top: "55%", right: "-18%" },
              ].map(({ label, ...pos }) => (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    ...pos,
                    background: "#1e1810",
                    border: "1px solid rgba(181,112,42,0.25)",
                    color: "#d4924a",
                    padding: "6px 14px",
                    borderRadius: 999,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    letterSpacing: "0.03em",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section
        className="wrap"
        style={{
          marginTop: -40,
          position: "relative",
          zIndex: 10,
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
          className="stats-grid"
        >
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="stat-card">
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: color + "18",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <Icon size={18} color={color} />
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#1a1208",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: "0.82rem", color: "#8a7a66", marginTop: 4 }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="section wrap">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "#b5702a",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Что мы снимаем
          </div>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#1a1208",
              letterSpacing: "-0.025em",
            }}
          >
            Наши направления
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
          className="services-grid"
        >
          {services.map(({ icon: Icon, title, desc, color, bg, tag }) => (
            <Link
              to="/gallery"
              key={title}
              className="card"
              style={{
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  background: bg,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={24} color={color} />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "#1a1208",
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h3>
                <p style={{ color: "#7a6a56", fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {desc}
                </p>
              </div>
              <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 6, color, fontSize: "0.83rem", fontWeight: 600 }}>
                Смотреть работы <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured gallery ─────────────────────────────── */}
      {featured.length > 0 && (
        <section
          style={{ background: "#f5f0e8", padding: "64px 0" }}
        >
          <div className="wrap">
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 28,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "#b5702a",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  Избранные работы
                </div>
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#1a1208",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Портфолио студии
                </h2>
              </div>
              <Link
                to="/gallery"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#b5702a",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Вся галерея <ArrowRight size={15} />
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 14,
              }}
              className="featured-grid"
            >
              {featured.map((photo, i) => (
                <div
                  key={photo.id}
                  onClick={() => setLbIndex(i)}
                  style={{
                    gridColumn: i === 0 ? "span 2" : "span 1",
                    gridRow: i === 0 ? "span 2" : "span 1",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    aspectRatio: i === 0 ? "4/3" : "1/1",
                    background: "#ede9e2",
                  }}
                  className="photo-item"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="photo-overlay">
                    <div
                      style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        right: 12,
                      }}
                    >
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          marginBottom: 2,
                        }}
                      >
                        {photo.title}
                      </p>
                      {photo.category_name && (
                        <p
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "0.75rem",
                          }}
                        >
                          {photo.category_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #110e08 0%, #1e1508 100%)",
          padding: "80px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, rgba(181,112,42,0.12) 0%, transparent 70%)",
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
            Запишитесь сейчас
          </div>
          <h2
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#f5efe6",
              marginBottom: 14,
              letterSpacing: "-0.025em",
            }}
          >
            Готовы создать ваши снимки?
          </h2>
          <p
            style={{
              color: "rgba(245,239,230,0.45)",
              fontSize: "1rem",
              marginBottom: 36,
              maxWidth: 440,
              margin: "0 auto 36px",
              lineHeight: 1.7,
            }}
          >
            Свяжитесь с нами — обсудим детали, выберем локацию и создадим
            фотографии, которые вы будете хранить всю жизнь.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/contacts"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "#b5702a",
                color: "#fff",
                fontWeight: 700,
                borderRadius: 12,
                fontSize: "0.95rem",
              }}
            >
              Записаться на съёмку <ArrowRight size={17} />
            </Link>
            <Link
              to="/gallery"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                background: "rgba(255,255,255,0.07)",
                color: "#f5efe6",
                fontWeight: 600,
                borderRadius: 12,
                fontSize: "0.95rem",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Images size={17} /> Смотреть портфолио
            </Link>
          </div>
        </div>
      </section>

      {lbIndex !== null && (
        <Lightbox
          photos={featured}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLbIndex((i) => Math.min(featured.length - 1, i + 1))}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .services-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-grid > div:first-child { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
}
