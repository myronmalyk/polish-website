"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Emblem, { EmblemStyle } from "./Emblem";

type HeroImage = "front" | "side";
type HeroLayout = "left" | "center";

interface VantaPolishProps {
  emblemStyle?: EmblemStyle;
  heroImage?: HeroImage;
  heroLayout?: HeroLayout;
}

interface FormState {
  name: string;
  phone: string;
  vehicle: string;
  service: string;
  date: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const MONO = "'Space Mono', monospace";
const ARCHIVO = "Archivo, sans-serif";
const CHROME_FILL =
  "linear-gradient(180deg,#fbfbfc,#cfd3d6 45%,#9aa0a6 56%,#e9ebec)";

const emptyForm: FormState = {
  name: "",
  phone: "",
  vehicle: "",
  service: "",
  date: "",
  notes: "",
};

export default function VantaPolish({
  emblemStyle = "rings",
  heroImage = "front",
  heroLayout = "left",
}: VantaPolishProps) {
  const [scrolled, setScrolled] = useState(false);
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [baPos, setBaPos] = useState(50);
  const [baDragging, setBaDragging] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const baRef = useRef<HTMLDivElement | null>(null);

  // scroll + entrance animation (mirrors componentDidMount)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const t = setTimeout(() => setEntered(true), 70);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  const center = heroLayout === "center";

  const enter = (d: number): React.CSSProperties => ({
    transform: entered ? "none" : "translateY(16px)",
    transition: `transform .85s cubic-bezier(.2,.7,.2,1) ${d}s`,
  });

  // --- Before / after slider ---
  const baFromEvent = useCallback(
    (clientX: number) => {
      const el = baRef.current;
      if (!el) return baPos;
      const r = el.getBoundingClientRect();
      const p = ((clientX - r.left) / r.width) * 100;
      return Math.max(2, Math.min(98, p));
    },
    [baPos]
  );

  const baDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setBaDragging(true);
    setBaPos(baFromEvent(e.clientX));
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };
  const baMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (baDragging) setBaPos(baFromEvent(e.clientX));
  };
  const baUp = () => setBaDragging(false);

  // --- WhatsApp prefilled link ---
  let msg = "Hi Vanta Polish, I'd like to book a detail.";
  if (form.vehicle) msg += " Vehicle: " + form.vehicle + ".";
  if (form.service) msg += " Service: " + form.service + ".";
  if (form.date) msg += " Preferred date: " + form.date + ".";
  if (form.name) msg += " — " + form.name;
  const waHref = "https://wa.me/12065550188?text=" + encodeURIComponent(msg);

  // --- Form handlers ---
  const onField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const field = e.target.dataset.field as keyof FormState | undefined;
    if (!field) return;
    const v = e.target.value;
    setForm((s) => ({ ...s, [field]: v }));
    setErrors((s) => ({ ...s, [field]: undefined }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Please enter your name";
    if (!form.phone.trim()) errs.phone = "Please enter a phone number";
    if (!form.vehicle.trim()) errs.vehicle = "Tell us about your vehicle";
    if (!form.service) errs.service = "Pick a service";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    try {
      const book = document.getElementById("book");
      if (book) window.scrollTo({ top: book.offsetTop - 70, behavior: "smooth" });
    } catch {
      /* noop */
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setForm(emptyForm);
  };

  const nameSuffix = form.name ? " " + form.name.trim().split(" ")[0] : "";
  const vehicleSuffix = form.vehicle ? " for your " + form.vehicle : "";
  const phoneDisplay = form.phone ? form.phone : "you";

  // --- Derived styles ---
  const navSkinStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transition: "background .45s ease, border-color .45s ease, backdrop-filter .45s ease",
    background: scrolled
      ? "rgba(9,9,11,.74)"
      : "linear-gradient(180deg, rgba(0,0,0,.55), transparent)",
    backdropFilter: scrolled ? "blur(15px) saturate(1.3)" : "none",
    WebkitBackdropFilter: scrolled ? "blur(15px) saturate(1.3)" : "none",
    borderBottom: "1px solid " + (scrolled ? "rgba(255,255,255,.08)" : "transparent"),
  };

  const heroBgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(/assets/${heroImage === "side" ? "gla-side.jpeg" : "work-audi-q7.jpeg"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "contrast(1.08) brightness(.82) saturate(.92)",
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: ".16em",
    textTransform: "uppercase",
    color: "#b7bcc1",
  };

  const eyebrowMono: React.CSSProperties = {
    fontFamily: MONO,
    fontSize: 12,
    letterSpacing: ".28em",
    color: "#80868c",
    marginBottom: 18,
  };

  const services = [
    { n: "01", t: "Paint Correction", d: "Multi-stage machine polishing that removes swirl marks, scratches, and oxidation to restore a flawless, mirror-like finish." },
    { n: "02", t: "Ceramic Coating", d: "A durable nano-ceramic layer that locks in gloss, repels water and contaminants, and protects your paint for years." },
    { n: "03", t: "Hand Wash & Polish", d: "A meticulous hand wash and fine polish that safely lifts grime and brings depth and shine back to the paint." },
    { n: "04", t: "Headlight Restoration", d: "Cloudy, yellowed headlights sanded, polished, and sealed back to crystal clarity — for looks and safety." },
    { n: "05", t: "Wax & Sealant", d: "Premium carnauba wax or synthetic sealant for a warm, deep shine and months of added protection." },
  ];

  const processSteps = [
    { n: "01", t: "Inspect", d: "Paint-depth readings and a defect check under detailing lights." },
    { n: "02", t: "Correct", d: "Multi-stage polishing to remove swirls, scratches, and oxidation." },
    { n: "03", t: "Protect", d: "Ceramic coating or sealant locks in the finish for the long haul." },
    { n: "04", t: "Reveal", d: "Final wipe-down, inspection, and hand-back looking showroom-new." },
  ];

  const marqueeText =
    "PAINT CORRECTION  ◇  CERAMIC COATING  ◇  HAND WASH & POLISH  ◇  HEADLIGHT RESTORATION  ◇  WAX & SEALANT  ◇  SWIRL REMOVAL  ◇  ";

  const arrowIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h9M9 4l4 4-4 4" stroke="#0b0b0d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const waIcon = (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M4 20l1.4-4.1A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z" stroke="#e8eaec" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div
      id="top"
      style={{
        position: "relative",
        background: "#0a0a0c",
        color: "#f3f4f5",
        fontFamily: "Manrope, sans-serif",
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* shared chrome gradient */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="agChrome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.34" stopColor="#d2d6d9" />
            <stop offset="0.52" stopColor="#7b8086" />
            <stop offset="0.7" stopColor="#b0b5ba" />
            <stop offset="1" stopColor="#f1f2f3" />
          </linearGradient>
        </defs>
      </svg>

      {/* grain */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: "-25%",
          zIndex: 9000,
          pointerEvents: "none",
          opacity: 0.05,
          mixBlendMode: "overlay",
          animation: "agGrain 1.1s steps(2) infinite",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E\")",
        }}
      />

      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div style={navSkinStyle} />
        <nav
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            padding: "16px clamp(18px,4vw,56px)",
            maxWidth: 1440,
            margin: "0 auto",
          }}
        >
          <a href="#top" style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <Emblem size={36} style={emblemStyle} />
            <span
              style={{
                fontFamily: ARCHIVO,
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: ".2em",
                background:
                  "linear-gradient(100deg,#fff 0%,#cfd3d6 30%,#83888e 48%,#fbfbfc 62%,#aeb3b8 80%)",
                backgroundSize: "220% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                animation: "agShine 7s linear infinite",
              }}
            >
              VANTA&nbsp;POLISH
            </span>
          </a>
          <div className="vp-navlinks" style={{ display: "flex", alignItems: "center", gap: 34 }}>
            <a href="#work" className="vp-navlink" style={navLinkStyle}>Work</a>
            <a href="#services" className="vp-navlink" style={navLinkStyle}>Services</a>
            <a href="#process" className="vp-navlink" style={navLinkStyle}>Process</a>
            <a href="tel:+12065550188" className="vp-navlink-dim" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", color: "#7e848a" }}>
              (206)&nbsp;555-0188
            </a>
            <a
              href="#book"
              className="vp-chrome-btn"
              style={{
                background: CHROME_FILL,
                color: "#0b0b0d",
                fontFamily: ARCHIVO,
                fontWeight: 700,
                letterSpacing: ".04em",
                borderRadius: 999,
                padding: "11px 22px",
                fontSize: 13,
                boxShadow: "0 6px 22px rgba(0,0,0,.4)",
              }}
            >
              Book a detail
            </a>
          </div>
          <button
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Menu"
            className="vp-burger"
            style={{
              display: "none",
              background: "none",
              border: "1px solid rgba(255,255,255,.2)",
              borderRadius: 10,
              width: 44,
              height: 44,
              color: "#fff",
              cursor: "pointer",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <span style={{ display: "block", width: 18, height: 1.6, background: "#fff" }} />
            <span style={{ display: "block", width: 18, height: 1.6, background: "#fff" }} />
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            background: "rgba(8,8,10,.97)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            padding: "26px clamp(18px,5vw,40px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Emblem size={38} style={emblemStyle} />
              <span style={{ fontFamily: ARCHIVO, fontWeight: 800, letterSpacing: ".2em", color: "#eef0f1" }}>
                VANTA POLISH
              </span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close"
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 10,
                width: 44,
                height: 44,
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 46 }}>
            {[
              { href: "#work", label: "Work" },
              { href: "#services", label: "Services" },
              { href: "#process", label: "Process" },
              { href: "#book", label: "Book" },
            ].map((it) => (
              <a
                key={it.href}
                href={it.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: ARCHIVO,
                  fontWeight: 700,
                  fontSize: 34,
                  letterSpacing: "-.01em",
                  color: "#f3f4f5",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,.07)",
                }}
              >
                {it.label}
              </a>
            ))}
          </div>
          <a
            href="#book"
            onClick={() => setMenuOpen(false)}
            style={{
              marginTop: "auto",
              textAlign: "center",
              background: CHROME_FILL,
              color: "#0b0b0d",
              fontFamily: ARCHIVO,
              fontWeight: 700,
              borderRadius: 999,
              padding: 16,
              fontSize: 15,
            }}
          >
            Request a booking
          </a>
        </div>
      )}

      {/* HERO */}
      <section
        className="vp-hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px clamp(18px,4vw,56px) 90px",
          overflow: "hidden",
        }}
      >
        <div role="img" aria-label={heroImage === "side" ? "Freshly detailed Mercedes GLA" : "Freshly detailed Audi Q7"} style={heroBgStyle} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(8,8,10,.94) 0%,rgba(8,8,10,.7) 38%,rgba(8,8,10,.28) 72%,rgba(8,8,10,.5) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,#0a0a0c 1%,rgba(10,10,12,.1) 32%,transparent 60%),radial-gradient(120% 80% at 80% 30%,transparent 40%,rgba(8,8,10,.6) 100%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", top: "8%", right: -90, zIndex: 1 }}>
          <Emblem size={560} style={emblemStyle} ghost />
        </div>

        <div style={{ maxWidth: 1440, margin: "0 auto", width: "100%", position: "relative", zIndex: 3 }}>
          <div
            style={{
              position: "relative",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: center ? "center" : "flex-start",
              textAlign: center ? "center" : "left",
              maxWidth: center ? 860 : 760,
              margin: center ? "0 auto" : 0,
            }}
          >
            <div
              className="vp-hero-eyebrow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                fontFamily: MONO,
                fontSize: 12,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#9aa0a6",
                ...enter(0),
              }}
            >
              <span style={{ width: 26, height: 1, background: "linear-gradient(90deg,#7b8086,#e9ebec)", display: "inline-block" }} />
              Paint Correction · Ceramic Coating · Greater Seattle
            </div>
            <h1
              className="vp-hero-h1"
              style={{
                margin: "22px 0 0",
                fontFamily: ARCHIVO,
                fontWeight: 900,
                fontSize: "clamp(46px,8.2vw,108px)",
                lineHeight: 0.92,
                letterSpacing: "-.035em",
                color: "#f4f5f6",
                ...enter(0.08),
              }}
            >
              Every reflection,
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(100deg,#fff 0%,#d2d6d9 26%,#7b8086 46%,#fdfdfd 60%,#aeb3b8 82%)",
                  backgroundSize: "220% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  animation: "agShine 8s linear infinite",
                }}
              >
                perfected.
              </span>
            </h1>
            <p
              style={{
                margin: center ? "26px auto 0" : "26px 0 0",
                maxWidth: 540,
                fontSize: "clamp(15px,1.5vw,18px)",
                lineHeight: 1.65,
                color: "#aab0b6",
                ...enter(0.16),
              }}
            >
              A high-end detailing studio for paint correction, ceramic coating, and finishes that look better than the showroom floor. By appointment — mobile or in-studio.
            </p>
            <div
              className="vp-hero-cta"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                marginTop: 36,
                justifyContent: center ? "center" : "flex-start",
                ...enter(0.26),
              }}
            >
              <a
                href="#book"
                className="vp-chrome-btn-hero vp-hero-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: CHROME_FILL,
                  color: "#0b0b0d",
                  fontFamily: ARCHIVO,
                  fontWeight: 700,
                  letterSpacing: ".03em",
                  borderRadius: 999,
                  padding: "16px 28px",
                  fontSize: 15,
                  boxShadow: "0 10px 34px rgba(0,0,0,.45)",
                }}
              >
                Request a booking
                {arrowIcon}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener"
                className="vp-ghost-btn vp-hero-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,.04)",
                  color: "#e8eaec",
                  border: "1px solid rgba(255,255,255,.2)",
                  borderRadius: 999,
                  padding: "16px 26px",
                  fontFamily: ARCHIVO,
                  fontWeight: 600,
                  letterSpacing: ".03em",
                  fontSize: 15,
                }}
              >
                {waIcon}
                WhatsApp us
              </a>
            </div>
            <div
              className="vp-hero-chips"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px 18px",
                marginTop: 32,
                alignItems: "center",
                justifyContent: center ? "center" : "flex-start",
                ...enter(0.36),
              }}
            >
              {["BY APPOINTMENT", "MOBILE & STUDIO", "EST. 2026"].map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 && <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4a4f54" }} />}
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", color: "#80868c" }}>{c}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="vp-hero-scroll" style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animation: "agBob 2.4s ease-in-out infinite" }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: ".3em", color: "#80868c" }}>SCROLL</span>
          <span style={{ width: 1, height: 34, background: "linear-gradient(#80868c,transparent)" }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ position: "relative", zIndex: 4, borderTop: "1px solid rgba(255,255,255,.07)", borderBottom: "1px solid rgba(255,255,255,.07)", background: "#0c0c0f", overflow: "hidden", padding: "16px 0" }}>
        <div style={{ display: "flex", width: "max-content", animation: "agMarquee 32s linear infinite" }}>
          <span style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".26em", color: "#5c6166", whiteSpace: "nowrap" }}>{marqueeText}</span>
          <span aria-hidden="true" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: ".26em", color: "#5c6166", whiteSpace: "nowrap" }}>{marqueeText}</span>
        </div>
      </div>

      {/* SERVICES */}
      <section
        id="services"
        style={{
          position: "relative",
          scrollMarginTop: 84,
          padding: "clamp(70px,9vw,130px) clamp(18px,4vw,56px)",
          background: "radial-gradient(80% 60% at 50% 0%,rgba(170,180,190,.05),transparent 70%),#0a0a0c",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 54 }}>
            <div>
              <div style={eyebrowMono}>01 — SERVICES</div>
              <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.0, letterSpacing: "-.025em", color: "#f3f4f5" }}>
                Detailing, done properly.
              </h2>
            </div>
            <p style={{ margin: 0, maxWidth: 380, fontSize: 15, lineHeight: 1.7, color: "#9aa0a6" }}>
              Five core services, each performed by hand with professional-grade product and zero shortcuts.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {services.map((s) => (
              <article
                key={s.n}
                className="vp-svc-card"
                style={{
                  background: "#121215",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 18,
                  padding: 30,
                  transition: "transform .4s cubic-bezier(.2,.7,.2,1),border-color .4s,background .4s",
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 13, color: "#7b8086", marginBottom: 42 }}>{s.n}</div>
                <h3 style={{ margin: "0 0 12px", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 21, letterSpacing: "-.01em", color: "#f1f2f3" }}>{s.t}</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: "#92989e" }}>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ position: "relative", scrollMarginTop: 84, padding: "clamp(60px,8vw,110px) clamp(18px,4vw,56px)", background: "#0c0c0f", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="vp-ba-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "minmax(0,0.85fr) minmax(0,1.15fr)", gap: "clamp(32px,5vw,72px)", alignItems: "center" }}>
          <div>
            <div style={eyebrowMono}>02 — PAINT CORRECTION</div>
            <h2 style={{ margin: "0 0 20px", fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(30px,4.6vw,56px)", lineHeight: 1.02, letterSpacing: "-.025em", color: "#f3f4f5" }}>
              Swirls gone.<br />Depth back.
            </h2>
            <p style={{ margin: "0 0 18px", fontSize: 16, lineHeight: 1.72, color: "#9aa0a6", maxWidth: 420 }}>
              Most &quot;shine&quot; is hidden under a haze of swirl marks and wash scratches. Multi-stage machine polishing removes them and brings back the deep, wet-look gloss.
            </p>
            <p style={{ margin: 0, fontFamily: MONO, fontSize: 11, letterSpacing: ".16em", color: "#6b7075", textTransform: "uppercase" }}>
              Drag the handle to compare →
            </p>
          </div>
          <div
            ref={baRef}
            onPointerDown={baDown}
            onPointerMove={baMove}
            onPointerUp={baUp}
            style={{
              position: "relative",
              aspectRatio: "4/5",
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,.1)",
              boxShadow: "0 30px 80px rgba(0,0,0,.5)",
              cursor: "ew-resize",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            {/* after (base) */}
            <img src="/assets/ba-after.png" alt="BMW X5 — corrected, glossy finish" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", filter: "contrast(1.04) saturate(1.02)" }} />
            <span style={{ position: "absolute", top: 16, right: 16, fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#e9ebec", background: "rgba(8,8,10,.55)", border: "1px solid rgba(255,255,255,.18)", padding: "6px 11px", borderRadius: 999, backdropFilter: "blur(6px)" }}>AFTER</span>
            {/* before (clipped) */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden", clipPath: `inset(0 ${100 - baPos}% 0 0)`, willChange: "clip-path" }}>
              <img src="/assets/ba-before.png" alt="BMW X5 — swirled, scratched paint before correction" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 42%", filter: "none" }} />
              <span style={{ position: "absolute", top: 16, left: 16, fontFamily: MONO, fontSize: 10, letterSpacing: ".22em", color: "#cfd3d6", background: "rgba(8,8,10,.5)", border: "1px solid rgba(255,255,255,.16)", padding: "6px 11px", borderRadius: 999, backdropFilter: "blur(6px)" }}>BEFORE</span>
            </div>
            {/* handle */}
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${baPos}%`, transform: "translateX(-50%)", width: 46 }}>
              <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", transform: "translateX(-50%)", width: 2, background: "linear-gradient(#fff,#9aa0a6)", boxShadow: "0 0 18px rgba(255,255,255,.5)" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 46, height: 46, borderRadius: "50%", background: CHROME_FILL, boxShadow: "0 6px 20px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                  <path d="M7 3L3 7l4 4M13 3l4 4-4 4" stroke="#0b0b0d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORK / GALLERY */}
      <section id="work" style={{ position: "relative", scrollMarginTop: 84, padding: "clamp(70px,9vw,130px) clamp(18px,4vw,56px)", background: "#0a0a0c" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: 48 }}>
            <div>
              <div style={eyebrowMono}>03 — THE WORK</div>
              <h2 style={{ margin: 0, fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.0, letterSpacing: "-.025em", color: "#f3f4f5" }}>Recent work.</h2>
            </div>
            <p style={{ margin: 0, maxWidth: 340, fontSize: 15, lineHeight: 1.7, color: "#9aa0a6" }}>
              A look at cars that left the bay with a finish deeper than the day they were bought.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <figure style={{ margin: 0, position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", aspectRatio: "2/1" }}>
              <img src="/assets/work-audi-q7.jpeg" alt="Black Audi Q7 quattro detailed by the water at sunset" className="vp-gal-img-wide" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 56%", filter: "contrast(1.05) brightness(.97) saturate(1.02)", transition: "transform .9s cubic-bezier(.2,.7,.2,1),filter .6s", display: "block" }} />
              <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 26, background: "linear-gradient(0deg,rgba(8,8,10,.85),transparent)", fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", color: "#cfd3d6" }}>AUDI Q7 QUATTRO · CERAMIC COATING</figcaption>
            </figure>
            <div className="vp-gallery-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
              {[
                { src: "/assets/work-bmw-x6-front.jpeg", alt: "Black BMW X6 front profile after detail", cap: "BMW X6 · PAINT CORRECTION" },
                { src: "/assets/work-mercedes-gla.jpeg", alt: "White Mercedes GLA after hand polish", cap: "MERCEDES GLA · HAND POLISH" },
                { src: "/assets/work-bmw-x6-rear.jpeg", alt: "Black BMW X6 rear profile, glossy finish", cap: "BMW X6 · GLOSS ENHANCEMENT" },
              ].map((g) => (
                <figure key={g.cap} style={{ margin: 0, position: "relative", borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", aspectRatio: "3/2" }}>
                  <img src={g.src} alt={g.alt} className="vp-gal-img" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "contrast(1.05) brightness(.95) saturate(.98)", transition: "transform .8s cubic-bezier(.2,.7,.2,1),filter .6s", display: "block" }} />
                  <figcaption style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 18, background: "linear-gradient(0deg,rgba(8,8,10,.85),transparent)", fontFamily: MONO, fontSize: 11, letterSpacing: ".14em", color: "#cfd3d6" }}>{g.cap}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" style={{ position: "relative", scrollMarginTop: 84, padding: "clamp(70px,9vw,130px) clamp(18px,4vw,56px)", background: "#0c0c0f", borderTop: "1px solid rgba(255,255,255,.06)" }}>
        <div className="vp-process-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: "clamp(32px,5vw,70px)", alignItems: "center" }}>
          <div>
            <div style={eyebrowMono}>04 — THE PROCESS</div>
            <h2 style={{ margin: "0 0 40px", fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(32px,5vw,58px)", lineHeight: 1.0, letterSpacing: "-.025em", color: "#f3f4f5" }}>
              Four stages<br />to flawless.
            </h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {processSteps.map((p, i) => (
                <div
                  key={p.n}
                  style={{
                    display: "flex",
                    gap: 22,
                    padding: "22px 0",
                    borderTop: "1px solid rgba(255,255,255,.09)",
                    borderBottom: i === processSteps.length - 1 ? "1px solid rgba(255,255,255,.09)" : undefined,
                  }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 13, color: "#7b8086", paddingTop: 3, minWidth: 26 }}>{p.n}</span>
                  <div>
                    <h3 style={{ margin: "0 0 6px", fontFamily: ARCHIVO, fontWeight: 700, fontSize: 20, color: "#f1f2f3" }}>{p.t}</h3>
                    <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: "#92989e" }}>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", minHeight: 440, boxShadow: "0 30px 80px rgba(0,0,0,.5)" }}>
            <img src="/assets/at-work.jpeg" alt="Founder of Vanta Polish detailing a car" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", filter: "grayscale(.3) contrast(1.1) brightness(.66)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(8,8,10,.92) 6%,rgba(8,8,10,.2) 55%,rgba(8,8,10,.5))" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 34 }}>
              <p style={{ margin: "0 0 16px", fontFamily: ARCHIVO, fontWeight: 600, fontSize: "clamp(18px,2vw,24px)", lineHeight: 1.4, letterSpacing: "-.01em", color: "#f1f2f3" }}>
                &quot;I treat every car like it&apos;s leaving a showroom — because to its owner, it already is.&quot;
              </p>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: ".2em", color: "#9aa0a6" }}>— FOUNDER, VANTA POLISH</div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOK */}
      <section id="book" style={{ position: "relative", scrollMarginTop: 84, padding: "clamp(70px,9vw,130px) clamp(18px,4vw,56px)", background: "radial-gradient(70% 60% at 50% 100%,rgba(170,180,190,.05),transparent 70%),#0a0a0c" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ ...eyebrowMono, marginBottom: 18 }}>05 — BOOK</div>
            <h2 style={{ margin: "0 auto 18px", fontFamily: ARCHIVO, fontWeight: 800, fontSize: "clamp(34px,5.5vw,66px)", lineHeight: 1.0, letterSpacing: "-.03em", color: "#f3f4f5" }}>Request your detail.</h2>
            <p style={{ margin: "0 auto", maxWidth: 520, fontSize: 16, lineHeight: 1.65, color: "#9aa0a6" }}>
              Tell us about your car and what you&apos;re after — we&apos;ll text back within a few hours with a quote and the next opening.
            </p>
          </div>

          <div className="vp-book-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr .85fr", gap: "clamp(24px,3vw,40px)", alignItems: "start" }}>
            <div style={{ background: "#121215", border: "1px solid rgba(255,255,255,.08)", borderRadius: 22, padding: "clamp(24px,3vw,40px)" }}>
              {!submitted ? (
                <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  <Field label="Name" error={errors.name}>
                    <input data-field="name" value={form.name} onChange={onField} placeholder="Your name" className="vp-input" style={inputStyle} />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input data-field="phone" value={form.phone} onChange={onField} placeholder="(206) 555-0188" className="vp-input" style={inputStyle} />
                  </Field>
                  <Field label="Vehicle" error={errors.vehicle} full>
                    <input data-field="vehicle" value={form.vehicle} onChange={onField} placeholder="Year · Make · Model · Color" className="vp-input" style={inputStyle} />
                  </Field>
                  <Field label="Service" error={errors.service}>
                    <select data-field="service" value={form.service} onChange={onField} className="vp-input" style={{ ...inputStyle, appearance: "none" }}>
                      <option value="" style={{ background: "#0d0d10" }}>Select a service…</option>
                      <option value="Paint Correction" style={{ background: "#0d0d10" }}>Paint Correction</option>
                      <option value="Ceramic Coating" style={{ background: "#0d0d10" }}>Ceramic Coating</option>
                      <option value="Hand Wash & Polish" style={{ background: "#0d0d10" }}>Hand Wash &amp; Polish</option>
                      <option value="Headlight Restoration" style={{ background: "#0d0d10" }}>Headlight Restoration</option>
                      <option value="Wax & Sealant" style={{ background: "#0d0d10" }}>Wax &amp; Sealant</option>
                      <option value="Not sure — recommend" style={{ background: "#0d0d10" }}>Not sure — recommend</option>
                    </select>
                  </Field>
                  <Field label="Preferred date">
                    <input data-field="date" type="date" value={form.date} onChange={onField} className="vp-input" style={{ ...inputStyle, colorScheme: "dark" }} />
                  </Field>
                  <Field label="Notes" full>
                    <textarea data-field="notes" value={form.notes} onChange={onField} rows={3} placeholder="Condition, goals, anything we should know…" className="vp-input" style={{ ...inputStyle, minHeight: 96 }} />
                  </Field>
                  <div style={{ gridColumn: "1 / -1", display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 6 }}>
                    <button
                      type="submit"
                      className="vp-chrome-btn"
                      style={{ display: "inline-flex", alignItems: "center", gap: 10, background: CHROME_FILL, color: "#0b0b0d", fontFamily: ARCHIVO, fontWeight: 700, letterSpacing: ".03em", border: "none", borderRadius: 999, padding: "15px 30px", fontSize: 15, cursor: "pointer" }}
                    >
                      Request booking
                      {arrowIcon}
                    </button>
                    <a href={waHref} target="_blank" rel="noopener" className="vp-underline-link" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", color: "#9aa0a6", textDecoration: "underline", textUnderlineOffset: 4 }}>
                      or message on WhatsApp
                    </a>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <div style={{ width: 74, height: 74, borderRadius: "50%", margin: "0 auto 22px", background: CHROME_FILL, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 34px rgba(0,0,0,.5)" }}>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                      <path d="M9 17.5l5 5 11-12" stroke="#0b0b0d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 style={{ margin: "0 0 12px", fontFamily: ARCHIVO, fontWeight: 800, fontSize: 28, letterSpacing: "-.02em", color: "#f3f4f5" }}>Request received</h3>
                  <p style={{ margin: "0 auto 26px", maxWidth: 400, fontSize: 15, lineHeight: 1.65, color: "#9aa0a6" }}>
                    Thanks{nameSuffix} — we&apos;ve got your request{vehicleSuffix}. We&apos;ll text {phoneDisplay} within a few hours to confirm.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
                    <a href={waHref} target="_blank" rel="noopener" className="vp-ghost-btn" style={{ background: "rgba(255,255,255,.05)", color: "#e8eaec", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999, padding: "13px 24px", fontFamily: ARCHIVO, fontWeight: 600, fontSize: 14 }}>
                      Send the same details on WhatsApp
                    </a>
                    <button onClick={resetForm} className="vp-underline-link" style={{ background: "none", border: "none", color: "#9aa0a6", fontFamily: MONO, fontSize: 12, letterSpacing: ".1em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}>
                      Submit another request
                    </button>
                  </div>
                </div>
              )}
            </div>

            <aside style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <a href="tel:+12065550188" className="vp-contact-card" style={contactCardStyle}>
                <span style={contactIconStyle}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L16 13l5 2v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke="#cfd3d6" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </span>
                <span>
                  <span style={contactLabelStyle}>CALL OR TEXT</span>
                  <span style={contactValueStyle}>(206) 555-0188</span>
                </span>
              </a>
              <a href={waHref} target="_blank" rel="noopener" className="vp-contact-card" style={contactCardStyle}>
                <span style={contactIconStyle}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M4 20l1.4-4.1A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z" stroke="#cfd3d6" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </span>
                <span>
                  <span style={contactLabelStyle}>WHATSAPP</span>
                  <span style={contactValueStyle}>Message us</span>
                </span>
              </a>
              <a href="mailto:hello@vantapolish.co" className="vp-contact-card" style={contactCardStyle}>
                <span style={contactIconStyle}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#cfd3d6" strokeWidth="1.5" /><path d="M4 7l8 6 8-6" stroke="#cfd3d6" strokeWidth="1.5" /></svg>
                </span>
                <span>
                  <span style={contactLabelStyle}>EMAIL</span>
                  <span style={contactValueStyle}>hello@vantapolish.co</span>
                </span>
              </a>
              <div style={{ background: "#121215", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 20 }}>
                <span style={contactLabelStyle}>STUDIO &amp; HOURS</span>
                <span style={{ ...contactValueStyle, marginTop: 6 }}>Greater Seattle, WA</span>
                <span style={{ display: "block", fontSize: 13.5, color: "#9aa0a6", marginTop: 4 }}>Mon–Sat · 8am–6pm · By appointment</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ position: "relative", background: "#08080a", borderTop: "1px solid rgba(255,255,255,.07)", padding: "clamp(50px,6vw,80px) clamp(18px,4vw,56px) 36px" }}>
        <div className="vp-footer-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 36 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
              <Emblem size={44} style={emblemStyle} detail />
              <span style={{ fontFamily: ARCHIVO, fontWeight: 800, fontSize: 18, letterSpacing: ".2em", color: "#eef0f1" }}>VANTA POLISH</span>
            </div>
            <p style={{ margin: 0, maxWidth: 280, fontSize: 14, lineHeight: 1.65, color: "#80868c" }}>
              The art of the perfect finish. Premium auto detailing for the Greater Seattle area.
            </p>
          </div>
          <FooterCol title="SERVICES" links={[
            { href: "#services", label: "Paint Correction" },
            { href: "#services", label: "Ceramic Coating" },
            { href: "#services", label: "Hand Wash & Polish" },
            { href: "#services", label: "Headlight Restoration" },
          ]} />
          <FooterCol title="NAVIGATE" links={[
            { href: "#work", label: "Work" },
            { href: "#process", label: "Process" },
            { href: "#book", label: "Book a detail" },
          ]} />
          <FooterCol title="CONTACT" links={[
            { href: "tel:+12065550188", label: "(206) 555-0188" },
            { href: "mailto:hello@vantapolish.co", label: "hello@vantapolish.co" },
            { href: "https://instagram.com", label: "@vantapolish", external: true },
          ]} />
        </div>
        <div style={{ maxWidth: 1280, margin: "48px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.07)", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", fontFamily: MONO, fontSize: 11, letterSpacing: ".1em", color: "#6b7075" }}>
          <span>© 2026 VANTA POLISH · GREATER SEATTLE, WA</span>
          <span>PREMIUM AUTO DETAILING</span>
        </div>
      </footer>
    </div>
  );
}

/* ---- Small presentational helpers ---- */

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0d0d10",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 11,
  padding: "13px 14px",
  color: "#f3f4f5",
  fontSize: 15,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 11,
  letterSpacing: ".18em",
  textTransform: "uppercase",
  color: "#7e848a",
  marginBottom: 9,
};

const contactCardStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 15,
  background: "#121215",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 16,
  padding: 20,
};

const contactIconStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const contactLabelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 10,
  letterSpacing: ".2em",
  color: "#7e848a",
};

const contactValueStyle: React.CSSProperties = {
  display: "block",
  fontFamily: ARCHIVO,
  fontWeight: 600,
  fontSize: 16,
  color: "#f1f2f3",
  marginTop: 3,
};

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <span style={{ display: "block", marginTop: 6, fontSize: 12, color: "#d2766b" }}>{error}</span>}
    </div>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: ".2em", color: "#6b7075", marginBottom: 16 }}>{title}</div>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          {...(l.external ? { target: "_blank", rel: "noopener" } : {})}
          className="vp-foot-link"
          style={{ display: "block", fontSize: 14, color: "#a6abb0", padding: "5px 0" }}
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
