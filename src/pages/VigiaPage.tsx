import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Eye, ScanEye, BellRing, FileCheck, MessageCircle, ArrowLeft, Target, Smartphone } from "lucide-react";
import Footer from "../components/Footer";
import WavesBackground from "../components/WavesBackground";
import { useFavicon } from "../hooks/useFavicon";
// @ts-ignore
import vigiaFavicon from "../assets/images/vigia_favicon.svg";
// @ts-ignore
import vigiaColorLogo from "../assets/images/vigia.png";
// @ts-ignore
import vigiaNewLogo from "../assets/images/vigia_newLogo.png";
// @ts-ignore
import vigiaPrincipalLogo from "../assets/images/VIGIA_PRINCIPAL_WHITE.svg";
// @ts-ignore
import vigiaRuedaTexto from "../assets/images/VIGIA_rueda_texto.svg";
// @ts-ignore
import vigiaRuedaCentro from "../assets/images/VIGIA_rueda_centro.svg";
import logoConsalud from "../assets/images/logoConsalud.png";
// @ts-ignore
import projectVideo from "../assets/images/Video Project.mp4";
// @ts-ignore
import escritorioDavid from "../assets/images/EscritorioDavid.png";
// @ts-ignore
import kevinChaleco from "../assets/images/kevinChaleco.png";
// @ts-ignore
import vigiaCapture1 from "../assets/images/Captura de pantalla 2026-06-22 111515.png";
// @ts-ignore
import vigiaCapture2 from "../assets/images/Captura de pantalla 2026-06-22 111526.png";


const WHATSAPP_VIGIA = `https://wa.me/573057883941?text=${encodeURIComponent("Hola, quiero solicitar una demo de la *Plataforma Vigía SST* de Consalud. Me gustaría conocer más sobre cómo puede ayudar a mi empresa.")}`;

const FEATURES = [
  { icon: <Eye size={16} />, title: "Observación inteligente", desc: "Analiza el entorno de trabajo de forma continua para identificar comportamientos y condiciones de riesgo." },
  { icon: <ScanEye size={16} />, title: "Detección de riesgos", desc: "Reconoce EPP, celulares y situaciones críticas en milisegundos con evidencia visual." },
  { icon: <BellRing size={16} />, title: "Alertas en tiempo real", desc: "Notifica al supervisor SST por email o WhatsApp cuando aparece una condición de riesgo." },
  { icon: <FileCheck size={16} />, title: "Reportes automáticos", desc: "Convierte cada evento en trazabilidad y soporte documental para seguimiento y cumplimiento." },
];

const HEADER_FEATURES = [
  { n: "01", icon: <Target size={16} />, label: "Detección de EPP" },
  { n: "02", icon: <BellRing size={16} />, label: "Alertas en tiempo real" },
  { n: "03", icon: <Smartphone size={16} />, label: "Manipulación de celular" },
  { n: "04", icon: <FileCheck size={16} />, label: "Reportes automáticos" },
];

const EXTRAS = [
  "Siniestralidad: reducción drástica de incidentes y accidentes",
  "Planes de Mejora: datos exactos para cumplimiento normativo HSE",
  "Capital Humano: protección operativa y optimización de costos",
  "Flujo: Cámaras optimizadas → AI Vigía → Alerta Real + soporte documental",
  "Despliegue en días, no meses · Reportes generados al instante",
];

const GALLERY = [
  { src: escritorioDavid, label: "ALERTA POR MANIPULACIÓN DE CELULARES", title: "Detección de celulares" },
  { src: kevinChaleco,    label: "ALERTA POR NO USO DE EPPs",            title: "Monitoreo de Bienestar" },
  { src: vigiaCapture1,   label: "CÁMARAS EN VIVO",                      title: "En tiempo real" },
  { src: vigiaCapture2,   label: "ALERTAS POR WHATSAPP/E-MAIL",          title: "Cumplimiento Normativo" },
];

