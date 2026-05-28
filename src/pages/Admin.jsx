import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Upload,
  Trash2,
  Users,
  Images,
  LayoutGrid,
  FileText,
  Plus,
  X,
  Star,
  StarOff,
  Settings,
  Save,
} from "lucide-react";

const S = {
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    overflow: "hidden",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: 7,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    fontSize: "0.875rem",
    color: "#1e293b",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 20px",
    background: "#1d4ed8",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.875rem",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
};

function TabBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 10,
        border: "none",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        background: active ? "#1d4ed8" : "transparent",
        color: active ? "#fff" : "#64748b",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#f1f5f9";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function StatCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #f1f5f9",
        borderRadius: 14,
        padding: "20px 16px",
        textAlign: "center",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          background: bg,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 10px",
        }}
      >
        <Icon size={18} color={color} />
      </div>
      <div
        style={{
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1,
        }}
      >
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isAdmin, authFetch } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("photos");
  const [stats, setStats] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category_id: "",
    is_featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "" });
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [editPage, setEditPage] = useState({ about: null, contacts: null });
  const fileRef = useRef();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    loadAll();
  }, [isAdmin]);

  async function loadAll() {
    const [statsR, photosR, usersR, catsR] = await Promise.all([
      authFetch("/api/admin/stats").then((r) => r.json()),
      authFetch("/api/photos?limit=100").then((r) => r.json()),
      authFetch("/api/admin/users").then((r) => r.json()),
      authFetch("/api/photos/categories").then((r) => r.json()),
    ]);
    setStats(statsR);
    setPhotos(Array.isArray(photosR) ? photosR : []);
    setUsers(Array.isArray(usersR) ? usersR : []);
    setCategories(Array.isArray(catsR) ? catsR : []);
    const [aboutR, contactsR] = await Promise.all([
      fetch("/api/pages/about").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/pages/contacts").then((r) => (r.ok ? r.json() : null)),
    ]);
    setEditPage({ about: aboutR, contacts: contactsR });
  }

  function showMsg(text, type = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3000);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) {
      showMsg("Выберите файл", "error");
      return;
    }
    if (!uploadForm.title) {
      showMsg("Введите название", "error");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("photo", selectedFile);
    fd.append("title", uploadForm.title);
    fd.append("description", uploadForm.description);
    fd.append("category_id", uploadForm.category_id);
    fd.append("is_featured", uploadForm.is_featured);
    const res = await authFetch("/api/photos", { method: "POST", body: fd });
    if (res.ok) {
      const p = await res.json();
      setPhotos((prev) => [p, ...prev]);
      setUploadForm({
        title: "",
        description: "",
        category_id: "",
        is_featured: false,
      });
      setSelectedFile(null);
      setPreview(null);
      showMsg("Фото успешно загружено!");
      setTab("photos");
    } else {
      const d = await res.json();
      showMsg(d.error || "Ошибка загрузки", "error");
    }
    setUploading(false);
  }

  async function deletePhoto(id) {
    if (!confirm("Удалить фото?")) return;
    const res = await authFetch(`/api/photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showMsg("Фото удалено");
    }
  }

  async function toggleFeatured(photo) {
    const res = await authFetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...photo, is_featured: !photo.is_featured }),
    });
    if (res.ok) {
      const p = await res.json();
      setPhotos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
    }
  }

  async function changeRole(userId, role) {
    const res = await authFetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const u = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? u : x)));
      showMsg("Роль изменена");
    }
  }

  async function addCategory() {
    if (!newCat.name || !newCat.slug) {
      showMsg("Заполните все поля", "error");
      return;
    }
    const res = await authFetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      const c = await res.json();
      setCategories((prev) => [...prev, c]);
      setNewCat({ name: "", slug: "" });
      showMsg("Категория добавлена");
    } else {
      const d = await res.json();
      showMsg(d.error, "error");
    }
  }

  async function deleteCategory(id) {
    if (!confirm("Удалить категорию?")) return;
    const res = await authFetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showMsg("Удалено");
    }
  }

  async function savePage(slug) {
    const p = editPage[slug];
    const res = await authFetch(`/api/pages/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: p.title, content: p.content }),
    });
    if (res.ok) showMsg("Сохранено!");
    else showMsg("Ошибка сохранения", "error");
  }

  if (!isAdmin) return null;

  const tabs = [
    { id: "photos", label: "Фотографии", icon: Images },
    { id: "upload", label: "Загрузить", icon: Upload },
    { id: "categories", label: "Категории", icon: LayoutGrid },
    { id: "users", label: "Пользователи", icon: Users },
    { id: "pages", label: "Страницы", icon: FileText },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: "#f8fafc" }}>
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "28px 0",
        }}
      >
        <div
          className="wrap"
          style={{ display: "flex", alignItems: "center", gap: 14 }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "#2563eb",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Settings size={20} color="#fff" />
          </div>
          <div>
            <h1
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#f8fafc",
                lineHeight: 1.2,
              }}
            >
              Панель администратора
            </h1>
            <p style={{ fontSize: "0.83rem", color: "#64748b", marginTop: 2 }}>
              Привет, {user?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ padding: "28px 24px 64px" }}>
        {/* ── Toast msg ────────────────────────────────── */}
        {msg.text && (
          <div
            style={{
              marginBottom: 20,
              padding: "12px 18px",
              borderRadius: 10,
              fontSize: "0.875rem",
              fontWeight: 500,
              background: msg.type === "error" ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${msg.type === "error" ? "#fecaca" : "#bbf7d0"}`,
              color: msg.type === "error" ? "#dc2626" : "#15803d",
            }}
          >
            {msg.text}
          </div>
        )}

        {/* ── Stats ────────────────────────────────────── */}
        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
              marginBottom: 24,
            }}
            className="stats-row"
          >
            <StatCard
              icon={Users}
              value={stats.users}
              label="Пользователей"
              color="#3b82f6"
              bg="#eff6ff"
            />
            <StatCard
              icon={Images}
              value={stats.photos}
              label="Фотографий"
              color="#8b5cf6"
              bg="#f5f3ff"
            />
            <StatCard
              icon={LayoutGrid}
              value={stats.categories}
              label="Категорий"
              color="#10b981"
              bg="#ecfdf5"
            />
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 20,
            overflowX: "auto",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            padding: "6px",
          }}
        >
          {tabs.map((t) => (
            <TabBtn
              key={t.id}
              active={tab === t.id}
              onClick={() => setTab(t.id)}
              icon={t.icon}
              label={t.label}
            />
          ))}
        </div>

        {/* ══ PHOTOS tab ══════════════════════════════════ */}
        {tab === "photos" && (
          <div style={S.card}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: "0.95rem",
                }}
              >
                Все фотографии ({photos.length})
              </h2>
              <button
                onClick={() => setTab("upload")}
                style={{
                  ...S.btnPrimary,
                  padding: "7px 14px",
                  fontSize: "0.8rem",
                }}
              >
                <Plus size={14} /> Добавить
              </button>
            </div>
            {photos.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <Images
                  size={40}
                  style={{ color: "#cbd5e1", margin: "0 auto 12px" }}
                />
                <p style={{ color: "#94a3b8", fontWeight: 500 }}>
                  Фотографий пока нет
                </p>
                <p
                  style={{ color: "#cbd5e1", fontSize: "0.8rem", marginTop: 4 }}
                >
                  Загрузите первое фото
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 12,
                  padding: 20,
                }}
                className="admin-photo-grid"
              >
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      position: "relative",
                      borderRadius: 10,
                      overflow: "hidden",
                      aspectRatio: "1/1",
                      background: "#f1f5f9",
                    }}
                    className="admin-photo-item"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <div
                      className="admin-photo-hover"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.52)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        padding: 8,
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          onClick={() => toggleFeatured(photo)}
                          title={
                            photo.is_featured
                              ? "Убрать с главной"
                              : "На главную"
                          }
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.2)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {photo.is_featured ? (
                            <Star size={13} fill="#fbbf24" color="#fbbf24" />
                          ) : (
                            <StarOff size={13} color="#fff" />
                          )}
                        </button>
                        <button
                          onClick={() => deletePhoto(photo.id)}
                          title="Удалить"
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(239,68,68,0.85)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Trash2 size={13} color="#fff" />
                        </button>
                      </div>
                      <p
                        style={{
                          color: "#fff",
                          fontSize: "0.72rem",
                          fontWeight: 500,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {photo.title}
                      </p>
                    </div>
                    {photo.is_featured && (
                      <div
                        style={{
                          position: "absolute",
                          top: 6,
                          left: 6,
                          background: "#fbbf24",
                          borderRadius: "50%",
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.6rem",
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
            )}
          </div>
        )}

        {/* ══ UPLOAD tab ══════════════════════════════════ */}
        {tab === "upload" && (
          <div style={{ ...S.card, padding: "28px 28px" }}>
            <h2
              style={{
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "1rem",
                marginBottom: 24,
              }}
            >
              Загрузить фотографию
            </h2>
            <form
              onSubmit={handleUpload}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              {/* Dropzone */}
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: 14,
                  padding: "36px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: preview ? "#f8fafc" : "#fafbff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#3b82f6";
                  e.currentTarget.style.background = "#eff6ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.background = preview
                    ? "#f8fafc"
                    : "#fafbff";
                }}
              >
                {preview ? (
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <img
                      src={preview}
                      alt="preview"
                      style={{
                        maxHeight: 200,
                        borderRadius: 10,
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setSelectedFile(null);
                      }}
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        width: 22,
                        height: 22,
                        background: "#ef4444",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: "#f1f5f9",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <Upload size={22} color="#94a3b8" />
                    </div>
                    <p
                      style={{
                        color: "#475569",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      Нажмите или перетащите фото
                    </p>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.78rem",
                        marginTop: 4,
                      }}
                    >
                      JPG, PNG, WebP · до 10 МБ
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      setSelectedFile(f);
                      setPreview(URL.createObjectURL(f));
                    }
                  }}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
                className="upload-row"
              >
                <div>
                  <label style={S.label}>
                    Название <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, title: e.target.value })
                    }
                    placeholder="Название фото"
                    required
                    style={S.input}
                  />
                </div>
                <div>
                  <label style={S.label}>Категория</label>
                  <select
                    value={uploadForm.category_id}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        category_id: e.target.value,
                      })
                    }
                    style={{ ...S.input, appearance: "none" }}
                  >
                    <option value="">Без категории</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={S.label}>Описание</label>
                <textarea
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Краткое описание (необязательно)..."
                  style={{ ...S.input, resize: "none" }}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() =>
                    setUploadForm({
                      ...uploadForm,
                      is_featured: !uploadForm.is_featured,
                    })
                  }
                  style={{
                    width: 40,
                    height: 22,
                    borderRadius: 999,
                    cursor: "pointer",
                    transition: "background 0.2s",
                    background: uploadForm.is_featured ? "#fbbf24" : "#e2e8f0",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 3,
                      left: uploadForm.is_featured ? 21 : 3,
                      width: 16,
                      height: 16,
                      background: "#fff",
                      borderRadius: "50%",
                      transition: "left 0.2s",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  Показать на главной странице ⭐
                </span>
              </label>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  ...S.btnPrimary,
                  width: "100%",
                  padding: "13px",
                  fontSize: "0.95rem",
                  opacity: uploading ? 0.7 : 1,
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                <Upload size={17} />{" "}
                {uploading ? "Загружаем..." : "Загрузить фото"}
              </button>
            </form>
          </div>
        )}

        {/* ══ CATEGORIES tab ══════════════════════════════ */}
        {tab === "categories" && (
          <div style={S.card}>
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: "0.95rem",
                  marginBottom: 14,
                }}
              >
                Добавить категорию
              </h2>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Название"
                  value={newCat.name}
                  onChange={(e) =>
                    setNewCat({ ...newCat, name: e.target.value })
                  }
                  style={{ ...S.input, flex: "1 1 160px" }}
                />
                <input
                  type="text"
                  placeholder="slug (латиницей)"
                  value={newCat.slug}
                  onChange={(e) =>
                    setNewCat({
                      ...newCat,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/[^a-z0-9-]/g, ""),
                    })
                  }
                  style={{ ...S.input, flex: "1 1 160px" }}
                />
                <button
                  onClick={addCategory}
                  style={{
                    ...S.btnPrimary,
                    padding: "10px 18px",
                    flexShrink: 0,
                  }}
                >
                  <Plus size={15} /> Добавить
                </button>
              </div>
            </div>
            <div style={{ padding: "8px 0" }}>
              {categories.length === 0 ? (
                <p
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                  }}
                >
                  Категорий пока нет
                </p>
              ) : (
                categories.map((c, i) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 24px",
                      borderBottom:
                        i < categories.length - 1
                          ? "1px solid #f8fafc"
                          : "none",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#3b82f6",
                        }}
                      />
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#1e293b",
                          fontSize: "0.875rem",
                        }}
                      >
                        {c.name}
                      </span>
                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "0.78rem",
                          fontFamily: "monospace",
                        }}
                      >
                        {c.slug}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          borderRadius: 999,
                          fontSize: "0.72rem",
                          fontWeight: 600,
                        }}
                      >
                        {c.photo_count} фото
                      </span>
                    </div>
                    <button
                      onClick={() => deleteCategory(c.id)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "none",
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#ef4444",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fef2f2";
                        e.currentTarget.style.border = "1px solid #fecaca";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none";
                        e.currentTarget.style.border = "1px solid #e2e8f0";
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ══ USERS tab ═══════════════════════════════════ */}
        {tab === "users" && (
          <div style={S.card}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <h2
                style={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: "0.95rem",
                }}
              >
                Пользователи ({users.length})
              </h2>
            </div>
            {users.map((u, i) => (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom:
                    i < users.length - 1 ? "1px solid #f8fafc" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      background: u.role === "admin" ? "#eff6ff" : "#f8fafc",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: u.role === "admin" ? "#1d4ed8" : "#64748b",
                      flexShrink: 0,
                    }}
                  >
                    {u.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#0f172a",
                        fontSize: "0.875rem",
                      }}
                    >
                      {u.name}
                    </p>
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.775rem",
                        marginTop: 1,
                      }}
                    >
                      {u.email}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: u.role === "admin" ? "#eff6ff" : "#f1f5f9",
                      color: u.role === "admin" ? "#1d4ed8" : "#64748b",
                    }}
                  >
                    {u.role === "admin" ? "Админ" : "Пользователь"}
                  </span>
                  {u.id !== user?.id && (
                    <button
                      onClick={() =>
                        changeRole(u.id, u.role === "admin" ? "user" : "admin")
                      }
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        border: "1.5px solid #e2e8f0",
                        background: "#fff",
                        color: "#1d4ed8",
                        fontSize: "0.775rem",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#eff6ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "#fff")
                      }
                    >
                      {u.role === "admin" ? "Разжаловать" : "Сделать админом"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PAGES tab ═══════════════════════════════════ */}
        {tab === "pages" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              ["about", "О школе"],
              ["contacts", "Контакты"],
            ].map(([slug, title]) => (
              <div key={slug} style={{ ...S.card, padding: 0 }}>
                <div
                  style={{
                    padding: "16px 24px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <FileText size={16} color="#3b82f6" />
                  <h2
                    style={{
                      fontWeight: 700,
                      color: "#0f172a",
                      fontSize: "0.95rem",
                    }}
                  >
                    Страница «{title}»
                  </h2>
                </div>
                <div style={{ padding: "24px" }}>
                  {editPage[slug] ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                      }}
                    >
                      <div>
                        <label style={S.label}>Заголовок</label>
                        <input
                          type="text"
                          value={editPage[slug].title}
                          onChange={(e) =>
                            setEditPage((prev) => ({
                              ...prev,
                              [slug]: { ...prev[slug], title: e.target.value },
                            }))
                          }
                          style={S.input}
                        />
                      </div>
                      <div>
                        <label style={S.label}>Текст страницы</label>
                        <textarea
                          rows={7}
                          value={editPage[slug].content}
                          onChange={(e) =>
                            setEditPage((prev) => ({
                              ...prev,
                              [slug]: {
                                ...prev[slug],
                                content: e.target.value,
                              },
                            }))
                          }
                          style={{ ...S.input, resize: "vertical" }}
                        />
                      </div>
                      <div>
                        <button
                          onClick={() => savePage(slug)}
                          style={{ ...S.btnPrimary, gap: 7 }}
                        >
                          <Save size={15} /> Сохранить изменения
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                      Загрузка...
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .admin-photo-item:hover .admin-photo-hover { opacity: 1 !important; }
        @media (max-width: 640px) {
          .stats-row { grid-template-columns: repeat(3, 1fr) !important; }
          .admin-photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .upload-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
