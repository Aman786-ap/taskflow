import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

/* ─── Constants ─────────────────────────────────────────── */
const PURPLE  = "#7c6bff";
const DARK_BG = "#1a1a2e";
const DAYS    = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRIORITIES = [
  { value: "low",    label: "Low",    color: "#888",    bg: "#f4f4f4" },
  { value: "medium", label: "Medium", color: PURPLE,    bg: "#f0eeff" },
  { value: "high",   label: "High",   color: "#dc2626", bg: "#fff0f0" },
];
const STATUSES = [
  { value: "todo",        label: "To Do",       color: "#777",    bg: "#f4f4f4" },
  { value: "in-progress", label: "In Progress", color: "#b45309", bg: "#fffbeb" },
  { value: "done",        label: "Done",        color: "#15803d", bg: "#f0fdf4" },
];

const getCfg = (arr, val) => arr.find((x) => x.value === val) || arr[0];

/* ─── Reusable Badge ─────────────────────────────────────── */
function Badge({ cfg }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
      background: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

/* ─── Sidebar Nav Item ───────────────────────────────────── */
function NavItem({ icon, label, active, onClick, danger }) {
  return (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 10px", borderRadius: 8, fontSize: 13,
      fontWeight: active ? 600 : 400,
      color: danger ? "rgba(255,100,100,0.75)" : active ? "#fff" : "rgba(255,255,255,0.5)",
      background: active ? "rgba(124,107,255,0.2)" : "transparent",
      cursor: "pointer", marginBottom: 2, userSelect: "none",
    }}>
      <span style={{ fontSize: 15, width: 18, textAlign: "center" }}>{icon}</span>
      {label}
    </div>
  );
}

