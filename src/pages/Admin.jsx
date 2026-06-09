import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Upload, Trash2, Users, Images, LayoutGrid, FileText,
  Plus, X, Star, StarOff, Save, Ban, UserCheck,
  Search, Edit2, Check, RefreshCw, ShieldAlert, Aperture, Camera,
  Eye, EyeOff,
} from "lucide-react";

// ── Design tokens ──────────────────────────────────────────────────────────
const C = {
  bg: "#faf7f4",
  card: "#ffffff",
  border: "#e8e0d5",
  borderLight: "#f2ece4",
  gold: "#b5702a",
  goldLight: "#fdf5ec",
  goldBorder: "#e8c99a",
  dark: "#1a1208",
  darkMid: "#2a1f10",
  text: "#1c1208",
  textMid: "#5c4a30",
  textMuted: "#9c856a",
  navy: "#0d0b08",
};

const S = {
  card: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: 16,
    overflow: "hidden",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: C.textMid,
    marginBottom: 7,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${C.border}`,
    borderRadius: 10,
    fontSize: "0.875rem",
    color: C.text,
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 20px",
    background: C.gold,
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.875rem",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnDanger: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "6px 12px",
    background: "#fef2f2",
    color: "#dc2626",
    fontWeight: 600,
    fontSize: "0.775rem",
    borderRadius: 8,
    border: "1.5px solid #fecaca",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnWarn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "6px 12px",
    background: "#fff7ed",
    color: "#ea580c",
    fontWeight: 600,
    fontSize: "0.775rem",
    borderRadius: 8,
    border: "1.5px solid #fed7aa",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnGhost: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "6px 12px",
    background: C.goldLight,
    color: C.gold,
    fontWeight: 500,
    fontSize: "0.775rem",
    borderRadius: 8,
    border: `1.5px solid ${C.goldBorder}`,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

// ── Tab button ─────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, icon: Icon, label, badge }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "9px 16px", borderRadius: 10, border: "none",
        cursor: "pointer", fontSize: "0.85rem", fontWeight: 500,
        whiteSpace: "nowrap", position: "relative", fontFamily: "inherit",
        background: active ? C.gold : "transparent",
        color: active ? "#fff" : C.textMuted,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = C.goldLight; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon size={15} />
      {label}
      {badge > 0 && (
        <span style={{
          background: "#ef4444", color: "#fff", borderRadius: 999,
          fontSize: "0.65rem", fontWeight: 700, padding: "1px 5px", marginLeft: 2,
        }}>{badge}</span>
      )}
    </button>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.borderLight}`, borderRadius: 14,
      padding: "20px 16px", textAlign: "center",
      boxShadow: "0 1px 6px rgba(181,112,42,0.06)",
    }}>
      <div style={{
        width: 42, height: 42, background: bg, borderRadius: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 10px",
      }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>
        {value ?? "—"}
      </div>
      <div style={{ fontSize: "0.78rem", color: C.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(13,11,8,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: C.card, borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 480,
        boxShadow: "0 24px 60px rgba(13,11,8,0.3)",
        border: `1px solid ${C.border}`,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, color: C.text, fontSize: "1rem" }}>{title}</h3>
          <button onClick={onClose} style={{
            border: "none", background: C.goldLight, borderRadius: 8,
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", color: C.gold,
          }}><X size={15} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
export default function Admin() {
  const { user, isAdmin, authFetch } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("photos");
  const [stats, setStats] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", category_id: "", is_featured: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [newCat, setNewCat] = useState({ name: "", slug: "" });
  const [editingCat, setEditingCat] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "success" });
  const [editPage, setEditPage] = useState({ about: null, contacts: null });
  const [userSearch, setUserSearch] = useState("");
  const [photoFilter, setPhotoFilter] = useState("");
  const [photoView, setPhotoView] = useState("list");
  const [editPhotoModal, setEditPhotoModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    loadAll();
  }, [isAdmin]);

  async function loadAll() {
    try {
      const [statsR, photosR, usersR, catsR] = await Promise.all([
        authFetch("/api/admin/stats").then((r) => r.json()),
        authFetch("/api/photos?limit=200&admin=true").then((r) => r.json()),
        authFetch("/api/admin/users").then((r) => r.json()),
        authFetch("/api/photos/categories").then((r) => r.json()),
      ]);
      setStats(statsR);
      setPhotos(Array.isArray(photosR) ? photosR : []);
      setUsers(Array.isArray(usersR) ? usersR : []);
      setCategories(Array.isArray(catsR) ? catsR : []);
    } catch (err) {
      console.error("loadAll admin data error:", err.message);
    }
    try {
      const [aboutR, contactsR] = await Promise.all([
        fetch("/api/pages/about").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/pages/contacts").then((r) => (r.ok ? r.json() : null)),
      ]);
      setEditPage({
        about: aboutR || { slug: "about", title: "О студии LUMINAS", content: "" },
        contacts: contactsR || { slug: "contacts", title: "Контакты", content: "{}" },
      });
    } catch (err) {
      console.error("loadAll pages error:", err.message);
      setEditPage({
        about: { slug: "about", title: "О студии LUMINAS", content: "" },
        contacts: { slug: "contacts", title: "Контакты", content: "{}" },
      });
    }
  }

  function showMsg(text, type = "success") {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: "", type: "success" }), 3500);
  }

  // ── Upload ─────────────────────────────────────────────────────────────
  async function handleUpload(e) {
    e.preventDefault();
    if (!selectedFile) { showMsg("Выберите файл", "error"); return; }
    if (!uploadForm.title) { showMsg("Введите название", "error"); return; }
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
      setUploadForm({ title: "", description: "", category_id: "", is_featured: false });
      setSelectedFile(null); setPreview(null);
      showMsg("Фото успешно загружено!");
      setTab("photos");
      loadAll();
    } else {
      const d = await res.json();
      showMsg(d.error || "Ошибка загрузки", "error");
    }
    setUploading(false);
  }

  // ── Photos ─────────────────────────────────────────────────────────────
  async function deletePhoto(id) {
    try {
      const res = await authFetch(`/api/photos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setStats((s) => s ? { ...s, photos: s.photos - 1 } : s);
        showMsg("Фото удалено");
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg(d.error || "Ошибка при удалении", "error");
      }
    } catch (e) {
      showMsg("Ошибка соединения с сервером", "error");
    }
    setConfirmModal(null);
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

  async function toggleVisibility(photo) {
    const res = await authFetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...photo, is_visible: !photo.is_visible }),
    });
    if (res.ok) {
      const p = await res.json();
      setPhotos((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      showMsg(p.is_visible ? "Фото отображается в галерее" : "Фото скрыто из галереи");
    }
  }

  async function savePhotoEdit() {
    if (!editPhotoModal?.title) { showMsg("Название обязательно", "error"); return; }
    const res = await authFetch(`/api/photos/${editPhotoModal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editPhotoModal),
    });
    if (res.ok) {
      const p = await res.json();
      setPhotos((prev) => prev.map((x) => (x.id === p.id ? { ...x, ...p } : x)));
      setEditPhotoModal(null);
      showMsg("Фото обновлено");
    } else {
      showMsg("Ошибка сохранения", "error");
    }
  }

  // ── Users ──────────────────────────────────────────────────────────────
  async function changeRole(userId, role) {
    const res = await authFetch(`/api/admin/users/${userId}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      const u = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...u } : x)));
      showMsg("Роль изменена");
    } else {
      const d = await res.json();
      showMsg(d.error || "Ошибка", "error");
    }
  }

  async function toggleBan(userId) {
    const res = await authFetch(`/api/admin/users/${userId}/ban`, { method: "PATCH" });
    if (res.ok) {
      const u = await res.json();
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, ...u } : x)));
      setStats((s) => s ? {
        ...s, banned: u.is_banned ? s.banned + 1 : Math.max(0, s.banned - 1),
      } : s);
      showMsg(u.is_banned ? "Пользователь заблокирован" : "Блокировка снята");
    } else {
      const d = await res.json();
      showMsg(d.error || "Ошибка", "error");
    }
    setConfirmModal(null);
  }

  async function deleteUser(userId) {
    const res = await authFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setStats((s) => s ? { ...s, users: s.users - 1 } : s);
      showMsg("Пользователь удалён");
    } else {
      const d = await res.json();
      showMsg(d.error || "Ошибка", "error");
    }
    setConfirmModal(null);
  }

  // ── Categories ─────────────────────────────────────────────────────────
  async function addCategory() {
    if (!newCat.name || !newCat.slug) { showMsg("Заполните все поля", "error"); return; }
    const res = await authFetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCat),
    });
    if (res.ok) {
      const c = await res.json();
      setCategories((prev) => [...prev, { ...c, photo_count: 0 }]);
      setNewCat({ name: "", slug: "" });
      showMsg("Категория добавлена");
    } else {
      const d = await res.json();
      showMsg(d.error, "error");
    }
  }

  async function saveCategoryEdit(id) {
    if (!editingCat?.name || !editingCat?.slug) { showMsg("Заполните все поля", "error"); return; }
    const res = await authFetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingCat.name, slug: editingCat.slug }),
    });
    if (res.ok) {
      const c = await res.json();
      setCategories((prev) => prev.map((x) => x.id === c.id ? { ...x, ...c } : x));
      setEditingCat(null);
      showMsg("Категория обновлена");
    } else {
      const d = await res.json();
      showMsg(d.error, "error");
    }
  }

  async function deleteCategory(id) {
    const res = await authFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showMsg("Удалено");
    }
    setConfirmModal(null);
  }

  // ── Pages ──────────────────────────────────────────────────────────────
  async function savePage(slug) {
    const p = editPage[slug];
    if (!p) return showMsg("Данные страницы не загружены", "error");
    if (!p.title?.trim()) return showMsg("Введите заголовок страницы", "error");
    try {
      const res = await authFetch(`/api/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: p.title, content: p.content }),
      });
      if (res.ok) showMsg("Страница сохранена!");
      else {
        const err = await res.json().catch(() => ({}));
        showMsg(err.error || "Ошибка сохранения", "error");
      }
    } catch (err) {
      showMsg("Ошибка соединения с сервером", "error");
    }
  }

  if (!isAdmin) return null;

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });
  const filteredPhotos = photoFilter
    ? photos.filter((p) => String(p.category_id) === photoFilter)
    : photos;
  const bannedCount = users.filter((u) => u.is_banned).length;

  const tabs = [
    { id: "photos",     label: "Фотографии",    icon: Images },
    { id: "upload",     label: "Загрузить",      icon: Camera },
    { id: "categories", label: "Категории",      icon: LayoutGrid },
    { id: "users",      label: "Клиенты",        icon: Users, badge: bannedCount },
    { id: "pages",      label: "Страницы",       icon: FileText },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: C.bg }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.dark} 60%, ${C.darkMid} 100%)`,
        padding: "28px 0",
        borderBottom: `2px solid ${C.gold}22`,
      }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46,
              background: `linear-gradient(135deg, ${C.gold} 0%, #d4883a 100%)`,
              borderRadius: 13,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              boxShadow: `0 4px 14px ${C.gold}55`,
            }}>
              <Aperture size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f5efe8", lineHeight: 1.2, letterSpacing: "0.02em" }}>
                LUMINAS · Администратор
              </h1>
              <p style={{ fontSize: "0.82rem", color: "#9c856a", marginTop: 2 }}>
                Добро пожаловать, {user?.name}
              </p>
            </div>
          </div>
          <button onClick={loadAll} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 14px", background: "rgba(181,112,42,0.12)",
            border: `1px solid ${C.gold}40`, borderRadius: 10,
            color: "#b5916a", fontSize: "0.8rem", cursor: "pointer", fontFamily: "inherit",
          }}>
            <RefreshCw size={13} /> Обновить
          </button>
        </div>
      </div>

      <div className="wrap" style={{ padding: "28px 24px 64px" }}>

        {/* ── Toast ──────────────────────────────────────────────── */}
        {msg.text && (
          <div style={{
            marginBottom: 20, padding: "12px 18px", borderRadius: 10,
            fontSize: "0.875rem", fontWeight: 500,
            background: msg.type === "error" ? "#fef2f2" : C.goldLight,
            border: `1px solid ${msg.type === "error" ? "#fecaca" : C.goldBorder}`,
            color: msg.type === "error" ? "#dc2626" : C.gold,
          }}>
            {msg.text}
          </div>
        )}

        {/* ── Stats ──────────────────────────────────────────────── */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}
            className="stats-row">
            <StatCard icon={Users}       value={stats.users}      label="Клиентов"       color={C.gold}    bg={C.goldLight} />
            <StatCard icon={Images}      value={stats.photos}     label="Фотографий"     color="#8b5cf6"   bg="#f5f3ff" />
            <StatCard icon={LayoutGrid}  value={stats.categories} label="Категорий"      color="#10b981"   bg="#ecfdf5" />
            <StatCard icon={ShieldAlert} value={stats.banned}     label="Заблокировано"  color="#ef4444"   bg="#fef2f2" />
          </div>
        )}

        {/* ── Tabs ───────────────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 20, overflowX: "auto",
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "6px",
        }}>
          {tabs.map((t) => (
            <TabBtn key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}
              icon={t.icon} label={t.label} badge={t.badge} />
          ))}
        </div>

        {/* ══ PHOTOS tab ══════════════════════════════════════════ */}
        {tab === "photos" && (
          <div style={S.card}>
            {/* Toolbar */}
            <div style={{
              padding: "14px 20px", borderBottom: `1px solid ${C.borderLight}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            }}>
              <h2 style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem" }}>
                Все фотографии ({filteredPhotos.length})
              </h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <select
                  value={photoFilter}
                  onChange={(e) => setPhotoFilter(e.target.value)}
                  style={{ ...S.input, width: "auto", padding: "6px 10px", fontSize: "0.8rem" }}
                >
                  <option value="">Все категории</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {/* View toggle */}
                <div style={{ display: "flex", background: C.bg, borderRadius: 8, padding: 2, border: `1px solid ${C.border}` }}>
                  {[["list", Images], ["grid", LayoutGrid]].map(([v, Icon]) => (
                    <button key={v} onClick={() => setPhotoView(v)} style={{
                      width: 30, height: 30, borderRadius: 6, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: photoView === v ? C.gold : "transparent",
                      color: photoView === v ? "#fff" : C.textMuted,
                      transition: "all 0.15s",
                    }}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
                <button onClick={() => setTab("upload")} style={{ ...S.btnPrimary, padding: "7px 14px", fontSize: "0.8rem" }}>
                  <Plus size={14} /> Добавить
                </button>
              </div>
            </div>

            {filteredPhotos.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <Camera size={40} style={{ color: C.border, margin: "0 auto 12px" }} />
                <p style={{ color: C.textMuted, fontWeight: 500 }}>Фотографий пока нет</p>
                <p style={{ color: C.textMuted, fontSize: "0.8rem", marginTop: 6 }}>
                  Загрузите первые работы студии
                </p>
              </div>
            ) : photoView === "list" ? (
              /* ── LIST VIEW ── */
              <div>
                {filteredPhotos.map((photo, i) => (
                  <div key={photo.id} style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "12px 20px",
                    borderBottom: i < filteredPhotos.length - 1 ? `1px solid ${C.borderLight}` : "none",
                    background: !photo.is_visible ? "#fafafa" : "#fff",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => { if (photo.is_visible) e.currentTarget.style.background = C.goldLight; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = !photo.is_visible ? "#fafafa" : "#fff"; }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 8, overflow: "hidden",
                      flexShrink: 0, background: C.borderLight, position: "relative",
                      opacity: photo.is_visible ? 1 : 0.5,
                    }}>
                      <img src={photo.url} alt={photo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{
                          fontWeight: 600, fontSize: "0.9rem", color: photo.is_visible ? C.text : C.textMuted,
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {photo.title}
                        </span>
                        {photo.is_featured && (
                          <span style={{
                            background: "#fdf5ec", color: C.gold, border: `1px solid ${C.goldBorder}`,
                            borderRadius: 6, fontSize: "0.65rem", fontWeight: 700,
                            padding: "1px 6px", letterSpacing: "0.04em",
                          }}>★ Главная</span>
                        )}
                        {!photo.is_visible && (
                          <span style={{
                            background: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb",
                            borderRadius: 6, fontSize: "0.65rem", fontWeight: 700, padding: "1px 6px",
                          }}>Скрыто</span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                        {photo.category_name && (
                          <span style={{ fontSize: "0.75rem", color: C.textMuted }}>
                            {photo.category_name}
                          </span>
                        )}
                        {photo.description && (
                          <span style={{
                            fontSize: "0.75rem", color: C.textMuted,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260,
                          }}>
                            {photo.description}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions — always visible */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                      <button
                        onClick={() => toggleFeatured(photo)}
                        title={photo.is_featured ? "Убрать с главной" : "На главную"}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
                          background: photo.is_featured ? "#fdf5ec" : "#fff",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {photo.is_featured
                          ? <Star size={14} fill="#b5702a" color="#b5702a" />
                          : <StarOff size={14} color={C.textMuted} />}
                      </button>
                      <button
                        onClick={() => toggleVisibility(photo)}
                        title={photo.is_visible ? "Скрыть из галереи" : "Показать в галерее"}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`,
                          background: photo.is_visible ? "#ecfdf5" : "#f3f4f6",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {photo.is_visible
                          ? <Eye size={14} color="#15803d" />
                          : <EyeOff size={14} color="#6b7280" />}
                      </button>
                      <button
                        onClick={() => setEditPhotoModal({ ...photo })}
                        title="Редактировать"
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.goldBorder}`,
                          background: C.goldLight, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Edit2 size={14} color={C.gold} />
                      </button>
                      <button
                        onClick={() => setConfirmModal({ type: "photo", id: photo.id, name: photo.title })}
                        title="Удалить"
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca",
                          background: "#fef2f2", cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ── GRID VIEW ── */
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: 20 }}
                className="admin-photo-grid">
                {filteredPhotos.map((photo) => (
                  <div key={photo.id} style={{
                    borderRadius: 10, overflow: "hidden", background: C.borderLight,
                    border: `1px solid ${C.border}`,
                    opacity: photo.is_visible ? 1 : 0.65,
                  }}>
                    {/* Photo */}
                    <div style={{ position: "relative", aspectRatio: "1/1" }}>
                      <img src={photo.url} alt={photo.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      {photo.is_featured && (
                        <div style={{
                          position: "absolute", top: 6, left: 6,
                          background: C.gold, borderRadius: "50%",
                          width: 20, height: 20,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <Star size={11} fill="#fff" color="#fff" />
                        </div>
                      )}
                      {!photo.is_visible && (
                        <div style={{
                          position: "absolute", top: 6, right: 6,
                          background: "rgba(0,0,0,0.6)", borderRadius: 6,
                          padding: "2px 6px", display: "flex", alignItems: "center", gap: 3,
                        }}>
                          <EyeOff size={10} color="#fff" />
                          <span style={{ color: "#fff", fontSize: "0.6rem", fontWeight: 600 }}>Скрыто</span>
                        </div>
                      )}
                    </div>
                    {/* Title */}
                    <div style={{ padding: "8px 10px 6px", borderBottom: `1px solid ${C.borderLight}` }}>
                      <p style={{
                        fontSize: "0.78rem", fontWeight: 600, color: C.text,
                        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                      }}>
                        {photo.title}
                      </p>
                      {photo.category_name && (
                        <p style={{ fontSize: "0.68rem", color: C.textMuted, marginTop: 1 }}>
                          {photo.category_name}
                        </p>
                      )}
                    </div>
                    {/* Always-visible action strip */}
                    <div style={{
                      display: "flex", justifyContent: "space-around", padding: "6px 8px",
                      background: "#fdfaf7",
                    }}>
                      <button onClick={() => toggleFeatured(photo)}
                        title={photo.is_featured ? "Убрать с главной" : "На главную"}
                        style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {photo.is_featured
                          ? <Star size={14} fill="#b5702a" color="#b5702a" />
                          : <StarOff size={14} color={C.textMuted} />}
                      </button>
                      <button onClick={() => toggleVisibility(photo)}
                        title={photo.is_visible ? "Скрыть" : "Показать"}
                        style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {photo.is_visible
                          ? <Eye size={14} color="#15803d" />
                          : <EyeOff size={14} color="#6b7280" />}
                      </button>
                      <button onClick={() => setEditPhotoModal({ ...photo })}
                        title="Редактировать"
                        style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Edit2 size={14} color={C.gold} />
                      </button>
                      <button onClick={() => setConfirmModal({ type: "photo", id: photo.id, name: photo.title })}
                        title="Удалить"
                        style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={14} color="#dc2626" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══ UPLOAD tab ══════════════════════════════════════════ */}
        {tab === "upload" && (
          <div style={{ ...S.card, padding: "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <Camera size={20} color={C.gold} />
              <h2 style={{ fontWeight: 700, color: C.text, fontSize: "1rem" }}>
                Загрузить фотографию
              </h2>
            </div>
            <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Dropzone */}
              <div
                onClick={() => fileRef.current.click()}
                style={{
                  border: `2px dashed ${C.goldBorder}`, borderRadius: 14,
                  padding: "36px 20px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s",
                  background: preview ? C.goldLight : "#fdfaf7",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.background = C.goldLight; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.goldBorder; e.currentTarget.style.background = preview ? C.goldLight : "#fdfaf7"; }}
              >
                {preview ? (
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 10, objectFit: "cover" }} />
                    <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); setSelectedFile(null); }}
                      style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", background: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{
                      width: 52, height: 52, background: C.goldLight, borderRadius: 12,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 12px",
                    }}>
                      <Upload size={22} color={C.gold} />
                    </div>
                    <p style={{ color: C.textMid, fontWeight: 600, fontSize: "0.9rem" }}>
                      Нажмите или перетащите файл
                    </p>
                    <p style={{ color: C.textMuted, fontSize: "0.78rem", marginTop: 6 }}>
                      JPG, PNG, WEBP — до 10 МБ
                    </p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (!f) return;
                  setSelectedFile(f);
                  const reader = new FileReader();
                  reader.onload = (ev) => setPreview(ev.target.result);
                  reader.readAsDataURL(f);
                }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="upload-row">
                <div>
                  <label style={S.label}>Название *</label>
                  <input style={S.input} value={uploadForm.title} placeholder="Название фото"
                    onChange={(e) => setUploadForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label style={S.label}>Категория</label>
                  <select style={S.input} value={uploadForm.category_id}
                    onChange={(e) => setUploadForm((p) => ({ ...p, category_id: e.target.value }))}>
                    <option value="">Без категории</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={S.label}>Описание</label>
                <textarea rows={3} style={{ ...S.input, resize: "vertical" }} value={uploadForm.description}
                  placeholder="Краткое описание (необязательно)"
                  onChange={(e) => setUploadForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={uploadForm.is_featured}
                  onChange={(e) => setUploadForm((p) => ({ ...p, is_featured: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: C.gold }} />
                <span style={{ fontSize: "0.875rem", color: C.textMid, fontWeight: 500 }}>
                  ★ Показать на главной странице
                </span>
              </label>
              <button type="submit" disabled={uploading} style={{ ...S.btnPrimary, opacity: uploading ? 0.7 : 1 }}>
                {uploading ? "Загрузка..." : <><Upload size={15} /> Загрузить фото</>}
              </button>
            </form>
          </div>
        )}

        {/* ══ CATEGORIES tab ════════════════════════════════════════ */}
        {tab === "categories" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Add form */}
            <div style={{ ...S.card, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <LayoutGrid size={16} color={C.gold} />
                <h3 style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>
                  Добавить категорию
                </h3>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input style={{ ...S.input, flex: 1, minWidth: 150 }} placeholder="Название"
                  value={newCat.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
                    setNewCat({ name, slug });
                  }} />
                <input style={{ ...S.input, flex: 1, minWidth: 150 }} placeholder="slug (url)"
                  value={newCat.slug}
                  onChange={(e) => setNewCat((p) => ({ ...p, slug: e.target.value }))} />
                <button onClick={addCategory} style={{ ...S.btnPrimary, whiteSpace: "nowrap" }}>
                  <Plus size={14} /> Добавить
                </button>
              </div>
            </div>

            {/* List */}
            <div style={S.card}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
                <h3 style={{ fontWeight: 700, color: C.text, fontSize: "0.9rem" }}>
                  Категории ({categories.length})
                </h3>
              </div>
              {categories.length === 0 ? (
                <p style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted }}>Нет категорий</p>
              ) : categories.map((c, i) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 20px",
                  borderBottom: i < categories.length - 1 ? `1px solid ${C.borderLight}` : "none",
                  gap: 12,
                }}>
                  {editingCat?.id === c.id ? (
                    <div style={{ display: "flex", gap: 8, flex: 1, flexWrap: "wrap" }}>
                      <input style={{ ...S.input, flex: 1, minWidth: 120, padding: "6px 10px" }}
                        value={editingCat.name}
                        onChange={(e) => setEditingCat((p) => ({ ...p, name: e.target.value }))} />
                      <input style={{ ...S.input, flex: 1, minWidth: 120, padding: "6px 10px" }}
                        value={editingCat.slug}
                        onChange={(e) => setEditingCat((p) => ({ ...p, slug: e.target.value }))} />
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => saveCategoryEdit(c.id)} style={{ ...S.btnPrimary, padding: "6px 12px" }}>
                          <Check size={13} />
                        </button>
                        <button onClick={() => setEditingCat(null)} style={{ ...S.btnGhost, padding: "6px 12px" }}>
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, color: C.text, fontSize: "0.875rem" }}>{c.name}</p>
                        <p style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: 1 }}>/{c.slug}</p>
                      </div>
                      <span style={{
                        padding: "3px 10px", background: C.goldLight, color: C.gold,
                        borderRadius: 999, fontSize: "0.72rem", fontWeight: 600,
                        border: `1px solid ${C.goldBorder}`,
                      }}>{c.photo_count ?? 0} фото</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditingCat({ id: c.id, name: c.name, slug: c.slug })}
                          style={{ width: 30, height: 30, borderRadius: 8, background: C.goldLight, border: `1px solid ${C.goldBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.gold }}>
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => setConfirmModal({ type: "category", id: c.id, name: c.name })}
                          style={{ width: 30, height: 30, borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ USERS tab ════════════════════════════════════════════ */}
        {tab === "users" && (
          <div style={S.card}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <h2 style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem" }}>
                  Клиенты ({users.length})
                  {bannedCount > 0 && (
                    <span style={{ marginLeft: 10, padding: "2px 8px", background: "#fef2f2", color: "#dc2626", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700 }}>
                      {bannedCount} заблокировано
                    </span>
                  )}
                </h2>
              </div>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: C.textMuted }} />
                <input
                  placeholder="Поиск по имени или email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ ...S.input, paddingLeft: 34, fontSize: "0.825rem" }}
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <p style={{ padding: "40px 20px", textAlign: "center", color: C.textMuted }}>
                {userSearch ? "Никого не найдено" : "Нет клиентов"}
              </p>
            ) : filteredUsers.map((u, i) => (
              <div key={u.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: i < filteredUsers.length - 1 ? `1px solid ${C.borderLight}` : "none",
                background: u.is_banned ? "#fffbeb" : "transparent",
                gap: 12,
              }}>
                {/* Avatar + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{
                    width: 38, height: 38, flexShrink: 0,
                    background: u.is_banned ? "#fef3c7" : u.role === "admin" ? C.goldLight : "#f8f5f0",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1.5px solid ${u.is_banned ? "#fde68a" : u.role === "admin" ? C.goldBorder : C.border}`,
                    fontSize: "0.85rem", fontWeight: 700,
                    color: u.is_banned ? "#d97706" : u.role === "admin" ? C.gold : C.textMuted,
                  }}>
                    {u.name[0].toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: C.text, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 6 }}>
                      {u.name}
                      {u.id === user?.id && (
                        <span style={{ fontSize: "0.68rem", color: C.textMuted, fontWeight: 400, background: C.borderLight, borderRadius: 6, padding: "1px 6px" }}>вы</span>
                      )}
                    </p>
                    <p style={{ color: C.textMuted, fontSize: "0.775rem", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.email}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700,
                    background: u.is_banned ? "#fef2f2" : u.role === "admin" ? C.goldLight : "#f1f5f9",
                    color: u.is_banned ? "#dc2626" : u.role === "admin" ? C.gold : C.textMuted,
                    border: u.is_banned ? "1px solid #fecaca" : "none",
                  }}>
                    {u.is_banned ? "Заблокирован" : u.role === "admin" ? "Администратор" : "Клиент"}
                  </span>

                  {u.id !== user?.id && (
                    <>
                      <button onClick={() => changeRole(u.id, u.role === "admin" ? "user" : "admin")}
                        style={S.btnGhost}>
                        {u.role === "admin" ? "Разжаловать" : "Сделать админом"}
                      </button>
                      <button
                        onClick={() => setConfirmModal({ type: "ban", id: u.id, name: u.name, is_banned: u.is_banned })}
                        style={u.is_banned
                          ? { ...S.btnGhost, color: "#15803d", borderColor: "#bbf7d0", background: "#f0fdf4" }
                          : S.btnWarn}>
                        {u.is_banned ? <><UserCheck size={12} /> Разблокировать</> : <><Ban size={12} /> Заблокировать</>}
                      </button>
                      <button onClick={() => setConfirmModal({ type: "user", id: u.id, name: u.name })}
                        style={S.btnDanger}>
                        <Trash2 size={12} /> Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PAGES tab ════════════════════════════════════════════ */}
        {tab === "pages" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* ── About page ── */}
            <div style={{ ...S.card, padding: 0 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={16} color={C.gold} />
                <div>
                  <h2 style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem" }}>Страница «О студии»</h2>
                  <p style={{ fontSize: "0.78rem", color: C.textMuted, marginTop: 2 }}>
                    Заголовок отображается в шапке страницы, текст — в блоке с историей студии
                  </p>
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                {editPage.about ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <label style={S.label}>Заголовок страницы</label>
                      <input type="text" value={editPage.about.title} style={S.input}
                        placeholder="О студии LUMINAS"
                        onChange={(e) => setEditPage((prev) => ({ ...prev, about: { ...prev.about, title: e.target.value } }))} />
                    </div>
                    <div>
                      <label style={S.label}>История студии (основной текст)</label>
                      <textarea rows={9} style={{ ...S.input, resize: "vertical" }} value={editPage.about.content}
                        placeholder="Расскажите историю студии..."
                        onChange={(e) => setEditPage((prev) => ({ ...prev, about: { ...prev.about, content: e.target.value } }))} />
                    </div>
                    <button onClick={() => savePage("about")} style={{ ...S.btnPrimary, gap: 7 }}>
                      <Save size={15} /> Сохранить
                    </button>
                  </div>
                ) : (
                  <p style={{ color: C.textMuted, fontSize: "0.875rem" }}>Загрузка...</p>
                )}
              </div>
            </div>

            {/* ── Contacts page ── */}
            <div style={{ ...S.card, padding: 0 }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.borderLight}`, display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={16} color={C.gold} />
                <div>
                  <h2 style={{ fontWeight: 700, color: C.text, fontSize: "0.95rem" }}>Страница «Контакты»</h2>
                  <p style={{ fontSize: "0.78rem", color: C.textMuted, marginTop: 2 }}>
                    Эти данные отображаются на странице Контакты — адрес, телефон, email и режим работы
                  </p>
                </div>
              </div>
              <div style={{ padding: "24px" }}>
                {editPage.contacts ? (() => {
                  let parsed = {};
                  try { parsed = JSON.parse(editPage.contacts.content || "{}"); } catch {}
                  function updateContact(key, val) {
                    const updated = { ...parsed, [key]: val };
                    setEditPage((prev) => ({
                      ...prev,
                      contacts: { ...prev.contacts, content: JSON.stringify(updated) },
                    }));
                  }
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div>
                        <label style={S.label}>Заголовок страницы</label>
                        <input type="text" value={editPage.contacts.title} style={S.input}
                          placeholder="Свяжитесь с нами"
                          onChange={(e) => setEditPage((prev) => ({ ...prev, contacts: { ...prev.contacts, title: e.target.value } }))} />
                      </div>
                      <div>
                        <label style={S.label}>Подзаголовок / описание</label>
                        <input type="text" value={parsed.intro || ""} style={S.input}
                          placeholder="Ответим в течение часа..."
                          onChange={(e) => updateContact("intro", e.target.value)} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }} className="upload-row">
                        <div>
                          <label style={S.label}>Адрес студии</label>
                          <input type="text" value={parsed.address || ""} style={S.input}
                            placeholder="г. Москва, ул. Арбат, 12"
                            onChange={(e) => updateContact("address", e.target.value)} />
                        </div>
                        <div>
                          <label style={S.label}>Телефон</label>
                          <input type="text" value={parsed.phone || ""} style={S.input}
                            placeholder="+7 (495) 123-45-67"
                            onChange={(e) => updateContact("phone", e.target.value)} />
                        </div>
                        <div>
                          <label style={S.label}>Email</label>
                          <input type="email" value={parsed.email || ""} style={S.input}
                            placeholder="hello@luminas.ru"
                            onChange={(e) => updateContact("email", e.target.value)} />
                        </div>
                        <div>
                          <label style={S.label}>Режим работы</label>
                          <input type="text" value={parsed.hours || ""} style={S.input}
                            placeholder="Ежедневно: 10:00 – 20:00"
                            onChange={(e) => updateContact("hours", e.target.value)} />
                        </div>
                        <div>
                          <label style={S.label}>Instagram (ссылка)</label>
                          <input type="url" value={parsed.instagram || ""} style={S.input}
                            placeholder="https://instagram.com/..."
                            onChange={(e) => updateContact("instagram", e.target.value)} />
                        </div>
                        <div>
                          <label style={S.label}>Telegram (ссылка)</label>
                          <input type="url" value={parsed.telegram || ""} style={S.input}
                            placeholder="https://t.me/..."
                            onChange={(e) => updateContact("telegram", e.target.value)} />
                        </div>
                      </div>
                      <button onClick={() => savePage("contacts")} style={{ ...S.btnPrimary, gap: 7 }}>
                        <Save size={15} /> Сохранить контактные данные
                      </button>
                    </div>
                  );
                })() : (
                  <p style={{ color: C.textMuted, fontSize: "0.875rem" }}>Загрузка...</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ══ EDIT PHOTO MODAL ════════════════════════════════════════ */}
      {editPhotoModal && (
        <Modal title="Редактировать фото" onClose={() => setEditPhotoModal(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={editPhotoModal.url} alt={editPhotoModal.title}
              style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10 }} />
            <div>
              <label style={S.label}>Название *</label>
              <input style={S.input} value={editPhotoModal.title}
                onChange={(e) => setEditPhotoModal((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>Описание</label>
              <textarea rows={3} style={{ ...S.input, resize: "vertical" }} value={editPhotoModal.description || ""}
                onChange={(e) => setEditPhotoModal((p) => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <label style={S.label}>Категория</label>
              <select style={S.input} value={editPhotoModal.category_id || ""}
                onChange={(e) => setEditPhotoModal((p) => ({ ...p, category_id: e.target.value || null }))}>
                <option value="">Без категории</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={!!editPhotoModal.is_featured}
                onChange={(e) => setEditPhotoModal((p) => ({ ...p, is_featured: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: C.gold }} />
              <span style={{ fontSize: "0.875rem", color: C.textMid, fontWeight: 500 }}>★ На главную страницу</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox"
                checked={editPhotoModal.is_visible !== false}
                onChange={(e) => setEditPhotoModal((p) => ({ ...p, is_visible: e.target.checked }))}
                style={{ width: 16, height: 16, accentColor: "#22c55e" }} />
              <span style={{ fontSize: "0.875rem", fontWeight: 500,
                color: editPhotoModal.is_visible !== false ? "#15803d" : C.textMuted }}>
                {editPhotoModal.is_visible !== false
                  ? "👁 Отображается в галерее"
                  : "🚫 Скрыто из галереи"}
              </span>
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={savePhotoEdit} style={{ ...S.btnPrimary, flex: 1 }}>
                <Save size={14} /> Сохранить
              </button>
              <button onClick={() => setEditPhotoModal(null)} style={{ ...S.btnGhost, flex: 1 }}>
                Отмена
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══ CONFIRM MODAL ═══════════════════════════════════════════ */}
      {confirmModal && (
        <Modal
          title={
            confirmModal.type === "user"     ? "Удалить клиента?"
            : confirmModal.type === "ban"    ? (confirmModal.is_banned ? "Разблокировать клиента?" : "Заблокировать клиента?")
            : confirmModal.type === "photo"  ? "Удалить фото?"
            : "Удалить категорию?"
          }
          onClose={() => setConfirmModal(null)}
        >
          <p style={{ color: C.textMid, fontSize: "0.875rem", marginBottom: 20 }}>
            {confirmModal.type === "user" && <>Клиент <strong>{confirmModal.name}</strong> будет удалён безвозвратно.</>}
            {confirmModal.type === "ban" && !confirmModal.is_banned && <>Клиент <strong>{confirmModal.name}</strong> не сможет войти на сайт.</>}
            {confirmModal.type === "ban" && confirmModal.is_banned && <>Клиент <strong>{confirmModal.name}</strong> снова сможет войти на сайт.</>}
            {confirmModal.type === "photo" && <>Фото <strong>«{confirmModal.name}»</strong> будет удалено безвозвратно.</>}
            {confirmModal.type === "category" && <>Категория <strong>«{confirmModal.name}»</strong> будет удалена. Фотографии останутся.</>}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => {
                if (confirmModal.type === "user")     deleteUser(confirmModal.id);
                else if (confirmModal.type === "ban") toggleBan(confirmModal.id);
                else if (confirmModal.type === "photo") deletePhoto(confirmModal.id);
                else if (confirmModal.type === "category") deleteCategory(confirmModal.id);
              }}
              style={{
                ...(confirmModal.type === "ban" && confirmModal.is_banned
                  ? { ...S.btnPrimary, flex: 1, background: "#15803d" }
                  : confirmModal.type === "ban"
                  ? { ...S.btnWarn, flex: 1, padding: "10px 20px", fontSize: "0.875rem" }
                  : { ...S.btnDanger, flex: 1, padding: "10px 20px", fontSize: "0.875rem" }
                )
              }}
            >
              {confirmModal.type === "ban" && confirmModal.is_banned && <><UserCheck size={14} /> Разблокировать</>}
              {confirmModal.type === "ban" && !confirmModal.is_banned && <><Ban size={14} /> Заблокировать</>}
              {confirmModal.type === "user" && <><Trash2 size={14} /> Удалить</>}
              {confirmModal.type === "photo" && <><Trash2 size={14} /> Удалить фото</>}
              {confirmModal.type === "category" && <><Trash2 size={14} /> Удалить категорию</>}
            </button>
            <button onClick={() => setConfirmModal(null)}
              style={{ ...S.btnGhost, flex: 1, padding: "10px 20px", fontSize: "0.875rem" }}>
              Отмена
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
