import React, { useState } from "react";
import API from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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
          <h1 style={styles.brandHeading}>Organize your work,<br />ship faster.</h1>
          <p style={styles.brandSub}>
            A clean, minimal task manager built for developers and teams who value clarity.
          </p>

          <ul style={styles.featureList}>
            {[
              "Real-time task tracking",
              "JWT-secured authentication",
              "Cloud database syncing",
              "Priority & status tagging",
            ].map((f) => (
              <li key={f} style={styles.featureItem}>
                <span style={styles.featureDot} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p style={styles.brandFooter}>© 2025 TaskFlow. Built for internship assessment.</p>
      </div>

      {/* ── Right form panel ── */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create your account</h2>
            <p style={styles.formSub}>Free forever. No credit card required.</p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input
                name="name"
                type="text"
                placeholder="Arjun Sharma"
                required
                value={form.name}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

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
              <label style={styles.label}>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                required
                value={form.password}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            <button type="submit" disabled={loading} style={loading ? styles.btnDisabled : styles.btn}>
              {loading ? "Creating account…" : "Create account →"}
            </button>
          </form>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <Link to="/" style={styles.link}>Sign in</Link>
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
  logo: {
    fontSize: 26,
    fontWeight: 600,
    color: "#ffffff",
    letterSpacing: "-0.5px",
  },
  logoAccent: { color: PURPLE },
  brandContent: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" },
  brandHeading: {
    fontSize: 32,
    fontWeight: 600,
    color: "#ffffff",
    lineHeight: 1.3,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  brandSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.75,
    marginBottom: 36,
    maxWidth: 320,
  },
  featureList: { listStyle: "none", padding: 0, margin: 0 },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    padding: "8px 0",
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: PURPLE,
    flexShrink: 0,
  },
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
    transition: "border-color 0.15s, box-shadow 0.15s",
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
    boxShadow: `0 0 0 3px rgba(124,107,255,0.12)`,
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
    transition: "opacity 0.15s",
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

export default Signup;