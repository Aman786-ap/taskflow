import React, { useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user)); // ADD THIS
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── Left brand panel ── */}
      <div style={styles.leftPanel}>
        <div style={styles.logo}>Task<span style={styles.logoAccent}>Flow</span></div>

        <div style={styles.brandContent}>
          <h1 style={styles.brandHeading}>Welcome back.<br />Let's get to work.</h1>
          <p style={styles.brandSub}>
            Sign in to pick up right where you left off. Your tasks are waiting.
          </p>

          <div style={styles.statsRow}>
            <div style={styles.statCard}>
              <div style={styles.statNum}>2.1K</div>
              <div style={styles.statLbl}>Active users</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNum}>18k</div>
              <div style={styles.statLbl}>Tasks completed</div>
            </div>
          </div>
        </div>

        <p style={styles.brandFooter}>© 2025 TaskFlow. Built By Aman Pathan.</p>
      </div>

      {/* ── Right form panel ── */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Sign in to TaskFlow</h2>
            <p style={styles.formSub}>Enter your credentials to continue.</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="arjun@example.com"
                required
                value={form.email}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.labelRow}>
                <span>Password</span>
                <a href="#!" style={styles.forgotLink}>Forgot password?</a>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.link}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Styles ──────────────────────────────────────────────────── */
const PURPLE = "#7c6bff";
const DARK_BG = "#1a1a2e";

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  /* Left */
  leftPanel: {
    flex: "0 0 42%",
    background: DARK_BG,
    padding: "48px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: { fontSize: 26, fontWeight: 600, color: "#fff", letterSpacing: "-0.5px" },
  logoAccent: { color: PURPLE },
  brandContent: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  brandHeading: {
    fontSize: 32,
    fontWeight: 600,
    color: "#fff",
    lineHeight: 1.3,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  brandSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.75,
    marginBottom: 36,
    maxWidth: 300,
  },
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  statCard: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "18px 16px",
  },
  statNum: { fontSize: 24, fontWeight: 700, color: PURPLE, marginBottom: 4 },
  statLbl: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  brandFooter: { fontSize: 11, color: "rgba(255,255,255,0.2)" },

  /* Right */
  rightPanel: {
    flex: 1,
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  formCard: { width: "100%", maxWidth: 400 },
  formHeader: { marginBottom: 28 },
  formTitle: { fontSize: 22, fontWeight: 600, color: "#111", marginBottom: 6 },
  formSub: { fontSize: 13, color: "#888" },

  /* Fields */
  field: { marginBottom: 18 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 7,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 11,
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 7,
  },
  forgotLink: {
    fontSize: 12,
    color: PURPLE,
    textDecoration: "none",
    textTransform: "none",
    letterSpacing: 0,
    fontWeight: 400,
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    color: "#111",
    background: "#f8f8fc",
    border: "1px solid #e2e2f0",
    borderRadius: 8,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  inputFocus: {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14,
    color: "#111",
    background: "#fff",
    border: `1px solid ${PURPLE}`,
    borderRadius: 8,
    outline: "none",
    fontFamily: "inherit",
    boxShadow: "0 0 0 3px rgba(124,107,255,0.12)",
    boxSizing: "border-box",
  },

  /* Button */
  btn: {
    width: "100%",
    padding: "12px",
    background: PURPLE,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 6,
    fontFamily: "inherit",
  },
  btnDisabled: {
    width: "100%",
    padding: "12px",
    background: "#b8b0ff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "not-allowed",
    marginTop: 6,
    fontFamily: "inherit",
  },

  /* Misc */
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffc5c5",
    color: "#c0392b",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 13,
    marginBottom: 18,
  },
  switchText: { textAlign: "center", fontSize: 13, color: "#888", marginTop: 22 },
  link: { color: PURPLE, textDecoration: "none", fontWeight: 600 },
};

export default Login;