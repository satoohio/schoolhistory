import { useState, useEffect } from "react";
import { Camera, Award, Heart, Aperture, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const [page, setPage] = useState(null);

  useEffect(() => {
    fetch("/api/pages/about")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPage(d));
  }, []);

  const values = [
    {
      icon: Aperture,
      title: "Художественный взгляд",
      desc: "Мы не просто фотографируем — мы выстраиваем кадр так, чтобы каждый снимок рассказывал историю.",
      color: "#b5702a",
      bg: "#fdf5ec",
    },
    {
      icon: Heart,
      title: "Забота о клиенте",
      desc: "Раскрепощаем даже самых застенчивых. Съёмка проходит легко и непринуждённо.",
      color: "#e05a7a",
      bg: "#fff0f3",
    },
    {
      icon: Award,
      title: "Качество обработки",
      desc: "Ретушь, цветокоррекция и художественная обработка — каждый снимок доводится до идеала.",
      color: "#7c5cbf",
      bg: "#f5f0ff",
    },
    {
      icon: Camera,
      title: "Профессиональное оборудование",
      desc: "Полнокадровые камеры, портретная и репортажная оптика, студийный свет и стробоскопы.",
      color: "#2ea87e",
      bg: "#ecfdf5",
    },
  ];

  const packages = [
    {
      name: "Базовый",
      duration: "1–2 часа",
      photos: "20–30 фото",
      price: "от 5 000 ₽",
      features: ["Одна локация", "Базовая ретушь", "Онлайн-галерея", "Срок: 7 дней"],
      accent: false,
    },
    {
      name: "Стандарт",
      duration: "3–4 часа",
      photos: "50–70 фото",
      price: "от 10 000 ₽",
      features: ["До 2 локаций", "Глубокая ретушь", "Онлайн-галерея", "Помощь со стилем", "Срок: 5 дней"],
      accent: true,
    },
    {
      name: "Премиум",
      duration: "Полный день",
      photos: "100+ фото",
      price: "от 20 000 ₽",
      features: ["Без ограничений", "Художественная обработка", "Печать 10 фото", "Видео-ролик", "Срок: 3 дня"],
      accent: false,
    },
  ];

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
            top: "40%",
            right: "5%",
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(181,112,42,0.12) 0%, transparent 70%)",
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
            История и философия
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
            О студии LUMINAS
          </h1>
          <p style={{ color: "rgba(245,239,230,0.45)", fontSize: "1rem", maxWidth: 460, margin: "0 auto" }}>
            8 лет создаём снимки, которые вы будете хранить всю жизнь
          </p>
        </div>
      </div>

      <div className="wrap-sm" style={{ padding: "56px 24px 0" }}>
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
                    color: "#4a3f32",
                    lineHeight: 1.85,
                    fontSize: "1.02rem",
                    marginBottom: 16,
                  }}
                >
                  {line}
                </p>
              ))
          ) : (
            <>
              <p style={{ color: "#4a3f32", lineHeight: 1.85, fontSize: "1.02rem", marginBottom: 16 }}>
                Студия LUMINAS основана в 2016 году фотографом Алексеем Кузнецовым. За 8 лет работы
                мы провели более 500 фотосессий — от камерных портретов до масштабных свадебных съёмок
                в разных городах России.
              </p>
              <p style={{ color: "#4a3f32", lineHeight: 1.85, fontSize: "1.02rem", marginBottom: 16 }}>
                Наша философия проста: хорошая фотография — это не только правильный свет и выдержка.
                Это доверие между фотографом и моделью, атмосфера на съёмке, умение поймать
                настоящий живой момент.
              </p>
              <p style={{ color: "#4a3f32", lineHeight: 1.85, fontSize: "1.02rem" }}>
                Мы работаем в трёх направлениях: свадебная съёмка, школьные фотосессии и
                индивидуальные/семейные портреты. Каждое из них требует своего подхода —
                и для каждого у нас есть нужный опыт и оборудование.
              </p>
            </>
          )}
        </div>

        {/* Values */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
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
            Наши принципы
          </div>
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#1a1208",
              letterSpacing: "-0.02em",
            }}
          >
            Почему выбирают нас
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 16,
            marginBottom: 72,
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
                    color: "#1a1208",
                    marginBottom: 6,
                    fontSize: "0.95rem",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "#7a6a56",
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

      {/* Pricing */}
      <div style={{ background: "#f5f0e8", padding: "64px 0" }}>
        <div className="wrap">
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
              Прайс-лист
            </div>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#1a1208",
                letterSpacing: "-0.02em",
              }}
            >
              Пакеты съёмки
            </h2>
            <p style={{ color: "#7a6a56", fontSize: "0.9rem", marginTop: 8 }}>
              Индивидуальный расчёт для свадеб и корпоративных съёмок
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              alignItems: "start",
            }}
            className="pricing-grid"
          >
            {packages.map(({ name, duration, photos, price, features, accent }) => (
              <div
                key={name}
                className="card"
                style={{
                  padding: "32px 28px",
                  background: accent ? "#1a1208" : "#fff",
                  border: accent ? "none" : "1px solid #ede9e2",
                  transform: accent ? "scale(1.03)" : "none",
                  position: "relative",
                }}
              >
                {accent && (
                  <div
                    style={{
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#b5702a",
                      color: "#fff",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 999,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Популярный
                  </div>
                )}
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: accent ? "#b5702a" : "#9a8a76",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 6,
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: accent ? "#f5efe6" : "#1a1208",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {price}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: accent ? "#7a6a56" : "#9a8a76", marginTop: 4 }}>
                    {duration} · {photos}
                  </div>
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                  {features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CheckCircle size={15} color="#b5702a" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "0.875rem", color: accent ? "rgba(245,239,230,0.7)" : "#6b5c4a" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contacts"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "11px",
                    borderRadius: 10,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    background: accent ? "#b5702a" : "transparent",
                    color: accent ? "#fff" : "#b5702a",
                    border: accent ? "none" : "1.5px solid #b5702a",
                  }}
                >
                  Записаться <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > div { transform: none !important; }
        }
      `}</style>
    </div>
  );
}
