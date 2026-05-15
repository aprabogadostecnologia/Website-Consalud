"use client";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import PortalScene from "@/components/canvas/PortalScene";

// Smooth 4-point fade: 0→1 from a→b, hold b→c, 1→0 from c→d
function fade(p: number, a: number, b: number, c: number, d: number): number {
  if (p < a || p >= d) return 0;
  if (p < b && b > a) return (p - a) / (b - a);
  if (p <= c) return 1;
  return 1 - (p - c) / (d - c);
}

const VALORES = ["Responsabilidad", "Integridad", "Experiencia", "Adaptabilidad"];

const SERVICIOS = [
  { title: "SG-SST", desc: "Ciclo PHVA · Decreto 1072/2015" },
  { title: "Outsourcing", desc: "Medicina, psicología, ergonomía" },
  { title: "Gestión Ambiental", desc: "ISO 14001:2015" },
  { title: "Asesoría Legal", desc: "Riesgos laborales y seguridad social" },
  { title: "Auditorías", desc: "ISO 45001 · 14001 · 9001" },
  { title: "Capacitaciones", desc: "Psicosocial, químico, mecánico" },
  { title: "Gestión del Riesgo", desc: "Tareas críticas y emergencias" },
];

// Navigation dot thresholds (start of each section zone)
const NAV_DOTS = [
  { label: "Inicio", from: 0, to: 0.24 },
  { label: "Nosotros", from: 0.24, to: 0.48 },
  { label: "Servicios", from: 0.48, to: 0.72 },
  { label: "Marcas", from: 0.72, to: 1.01 },
];

export default function HeroPage() {
  const p = useScrollProgress();

  // Hero: fully visible from scroll=0, starts fading at 18%
  const heroO      = p < 0.18 ? 1 : p < 0.27 ? 1 - (p - 0.18) / 0.09 : 0;
  const nosotrosO  = fade(p, 0.25, 0.33, 0.43, 0.51);
  const serviciosO = fade(p, 0.49, 0.57, 0.67, 0.75);
  const submarcasO = fade(p, 0.73, 0.81, 0.97, 1.01);

  return (
    // 500 vh = 4 screens of scroll travel for the portal journey
    <div className="relative" style={{ height: "500vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* ── WebGL Portal ── */}
        <PortalScene progress={p} className="absolute inset-0 w-full h-full" />

        {/* ── Navigation dots ── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {NAV_DOTS.map(({ label, from, to }) => {
            const active = p >= from && p < to;
            return (
              <div key={label} className="group flex items-center gap-2 justify-end">
                <span className="text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {label}
                </span>
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active ? 10 : 6,
                    height: active ? 10 : 6,
                    background: active ? "#ff8d2b" : "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── SECCIÓN 1: HERO ── */}
        <SectionOverlay opacity={heroO}>
          <div className="text-center max-w-4xl mx-auto px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#ff8d2b] mb-4">
              Aliado Vital SST
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-white">Tu socio estratégico</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #ff8d2b 0%, #0546f2 100%)" }}
              >
                en seguridad y salud
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Protegemos a tu equipo con soluciones SST a la medida —&nbsp;sin
              improvisaciones, con respaldo académico y experiencia desde 1998.
            </p>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              style={{ pointerEvents: heroO > 0.5 ? "auto" : "none" }}
            >
              <a
                href="#services"
                className="px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
                style={{ background: "#ff8d2b", color: "#05123e" }}
              >
                Ver servicios
              </a>
              <a
                href="#about"
                className="px-8 py-3 rounded-full border border-white/20 hover:border-[#ff8d2b]/60 text-white/70 hover:text-white font-semibold transition-all"
              >
                Conocer Consalud
              </a>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
            <span>Scroll para recorrer</span>
            <div
              className="w-px h-10 animate-pulse"
              style={{ background: "linear-gradient(to bottom, #ff8d2b55, transparent)" }}
            />
          </div>
        </SectionOverlay>

        {/* ── SECCIÓN 2: NOSOTROS ── */}
        <SectionOverlay opacity={nosotrosO}>
          <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 px-8 md:px-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#ff8d2b] mb-3">
                Quiénes somos
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight">
                Expertos que simplifican la normativa SST
              </h2>
              <p className="text-white/60 leading-relaxed">
                Desde 1998 en Bogotá, acompañamos a empresas colombianas con
                un modelo a la medida — equipo interdisciplinar, respaldo
                académico y cero improvisaciones.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#ff8d2b] mb-3">
                Nuestros valores
              </p>
              <div className="grid grid-cols-2 gap-3">
                {VALORES.map((v) => (
                  <div
                    key={v}
                    className="p-4 rounded-xl border border-white/10 bg-[#05123e]/65 backdrop-blur-sm"
                  >
                    <p className="text-white font-semibold text-sm">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionOverlay>

        {/* ── SECCIÓN 3: SERVICIOS ── */}
        <SectionOverlay opacity={serviciosO}>
          <div className="max-w-5xl w-full px-8 md:px-16">
            <div className="text-center mb-7">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#ff8d2b] mb-2">
                Lo que hacemos
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Nuestros servicios
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {SERVICIOS.map((s) => (
                <div
                  key={s.title}
                  className="p-4 rounded-xl border border-white/10 bg-[#05123e]/65 backdrop-blur-sm"
                >
                  <p className="text-[#ff8d2b] font-semibold text-sm mb-1">{s.title}</p>
                  <p className="text-white/50 text-xs leading-snug">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionOverlay>

        {/* ── SECCIÓN 4: SUBMARCAS ── */}
        <SectionOverlay opacity={submarcasO}>
          <div
            className="max-w-4xl w-full px-8 text-center"
            style={{ pointerEvents: submarcasO > 0.5 ? "auto" : "none" }}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-[#ff8d2b] mb-3">
              Nuestras marcas
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-10">
              Un universo de soluciones
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TODO: reemplazar con nombres y descripciones reales de las dos submarcas */}
              {[
                { name: "Submarca 1", desc: "Descripción de la primera submarca" },
                { name: "Submarca 2", desc: "Descripción de la segunda submarca" },
              ].map((brand) => (
                <div
                  key={brand.name}
                  className="p-8 rounded-2xl border border-[#ff8d2b]/30 bg-[#05123e]/70 backdrop-blur-sm hover:border-[#ff8d2b]/70 transition-colors cursor-pointer group"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{brand.name}</h3>
                  <p className="text-white/50 text-sm mb-5">{brand.desc}</p>
                  <span className="text-[#ff8d2b] text-sm font-semibold group-hover:underline">
                    Explorar →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionOverlay>

      </div>
    </div>
  );
}

function SectionOverlay({
  opacity,
  children,
}: {
  opacity: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      style={{ opacity }}
    >
      {children}
    </div>
  );
}
