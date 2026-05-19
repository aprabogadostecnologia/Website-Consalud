"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Shield, Users, AlertTriangle, Leaf, BookOpen, Scale, CheckSquare, Heart, Eye, Award, Zap, ChevronDown } from "lucide-react";

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

// ── Data ──────────────────────────────────────────────────────────────────────
const VALORES = [
  {
    name:   "Responsabilidad",
    icon:   Heart,
    desc:   "Garantizamos acompañamiento permanente y compromiso profesional a nuestros clientes con el fin de brindar bienestar para sus empleados y productividad en sus procesos.",
    accent: "#ff8d2b",
  },
  {
    name:   "Integridad",
    icon:   Eye,
    desc:   "Transparencia y confiabilidad frente a todos los procesos, guardando siempre confidencialidad y lealtad con nuestros clientes.",
    accent: "#4d7fff",
  },
  {
    name:   "Experiencia",
    icon:   Award,
    desc:   "Contamos con un equipo de trabajo multidisciplinar con gran trayectoria en diferentes sectores económicos que permiten tener una visión acertada a las necesidades de nuestros clientes.",
    accent: "#ff8d2b",
  },
  {
    name:   "Adaptabilidad",
    icon:   Zap,
    desc:   "Tenemos la capacidad de responder adecuada y oportunamente a las exigencias del entorno y de nuestros clientes, generando soluciones específicas para cada uno.",
    accent: "#4d7fff",
  },
];

const SERVICIOS = [
  {
    title:   "Seguridad y Salud en el Trabajo",
    norm:    "Decreto 1072/2015 · Resolución 0312/2019",
    icon:    Shield,
    desc:    "Diseñamos, asesoramos e implementamos el SG-SST en todas las etapas del ciclo PHVA con metodologías comprensibles para todos los actores del sistema.",
    bullets: ["Evaluación inicial SG-SST", "Identificación de peligros y matriz legal", "Definición de objetivos y recursos", "Plan anual de trabajo", "Documentación y plan de formación", "Prevención y respuesta ante emergencias", "Gestión de accidentes e incidentes", "Auditoría y acciones correctivas"],
    accent:  "#ff8d2b",
  },
  {
    title:   "Servicios Outsourcing",
    norm:    "Consultoría in house · Talento humano especializado",
    icon:    Users,
    desc:    "Proveemos profesionales competentes en SST, medicina laboral, psicología, enfermería y ergonomía para que tu empresa se enfoque en su negocio.",
    bullets: ["Medicina Preventiva y del Trabajo", "Psicología organizacional", "Ergonomía", "Enfermería laboral", "Prevención de emergencias", "Ambiental y calidad", "Batería de riesgo psicosocial"],
    accent:  "#4d7fff",
  },
  {
    title:   "Gestión del Riesgo",
    norm:    "Programas de intervención · Tareas críticas",
    icon:    AlertTriangle,
    desc:    "Desarrollamos programas integrales para identificar, evaluar y controlar riesgos laborales específicos de tu empresa y sector.",
    bullets: ["Tareas críticas y trabajos de alto riesgo", "Plan estratégico de seguridad vial", "Manejo de sustancias químicas (GHS)", "Prevención de riesgo osteomuscular", "Programa de pausas activas", "Protección contra caídas", "Vigilancia epidemiológica"],
    accent:  "#ff8d2b",
  },
  {
    title:   "Gestión Ambiental",
    norm:    "ISO 14001:2015 · Decreto 1076/2015",
    icon:    Leaf,
    desc:    "Diseñamos e implementamos el sistema de gestión ambiental con acciones estratégicas para el control de aspectos e impactos sobre el entorno.",
    bullets: ["Gestión integral de residuos sólidos (PGIRS)", "Plan de residuos peligrosos", "Plan de saneamiento ambiental", "Uso eficiente de agua y energía", "Preparación ante emergencias ambientales"],
    accent:  "#4d7fff",
  },
  {
    title:   "Capacitaciones",
    norm:    "Formación especializada · Múltiples modalidades",
    icon:    BookOpen,
    desc:    "Capacitamos a tu equipo según el peligro y especialidad del personal, con instructores expertos en cada área del SG-SST.",
    bullets: ["Coaching de seguridad", "Riesgo psicosocial y químico", "Riesgo mecánico y bloqueo/etiquetado", "Orden, aseo y hábitos saludables", "Promoción y prevención en salud", "COPASST y Comité de Convivencia"],
    accent:  "#ff8d2b",
  },
  {
    title:   "Asesoría Legal",
    norm:    "Seguridad social · Riesgos laborales",
    icon:    Scale,
    desc:    "Abogados especialistas en seguridad social y salud ocupacional con amplia experiencia en el Sistema General de Riesgos Laborales colombiano.",
    bullets: ["Estabilidad laboral reforzada", "Consultoría en Sistema General de Riesgos Laborales", "Aspectos legales del SG-SST"],
    accent:  "#4d7fff",
  },
  {
    title:   "Auditorías",
    norm:    "ISO 45001 · ISO 14001 · ISO 9001",
    icon:    CheckSquare,
    desc:    "Realizamos auditorías y seguimientos para evaluar el desempeño y la eficacia de los sistemas de gestión implementados en tu empresa.",
    bullets: ["SG-SST: Decreto 1072/2015 y Res. 0312/2019", "Gestión ambiental: Decreto 1076/2015", "ISO 45001 — Seguridad y salud", "ISO 14001 — Gestión ambiental", "ISO 9001 — Calidad"],
    accent:  "#ff8d2b",
  },
];