/* ─── Form Field wrapper ─────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700, color: "#777",
        textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 7,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const mInput = {
  width: "100%", padding: "10px 13px", fontSize: 14,
  color: "#111", background: "#f8f8fc",
  border: "1px solid #e2e2f0", borderRadius: 8,
  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

/* ─── Task Modal ─────────────────────────────────────────── */
function TaskModal({ task, onClose, onSave }) {
  const isEdit = Boolean(task?._id);
  const [form, setForm] = useState(
    isEdit ? { ...task } : { title: "", description: "", priority: "medium", status: "todo" }
  );
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setErr("Title is required."); return; }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,10,30,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 20,
      }}
    >
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "32px 32px 28px",
        width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
        fontFamily: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111" }}>
            {isEdit ? "✏️  Edit Task" : "✨  New Task"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, color: "#bbb", cursor: "pointer" }}>✕</button>
        </div>

        {err && (
          <div style={{ background: "#fff0f0", border: "1px solid #ffd0d0", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 }}>
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          <Field label="Task Title *">
            <input required placeholder="What needs to be done?" value={form.title}
              onChange={(e) => set("title", e.target.value)} style={mInput} autoFocus />
          </Field>

          <Field label="Description">
            <textarea placeholder="Optional details…" value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3} style={{ ...mInput, resize: "vertical", minHeight: 76 }} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Priority">
              <select value={form.priority} onChange={(e) => set("priority", e.target.value)} style={mInput}>
                {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value)} style={mInput}>
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <button type="button" onClick={onClose} style={{
              padding: "10px 20px", fontSize: 13, fontWeight: 600,
              background: "#fff", border: "1px solid #e2e2f0",
              borderRadius: 8, color: "#666", cursor: "pointer", fontFamily: "inherit",
            }}>Cancel</button>
            <button type="submit" disabled={saving} style={{
              padding: "10px 24px", fontSize: 13, fontWeight: 700,
              background: PURPLE, color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
              opacity: saving ? 0.7 : 1,
            }}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Task ✓"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Confirm Delete ─────────────────────────────────────── */
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{ position: "fixed", inset: 0, background: "rgba(10,10,30,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
    >
      <div style={{ background: "#fff", borderRadius: 14, padding: "30px 32px", maxWidth: 360, width: "90%", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 8 }}>Delete this task?</h3>
        <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>This action cannot be undone.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={onCancel} style={{
            padding: "10px 20px", fontSize: 13, fontWeight: 600,
            background: "#fff", border: "1px solid #e2e2f0",
            borderRadius: 8, color: "#666", cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: "10px 22px", fontSize: 13, fontWeight: 700,
            background: "#dc2626", color: "#fff",
            border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
          }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const [user]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  });

  const [tasks,     setTasks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(null);
  const [deleteId,  setDeleteId]  = useState(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [filter,    setFilter]    = useState("all");

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch { /* interceptor handles redirect */ }
    finally { setLoading(false); }
  };

  const handleSave = async (form) => {
    try {
      if (form._id) {
        const res = await API.put(`/tasks/${form._id}`, form);
        setTasks((p) => p.map((t) => (t._id === form._id ? res.data.task : t)));
      } else {
        const res = await API.post("/tasks", form);
        setTasks((p) => [res.data.task, ...p]);
      }
      setModal(null);
    } catch (e) {
      alert(e.response?.data?.message || "Could not save task.");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/tasks/${deleteId}`);
      setTasks((p) => p.filter((t) => t._id !== deleteId));
    } catch { alert("Could not delete."); }
    finally { setDeleteId(null); }
  };

  const toggleDone = async (task) => {
    const next = task.status === "done" ? "todo" : "done";
    try {
      const res = await API.put(`/tasks/${task._id}`, { ...task, status: next });
      setTasks((p) => p.map((t) => (t._id === task._id ? res.data.task : t)));
    } catch { /* silent */ }
  };

  const logout = () => { localStorage.clear(); navigate("/"); };

  /* ── Derived data ── */
  const stats = {
    total:      tasks.length,
    todo:       tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done:       tasks.filter((t) => t.status === "done").length,
  };
  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const highPriority = tasks.filter((t) => t.priority === "high" && t.status !== "done");

  const displayed =
    activeNav === "priority" ? tasks.filter((t) => t.priority === "high") :
    filter === "all"         ? tasks :
                               tasks.filter((t) => t.status === filter);

  const barHeights = [35, 60, 45, 80, 55, 25, 15].map(
    (b) => Math.min(95, b + (stats.total % 5) * 3)
  );

  /* ── render ── */
  const S = st;
  return (
    <div style={S.page}>

      {/* ══ SIDEBAR ══ */}
      <aside style={S.sidebar}>
        <div style={S.sbLogo}>Task<span style={{ color: PURPLE }}>Flow</span></div>

        <div style={S.sbUser}>
          <div style={S.sbAvatar}>{(user.name || "U")[0].toUpperCase()}</div>
          <div>
            <div style={S.sbName}>{user.name || "User"}</div>
            <div style={S.sbEmail}>{user.email || ""}</div>
          </div>
        </div>

        <div style={S.sbNav}>
          <div style={S.sbLabel}>Menu</div>
          <NavItem icon="⊞" label="Dashboard"     active={activeNav === "dashboard"} onClick={() => setActiveNav("dashboard")} />
          <NavItem icon="✓" label="My Tasks"      active={activeNav === "tasks"}     onClick={() => setActiveNav("tasks")} />
          <NavItem icon="🔥" label="High Priority" active={activeNav === "priority"} onClick={() => setActiveNav("priority")} />
          <NavItem icon="◷" label="Activity"      active={activeNav === "activity"}  onClick={() => setActiveNav("activity")} />
          <div style={{ ...S.sbLabel, marginTop: 20 }}>Workspace</div>
          <NavItem icon="⊕" label="New Task" onClick={() => setModal({})} />
        </div>

        <div style={S.sbBottom}>
          <div style={S.sbProgressLabel}>{pct}% tasks completed this week</div>
          <div style={S.sbBarBg}>
            <div style={{ ...S.sbBar, width: `${pct}%` }} />
          </div>
          <NavItem icon="→" label="Sign out" danger onClick={logout} />
        </div>
      </aside>

      {/* ══ CONTENT ══ */}
      <div style={S.content}>

        {/* Top bar */}
        <div style={S.topBar}>
          <div>
            <div style={S.topTitle}>{greeting()}, {user.name?.split(" ")[0] || "there"} 👋</div>
            <div style={S.topSub}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <button onClick={() => setModal({})} style={S.addBtn}>+ New Task</button>
        </div>

        <div style={S.inner}>

          {/* Stat cards */}
          <div style={S.statsGrid}>
            {[
              { label: "Total Tasks",  value: stats.total,      color: PURPLE,    icon: "📋" },
              { label: "To Do",        value: stats.todo,       color: "#888",    icon: "○" },
              { label: "In Progress",  value: stats.inProgress, color: "#d97706", icon: "⟳" },
              { label: "Completed",    value: stats.done,       color: "#16a34a", icon: "✓" },
            ].map((s) => (
              <div
  key={s.label}
  style={S.statCard}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
                <div style={{ ...S.statAccent, background: s.color }} />
                <div style={{ ...S.statNum, color: s.color }}>{s.value}</div>
                <div style={S.statLabel}>{s.label}</div>
                <div style={S.statIcon}>{s.icon}</div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div style={S.twoCol}>

            {/* Task list card */}
            <div style={S.card}>
              <div style={S.cardHd}>
                <span style={S.cardTitle}>
                  {activeNav === "priority" ? "🔥 High Priority"
                   : activeNav === "tasks"   ? "✓ All Tasks"
                   : "Recent Tasks"}
                </span>
                {activeNav !== "priority" && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {["all", "todo", "in-progress", "done"].map((f) => (
                      <button key={f} onClick={() => setFilter(f)}
                        style={filter === f ? S.pillActive : S.pillBtn}>
                        {f === "all" ? "All" : f === "in-progress" ? "Active" : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={S.spinner} />
                </div>
              ) : displayed.length === 0 ? (
                <div style={S.empty}>
                  <div style={{ fontSize: 42, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#333", marginBottom: 6 }}>No tasks here</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>Click "+ New Task" to get started</div>
                </div>
              ) : (
                displayed.map((task) => {
                  const st2  = getCfg(STATUSES, task.status);
                  const pr2  = getCfg(PRIORITIES, task.priority);
                  const done = task.status === "done";
                  return (
                    <div
  key={task._id}
  style={S.taskRow}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#f9f9ff";
    e.currentTarget.style.transform = "translateX(5px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.transform = "translateX(0)";
  }}
>
                      <button onClick={() => toggleDone(task)}
                        style={{ ...S.check, ...(done ? S.checkDone : {}) }} title="Toggle done">
                        {done && "✓"}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...S.taskTitle, ...(done ? S.taskDone : {}) }}>{task.title}</div>
                        {task.description && <div style={S.taskDesc}>{task.description}</div>}
                        <div style={{ display: "flex", gap: 6, marginTop: 7, flexWrap: "wrap", alignItems: "center" }}>
                          <Badge cfg={st2} />
                          <Badge cfg={pr2} />
                          <span style={{ fontSize: 11, color: "#ccc" }}>
                            {new Date(task.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button onClick={() => setModal(task)} style={S.iconBtn} title="Edit">✏️</button>
                        <button onClick={() => setDeleteId(task._id)}
                          style={{ ...S.iconBtn, background: "#fff5f5", borderColor: "#ffd0d0" }} title="Delete">🗑️</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right column widgets */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Weekly bar chart */}
              <div style={S.card}>
                <div style={S.cardHd}>
                  <span style={S.cardTitle}>Weekly Activity</span>
                  <span style={{ fontSize: 11, color: "#bbb" }}>tasks done</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                  {DAYS.map((d, i) => (
                    <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, flex: 1 }}>
                      <div style={{
                        background: i < 5 ? PURPLE : "#e8e8f0",
                        borderRadius: "4px 4px 0 0",
                        width: "100%",
                        height: `${barHeights[i]}%`,
                        minHeight: 4,
                        opacity: i < 5 ? 0.85 : 0.4,
                      }} />
                      <span style={{ fontSize: 9, color: "#bbb" }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={S.card}>
                <div style={S.cardHd}><span style={S.cardTitle}>Quick Actions</span></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { icon: "➕", label: "Add Task",      sub: "Create new",                    action: () => setModal({}) },
                    { icon: "🔥", label: "High Priority", sub: `${highPriority.length} urgent`,  action: () => setActiveNav("priority") },
                    { icon: "⏳", label: "In Progress",   sub: `${stats.inProgress} active`,     action: () => { setFilter("in-progress"); setActiveNav("tasks"); } },
                    { icon: "📊", label: "Progress",      sub: `${pct}% done`,                   action: () => {} },
                  ].map((q) => (
                    <button key={q.label} onClick={q.action} style={S.quickCard}>
                      <div style={{ fontSize: 20, marginBottom: 8 }}>{q.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>{q.label}</div>
                      <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{q.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Circular progress */}
              <div style={{ ...S.card, textAlign: "center" }}>
                <div style={{ ...S.cardTitle, marginBottom: 16 }}>Overall Progress</div>
                <div style={{ margin: "0 auto 10px", position: "relative", width: 84, height: 84 }}>
                  <svg width="84" height="84" viewBox="0 0 84 84">
                    <circle cx="42" cy="42" r="34" fill="none" stroke="#f0f0f8" strokeWidth="8" />
                    <circle
                      cx="42" cy="42" r="34"
                      fill="none" stroke={PURPLE} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 42 42)"
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 17, fontWeight: 800, color: PURPLE,
                  }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{stats.done} of {stats.total} tasks completed</div>
              </div>
            </div>
          </div>

          {/* High priority section — dashboard view only */}
          {activeNav === "dashboard" && highPriority.length > 0 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 12 }}>🔥 Needs Attention</div>
              {highPriority.slice(0, 3).map((task) => (
                <div key={task._id} style={S.priorityCard}>
                  <div style={{ width: 4, height: 38, borderRadius: 4, background: "#dc2626", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{task.title}</div>
                    {task.description && <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{task.description}</div>}
                  </div>
                  <Badge cfg={getCfg(STATUSES, task.status)} />
                  <button
  onClick={() => setModal({})}
  style={S.addBtn}
  onMouseEnter={(e) => {
    e.target.style.transform = "scale(1.05)";
    e.target.style.boxShadow = "0 8px 20px rgba(124,107,255,0.4)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "scale(1)";
    e.target.style.boxShadow = "none";
  }}
></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal !== null && (
        <TaskModal task={modal._id ? modal : null} onClose={() => setModal(null)} onSave={handleSave} />
      )}
      {deleteId && (
        <ConfirmModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      )}
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────── */
const st = {
  page: {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  sidebar: {
    background: DARK_BG, display: "flex", flexDirection: "column",
    position: "sticky", top: 0, height: "100vh", overflowY: "auto",
  },
  sbLogo: {
    padding: "24px 22px 20px", fontSize: 22, fontWeight: 800,
    color: "#fff", letterSpacing: "-0.5px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sbUser: {
    padding: "16px 22px", display: "flex", alignItems: "center", gap: 12,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  sbAvatar: {
    width: 36, height: 36, borderRadius: "50%", background: PURPLE,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  sbName:  { fontSize: 13, fontWeight: 700, color: "#fff" },
  sbEmail: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  sbNav:   { padding: "16px 12px", flex: 1 },
  sbLabel: {
    fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.25)", padding: "0 10px", marginBottom: 8,
    display: "block",
  },
  sbBottom: { padding: "12px 12px 20px" },
  sbProgressLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 6, paddingLeft: 4 },
  sbBarBg: { background: "rgba(255,255,255,0.08)", borderRadius: 20, height: 5, marginBottom: 14 },
  sbBar:   { background: PURPLE, borderRadius: 20, height: 5 },

  content: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  topBar: {
    background: "#fff", borderBottom: "1px solid #e8e8f0",
    padding: "14px 28px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 10,
  },
  topTitle: { fontSize: 16, fontWeight: 700, color: "#111" },
  topSub:   { fontSize: 12, color: "#bbb", marginTop: 2 },
  addBtn: {
  padding: "9px 20px",
  fontSize: 13,
  fontWeight: 700,
  background: PURPLE,
  color: "#fff",
  border: "none",
  borderRadius: 9,
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.3s ease",
},

  inner: { padding: "28px 28px 48px", flex: 1 },

  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 },
  statCard: {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.2)",
  transition: "all 0.3s ease",
  cursor: "pointer",
},
  statAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 3, borderRadius: "13px 13px 0 0" },
  statNum:    { fontSize: 36, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
  statLabel:  { fontSize: 11, textTransform: "uppercase", letterSpacing: "0.07em", color: "#999" },
  statIcon:   { position: "absolute", bottom: 14, right: 16, fontSize: 24, opacity: 0.1 },

  twoCol: { display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 24 },

  taskCard: {
  background: "rgba(255,255,255,0.2)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.2)"},
  cardHd: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginBottom: 18, flexWrap: "wrap", gap: 8,
  },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#111" },

  pillBtn: {
    padding: "4px 11px", fontSize: 11, borderRadius: 20,
    border: "1px solid #e2e2f0", background: "#fff",
    color: "#888", cursor: "pointer", fontFamily: "inherit",
  },
  pillActive: {
    padding: "4px 11px", fontSize: 11, borderRadius: 20,
    border: `1px solid ${PURPLE}`, background: "#f0eeff",
    color: PURPLE, cursor: "pointer", fontFamily: "inherit", fontWeight: 700,
  },

  taskRow: {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "12px 0",
  borderBottom: "1px solid #f4f4f8",
  transition: "all 0.25s ease",
},
  check: {
    width: 20, height: 20, borderRadius: "50%",
    border: "2px solid #d8d8ec", background: "transparent",
    cursor: "pointer", flexShrink: 0, marginTop: 2,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 10, fontWeight: 800, color: "#fff",
  },
  checkDone:  { background: "#16a34a", borderColor: "#16a34a" },
  taskTitle:  { fontSize: 14, fontWeight: 600, color: "#111" },
  taskDone:   { textDecoration: "line-through", color: "#bbb" },
  taskDesc:   { fontSize: 12, color: "#aaa", marginTop: 3, lineHeight: 1.4 },
  iconBtn: {
    padding: "6px 10px", fontSize: 14,
    background: "#f8f8ff", border: "1px solid #e8e8f0",
    borderRadius: 7, cursor: "pointer",
  },

  quickCard: {
    background: "#f8f8ff", border: "1px solid #e8e8f0",
    borderRadius: 10, padding: "14px 12px", textAlign: "left",
    cursor: "pointer", fontFamily: "inherit",
  },

  priorityCard: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "14px 18px", background: "#fff",
    border: "1px solid #e8e8f0", borderRadius: 11, marginBottom: 10,
  },

  spinner: {
    width: 30, height: 30, borderRadius: "50%",
    border: "3px solid #e8e8f0", borderTopColor: PURPLE,
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
  empty: { textAlign: "center", padding: "52px 20px" },
};