"use client";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { CheckSquare, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { VALORES, SERVICIOS, MARCAS, CONTACTO_INFO, PAGE_BANDS, SECTIONS } from "@/data/heroData";
import type { Marca } from "@/data/heroData";

const RoadScene = dynamic(() => import("@/components/canvas/RoadScene"), { ssr: false });

// ── Math helpers ──────────────────────────────────────────────────────────────
function norm(p: number, a: number, b: number) {
  return Math.max(0, Math.min(1, (p - a) / (b - a)));
}
function eo(t: number) { return 1 - (1 - t) ** 3; }
function e(p: number, a: number, b: number) { return eo(norm(p, a, b)); }
function fade(p: number, a: number, b: number, c: number, d: number) {
  if (p < a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p <= c) return 1;
  return 1 - (p - c) / (d - c);
}

// Style builders — only opacity + transform (GPU composited)
const up  = (t: number, d = 28) => ({ opacity: t, transform: `translateY(${(1-t)*d}px)` } as React.CSSProperties);
const lft = (t: number, d = 50) => ({ opacity: t, transform: `translateX(${(1-t)*-d}px)` } as React.CSSProperties);
const rgt = (t: number, d = 50) => ({ opacity: t, transform: `translateX(${(1-t)*d}px)` } as React.CSSProperties);
const sc  = (t: number)         => ({ opacity: t, transform: `scale(${0.86 + t * 0.14})` } as React.CSSProperties);




function BrandCard({ name, logo, accent, tagline, phrase, onExpand }: Marca & { onExpand: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setTilt({
      y:  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 10,
      x: -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 10,
    });
  };

  return (
    <div
      ref={cardRef}
      style={{
        width: 380,
        height: 460,
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.03 : 1})`,
        transition: hovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onClick={onExpand}
    >
      <div style={{
        position: "absolute", inset: 0,
        borderRadius: 24,
        border: `1px solid ${hovered ? `${accent}66` : `${accent}33`}`,
        background: hovered ? "rgba(255,255,255,0.07)" : "rgba(5,18,62,0.92)",
        backdropFilter: hovered ? "blur(8px)" : undefined,
        boxShadow: hovered
          ? `0 12px 45px rgba(255,141,43,0.18), 0 6px 30px rgba(0,0,0,0.4)`
          : "0 6px 30px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 24, padding: 40, overflow: "hidden",
        transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
      }}>
        {/* Glow blob */}
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 140, height: 140,
          background: `radial-gradient(circle, ${accent}25, transparent 70%)`,
          borderRadius: "50%", filter: "blur(20px)", pointerEvents: "none",
          opacity: hovered ? 1 : 0, transition: "opacity 0.4s",
        }} />

        <div style={{ perspective: 1000, display: "flex", justifyContent: "center" }}>
          <motion.img
            src={logo} alt={name} draggable={false}
            animate={{ rotateY: hovered ? 360 : 0 }}
            transition={hovered ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] } : { duration: 0.4 }}
            style={{ height: 100, objectFit: "contain", display: "block" }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: 0, letterSpacing: 3 }}>{name}</h3>
          <p style={{ fontSize: 13, fontWeight: 600, color: accent, margin: "6px 0 0" }}>{tagline}</p>
        </div>
        <div style={{ height: 2, width: 36, background: accent }} />
        {phrase && (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "center", lineHeight: 1.55, margin: "0 4px" }}>
            {phrase}
          </p>
        )}
        <div style={{
          fontSize: 13, fontWeight: 600, color: accent,
          border: `1px solid ${accent}44`, borderRadius: 20, padding: "8px 20px",
          background: hovered ? `${accent}15` : "transparent",
          transition: "background 0.2s",
        }}>
          Explorar →
        </div>
      </div>
    </div>
  );
}

export default function HeroPage() {
  const p = useScrollProgress();
  const [sceneReady, setSceneReady] = useState(false);
  const [activeMarca, setActiveMarca] = useState<number | null>(null);
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeroSlide(s => (s + 1) % 3), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Section opacities (asymmetric bands) ─────────────────────────────────
  const heroO = p < 0.10 ? 1 : p < 0.15 ? 1 - (p - 0.10) / 0.05 : 0;
  const nosO  = fade(p, 0.10, 0.12, 0.205, 0.22);
  const servO = fade(p, 0.22, 0.25, 0.79, 0.82);
  const marcO = fade(p, 0.82, 0.84, 0.87, 0.90);
  const contO = fade(p, 0.90, 0.92, 0.98, 1.01);

  const sectionO = [heroO, nosO, servO, marcO, contO];

  // ── Local build progressions ──────────────────────────────────────────────
  const nL = norm(p, 0.10, 0.21);
  const sL = norm(p, 0.22, 0.82);
  const mL = norm(p, 0.82, 0.90);
  const cL = norm(p, 0.90, 0.98);

  // ── Hero build — CSS one-shot entrance, no scroll dependency ──
  const ha = (d: number) => ({ animation: `heroFadeUp 0.7s ease-out ${0.35 + d}s both` } as React.CSSProperties);
  const hCue = 1 - norm(p, 0.07, 0.12);

  // ── Nosotros build ──
  const nLabel = e(nL, 0.00, 0.14);
  const nTitle = e(nL, 0.10, 0.28);
  const nText  = e(nL, 0.24, 0.44);
  const nLine  = norm(nL, 0.38, 0.58);
  const nS1    = e(nL, 0.42, 0.58);
  const nS2    = e(nL, 0.50, 0.66);
  const nS3    = e(nL, 0.58, 0.74);
  const nC     = [e(nL,0.62,0.78), e(nL,0.67,0.83), e(nL,0.72,0.88), e(nL,0.77,0.93)];
  const years    = Math.round(nS1 * 27);
  const services = Math.round(nS2 * 7);

  // ── Servicios carousel ──
  const sLabel    = e(sL, 0.00, 0.03);
  const sTitle    = e(sL, 0.01, 0.05);
  // Dwell mapping: 55% hold per card + 0.8-segment tail so last card has reading time
  const _N     = SERVICIOS.length;
  const _hold  = 0.65;
  const _tail  = 0.8;
  const _sRaw  = sL * (_N - 1 + _tail);
  let sActiveF: number;
  if (_sRaw >= _N - 1) {
    sActiveF = _N - 1;
  } else {
    const _sSeg = Math.floor(Math.min(_sRaw, _N - 1.0001));
    const _sW   = _sRaw - _sSeg;
    sActiveF = _sSeg + (_sW < _hold ? 0 : (_sW - _hold) / (1 - _hold));
  }
  const sActiveIdx = Math.min(_N - 1, Math.max(0, Math.round(sActiveF)));

  // ── Marcas build ──
  const mLabel = e(mL, 0.00, 0.18);
  const mTitle = e(mL, 0.12, 0.32);
  const mText  = e(mL, 0.28, 0.48);
  const mC     = [e(mL, 0.28, 0.56), e(mL, 0.44, 0.72)];

  // ── Contacto build ──
  const cLabel = e(cL, 0.00, 0.18);
  const cTitle = e(cL, 0.10, 0.28);
  const cForm  = e(cL, 0.22, 0.50);
  const cInfo  = e(cL, 0.46, 0.68);

  // Scroll snap: pulls into nearest section only from travel zones
  useEffect(() => {
    // Safe zones = full content band per section — no snap while user is reading
    const SAFE_ZONES: [number, number][] = [
      [0.00, 0.10],  // Inicio
      [0.10, 0.22],  // Nosotros
      [0.22, 0.82],  // Servicios
      [0.82, 0.90],  // Marcas
      [0.90, 1.01],  // Contacto
    ];
    // Travel zones (camera moving, no readable content) + where to snap
    const TRAVEL_ZONES: [number, number, number][] = [
      [0.072, 0.10,  0.13], // Inicio→Nosotros
      [0.187, 0.22,  0.25], // Nosotros→Servicios
      [0.872, 0.90,  0.92], // Marcas→Contacto
    ];

    let snapping = false;
    let snapTimeout: ReturnType<typeof setTimeout>;

    function doSnap() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const p = window.scrollY / total;
      // Don't snap if user is inside any content zone
      if (SAFE_ZONES.some(([a, b]) => p >= a && p < b)) return;
      // Find matching travel zone
      const zone = TRAVEL_ZONES.find(([a, b]) => p >= a && p < b);
      if (!zone) return;
      snapping = true;
      window.scrollTo({ top: zone[2] * total, behavior: "smooth" });
      // Lock long enough for smooth scroll to finish before accepting new events
      setTimeout(() => { snapping = false; }, 900);
    }

    const onScroll = () => {
      if (snapping) return;
      clearTimeout(snapTimeout);
      snapTimeout = setTimeout(doSnap, 300);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(snapTimeout);
    };
  }, []);

  // Open Vigía card from Navbar button
  useEffect(() => {
    const handler = () => setActiveMarca(0);
    window.addEventListener("openVigia", handler);
    return () => window.removeEventListener("openVigia", handler);
  }, []);

  // Lock scroll while a marca panel is open
  useEffect(() => {
    if (activeMarca !== null) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "";
    }
    return () => { document.documentElement.style.overflowY = ""; };
  }, [activeMarca]);

  // Form state
  const [empRange, setEmpRange] = useState("");
  const [hoveredVal, setHoveredVal] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "", empresa: "", cargo: "", telefono: "", email: "", servicio: "", mensaje: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const setField = (k: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!formData.nombre || !formData.email) return;
    setFormStatus("loading");
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.nombre,
          empresa:   formData.empresa,
          cargo:     formData.cargo,
          telefono:  formData.telefono,
          reply_to:  formData.email,
          servicio:  servicioSel || formData.servicio || "No especificado",
          empleados: empRange   || "No especificado",
          mensaje:   formData.mensaje,
          name:      formData.nombre,
          date:      new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
          title:     `Nuevo contacto: ${formData.nombre} (${formData.empresa})`,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      setFormStatus("success");
      setFormData({ nombre: "", empresa: "", cargo: "", telefono: "", email: "", mensaje: "",servicio: "" });
      setEmpRange("");
      setServicioSel("");
    } catch {
      setFormStatus("error");
    }
  };
  const [servicioOpen, setServicioOpen] = useState(false);
  const [servicioSel, setServicioSel] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageTitle, setExpandedImageTitle] = useState("");

  useEffect(() => {
    if (!servicioOpen) return;
    const close = () => setServicioOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [servicioOpen]);

  // Input base styles — dark, matches site palette
  const iCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors text-white placeholder:text-white/25 focus:border-[#ff8d2b]";
  const iSty = { borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", color: "white" } as React.CSSProperties;

  return (
    <div className="relative" style={{ height: "800vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── WebGL Road background ─────────────────────────────────────────── */}
        <RoadScene progress={p} className="absolute inset-0 w-full h-full" onReady={() => setSceneReady(true)} />

        {/* ── Section watermark ─────────────────────────────────────────────── */}
        {SECTIONS.map(({ num }, i) => (
          <div
            key={num}
            className="absolute right-8 bottom-16 font-extrabold leading-none pointer-events-none select-none text-[180px]"
            style={{ opacity: sectionO[i] * 0.12, color: "#ffffff" }}
          >
            {num}
          </div>
        ))}

        {/* ── Section label bottom-left ─────────────────────────────────────── */}
        {SECTIONS.map(({ num, label }, i) => (
          <div key={num} className="absolute bottom-8 left-8 z-20 pointer-events-none" style={{ opacity: sectionO[i] }}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25">
              {num} / 05 — {label}
            </p>
          </div>
        ))}

        {/* ── Nav dots ─────────────────────────────────────────────────────── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {SECTIONS.map(({ label }, i) => {
            const from = PAGE_BANDS[i];
            const to   = PAGE_BANDS[i + 1];
            const active = p >= from && p < to;
            return (
              <div key={label} className="group flex items-center gap-2 justify-end">
                <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {label}
                </span>
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  active ? 10 : 6,
                    height: active ? 10 : 6,
                    background: active ? "#ff8d2b" : "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── SCENE 1: HERO ─────────────────────────────────────────────────── */}
        {sceneReady && <div className="absolute inset-0 flex items-start pt-[18vh] z-10 pointer-events-none" style={{ opacity: heroO }}>

          <AnimatePresence mode="wait">
            {heroSlide === 0 ? (
              <motion.div
                key="slide-consalud"
                className="max-w-6xl mx-auto px-8 w-full flex items-center justify-between gap-8"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  <div style={ha(0.1)}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-8">
                      Aliado Vital SST · Bogotá · Desde 1998
                    </p>
                  </div>

                  <h1
                    className="text-5xl md:text-[3.75rem] font-extrabold text-white leading-tight"
                    style={{ ...ha(0.2), marginBottom: 28 }}
                  >
                    Tu socio<br /><span style={{ background: "linear-gradient(90deg, #ff8d2b, #05123e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>estratégico</span><br />en SST.
                  </h1>

                  <p className="text-xl text-white/80 max-w-lg leading-relaxed mb-8" style={{ ...ha(0.5), textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
                    Protegemos a tu equipo con soluciones a la medida &nbsp;sin
                    improvisaciones, con respaldo académico y experiencia real.
                  </p>

                  <div
                    className="flex flex-col sm:flex-row gap-4"
                    style={{ ...ha(0.6), pointerEvents: heroO > 0.05 ? "auto" : "none" }}
                  >
                    <button
                      className="px-8 py-3.5 rounded-full font-semibold text-[#05123e] hover:brightness-110 transition-all cursor-pointer border-none"
                      style={{ background: "#ff8d2b" }}
                    >
                      Diagnostico Gratuito ➤
                    </button>
                  </div>
                </div>

                {/* Right: Consalud logo */}
                <div className="hidden md:flex flex-shrink-0 items-center justify-center" style={ha(0.3)}>
                  <img
                    src="/logoConsalud.png"
                    alt="Consalud"
                    style={{ height: "clamp(120px, 14vw, 200px)", width: "auto", objectFit: "contain", opacity: 0.92 }}
                    draggable={false}
                  />
                </div>
              </motion.div>
            ) : heroSlide === 1 ? (
              <motion.div
                key="slide-vigia"
                className="max-w-6xl mx-auto px-8 w-full flex items-center justify-between gap-8"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Left: text content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.10, duration: 0.5 }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-8">
                      El Futuro de la Prevención en Colombia · IA & Visión Computacional
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.20, duration: 0.55 }}
                    style={{ marginBottom: 40 }}
                  >
                    <img
                      src="/vigiaWhite.png"
                      alt="Vigía Salud Inteligente"
                      style={{ height: "clamp(80px, 12vw, 160px)", objectFit: "contain", display: "block" }}
                      draggable={false}
                    />
                  </motion.div>

                  <motion.p
                    className="text-xl text-white/80 max-w-lg leading-relaxed mb-12"
                    style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.40, duration: 0.55 }}
                  >
                    <span style={{ display: "block", fontSize: "clamp(13px,1.5vw,15px)", color: "#ff8d2b", fontWeight: 700, marginBottom: 10 }}>
                      En Colombia, un trabajador fallece cada 20 horas.
                    </span>
                    Vigía alerta ANTES del incidente — cámaras, IA y rastreo visual inteligente para prevenir en tiempo real. Desarrollada en Colombia con Ingeniería Alemana.
                  </motion.p>

                  <motion.div
                    className="flex flex-col sm:flex-row gap-4"
                    style={{ pointerEvents: heroO > 0.05 ? "auto" : "none" }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.50, duration: 0.55 }}
                  >
                    <button
                      className="px-8 py-3.5 rounded-full font-semibold text-[#05123e] hover:brightness-110 transition-all cursor-pointer border-none"
                      style={{ background: "#ff8d2b" }}
                    >
                      Agenda tu demo — Cupo Limitado ➤
                    </button>
                    <button
                      className="px-8 py-3.5 rounded-full font-semibold text-white hover:bg-white/10 transition-all cursor-pointer"
                      style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.25)" }}
                    >
                      Conocer más
                    </button>
                  </motion.div>
                </div>

                {/* Right: hero product image */}
                <motion.div
                  className="hidden md:flex flex-shrink-0 items-center justify-center"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.30, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                >
                  <motion.img
                    src="/heroVigia.png"
                    alt="Vigía en acción"
                    draggable={false}
                    whileHover={{ scale: 1.06, y: -12 }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                    style={{
                      height: "clamp(180px, 22vw, 300px)",
                      width: "auto",
                      objectFit: "contain",
                      display: "block",
                      cursor: "pointer",
                      filter: "drop-shadow(0 0 32px rgba(255,141,43,0.45)) drop-shadow(0 12px 32px rgba(0,0,0,0.55))",
                    }}
                  />
                </motion.div>
              </motion.div>
            ) : (
              /* ── Slide 2: Coming Soon ───────────────────────────────────────── */
              <motion.div
                key="slide-coming-soon"
                className="max-w-6xl mx-auto px-8 w-full flex items-center justify-between gap-8"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Left: teaser text */}
                <div className="flex-1 min-w-0">
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10, duration: 0.5 }}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-8" style={{ color: "#4ade80" }}>
                      Nuevo Aliado · Bienestar Laboral · Próximamente
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20, duration: 0.55 }} style={{ marginBottom: 28 }}>
                    {/* Redacted name bars */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 12 }}>
                      <div style={{ height: 52, width: "78%", background: "rgba(255,255,255,0.10)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
                        <motion.div
                          style={{ position: "absolute", top: 0, left: 0, width: "45%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.10), transparent)" }}
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                      <div style={{ height: 52, width: "52%", background: "rgba(255,255,255,0.07)", borderRadius: 8, position: "relative", overflow: "hidden" }}>
                        <motion.div
                          style={{ position: "absolute", top: 0, left: 0, width: "45%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.08), transparent)" }}
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.6 }}
                        />
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                      [ Información pendiente de publicación ]
                    </span>
                  </motion.div>

                  <motion.p className="text-xl text-white/80 max-w-lg leading-relaxed mb-8" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.40, duration: 0.55 }}>
                    Una nueva solución de bienestar integral y salud laboral se suma al ecosistema de Consalud.
                  </motion.p>

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.50, duration: 0.55 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 20, border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.05)" }}>
                      <motion.div
                        style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80" }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                      <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Próximamente · 2026</span>
                    </div>
                  </motion.div>
                </div>

                {/* Right: classified mystery card */}
                <motion.div
                  className="hidden md:flex flex-shrink-0 items-center justify-center"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.30, duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div style={{ width: 260, height: 300, borderRadius: 24, border: "1px solid rgba(74,222,128,0.15)", background: "rgba(5,18,62,0.75)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, position: "relative", overflow: "hidden" }}>
                    {/* Blurred content lines */}
                    {[75, 55, 68, 45, 60].map((w, i) => (
                      <div key={i} style={{ height: 9, width: `${w}%`, background: "rgba(255,255,255,0.05)", borderRadius: 4, filter: "blur(2px)" }} />
                    ))}
                    {/* Lock + label overlay */}
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                      <motion.div
                        style={{ width: 54, height: 54, borderRadius: "50%", border: "1.5px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(74,222,128,0.06)" }}
                        animate={{ boxShadow: ["0 0 0px rgba(74,222,128,0)", "0 0 22px rgba(74,222,128,0.28)", "0 0 0px rgba(74,222,128,0)"] }}
                        transition={{ duration: 2.4, repeat: Infinity }}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,0.65)" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </motion.div>
                      <p style={{ fontSize: 10, color: "rgba(74,222,128,0.45)", textTransform: "uppercase", letterSpacing: "0.22em", fontWeight: 600 }}>Próximamente</p>
                    </div>
                    {/* CONFIDENCIAL stamp */}
                    <div style={{ position: "absolute", top: 22, right: -28, transform: "rotate(38deg)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(74,222,128,0.22)", border: "1.5px solid rgba(74,222,128,0.18)", padding: "3px 26px", textTransform: "uppercase" }}>
                      CONFIDENCIAL
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            style={{ opacity: hCue }}
          >
            {/* Slide indicators */}
            <div className="flex gap-2 mb-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: heroSlide === i ? 22 : 6,
                    height: 6,
                    background: heroSlide === i
                      ? (i === 2 ? "#4ade80" : "#ff8d2b")
                      : "rgba(255,255,255,0.25)",
                  }}
                />
              ))}
            </div>
            <span className="tracking-[0.3em] uppercase text-[11px] font-semibold text-white/40">Scroll</span>
            <div
              className="relative flex justify-center pt-2.5 rounded-full border-2"
              style={{ width: 30, height: 48, borderColor: "rgba(255,141,43,0.55)" }}
            >
              <div
                className="rounded-full"
                style={{ width: 5, height: 8, background: "#ff8d2b", animation: "scrollArrow 1.6s ease-in-out infinite" }}
              />
            </div>
            <ChevronDown size={20} strokeWidth={2.5} style={{ color: "#ff8d2b", opacity: 0.7, animation: "scrollArrow 1.6s ease-in-out infinite 0.35s" }} />
          </div>
        </div>}

        {/* ── SCENE 2: NOSOTROS ─────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none" style={{ opacity: nosO }}>
          <div className="max-w-6xl mx-auto px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-16">

            <div>
              <div style={lft(nLabel)}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-4">Quiénes somos</p>
              </div>
              <div style={lft(nTitle, 40)}>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                  Expertos que simplifican la normativa SST
                </h2>
              </div>
              <div style={lft(nText, 30)}>
                <p className="text-white/80 text-lg leading-relaxed mb-10" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
                  Desde 1998 en Bogotá, acompañamos a empresas colombianas
                  con un modelo a la medida equipo interdisciplinar,
                  respaldo académico y cero improvisaciones.
                </p>
              </div>

              <div className="relative h-px mb-8" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{ width: `${nLine * 100}%`, background: "linear-gradient(90deg, #ff8d2b, #0546f2,  #f5f3e6 )" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { val: `${years}+`, label: "años de experiencia",    t: nS1 },
                  { val: `${services}`, label: "servicios especializados", t: nS2 },
                  { val: "100%",      label: "soluciones a la medida", t: nS3 },
                ].map(({ val, label, t }) => (
                  <div key={label} style={up(t, 16)}>
                    <p className="text-3xl font-extrabold text-[#ff8d2b]">{val}</p>
                    <p className="text-white/30 text-xs mt-1 leading-snug">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={rgt(nLabel)}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-4">Nuestros valores</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {VALORES.map((v, i) => {
                  const hov = hoveredVal === i;
                  const scT = sc(nC[i]);
                  return (
                    <div
                      key={v.name}
                      className="p-5 rounded-2xl border"
                      onMouseEnter={() => setHoveredVal(i)}
                      onMouseLeave={() => setHoveredVal(null)}
                      style={{
                        ...scT,
                        pointerEvents: nosO > 0.05 ? "auto" : "none",
                        background:  "rgba(3,8,28,0.92)",
                        borderColor: hov ? `${v.accent}55` : `${v.accent}25`,
                        boxShadow:   hov ? `0 8px 36px ${v.accent}40` : "none",
                        transform:   `${scT.transform} scale(${hov ? 1.04 : 1})`,
                        transition:  "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
                        cursor:      "default",
                      }}
                    >
                      <div className="mb-3" style={{ color: v.accent }}>
                        <v.icon size={28} strokeWidth={1.5} />
                      </div>
                      <p
                        className="text-4xl font-extrabold leading-none mb-3 select-none tabular-nums"
                        style={{ color: `${v.accent}55` }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div className="h-0.5 mb-3" style={{ width: 22, background: v.accent }} />
                      <p className="text-white font-semibold text-sm mb-2">{v.name}</p>
                      <p className="text-white/35 text-[11px] leading-relaxed">{v.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE 3: SERVICIOS CAROUSEL ──────────────────────────────────── */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" style={{ opacity: servO }}>

          {/* Fixed header */}
          <div className="absolute top-12 left-8 md:left-16">
            <div style={lft(sLabel)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-2">Lo que hacemos</p>
            </div>
            <div style={lft(sTitle, 30)}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Nuestros servicios</h2>
            </div>
          </div>

          {/* Card counter */}
          <div className="absolute top-12 right-8" style={{ opacity: sLabel }}>
            <p className="text-sm font-semibold text-white/30 tabular-nums">
              {String(sActiveIdx + 1).padStart(2, "0")}
              <span className="text-white/15"> / </span>
              {String(SERVICIOS.length).padStart(2, "0")}
            </p>
          </div>

          {/* Cards */}
          <div className="absolute inset-0 flex items-center">
            {SERVICIOS.map((s, i) => {
              const offset = sActiveF - i;
              const absOff = Math.abs(offset);
              if (absOff > 2.5) return null;
              return (
                <div
                  key={s.title}
                  className="absolute inset-x-0 px-8 md:px-20"
                  style={{
                    top: "50%",
                    transform: `translateY(-50%) translateX(${-offset * 92}vw) scale(${Math.max(0.90, 1 - absOff * 0.05)})`,
                    opacity: Math.max(0, 1 - absOff * 0.85),
                    willChange: "transform, opacity",
                  }}
                >
                  <div
                    className="max-w-5xl mx-auto rounded-3xl border grid grid-cols-1 md:grid-cols-5 overflow-hidden"
                    style={{ borderColor: `${s.accent}22`, background: "rgba(3,8,28,0.92)" }}
                  >
                    {/* Left panel */}
                    <div
                      className="md:col-span-2 p-8 md:p-10 border-b md:border-b-0 md:border-r"
                      style={{ borderColor: `${s.accent}18` }}
                    >
                      <div className="mb-4">
                        {s.icon && <s.icon size={40} strokeWidth={1.5} style={{ color: s.accent }} />}
                      </div>
                      <p
                        className="text-7xl font-extrabold leading-none mb-4 select-none"
                        style={{ color: `${s.accent}55`, fontVariantNumeric: "tabular-nums" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <div className="h-0.5 mb-5" style={{ width: 28, background: s.accent }} />
                      <h3 className="text-xl md:text-2xl font-extrabold text-white leading-snug mb-3">{s.title}</h3>
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: s.accent }}>
                        {s.norm}
                      </p>
                      <p className="text-white/70 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    {/* Right panel */}
                    <div className="md:col-span-3 p-8 md:p-10">
                      <p className="text-[10px] tracking-[0.28em] uppercase text-white/25 mb-5">Incluye</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {s.bullets.map(b => (
                          <li key={b} className="flex items-start gap-2.5 text-white/75 text-sm leading-snug">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.accent }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress pills */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {SERVICIOS.map((s, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: Math.abs(sActiveF - i) < 0.5 ? 22 : 5,
                  height: 4,
                  background: Math.abs(sActiveF - i) < 0.5 ? s.accent : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>

        </div>

        {/* ── SCENE 4: MARCAS ───────────────────────────────────────────────── */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none" style={{ opacity: marcO }}>
          <div className="max-w-6xl mx-auto px-8 w-full">
            <div className="text-center mb-14">
              <div style={up(mLabel)}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-3">Nuestras marcas</p>
              </div>
              <div style={up(mTitle, 32)}>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white">Un universo de soluciones</h2>
              </div>
            </div>

            <div className="flex justify-center" style={{ pointerEvents: marcO > 0.05 ? "auto" : "none" }}>
              {MARCAS.map((marca, i) => (
                <div key={marca.name} style={i === 0 ? lft(mC[0]) : rgt(mC[1])}>
                  <BrandCard {...marca} onExpand={() => setActiveMarca(i)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCENE 5: CONTACTO ─────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ opacity: contO }}>
          <div className="h-full flex flex-col justify-center max-w-5xl mx-auto px-8 py-8">

            {/* Header */}
            <div className="pointer-events-none mb-5">
              <div style={lft(cLabel)}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-1.5">
                  Trabajemos juntos
                </p>
              </div>
              <div style={lft(cTitle, 30)}>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Protege a tu equipo hoy</h2>
              </div>
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit} style={{ ...up(cForm, 24), pointerEvents: contO > 0.05 ? "auto" : "none" }}>
              <div className="rounded-2xl p-5 md:p-7 border" style={{ background: "rgba(3,8,28,0.85)", borderColor: "rgba(255,141,43,0.15)" }}>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input className={iCls} style={iSty} placeholder="Nombre completo *" value={formData.nombre}   onChange={setField("nombre")}   required />
                  <input className={iCls} style={iSty} placeholder="Empresa"            value={formData.empresa}  onChange={setField("empresa")} />
                  <input className={iCls} style={iSty} placeholder="Cargo"              value={formData.cargo}    onChange={setField("cargo")} />
                  <input className={iCls} style={iSty} placeholder="Teléfono"  type="tel"   value={formData.telefono} onChange={setField("telefono")} />
                  <input className={iCls} style={iSty} placeholder="Email *"   type="email" value={formData.email}    onChange={setField("email")}    required />
                  {/* Custom dark dropdown — replaces native select */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setServicioOpen(o => !o); }}
                      className={iCls + " flex items-center justify-between text-left"}
                      style={{ ...iSty, color: servicioSel ? "white" : "rgba(255,255,255,0.25)" }}
                    >
                      <span>{servicioSel || "Servicio de interés"}</span>
                      <ChevronDown size={14} style={{ opacity: 0.4, flexShrink: 0, transform: servicioOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                    </button>
                    {servicioOpen && (
                      <div
                        className="absolute left-0 right-0 z-50 rounded-xl border overflow-hidden"
                        style={{ top: "calc(100% + 4px)", background: "rgba(3,8,28,0.97)", borderColor: "rgba(255,141,43,0.25)", boxShadow: "0 12px 40px rgba(0,0,0,0.7)" }}
                      >
                        {SERVICIOS.map(s => (
                          <button
                            key={s.title}
                            type="button"
                            onClick={e => { e.stopPropagation(); setServicioSel(s.title); setServicioOpen(false); }}
                            className="w-full text-left px-3 py-2.5 text-sm transition-colors"
                            style={{
                              color: servicioSel === s.title ? "#ff8d2b" : "rgba(255,255,255,0.75)",
                              background: servicioSel === s.title ? "rgba(255,141,43,0.10)" : "transparent",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                            onMouseLeave={e => (e.currentTarget.style.background = servicioSel === s.title ? "rgba(255,141,43,0.10)" : "transparent")}
                          >
                            {s.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 text-white/30">
                    Número de empleados
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {["1 – 10", "11 – 50", "51 – 200", "+200"].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setEmpRange(r === empRange ? "" : r)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border"
                        style={{
                          background:  empRange === r ? "#ff8d2b" : "rgba(255,255,255,0.05)",
                          color:       empRange === r ? "#05123e" : "rgba(255,255,255,0.45)",
                          borderColor: empRange === r ? "#ff8d2b" : "rgba(255,255,255,0.12)",
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  className={iCls}
                  style={{ ...iSty, resize: "none" }}
                  rows={3}
                  placeholder="Mensaje o consulta (opcional)"
                  value={formData.mensaje}
                  onChange={setField("mensaje")}
                />

                <div className="flex items-center justify-between mt-3">
                  {formStatus === "success" && (
                    <p className="text-sm font-semibold" style={{ color: "#2ecc71" }}>
                      ¡Consulta enviada! Te contactamos pronto.
                    </p>
                  )}
                  {formStatus === "error" && (
                    <p className="text-sm font-semibold" style={{ color: "#e74c3c" }}>
                      Error al enviar. Intenta de nuevo.
                    </p>
                  )}
                  {formStatus !== "success" && formStatus !== "error" && <span />}
                  <button
                    type="submit"
                    disabled={formStatus === "loading"}
                    className="px-7 py-2.5 rounded-full font-semibold text-sm cursor-pointer border-none hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "#ff8d2b", color: "#05123e" }}
                  >
                    {formStatus === "loading" ? "Enviando…" : "Enviar consulta →"}
                  </button>
                </div>

              </div>
            </form>

            {/* Contact info row */}
            <div
              className="pointer-events-none mt-5 flex flex-wrap gap-x-8 gap-y-2"
              style={{ opacity: cInfo }}
            >
              {CONTACTO_INFO.map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#ff8d2b" }} />
                  <span className="text-white/30 text-xs tracking-wide">{label}:</span>
                  <span className="text-white/60 text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── MARCA EXPANDED PANEL ─────────────────────────────────────────── */}
        <AnimatePresence>
          {activeMarca !== null && (() => {
            const marca = MARCAS[activeMarca];
            const canPrev = activeMarca > 0;
            const canNext = activeMarca < MARCAS.length - 1;
            return (
              <motion.div
                key="marca-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute", inset: 0, zIndex: 100,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(2,6,22,0.88)",
                  backdropFilter: "blur(14px)",
                  pointerEvents: "auto",
                }}
                onClick={() => setActiveMarca(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
                  style={{
                    width: "min(900px, 92vw)",
                    height: "min(520px, 88vh)",
                    display: "grid",
                    gridTemplateColumns: "2fr 3fr",
                    borderRadius: 24,
                    overflow: "hidden",
                    border: `1px solid ${marca.accent}33`,
                    boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 60px ${marca.accent}12`,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* LEFT PANEL */}
                  <div style={{
                    background: "rgba(2,6,22,1)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: 32, position: "relative",
                    borderRight: `1px solid ${marca.accent}22`,
                  }}>
                    {/* Badge */}
                    <div style={{
                      position: "absolute", top: 20, left: 20,
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: marca.accent,
                      border: `1px solid ${marca.accent}44`,
                      borderRadius: 6, padding: "4px 8px",
                    }}>
                      {marca.badge ?? "TECNOLOGÍA SST"}
                    </div>

                    {/* Cerrar */}
                    <button
                      style={{
                        position: "absolute", top: 14, right: 14,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8, padding: "5px 10px",
                        color: "rgba(255,255,255,0.35)", fontSize: 11,
                        cursor: "pointer", lineHeight: 1,
                      }}
                      onClick={() => setActiveMarca(null)}
                    >✕</button>

                    {/* Año watermark */}
                    <div style={{
                      position: "absolute", inset: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      pointerEvents: "none", userSelect: "none",
                      fontSize: 120, fontWeight: 900, letterSpacing: "-4px",
                      color: "rgba(255,255,255,0.045)",
                      lineHeight: 1,
                    }}>
                      2020
                    </div>

                    {/* Logo */}
                    <img
                      src={marca.logo} alt={marca.name}
                      style={{ height: 130, objectFit: "contain", position: "relative", zIndex: 1 }}
                    />

                    {/* Footer: hito izq + flechas der */}
                    <div style={{
                      position: "absolute", bottom: 20, left: 20, right: 20,
                      display: "flex", alignItems: "flex-end", justifyContent: "space-between",
                    }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 4px" }}>
                          HITO ANUAL
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 800, color: marca.accent, margin: 0, letterSpacing: "0.04em" }}>
                          ORIGEN 2020
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: canPrev ? "rgba(255,255,255,0.06)" : "transparent",
                            color: canPrev ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                            cursor: canPrev ? "pointer" : "default",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onClick={() => canPrev && setActiveMarca(activeMarca - 1)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: canNext ? "rgba(255,255,255,0.06)" : "transparent",
                            color: canNext ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)",
                            cursor: canNext ? "pointer" : "default",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                          onClick={() => canNext && setActiveMarca(activeMarca + 1)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL */}
                  <div style={{
                    background: "rgba(5,14,40,0.98)",
                    padding: "28px 32px",
                    overflowY: "auto",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: marca.accent, margin: 0 }}>
                      ENTIDAD TECNOLÓGICA SST COLOMBIA
                    </p>

                    <div>
                      <h2 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: "0 0 4px", lineHeight: 1.2 }}>
                        {marca.fullName ?? marca.name}
                      </h2>
                      <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.1em" }}>
                        ROL PRINCIPAL:&nbsp;
                        <span style={{ color: "rgba(255,255,255,0.65)" }}>
                          {marca.role ?? marca.tagline.toUpperCase()}
                        </span>
                      </p>
                    </div>

                    <div style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: 12, padding: "14px 16px",
                    }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 6px" }}>
                        VISIÓN Y PROPÓSITO
                      </p>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                        {marca.description}
                      </p>
                    </div>

                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: marca.accent, margin: "0 0 10px" }}>
                        CARACTERÍSTICAS CLAVE
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {marca.features.map(f => (
                          <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <CheckSquare size={13} style={{ color: marca.accent, flexShrink: 0, marginTop: 1 }} />
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>{f.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: marca.accent, margin: "0 0 10px" }}>
                        MÓDULOS & CAPACIDADES
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        {marca.extras.map(ex => (
                          <div key={ex} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ color: marca.accent, fontSize: 10 }}>◆</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{ex}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video demo */}
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: marca.accent, margin: "0 0 10px" }}>
                        DEMO EN VIVO
                      </p>
                      {marca.videoSrc ? (
                        <video
                          src={marca.videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls
                          style={{
                            width: "100%",
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "#000",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "100%", aspectRatio: "16/9",
                          borderRadius: 12,
                          border: `1px dashed ${marca.accent}33`,
                          background: `${marca.accent}05`,
                          display: "flex", flexDirection: "column",
                          alignItems: "center", justifyContent: "center",
                          gap: 10,
                        }}>
                          <div style={{
                            width: 52, height: 52, borderRadius: "50%",
                            border: `2px solid ${marca.accent}44`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill={`${marca.accent}88`}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: 0, letterSpacing: "0.05em" }}>
                            Video demo próximamente
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image gallery */}
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: marca.accent, margin: "0 0 10px" }}>
                        PLATAFORMA EN ACCIÓN
                      </p>
                      <div className="grid grid-cols-2 gap-3.5 select-none">

                        <div
                          onClick={() => { setExpandedImage("/image.png"); setExpandedImageTitle("Dashboard Predictivo de Vigía SST"); }}
                          className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-[#ef7c10]/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                            <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ef7c10] backdrop-blur-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </div>
                          </div>
                          <img src="/cover%201.png" alt="Dashboard Predictivo de Vigía SST" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.15]" />
                          <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                            <span className="text-[7px] font-mono tracking-widest text-[#ef7c10] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ef7c10]/20">
                              TELEMETRÍA SST
                            </span>
                            <p className="text-[10px] font-sans font-bold text-slate-100 mt-1 leading-tight">Módulo Predictivo</p>
                          </div>
                        </div>

                        <div
                          onClick={() => { setExpandedImage("/img%202.png"); setExpandedImageTitle("Vigilancia de Salud Industrial Vigía"); }}
                          className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-[#ef7c10]/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                            <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ef7c10] backdrop-blur-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </div>
                          </div>
                          <img src="/cover2.png" alt="Vigilancia de Salud Industrial Vigía" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.15]" />
                          <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                            <span className="text-[7px] font-mono tracking-widest text-[#ef7c10] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ef7c10]/20">
                              BIOMETRÍA RÁPIDA
                            </span>
                            <p className="text-[10px] font-sans font-bold text-slate-100 mt-1 leading-tight">Monitoreo de Bienestar</p>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      marginTop: "auto", paddingTop: 12,
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 4px" }}>
                          ESTADO ALIANZA
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ecc71" }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#2ecc71" }}>
                            {marca.status ?? "Activa & Disponible"}
                          </span>
                        </div>
                      </div>
                      <button style={{
                        padding: "10px 20px", borderRadius: 20,
                        background: "transparent",
                        border: `1px solid ${marca.accent}`,
                        color: marca.accent,
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        cursor: "pointer",
                      }}>
                        CONECTAR CONVENIO →
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── IMAGE LIGHTBOX ───────────────────────────────────────────────── */}
        {expandedImage && (
          <div
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl p-6 cursor-zoom-out"
            onClick={() => setExpandedImage(null)}
          >
            <div className="absolute top-0 w-[500px] h-[300px] bg-gradient-to-b from-[#ef7c10]/15 to-transparent blur-[120px] rounded-full pointer-events-none select-none" />

            <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white pointer-events-none">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono tracking-widest text-[#ef7c10] uppercase font-bold">
                  Ecosistema Vigía SST 3D
                </span>
                <h3 className="text-sm font-sans font-medium text-slate-100 mt-0.5">{expandedImageTitle}</h3>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setExpandedImage(null); }}
                className="pointer-events-auto p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition duration-300 shadow-lg cursor-pointer"
                title="Cerrar vista"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              onClick={e => e.stopPropagation()}
              className="relative max-w-4xl max-h-[75vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#010410] flex items-center justify-center select-none cursor-default"
            >
              <img src={expandedImage ?? ""} alt={expandedImageTitle} className="max-w-full max-h-[75vh] object-contain rounded-2xl" />
            </div>

            <span className="absolute bottom-6 text-[10px] font-mono tracking-wider text-slate-500 uppercase select-none pointer-events-none">
              Haz clic en el fondo para volver al panel de control
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
