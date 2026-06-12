import React from "react";
import { useState, useEffect, useRef } from "react";

// ── data ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

const SKILLS = [
  { label: "Python", cat: "lang" },
  { label: "PyTorch", cat: "ml" },
  { label: "TensorFlow", cat: "ml" },
  { label: "Computer Vision", cat: "ml" },
  { label: "Large Language Models", cat: "ml" },
  { label: "GPT-4o", cat: "ml" },
  { label: "React", cat: "web" },
  { label: "JavaScript", cat: "lang" },
  { label: "Gradio", cat: "web" },
  { label: "Sentiment Analysis", cat: "ml" },
  { label: "CNNs", cat: "ml" },
  { label: "Git & GitHub", cat: "tool" },
  { label: "HuggingFace", cat: "tool" },
  { label: "REST APIs", cat: "web" },
];

const PROJECTS = [
  {
    title: "Social Media Intelligent Platform",
    tag: "NLP · LLM · RAG · React Dashboard",
    desc: "End-to-end brand monitoring platform on 9,929 Reddit posts. Combines 8 basic NLP techniques (NER, TF-IDF, K-Means, Word2Vec) with 9 advanced LLM methods — Twitter-RoBERTa, FAISS RAG, ReAct agent, crisis detection, multilingual analysis, and automated reporting. 85.7% sentiment F1, 91% crisis recall.",
    links: [{ label: "GitHub", url: "https://github.com/Sharon1-cmd/Social-Media-Intelligent-Platform" }],
    accent: "#7C5CFC",
  },
  {
    title: "Personal Financial Advisory Assistant",
    tag: "LLM · LoRA · Gradio · yfinance",
    desc: "Mistral-7B-Instruct powered chatbot with an 8-stage multi-turn dialogue system, live market data via Yahoo Finance, and role-based + chain-of-thought prompting. Includes LoRA fine-tuning of TinyLlama on a custom financial instruction dataset. Built with Gradio on Google Colab.",
    links: [{ label: "GitHub", url: "https://github.com/Sharon1-cmd/LLM_Chatbot" }],
    accent: "#A8F0E0",
  },
  {
    title: "Fine-Grained Image Classification",
    tag: "Computer Vision · Transfer Learning · Robot Deployment",
    desc: "Three-phase CV project classifying protein bar products from images. Phase 1: zero-shot transfer learning with ResNet50 & VGG16. Phase 2: fine-tuning with MixUp, CutOut, RandAugment. Phase 3: robot-camera domain adaptation — 96.67% accuracy after fine-tuning on 300 robot images.",
    links: [{ label: "GitHub", url: "https://github.com/Sharon1-cmd/Computer-Vision-Classification" }],
    accent: "#F5A623",
  },
];

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM",
];

// ── components ────────────────────────────────────────────────────────────────

function TypingText({ phrases }) {
  const [display, setDisplay] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1400);
      return () => clearTimeout(t);
    }
    const current = phrases[phraseIdx];
    const speed = deleting ? 40 : 75;
    const t = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        } else {
          setPaused(true);
          setDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        } else {
          setDeleting(false);
          setPhraseIdx((p) => (p + 1) % phrases.length);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [charIdx, deleting, paused, phraseIdx, phrases]);

  return (
    <span style={{ color: "#7C5CFC" }}>
      {display}
      <span className="cursor">|</span>
    </span>
  );
}

function FadeInSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Book a Meeting Modal ──────────────────────────────────────────────────────

