import { useState, useEffect } from "react";
import { BookOpen, Award, Users, Heart } from "lucide-react";

export default function About() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/about")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPage(d));
  }, []);

  const values = [
    {
      icon: BookOpen,
      title: "Знания",
      desc: "Глубокое образование по всем предметам с упором на критическое мышление.",
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      icon: Users,
      title: "Команда",
      desc: "Дружный коллектив учителей и учеников, работающих вместе.",
      color: "#8b5cf6",
      bg: "#f5f3ff",
    },
    {
      icon: Award,
      title: "Достижения",
      desc: "Победители олимпиад, конкурсов и спортивных соревнований.",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      icon: Heart,
      title: "Забота",
      desc: "Индивидуальный подход к каждому ребёнку и его развитию.",
      color: "#ef4444",
      bg: "#fef2f2",
    },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #312e81 0%, #1d4ed8 100%)",
          padding: "64px 0 60px",
        }}
      >
        <div className="wrap" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#a5b4fc",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 12,
            }}
          >
            История и миссия
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
            О нашей Гимназии №11
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
            Более 70 лет качественного образования
          </p>
        </div>
      </div>

      <div className="wrap-sm" style={{ padding: "56px 24px 72px" }}>
        {/* Main text card */}
        <div
          className="card"
          style={{ padding: "36px 40px", marginBottom: 48 }}
        >
          {page ? (
            page.content
              .split("\n")
              .filter(Boolean)
              .map((line, i) => (
                <p
                  key={i}
                  style={{
                    color: "#374151",
                    lineHeight: 1.8,
                    fontSize: "1.05rem",
                    marginBottom: 16,
                    lastChild: { marginBottom: 0 },
                  }}
                >
                  {line}
                </p>
              ))
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[100, 95, 80].map((w) => (
                <div
                  key={w}
                  style={{
                    height: 18,
                    background: "#f1f5f9",
                    borderRadius: 6,
                    width: `${w}%`,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#3b82f6",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Что нас отличает
          </div>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Наши ценности
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
          }}
          className="values-grid"
        >
          {values.map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
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
                <h3
                  style={{
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: 6,
                    fontSize: "0.95rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "#64748b",
                    fontSize: "0.875rem",
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
