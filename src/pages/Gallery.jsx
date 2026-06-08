import { useState, useEffect } from "react";
import { Search, Camera } from "lucide-react";
import Lightbox from "../components/Lightbox";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [lbIndex, setLbIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetch("/api/photos/categories")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (activeCategory !== "all") params.set("category", activeCategory);

    fetch(`/api/photos?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          if (offset === 0) {
            setPhotos(data);
          } else {
            setPhotos((prev) => [...prev, ...data]);
          }
          setTotal(data.length);
        }
      })
      .finally(() => setLoading(false));
  }, [activeCategory, offset]);

  const filtered = photos.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const canLoadMore = total === limit;

  function loadMore() {
    setOffset((prev) => prev + limit);
  }

  useEffect(() => {
    setOffset(0);
    setPhotos([]);
  }, [activeCategory, search]);

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(160deg, #0d0b08 0%, #1a1208 60%, #241a0d 100%)",
          padding: "64px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "10%",
            transform: "translateY(-50%)",
            width: 250,
            height: 250,
            background: "radial-gradient(circle, rgba(181,112,42,0.10) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div className="wrap" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "rgba(181,112,42,0.12)",
              border: "1px solid rgba(181,112,42,0.22)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
            }}
          >
            <Camera size={24} color="#b5702a" />
          </div>
          <h1
            style={{
              fontSize: "2.6rem",
              fontWeight: 800,
              color: "#f5efe6",
              letterSpacing: "-0.025em",
              marginBottom: 10,
            }}
          >
            Портфолио
          </h1>
          <p style={{ color: "rgba(245,239,230,0.40)", fontSize: "1rem" }}>
            Свадьбы · Школьные · Личные фотосессии
          </p>
        </div>
      </div>

      <div className="wrap" style={{ padding: "36px 24px 64px" }}>
        {/* Search + filters */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div style={{ position: "relative", maxWidth: 440 }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9a8a76",
              }}
            />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 40, maxWidth: "100%" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
            >
              Все
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCategory(c.slug)}
                className={`filter-btn ${activeCategory === c.slug ? "active" : ""}`}
              >
                {c.name}
                {c.photo_count > 0 && (
                  <span
                    style={{ opacity: 0.6, fontSize: "0.75rem", marginLeft: 4 }}
                  >
                    ({c.photo_count})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="photo-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 14,
                  borderRadius: 14,
                  background: "#ede9e2",
                  aspectRatio: i % 3 === 0 ? "1/1.4" : "1/1",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <Camera
              size={52}
              style={{ color: "#d4c4b0", margin: "0 auto 16px" }}
            />
            <p
              style={{ color: "#9a8a76", fontSize: "1.05rem", fontWeight: 500 }}
            >
              Фотографий пока нет
            </p>
            <p style={{ color: "#c4b4a0", fontSize: "0.875rem", marginTop: 6 }}>
              Попробуйте изменить фильтр
            </p>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#9a8a76",
                marginBottom: 18,
              }}
            >
              {filtered.length} фотографий
            </p>
            <div className="photo-grid">
              {filtered.map((photo, i) => (
                <div
                  key={photo.id}
                  className="photo-item"
                  onClick={() => setLbIndex(i)}
                >
                  <img src={photo.url} alt={photo.title} />
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
                          fontSize: "0.82rem",
                          marginBottom: 2,
                        }}
                      >
                        {photo.title}
                      </p>
                      {photo.category_name && (
                        <p
                          style={{
                            color: "rgba(255,255,255,0.65)",
                            fontSize: "0.72rem",
                          }}
                        >
                          {photo.category_name}
                        </p>
                      )}
                    </div>
                  </div>
                  {photo.is_featured && (
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        width: 22,
                        height: 22,
                        background: "#b5702a",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      ★
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {canLoadMore && !loading && filtered.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button onClick={loadMore} className="btn-primary">
              Загрузить ещё
            </button>
          </div>
        )}
      </div>

      {lbIndex !== null && (
        <Lightbox
          photos={filtered}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLbIndex((i) => Math.min(filtered.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