function BookingModal({ onClose }) {
  const [step, setStep] = useState(1); // 1 = form, 2 = confirm, 3 = done
  const [form, setForm] = useState({ name: "", email: "", topic: "", date: "", time: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqzjpev";
  const today = new Date().toISOString().split("T")[0];

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.date)  e.date  = "Please pick a date";
    if (!form.time)  e.time  = "Please choose a time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) setStep(2);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          topic: form.topic || "Not specified",
          date: form.date,
          time: form.time + " AEST",
          _subject: `📅 Meeting Request from ${form.name}`,
        }),
      });
      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setSubmitError(data?.errors?.[0]?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#B0ABCA", letterSpacing: "0.04em" }}>{label}</label>
      <input
        type={type}
        value={form[key]}
        min={key === "date" ? today : undefined}
        placeholder={placeholder}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        style={{
          background: "rgba(255,255,255,0.05)",
          border: errors[key] ? "1px solid #FF6B8A" : "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10, padding: "11px 14px", color: "#E8E4F0",
          fontSize: 15, outline: "none", fontFamily: "inherit",
          transition: "border-color 0.2s",
        }}
        onFocus={(e) => e.target.style.borderColor = "#7C5CFC"}
        onBlur={(e) => e.target.style.borderColor = errors[key] ? "#FF6B8A" : "rgba(255,255,255,0.12)"}
      />
      {errors[key] && <span style={{ fontSize: 12, color: "#FF6B8A" }}>{errors[key]}</span>}
    </div>
  );

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(5,7,15,0.82)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      <div style={{
        background: "#12162A", border: "1px solid rgba(124,92,252,0.3)",
        borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 480,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: "slideUp 0.3s ease",
      }}>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7C5CFC", marginBottom: 6 }}>
              {step === 3 ? "Confirmed!" : "Schedule a Call"}
            </p>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#E8E4F0" }}>
              {step === 3 ? "You're all set 🎉" : step === 2 ? "Review your booking" : "Book a Meeting"}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#6A6680", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {/* step 1 – form */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {field("name", "Your Name", "text", "e.g. Alex Chen")}
            {field("email", "Email Address", "email", "you@example.com")}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#B0ABCA", letterSpacing: "0.04em" }}>Topic (optional)</label>
              <select
                value={form.topic}
                onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "11px 14px", color: form.topic ? "#E8E4F0" : "#6A6680",
                  fontSize: 15, outline: "none", fontFamily: "inherit",
                }}
              >
                <option value="">Select a topic…</option>
                <option>Research Collaboration</option>
                <option>Internship Opportunity</option>
                <option>Project Discussion</option>
                <option>General Chat / Networking</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {field("date", "Preferred Date", "date")}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#B0ABCA", letterSpacing: "0.04em" }}>Time Slot (AEST)</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: errors.time ? "1px solid #FF6B8A" : "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10, padding: "11px 14px", color: form.time ? "#E8E4F0" : "#6A6680",
                    fontSize: 15, outline: "none", fontFamily: "inherit",
                  }}
                >
                  <option value="">Pick a time…</option>
                  {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                </select>
                {errors.time && <span style={{ fontSize: 12, color: "#FF6B8A" }}>{errors.time}</span>}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              style={{
                marginTop: 8, padding: "14px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #7C5CFC, #9575ff)",
                color: "#fff", fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 15, cursor: "pointer",
                transition: "opacity 0.2s",
              }}
              onMouseOver={(e) => e.target.style.opacity = "0.88"}
              onMouseOut={(e) => e.target.style.opacity = "1"}
            >
              Review Booking →
            </button>
          </div>
        )}

        {/* step 2 – confirm */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["Name", form.name],
                ["Email", form.email],
                ["Topic", form.topic || "Not specified"],
                ["Date", form.date],
                ["Time (AEST)", form.time],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "#7070A0" }}>{k}</span>
                  <span style={{ color: "#E8E4F0", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#6A6680", lineHeight: 1.65 }}>
              Sharon will receive your request and confirm via email. Meetings are typically 30 minutes on Google Meet.
            </p>
            {submitError && (
              <p style={{ fontSize: 13, color: "#FF6B8A", background: "rgba(255,107,138,0.08)", border: "1px solid rgba(255,107,138,0.25)", borderRadius: 8, padding: "10px 14px" }}>
                ⚠ {submitError}
              </p>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(1)} disabled={submitting} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", color: "#B0ABCA", fontFamily: "inherit", fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.5 : 1 }}>
                ← Edit
              </button>
              <button onClick={handleConfirm} disabled={submitting} style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "#7C5CFC", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {submitting ? (
                  <><span style={{ display: "inline-block", width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Sending…</>
                ) : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {/* step 3 – done */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ fontSize: 56, marginBottom: 20 }}>📅</div>
            <p style={{ color: "#A8F0E0", fontSize: 16, fontWeight: 500, marginBottom: 10 }}>
              Booking request sent!
            </p>
            <p style={{ color: "#6A6680", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
              Thanks <strong style={{ color: "#E8E4F0" }}>{form.name}</strong>! Sharon will confirm your{" "}
              <strong style={{ color: "#E8E4F0" }}>{form.time}</strong> slot on{" "}
              <strong style={{ color: "#E8E4F0" }}>{form.date}</strong> via email shortly.
            </p>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 999, border: "none", background: "#7C5CFC", color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showBooking ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showBooking]);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0B0F1A", color: "#E8E4F0", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        .cursor { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        .skill-tag {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          border: 1px solid rgba(124,92,252,0.35);
          background: rgba(124,92,252,0.08);
          color: #C4B8FF;
          transition: all 0.2s;
          cursor: default;
        }
        .skill-tag:hover { background: rgba(124,92,252,0.22); border-color: #7C5CFC; color: #fff; }
        .skill-tag.ml  { border-color: rgba(168,240,224,0.35); background: rgba(168,240,224,0.07); color: #A8F0E0; }
        .skill-tag.ml:hover  { background: rgba(168,240,224,0.18); border-color: #A8F0E0; color: #fff; }
        .skill-tag.web { border-color: rgba(245,166,35,0.35); background: rgba(245,166,35,0.07); color: #F5C97A; }
        .skill-tag.web:hover { background: rgba(245,166,35,0.18); border-color: #F5A623; color: #fff; }
        .skill-tag.tool { border-color: rgba(232,228,240,0.2); background: rgba(232,228,240,0.05); color: #B0ABCA; }
        .skill-tag.tool:hover { background: rgba(232,228,240,0.1); color: #fff; }

        .nav-link {
          background: none; border: none; cursor: pointer;
          color: #B0ABCA; font-size: 14px; font-weight: 500;
          letter-spacing: 0.05em; padding: 6px 0;
          transition: color 0.2s;
          font-family: 'Space Grotesk', sans-serif;
        }
        .nav-link:hover { color: #fff; }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          padding: 32px;
          transition: border-color 0.25s, transform 0.25s;
        }
        .card:hover { border-color: rgba(124,92,252,0.5); transform: translateY(-3px); }

        .cta-btn {
          display: inline-block;
          padding: 12px 32px;
          border-radius: 999px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          border: none;
        }
        .cta-primary {
          background: #7C5CFC;
          color: #fff;
        }
        .cta-primary:hover { background: #9575ff; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(124,92,252,0.35); }
        .cta-outline {
          background: transparent;
          color: #E8E4F0;
          border: 1px solid rgba(232,228,240,0.3) !important;
        }
        .cta-outline:hover { border-color: #7C5CFC !important; color: #C4B8FF; transform: translateY(-2px); }
        .cta-calendar {
          background: rgba(168,240,224,0.1);
          color: #A8F0E0;
          border: 1px solid rgba(168,240,224,0.3) !important;
        }
        .cta-calendar:hover { background: rgba(168,240,224,0.2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,240,224,0.15); }

        .section-label {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #7C5CFC;
          margin-bottom: 12px;
        }
        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 700;
          color: #E8E4F0;
          margin-bottom: 16px;
        }

        .exp-empty {
          text-align: center;
          padding: 64px 32px;
          border: 1.5px dashed rgba(124,92,252,0.35);
          border-radius: 16px;
          background: rgba(124,92,252,0.04);
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          color: #B0ABCA;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .social-link:hover { border-color: rgba(124,92,252,0.45); color: #E8E4F0; background: rgba(124,92,252,0.08); transform: translateY(-2px); }

        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .hero-actions { flex-direction: column; }
        }
      `}</style>

      {/* ── BOOKING MODAL ── */}
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 max(24px, 5vw)", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(11,15,26,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s",
      }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>
          sharon<span style={{ color: "#7C5CFC" }}>.</span>
        </span>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <button key={l} className="nav-link" onClick={() => scrollTo(l)}>{l}</button>
          ))}
          <button
            className="cta-btn cta-calendar"
            style={{ padding: "8px 20px", fontSize: 13 }}
            onClick={() => setShowBooking(true)}
          >
            📅 Book a Meeting
          </button>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#E8E4F0", fontSize: 22 }}
          className="hamburger"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "rgba(11,15,26,0.97)", backdropFilter: "blur(12px)",
          padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {NAV_LINKS.map((l) => (
            <button key={l} className="nav-link" style={{ fontSize: 18 }} onClick={() => scrollTo(l)}>{l}</button>
          ))}
          <button className="cta-btn cta-calendar" style={{ width: "fit-content" }} onClick={() => { setMenuOpen(false); setShowBooking(true); }}>
            📅 Book a Meeting
          </button>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="about" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "100px max(24px, 8vw) 80px", position: "relative" }}>
        <FadeInSection>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#7C5CFC", marginBottom: 24 }}>
            👋 &nbsp;Hello, I'm
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "clamp(48px, 9vw, 88px)", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 20 }}>
            Sharon Manohar
          </h1>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, fontSize: "clamp(20px, 3.5vw, 34px)", color: "#9090AA", lineHeight: 1.3, marginBottom: 36, maxWidth: 660 }}>
            Postgraduate student building{" "}
            <TypingText phrases={["Computer Vision systems.", "LLM-powered applications.", "AI that actually works.", "intelligent platforms."]} />
          </h2>

          <p style={{ fontSize: 17, color: "#8A86A0", lineHeight: 1.75, maxWidth: 560, marginBottom: 48 }}>
            Studying <strong style={{ color: "#C4B8FF" }}>Advanced Computer Vision</strong> and <strong style={{ color: "#A8F0E0" }}>Large Language Models</strong> at Macquarie University. I build things at the intersection of deep learning research and real-world software.
          </p>

          <div className="hero-actions" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="cta-btn cta-primary" onClick={() => scrollTo("Projects")}>View Projects</button>
            <button className="cta-btn cta-outline" onClick={() => scrollTo("Contact")}>Get in Touch</button>
            <button className="cta-btn cta-calendar" onClick={() => setShowBooking(true)}>📅 Book a Meeting</button>
          </div>
        </FadeInSection>

        <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35 }}>
          <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>scroll</span>
          <div style={{ width: 1, height: 48, background: "linear-gradient(to bottom, #7C5CFC, transparent)" }} />
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: "80px max(24px, 8vw)" }}>
        <FadeInSection>
          <p className="section-label">What I work with</p>
          <h2 className="section-title">Skills & Technologies</h2>
          <p style={{ color: "#8A86A0", fontSize: 16, maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
            From neural architectures to deployment pipelines — tools I reach for to turn ideas into running systems.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SKILLS.map((s) => (
              <span key={s.label} className={`skill-tag ${s.cat}`}>{s.label}</span>
            ))}
          </div>
        </FadeInSection>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ padding: "80px max(24px, 8vw)" }}>
        <FadeInSection>
          <p className="section-label">Built & shipped</p>
          <h2 className="section-title">Projects</h2>
        </FadeInSection>

        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginTop: 40 }}>
          {PROJECTS.map((p, i) => (
            <FadeInSection key={p.title} delay={i * 100}>
              <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.accent, marginTop: 4, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#7070A0", fontWeight: 500, letterSpacing: "0.04em", textAlign: "right" }}>{p.tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#E8E4F0" }}>{p.title}</h3>
                <p style={{ color: "#8A86A0", fontSize: 15, lineHeight: 1.7, flex: 1 }}>{p.desc}</p>
                {p.links.length > 0 && (
                  <div style={{ display: "flex", gap: 12 }}>
                    {p.links.map((lk) => (
                      <a key={lk.label} href={lk.url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 13, fontWeight: 600, color: "#7C5CFC", textDecoration: "none" }}
                      >
                        ↗ {lk.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: "80px max(24px, 8vw)" }}>
        <FadeInSection>
          <p className="section-label">Where I've been</p>
          <h2 className="section-title">Experience</h2>
          <p style={{ color: "#8A86A0", fontSize: 16, maxWidth: 480, marginBottom: 40, lineHeight: 1.7 }}>
            My professional journey — roles, internships, and work that shaped how I think.
          </p>

          {/* EMPTY STATE — remove once you add real experiences */}
          <div className="exp-empty">
            <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: "#C4B8FF", marginBottom: 10 }}>
              Experiences coming soon
            </p>
            <p style={{ color: "#6A6680", fontSize: 15, maxWidth: 340, margin: "0 auto", lineHeight: 1.65 }}>
              This section is ready and waiting. Add roles, internships, or research positions whenever you're ready.
            </p>
          </div>

          {/* ── EXAMPLE (uncomment and edit to use) ──
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 8 }}>
            {[
              {
                role: "Your Role Here",
                company: "Company / Organization",
                period: "Jan 2025 – Present",
                desc: "A short description of what you did and what you achieved.",
                tags: ["Python", "ML", "Relevant Skill"],
              },
            ].map((exp, i) => (
              <FadeInSection key={exp.role} delay={i * 80}>
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: "#E8E4F0" }}>{exp.role}</h3>
                      <p style={{ color: "#7C5CFC", fontSize: 15, fontWeight: 500, marginTop: 4 }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: 13, color: "#6A6680", fontWeight: 500, marginTop: 4 }}>{exp.period}</span>
                  </div>
                  <p style={{ color: "#8A86A0", fontSize: 15, lineHeight: 1.7 }}>{exp.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {exp.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          ──────────────────────────────── */}
        </FadeInSection>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "80px max(24px, 8vw) 120px" }}>
        <FadeInSection>
          <p className="section-label">Let's connect</p>
          <h2 className="section-title">Get in Touch</h2>
          <p style={{ color: "#8A86A0", fontSize: 16, maxWidth: 520, marginBottom: 48, lineHeight: 1.75 }}>
            Whether it's a research collab, internship, or just a chat about AI — reach out through any of these channels.
          </p>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 600, marginBottom: 40 }}>
            <a href="https://github.com/Sharon1-cmd" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              github.com/Sharon1-cmd
            </a>

            <a href="https://www.linkedin.com/in/sharon-manohar-1590432b3" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Sharon Manohar
            </a>

            <a href="mailto:sharonmanohar112@gmail.com" className="social-link" style={{ gridColumn: "1 / -1" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
              </svg>
              sharonmanohar112@gmail.com
            </a>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="cta-btn cta-calendar" onClick={() => setShowBooking(true)}>
              📅 Book a Meeting
            </button>
            <a href="mailto:sharonmanohar112@gmail.com" className="cta-btn cta-primary">
              Say Hello →
            </a>
          </div>
        </FadeInSection>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "24px max(24px, 8vw)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15 }}>
          Sharon Manohar<span style={{ color: "#7C5CFC" }}>.</span>
        </span>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <a href="https://github.com/Sharon1-cmd" target="_blank" rel="noopener noreferrer" style={{ color: "#50507A", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="#B0ABCA"} onMouseOut={e => e.target.style.color="#50507A"}>GitHub</a>
          <a href="https://www.linkedin.com/in/sharon-manohar-1590432b3" target="_blank" rel="noopener noreferrer" style={{ color: "#50507A", fontSize: 13, textDecoration: "none", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color="#B0ABCA"} onMouseOut={e => e.target.style.color="#50507A"}>LinkedIn</a>
          <span style={{ color: "#50507A", fontSize: 13 }}>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