export default function VigiaPage() {
  const navigate = useNavigate();
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedTitle, setExpandedTitle] = useState("");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  useFavicon(vigiaFavicon);

  const playChime = () => {};

  return (
    <div className="min-h-screen bg-[#f7faf9]">

      {/* WavesBackground — always visible, same as main page */}
      <WavesBackground />

      {/* ── NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#10263a]/90 backdrop-blur-[12px] border-b border-[#00ef89]/20 shadow-[0_8px_32px_rgba(16,38,58,0.3)]">
        <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 h-[72px] flex items-center justify-between">

          {/* Logo → home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 w-[200px] h-14">
              <img
                src={vigiaNewLogo}
                alt="Vigía Logo"
                className="absolute max-w-full max-h-full object-contain"
              />
            </div>
          </button>

          {/* Back + Vigía label */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-[#00ef89]/10 border border-[#00ef89]/30 text-[#00ef89] text-[11px] font-mono font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ef89] animate-pulse" />
              Plataforma Vigía SST
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-mono font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="relative z-10 pt-[72px]">

        {/* FULL-BLEED HEADER */}
        <motion.section
          className="relative isolate w-full overflow-hidden bg-gradient-to-br from-[#0a1830] via-[#10263a] to-[#0c3a30]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Decorative dotted texture — blue upper, green lower */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(56,189,248,0.6)_1px,transparent_1px)] [background-size:24px_24px]"
            style={{ WebkitMaskImage: "linear-gradient(to bottom, black, transparent 65%)", maskImage: "linear-gradient(to bottom, black, transparent 65%)" }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(0,239,137,0.55)_1px,transparent_1px)] [background-size:22px_22px]"
            style={{ WebkitMaskImage: "linear-gradient(to top, black, transparent 55%)", maskImage: "linear-gradient(to top, black, transparent 55%)" }}
          />

          {/* Decorative wave layers at the bottom edge */}
          <svg
            className="pointer-events-none absolute bottom-0 left-0 w-full h-28 md:h-40"
            viewBox="0 0 1440 200"
            preserveAspectRatio="none"
          >
            <path d="M0,140 C240,190 480,70 720,110 C960,150 1200,60 1440,120 L1440,200 L0,200 Z" fill="#00ef89" opacity="0.12" />
            <path d="M0,165 C260,120 500,190 760,150 C1000,115 1220,180 1440,150 L1440,200 L0,200 Z" fill="#00ef89" opacity="0.18" />
            <path d="M0,185 C300,150 560,200 820,175 C1080,150 1260,195 1440,175 L1440,200 L0,200 Z" fill="#00ef89" opacity="0.28" />
          </svg>

          {/* Spinning seal badge */}
          <div className="hidden sm:block absolute top-6 right-6 md:top-10 md:right-10 w-28 h-28 md:w-36 md:h-36 z-10">
            <img src={vigiaRuedaTexto} alt="" className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]" />
            <img src={vigiaRuedaCentro} alt="" className="absolute inset-0 w-full h-full" />
          </div>

          <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] mx-auto px-6 md:px-14 lg:px-16 2xl:px-24 py-[3vh] h-[calc(100vh-72px)] flex flex-col items-center justify-center text-center gap-[4vh]">
            <h1 className="sr-only">Vigía SST</h1>

            <img src={vigiaPrincipalLogo} alt="Vigía SST" className="h-[clamp(9rem,40vh,26rem)] w-auto object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]" />

            <div className="flex flex-col items-center gap-[2vh]">
              {/* Flag badges */}
              <div className="relative flex items-center justify-center w-[clamp(3.5rem,7vh,4.5rem)] h-[clamp(2.5rem,5vh,3.25rem)]">
                <div className="absolute left-0 w-[clamp(2.5rem,5vh,3.25rem)] h-[clamp(2.5rem,5vh,3.25rem)] rounded-full overflow-hidden border-2 border-[#f8fbfa]/80 shadow-[0_8px_20px_rgba(0,0,0,0.35)] flex flex-col">
                  <div className="h-1/2 bg-[#FCD116]" />
                  <div className="h-1/4 bg-[#003893]" />
                  <div className="h-1/4 bg-[#CE1126]" />
                </div>
                <div className="absolute right-0 w-[clamp(2.5rem,5vh,3.25rem)] h-[clamp(2.5rem,5vh,3.25rem)] rounded-full overflow-hidden border-2 border-[#00ef89] shadow-[0_8px_20px_rgba(0,0,0,0.35)] flex flex-col">
                  <div className="h-1/3 bg-[#0a0a0a]" />
                  <div className="h-1/3 bg-[#DD0000]" />
                  <div className="h-1/3 bg-[#FFCE00]" />
                </div>
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-1">
                <p className="text-[clamp(1.5rem,4.4vh,3rem)] font-black uppercase tracking-tight text-[#00ef89] leading-[1.1]">
                  Ingeniería Colombiana
                </p>
                <p className="text-[clamp(1.5rem,4.4vh,3rem)] font-black uppercase tracking-tight text-white leading-[1.1]">
                  Con Tecnología Alemana
                </p>
              </div>
            </div>

            {/* Numbered feature list */}
            <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-3">
              {HEADER_FEATURES.map((feat) => (
                <div key={feat.n} className="flex items-center gap-2.5 text-left">
                  <div className="shrink-0 w-[clamp(2.25rem,5.5vh,3rem)] h-[clamp(2.25rem,5.5vh,3rem)] rounded-lg border border-[#00ef89]/50 bg-[#00ef89]/10 flex items-center justify-center text-[#00ef89]">
                    {feat.icon}
                  </div>
                  <p className="text-[clamp(0.65rem,1.7vh,0.85rem)] font-mono font-black tracking-[0.1em] uppercase text-white">
                    <span className="text-[#00ef89]">{feat.n}.</span> {feat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <div className="w-full max-w-7xl xl:max-w-[1440px] mx-auto px-6 md:px-14 lg:px-16 2xl:px-24 pt-14 pb-20 md:pt-20 flex flex-col gap-16">

          {/* MAIN GRID: video + features */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left — logo + video */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <img src={vigiaNewLogo} alt="Vigía Logo" className="h-14 w-auto object-contain drop-shadow-[0_4px_16px_rgba(0,239,137,0.25)]" />
                <div className="border-l border-slate-200 pl-4">
                  <p className="text-slate-900 font-black text-lg leading-tight">Seguridad Predictiva en Tiempo Real</p>
                  <p className="text-[#00b879] text-xs font-mono tracking-widest uppercase mt-0.5">Colombia × Alemania</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-lg shadow-slate-200/60">
                <div className="px-4 pt-3 pb-2 flex items-center gap-2 border-b border-slate-200 bg-slate-100">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-2">Demo en Vivo · Vigía SST</span>
                </div>
                <video src={projectVideo} autoPlay loop muted playsInline controls className="w-full aspect-video object-cover" />
              </div>
            </div>

            {/* Right — features + extras */}
            <div className="flex flex-col gap-6">
              <div className="border-l-2 border-[#00ef89] pl-4 py-1">
                <p className="text-slate-600 text-sm italic font-sans">"Siempre presente. Siempre alerta."</p>
              </div>

              <div>
                <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-400 uppercase mb-3">Características Clave</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FEATURES.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 hover:border-[#00ef89]/40 transition-colors duration-200">
                      <div className="mt-0.5 text-[#00ef89] shrink-0">{feat.icon}</div>
                      <div>
                        <p className="text-xs font-black text-slate-900 mb-0.5">{feat.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans font-semibold">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-400 uppercase mb-3">Módulos & Capacidades</p>
                <div className="flex flex-col gap-2">
                  {EXTRAS.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[#00ef89] text-xs mt-0.5 shrink-0">◆</span>
                      <span className="text-sm text-slate-700 font-sans font-semibold">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* GALLERY */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-400 uppercase mb-4">Plataforma en Acción</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {GALLERY.map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setExpandedImage(img.src); setExpandedTitle(img.title); }}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-[#00ef89]/50 bg-slate-100 aspect-[4/3] cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(0,239,137,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent z-10 opacity-60 group-hover:opacity-35 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-white/90 border border-slate-200 p-2 rounded-full text-[#00ef89]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.12]" />
                  <div className="absolute bottom-2 left-2.5 right-2 z-20 text-left">
                    <span className="text-[9px] font-mono tracking-widest text-[#00ef89] uppercase font-black bg-black/75 px-2 py-1 rounded border border-[#00ef89]/20">{img.label}</span>
                    <p className="text-xs font-bold text-white mt-0.5 leading-tight">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA BAR */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={WHATSAPP_VIGIA}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-mono text-sm font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Solicitar Demo por WhatsApp
            </a>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl font-mono text-sm font-black uppercase tracking-widest border border-[#00ef89]/50 text-[#00ef89] hover:bg-[#00ef89]/10 hover:border-[#00ef89] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Inicio
            </button>
          </motion.div>

        </div>
      </main>

      <Footer jumpToLandingSection={() => { navigate("/"); }} playRetroChime={playChime} whatsappUrl={WHATSAPP_VIGIA} />

      {/* Image zoom modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={expandedImage} alt={expandedTitle} className="w-full h-auto max-h-[75vh] object-contain rounded-t-2xl" />
            <div className="bg-slate-900 border-t border-white/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[#00ef89] uppercase font-bold tracking-wider">VISTA EN DETALLE</p>
                <h4 className="text-base font-black text-white mt-1">{expandedTitle}</h4>
              </div>
              <button onClick={() => setExpandedImage(null)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 text-xs font-bold transition-all">
                Cerrar ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