const MARCAS = [
  { name: "Submarca 1", desc: "Descripción de la primera submarca",  accent: "#ff8d2b" },
  { name: "Submarca 2", desc: "Descripción de la segunda submarca",  accent: "#0546f2" },
];
const CONTACTO_INFO = [
  { label: "Email",     value: "direccion@consalud.com.co" },
  { label: "Numero",       value: "311 265 2715 · 324 209 7512" },
  { label: "Dirección", value: "Calle 92 # 16 - 30, Bogotá" },
];

// ── Sections meta ─────────────────────────────────────────────────────────────
// Matches RoadScene BANDS — camera arrives at each stop exactly when content appears
// [Inicio, Nosotros, Servicios, Marcas, Contacto]
const PAGE_BANDS = [0, 0.10, 0.22, 0.78, 0.88, 1.00];

const SECTIONS = [
  { num: "01", label: "Inicio" },
  { num: "02", label: "Nosotros" },
  { num: "03", label: "Servicios" },
  { num: "04", label: "Marcas" },
  { num: "05", label: "Contacto y formulario" },
];

export default function HeroPage() {
  const p = useScrollProgress();

  // ── Section opacities (asymmetric bands) ─────────────────────────────────
  const heroO = p < 0.10 ? 1 : p < 0.15 ? 1 - (p - 0.10) / 0.05 : 0;
  const nosO  = fade(p, 0.10, 0.12, 0.19, 0.22);
  const servO = fade(p, 0.22, 0.25, 0.75, 0.78);
  const marcO = fade(p, 0.78, 0.80, 0.85, 0.88);
  const contO = fade(p, 0.88, 0.90, 0.98, 1.01);

  const sectionO = [heroO, nosO, servO, marcO, contO];

  // ── Local build progressions ──────────────────────────────────────────────
  const nL = norm(p, 0.10, 0.21);
  const sL = norm(p, 0.22, 0.775);
  const mL = norm(p, 0.78, 0.875);
  const cL = norm(p, 0.88, 0.98);

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
  const _hold  = 0.55;
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
  const mC     = [e(mL, 0.28, 0.56), e(mL, 0.44, 0.72)];

  // ── Contacto build ──
  const cLabel = e(cL, 0.00, 0.18);
  const cTitle = e(cL, 0.10, 0.28);
  const cForm  = e(cL, 0.22, 0.50);
  const cInfo  = e(cL, 0.46, 0.68);

  // Form state
  const [empRange, setEmpRange] = useState("");
  const [hoveredVal, setHoveredVal] = useState<number | null>(null);

  // Input base styles — dark, matches site palette
  const iCls = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors text-white placeholder:text-white/25 focus:border-[#ff8d2b]";
  const iSty = { borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.05)", color: "white" } as React.CSSProperties;

  return (
    <div className="relative" style={{ height: "700vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── WebGL Road background ─────────────────────────────────────────── */}
        <RoadScene progress={p} className="absolute inset-0 w-full h-full" />

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
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none" style={{ opacity: heroO }}>
          <div className="max-w-6xl mx-auto px-8 w-full">

            <div style={ha(0.1)}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ff8d2b] mb-8">
                Aliado Vital SST · Bogotá · Desde 1998
              </p>
            </div>

            <h1 className="font-extrabold leading-[0.90] mb-10" style={{ fontSize: "clamp(52px, 8vw, 100px)" }}>
              <span className="block overflow-hidden">
                <span className="block" style={ha(0.2)}>Tu socio</span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block text-transparent bg-clip-text"
                  style={{ ...ha(0.3), backgroundImage: "linear-gradient(90deg, #ff8d2b 0%, #0546f2 100%)" }}
                >
                  estratégico
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="block text-white/85" style={ha(0.4)}>en SST.</span>
              </span>
            </h1>

            <p className="text-xl text-white/45 max-w-lg leading-relaxed mb-12" style={ha(0.5)}>
              Protegemos a tu equipo con soluciones a la medida —&nbsp;sin
              improvisaciones, con respaldo académico y experiencia real.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ ...ha(0.6), pointerEvents: "auto" }}
            >
              <button
                className="px-8 py-3.5 rounded-full font-semibold text-[#05123e] hover:brightness-110 transition-all cursor-pointer border-none"
                style={{ background: "#ff8d2b" }}
              >
                Ver servicios
              </button>
              <button className="px-8 py-3.5 rounded-full border border-white/20 hover:border-[#ff8d2b]/50 text-white/60 hover:text-white font-semibold transition-all cursor-pointer bg-transparent">
                Conocer Consalud
              </button>
            </div>
          </div>

          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ opacity: hCue }}
          >
            <span className="tracking-[0.3em] uppercase text-[10px] text-white/30 mb-1">Scroll</span>
            <ChevronDown size={22} strokeWidth={1.5} style={{ color: "#ff8d2b", opacity: 0.5, animation: "scrollArrow 1.6s ease-in-out infinite" }} />
            <ChevronDown size={22} strokeWidth={1.5} style={{ color: "#ff8d2b", animation: "scrollArrow 1.6s ease-in-out infinite 0.25s" }} />
          </div>
        </div>

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
                <p className="text-white/45 text-lg leading-relaxed mb-10">
                  Desde 1998 en Bogotá, acompañamos a empresas colombianas
                  con un modelo a la medida — equipo interdisciplinar,
                  respaldo académico y cero improvisaciones.
                </p>
              </div>

              <div className="relative h-px mb-8" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div
                  className="absolute top-0 left-0 h-full"
                  style={{ width: `${nLine * 100}%`, background: "linear-gradient(90deg, #ff8d2b, #0546f2)" }}
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
                      className="p-5 rounded-2xl border pointer-events-auto"
                      onMouseEnter={() => setHoveredVal(i)}
                      onMouseLeave={() => setHoveredVal(null)}
                      style={{
                        ...scT,
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
                      <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
                    </div>

                    {/* Right panel */}
                    <div className="md:col-span-3 p-8 md:p-10">
                      <p className="text-[10px] tracking-[0.28em] uppercase text-white/25 mb-5">Incluye</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {s.bullets.map(b => (
                          <li key={b} className="flex items-start gap-2.5 text-white/55 text-sm leading-snug">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {MARCAS.map(({ name, desc, accent }, i) => (
                <div
                  key={name}
                  className="p-10 rounded-3xl border"
                  style={{
                    ...(i === 0 ? lft(mC[0]) : rgt(mC[1])),
                    borderColor: `${accent}33`,
                    background: "rgba(5,18,62,0.92)",
                  }}
                >
                  <div className="h-0.5 mb-6" style={{ width: 36, background: accent }} />
                  <h3 className="text-2xl font-bold text-white mb-3">{name}</h3>
                  <p className="text-white/35 text-sm mb-8 leading-relaxed">{desc}</p>
                  <span className="text-sm font-semibold" style={{ color: accent }}>Explorar →</span>
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
            <div className="pointer-events-auto" style={up(cForm, 24)}>
              <div className="rounded-2xl p-5 md:p-7 border" style={{ background: "rgba(3,8,28,0.85)", borderColor: "rgba(255,141,43,0.15)" }}>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input className={iCls} style={iSty} placeholder="Nombre completo" />
                  <input className={iCls} style={iSty} placeholder="Empresa" />
                  <input className={iCls} style={iSty} placeholder="Cargo" />
                  <input className={iCls} style={iSty} placeholder="Teléfono" type="tel" />
                  <input className={iCls} style={iSty} placeholder="Email" type="email" />
                  <select className={iCls} style={{ ...iSty, color: "rgba(255,255,255,0.40)" }}>
                    <option value="">Servicio de interés</option>
                    {SERVICIOS.map(s => (
                      <option key={s.title} value={s.title}>{s.title}</option>
                    ))}
                  </select>
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
                />

                <div className="flex justify-end mt-3">
                  <button
                    className="px-7 py-2.5 rounded-full font-semibold text-sm cursor-pointer border-none hover:brightness-110 transition-all"
                    style={{ background: "#ff8d2b", color: "#05123e" }}
                  >
                    Enviar consulta →
                  </button>
                </div>

              </div>
            </div>

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

      </div>
    </div>
  );
}
