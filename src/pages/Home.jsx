import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Images,
  BookOpen,
  Trophy,
  Users,
  ArrowRight,
  Star,
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
    { icon: Users, value: "1200+", label: "Учеников", color: "#3b82f6" },
    { icon: BookOpen, value: "85", label: "Учителей", color: "#8b5cf6" },
    { icon: Trophy, value: "200+", label: "Наград", color: "#f59e0b" },
    { icon: Images, value: "70+", label: "Лет истории", color: "#10b981" },
  ];

  return (
    <div style={{ paddingTop: 64 }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #4f46e5 100%)",
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.07,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "36px 36px",
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
              fill="#f8fafc"
            />
          </svg>
        </div>

        <div
          className="wrap"
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px 24px 120px",
          }}
        >
          <div style={{ maxWidth: 600 }}>
            <div
              className="fade-up"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.12)",
                color: "#bfdbfe",
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: 28,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Star size={13} fill="#93c5fd" color="#93c5fd" />
              Добро пожаловать в Гимназию № 11
            </div>

            <h1
              className="fade-up"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 20,
                letterSpacing: "-0.02em",
                animationDelay: "0.05s",
              }}
            >
              Знания.
              <br />
              <span style={{ color: "#fbbf24" }}>Творчество.</span>
              <br />
              Будущее.
            </h1>

            <p
              className="fade-up"
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.78)",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
                animationDelay: "0.1s",
              }}
            >
              Мы создаём среду, где каждый ученик раскрывает свой потенциал и
              готовится к вызовам современного мира.
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
                style={{ background: "#fbbf24", color: "#1e293b" }}
              >
                <Images size={17} /> Смотреть галерею
              </Link>
              <Link to="/about" className="btn-outline">
                О нашей школе <ArrowRight size={16} />
              </Link>
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
                  color: "#1e293b",
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div
                style={{ fontSize: "0.82rem", color: "#64748b", marginTop: 4 }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured gallery ─────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section wrap">
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
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#3b82f6",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 6,
                }}
              >
                Гимнастическая жизнь
              </div>
              <h2
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Яркие моменты
              </h2>
            </div>
            <Link
              to="/gallery"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#1d4ed8",
                fontSize: "0.9rem",
                fontWeight: 500,
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
                  background: "#e2e8f0",
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
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
          padding: "72px 0",
        }}
      >
        <div className="wrap" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#fff",
              marginBottom: 12,
              letterSpacing: "-0.02em",
            }}
          >
            Присоединяйтесь к нашему сообществу
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "1rem",
              marginBottom: 32,
              maxWidth: 440,
              margin: "0 auto 32px",
            }}
          >
            Зарегистрируйтесь, чтобы получить доступ к полной галерее и новостям
            Гимназии
          </p>
          <Link
            to="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              background: "#fff",
              color: "#1d4ed8",
              fontWeight: 700,
              borderRadius: 12,
              fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
            }}
          >
            Зарегистрироваться бесплатно <ArrowRight size={17} />
          </Link>
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
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .featured-grid > div:first-child { grid-column: span 2 !important; }
        }
      `}</style>
    </div>
  );
}
