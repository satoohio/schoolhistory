import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index];

  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!photo) return null;

  const btnBase = {
    position: "absolute",
    background: "rgba(255,255,255,0.10)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "rgba(255,255,255,0.8)",
    transition: "background 0.2s",
    zIndex: 10,
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{ ...btnBase, top: 16, right: 16, width: 40, height: 40 }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
      >
        <X size={22} />
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          style={{ ...btnBase, left: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
        >
          <ChevronLeft size={30} />
        </button>
      )}

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          style={{ ...btnBase, right: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
        >
          <ChevronRight size={30} />
        </button>
      )}

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 900,
          maxHeight: "90vh",
          width: "100%",
          margin: "0 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={photo.url}
          alt={photo.title}
          style={{
            maxHeight: "75vh",
            maxWidth: "100%",
            objectFit: "contain",
            borderRadius: 14,
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        />
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <h3 style={{ color: "#f5efe6", fontWeight: 600, fontSize: "1rem", marginBottom: 4 }}>
            {photo.title}
          </h3>
          {photo.description && (
            <p style={{ color: "rgba(245,239,230,0.5)", fontSize: "0.875rem", marginBottom: 6 }}>
              {photo.description}
            </p>
          )}
          {photo.category_name && (
            <span style={{
              display: "inline-block",
              padding: "3px 12px",
              background: "rgba(181,112,42,0.2)",
              color: "#d4924a",
              fontSize: "0.75rem",
              borderRadius: 999,
              border: "1px solid rgba(181,112,42,0.3)",
              fontWeight: 600,
            }}>
              {photo.category_name}
            </span>
          )}
        </div>
      </div>

      {/* Counter */}
      <div style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.35)",
        fontSize: "0.82rem",
        letterSpacing: "0.05em",
      }}>
        {index + 1} / {photos.length}
      </div>
    </div>
  );
}
