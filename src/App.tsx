import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import RoadScene from "./components/RoadScene";
import StaticSections from "./components/StaticSections";
import VigiaPage from "./pages/VigiaPage";
// @ts-ignore
import consaludWhiteLogo from "./assets/images/conSaludWhite.png";
// @ts-ignore
import vigiaNewLogo from "./assets/images/vigia_newLogo.png";
// @ts-ignore
import vigiaColorLogo from "./assets/images/vigia.png";
// @ts-ignore
import vigiaDashboard from "./assets/images/EscritorioDavid.png";
// @ts-ignore
import vigiaWorker from "./assets/images/kevinChaleco.png";
// @ts-ignore
import logoConsalud from "./assets/images/logoConsalud.png";
// @ts-ignore
import consaludLogo from "./assets/images/Consalud.png";
// @ts-ignore
import consaludHero1 from "./assets/images/consalud hero 1.png";
// @ts-ignore
import consaludHero2 from "./assets/images/consalud hero2.jpg";
// @ts-ignore
import vigiaRuedaTexto from "./assets/images/VIGIA_rueda_texto.svg";
// @ts-ignore
import vigiaRuedaCentro from "./assets/images/VIGIA_rueda_centro.svg";
import {
  Compass, ChevronLeft, ChevronRight, Volume2, VolumeX,
  ArrowRight, Zap, Building, ChevronDown, Brain, ShieldCheck, Activity, Sparkles, CheckCircle,
  MessageCircle, ExternalLink, AlertTriangle, TrendingUp, Heart, Users, Camera, Cpu, BellRing, FileCheck
} from "lucide-react";
import Footer from "./components/Footer";

// Predefined WhatsApp contact link using standard wa.me scheme and pre-filled message
const WHATSAPP_URL = "https://wa.me/573057883941?text=Hola!%20Quiero%20solicitar%20asesor%C3%ADa%20sobre%20los%20servicios%20de%20SG-SST%20y%20Vig%C3%ADa.";
const WHATSAPP_VIGIA_URL = "https://wa.me/573057883941?text=" + encodeURIComponent("Hola, quiero solicitar una demo de la *Plataforma Vigía SST* de Consalud. Me gustaría conocer más sobre cómo puede ayudar a mi empresa.");

const VIGIA_FLOW = [
  <Camera className="w-full h-full" />,
  <Cpu className="w-full h-full" />,
  <BellRing className="w-full h-full" />,
  <FileCheck className="w-full h-full" />,
];

// Beautiful interactive vector SVGs for each allied brand, custom-illustrated with extreme transparency
const VigiaLogoSvg = () => (
  <svg viewBox="0 0 320 100" className="w-full h-auto max-h-[65px] drop-shadow-[0_4px_12px_rgba(249,115,22,0.15)]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="15" y="82" fontFamily="'Inter', 'Montserrat', 'system-ui', sans-serif" fontWeight="900" fontSize="76" fill="#f8fafc" letterSpacing="-4">
      VIGI
    </text>
    <path d="M 215,82 L 246,18 L 277,82 L 259,82 L 253,68 L 237,68 L 231,82 Z M 246,32 L 239,56 L 253,56 Z" fill="#ef7c10" />
    <path d="M 90,24 C 135,1 185,5 220,19" stroke="#ef7c10" strokeWidth="5" strokeLinecap="round" />
    <circle cx="220" cy="19" r="9" fill="#ef7c10" />
    <line x1="220" y1="19" x2="244" y2="46" stroke="#ef7c10" strokeWidth="5" strokeLinecap="round" />
    <circle cx="244" cy="46" r="5" fill="#ef7c10" stroke="#010410" strokeWidth="1.5" />
  </svg>
);

const MinTrabajoLogoSvg = () => (
  <svg viewBox="0 0 320 100" className="w-full h-auto max-h-[65px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="85" y="52" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="26" fill="#ffffff" letterSpacing="0.5">
      MinTrabajo
    </text>
    <text x="85" y="72" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="11" fill="#94a3b8" letterSpacing="0.2">
      Ministerio del Trabajo CO
    </text>
    <g transform="translate(15, 12)">
      <path d="M 12,5 L 48,5 C 48,5 58,28 48,48 C 38,62 30,70 30,70 C 30,70 22,62 12,48 C 2,28 12,5 M 12,5" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
      <path d="M 14,8 L 46,8 L 44,22 L 16,22 Z" fill="#fcd34d" />
      <path d="M 16,22 L 44,22 L 40,40 L 20,40 Z" fill="#3b82f6" />
      <path d="M 20,40 L 40,40 L 34,58 L 26,58 Z" fill="#ef4444" />
      <circle cx="30" cy="31" r="6" fill="none" stroke="#ffffff" strokeWidth="1.5" />
    </g>
  </svg>
);

const CCSColombiaLogoSvg = () => (
  <svg viewBox="0 0 320 100" className="w-full h-auto max-h-[65px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="85" y="52" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="28" fill="#ffffff" letterSpacing="1">
      CCS Colombia
    </text>
    <text x="85" y="72" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="11" fill="#10b981" letterSpacing="0.5">
      SEGURIDAD Y PREVENCIÓN
    </text>
    <g transform="translate(15, 12)">
      <rect x="5" y="5" width="55" height="55" rx="27.5" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="3" />
      <path d="M 32.5,17 L 32.5,27 L 42.5,27 L 42.5,35 L 32.5,35 L 32.5,45 L 24.5,45 L 24.5,35 L 14.5,35 L 14.5,27 L 24.5,27 L 24.5,17 Z" fill="#10b981" />
      <path d="M -1,18 C -1,-1 66,-1 66,18" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />
    </g>
  </svg>
);

const SuperSaludLogoSvg = () => (
  <svg viewBox="0 0 320 100" className="w-full h-auto max-h-[65px]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="85" y="52" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="26" fill="#ffffff" letterSpacing="0.2">
      SuperSalud
    </text>
    <text x="85" y="72" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="11" fill="#38bdf8" letterSpacing="0.5">
      VIGILANCIA SANITARIA
    </text>
    <g transform="translate(15, 12)">
      <path d="M 5,16 C 5,4 60,4 60,16 C 60,36 32.5,52 32.5,56 C 32.5,52 5,36 5,16 Z" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="2.5" />
      <path d="M 32.5,9 L 32.5,35 M 19.5,22 L 45.5,22" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
      <path d="M 11,30 C 19,38 46,38 54,30" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

const DcjLogoSvg = () => (
  <div className="flex items-center gap-3.5 select-none pointer-events-none mb-4 bg-slate-950/25 border border-white/5 backdrop-blur-sm rounded-2xl py-2 px-3 w-fit">
    <svg viewBox="0 0 100 100" className="w-11 h-11 filter drop-shadow-[0_4px_10px_rgba(255,141,43,0.22)]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orange leaf/holding hands circular path around */}
      <path d="M 50 15 A 35 35 0 0 0 15 50 A 35 35 0 0 0 50 85 A 35 35 0 0 0 85 50" stroke="#ff8d2b" strokeWidth="4" strokeLinecap="round" />
      <path d="M 15 50 C 15 75, 40 85, 50 85 C 60 85, 85 75, 85 50" fill="url(#leafGradient)" opacity="0.15" />
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff8d2b" />
          <stop offset="100%" stopColor="#e06b00" />
        </linearGradient>
      </defs>
      
      {/* Circular orange background and hands shape resembling the emblem */}
      <path d="M 25,65 C 32,70 42,75 50,75 C 58,75 68,70 75,65" stroke="#ff8d2b" strokeWidth="6" strokeLinecap="round" />
      
      {/* 3 figures inside */}
      {/* Left figure: orange */}
      <circle cx="38" cy="45" r="4.5" fill="#ff8d2b" />
      <path d="M 32,58 C 32,50 44,50 44,58" stroke="#ff8d2b" strokeWidth="3" strokeLinecap="round" />
      
      {/* Right figure: blue */}
      <circle cx="62" cy="45" r="4.5" fill="#3b82f6" />
      <path d="M 56,58 C 56,50 68,50 68,58" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

      {/* Center figure: orange */}
      <circle cx="50" cy="38" r="5" fill="#ff8d2b" />
      <path d="M 42,54 C 42,44 58,44 58,54" stroke="#ff8d2b" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
    
    <div className="flex flex-col justify-center text-left">
      <div className="flex items-baseline gap-1.5 leading-none">
        <span className="text-xl font-black text-white tracking-tight leading-none font-sans">DCJ</span>
        <span className="text-[9px] font-black text-[#ff8d2b] tracking-wider leading-none">TALENTO HUMANO 3.0</span>
      </div>
      <span className="text-[8px] text-slate-300 tracking-wide font-semibold leading-none mt-1">Conectamos talento, potenciamos personas</span>
    </div>
  </div>
);

const renderBrandLogo = (name: string) => {
  switch (name) {
    case "VIGIA":
      return (
        <img 
          src={vigiaColorLogo} 
          alt="VIGIA Logo" 
          className="w-full h-auto max-h-[75px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.1)] filter brightness-100" 
          referrerPolicy="no-referrer"
        />
      );
    case "MinTrabajo":
      return <MinTrabajoLogoSvg />;
    case "CCS Colombia":
      return <CCSColombiaLogoSvg />;
    case "SuperSalud":
      return <SuperSaludLogoSvg />;
    default:
      return null;
  }
};

const ALLIED_BRANDS = [
  {
    name: "VIGIA",
    fullName: "Vigía Salud Inteligente",
    role: "Monitoreo Predictivo & SST",
    badge: "👁️",
    desc: "Plataforma inteligente de vigilancia epidemiológica y prevención de riesgos para salvaguardar tu bienestar integral.",
    isPremium: true
  },
  {
    name: "MinTrabajo",
    fullName: "Ministerio del Trabajo",
    role: "Entidad Reguladora",
    badge: "🇨🇴",
    desc: "Vigilancia, supervisión y sanción preventiva del SG-SST en todo el territorio colombiano."
  },
  {
    name: "CCS Colombia",
    fullName: "Consejo Colombiano de Seguridad",
    role: "Referente Técnico",
    badge: "🛡️",
    desc: "Estandarización técnica, investigación de Higiene Industrial y fomento de la prevención libre de riesgos."
  },
  {
    name: "SuperSalud",
    fullName: "Superintendencia de Salud",
    role: "Defensa e Inspección",
    badge: "🏥",
    desc: "Garantía del cumplimiento estricto de los derechos de pacientes, cobertura GES y medicamentos."
  }
];

export const BRAND_THEMES: {
  [key: string]: {
    primary: string;
    secondary: string;
    glow: string;
    gradient: string;
    textAccent: string;
    bgAccentClass: string;
    borderAccentClass: string;
    textAccentClass: string;
    shadowGlow: string;
    features: string[];
    objectives: string[];
  };
} = {
  "VIGIA": {
    primary: "#ef7c10",
    secondary: "#002855",
    glow: "rgba(239, 124, 16, 0.4)",
    gradient: "from-[#ef7c10]/20 via-[#002855]/20 to-black/95",
    textAccent: "#ef7c10",
    bgAccentClass: "bg-orange-500",
    borderAccentClass: "border-orange-500/40 hover:border-orange-400",
    textAccentClass: "text-[#ef7c10]",
    shadowGlow: "shadow-[0_0_50px_rgba(239,124,16,0.25)]",
    features: ["Vigilancia médica 24/7 de trabajadores", "Predicción de brotes y riesgos epidemiológicos", "Alertas proactivas de salud ocupacional", "Configuración ágil del profesiograma"],
    objectives: ["Identificación precoz de sintomatología crítica", "Automatización de reportes SST para Ministerios", "Minimizar siniestralidad un 40% mediante analítica"]
  },
  "MinTrabajo": {
    primary: "#3b82f6",
    secondary: "#1e3a8a",
    glow: "rgba(59, 130, 246, 0.4)",
    gradient: "from-blue-600/20 via-yellow-500/10 to-red-600/20",
    textAccent: "#3b82f6",
    bgAccentClass: "bg-blue-600",
    borderAccentClass: "border-blue-500/40 hover:border-blue-400",
    textAccentClass: "text-blue-400",
    shadowGlow: "shadow-[0_0_50px_rgba(59,130,246,0.25)]",
    features: ["Cumplimiento de Estándares Mínimos (Res. 0312)", "Reportes gubernamentales de accidentalidad", "Sanciones preventivas e inspección virtual", "Fomento de trabajo seguro e inclusivo"],
    objectives: ["Reducir brechas de cumplimiento de SG-SST país", "Agilizar la radicación y seguimiento de trámites", "Garantizar ambientes laborales libres de acoso y riesgos"]
  },
  "CCS Colombia": {
    primary: "#10b981",
    secondary: "#064e3b",
    glow: "rgba(16, 185, 129, 0.4)",
    gradient: "from-emerald-500/20 via-teal-800/25 to-black/95",
    textAccent: "#10b981",
    bgAccentClass: "bg-emerald-500",
    borderAccentClass: "border-emerald-500/40 hover:border-emerald-400",
    textAccentClass: "text-emerald-400",
    shadowGlow: "shadow-[0_0_50px_rgba(16,185,129,0.25)]",
    features: ["Auditorías RUC y acompañamiento en sitio", "Programas académicos de posgrado y diplomados", "Investigación científica y técnica de riesgos", "Congresos mundiales y redes de líderes SST"],
    objectives: ["Generar cultura de Cero Daño en empresas aliadas", "Capacitar a más de 50,000 profesionales anualmente", "Estandarizar guías técnicas de higiene industrial"]
  },
  "SuperSalud": {
    primary: "#38bdf8",
    secondary: "#0c4a6e",
    glow: "rgba(56, 189, 248, 0.4)",
    gradient: "from-sky-400/20 via-blue-900/25 to-black/95",
    textAccent: "#38bdf8",
    bgAccentClass: "bg-sky-500",
    borderAccentClass: "border-sky-500/40 hover:border-sky-400",
    textAccentClass: "text-sky-400",
    shadowGlow: "shadow-[0_0_50px_rgba(56,189,248,0.25)]",
    features: ["Vigilancia del flujo financiero de EPS/IPS", "Mesa de resolución de PQR urgentes (Salvar vidas)", "Intervención de entidades con fallas de atención", "Estadísticas y auditorías del derecho a la salud"],
    objectives: ["Eliminar barreras de acceso a tratamientos complejos", "Garantizar transparencia en la destinación de recursos", "Atender el 100% de quejas críticas en tiempo real"]
  }
};

const SECTIONS = [
  { index: 1, label: "servicios", logoBadge: "✚", targetId: "sec-landing-2" },
  { index: 2, label: "nosotros", logoBadge: "🛡️", targetId: "sec-landing-1" },
  { index: 3, label: "contacto", logoBadge: "💬", targetId: "sec-landing-4" }
];

export default function App() {
  const navigate = useNavigate();
  const progress = 0.04; // Fija la cámara en el fondo del Hero (frente a la montaña de inicio)
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [brandCardHovered, setBrandCardHovered] = useState(false);
  const brandCardRef = useRef<HTMLDivElement>(null);
  const [brandCardRotateX, setBrandCardRotateX] = useState(0);
  const [brandCardRotateY, setBrandCardRotateY] = useState(0);

  // Vigía hero card tilt effect
  const vigiaHeroCardRef = useRef<HTMLDivElement>(null);
  const [vigiaHeroCardTilt, setVigiaHeroCardTilt] = useState({ x: 0, y: 0 });
  const [isVigiaHeroCardHovered, setIsVigiaHeroCardHovered] = useState(false);

  // Hero Cycling HUD states
  const [heroMode, setHeroMode] = useState<"consalud" | "vigia">("consalud");
  const [isHeroCycling, setIsHeroCycling] = useState(true);
  const [heroCycleProgress, setHeroCycleProgress] = useState(0);

  // Presentation Modal with timeline states
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [modalBrandIdx, setModalBrandIdx] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [isSlideTransitioning, setIsSlideTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const [modalToast, setModalToast] = useState("");
  const [activeMarca, setActiveMarca] = useState<number | null>(null);
  const [pendingContactService, setPendingContactService] = useState<string | null>(null);
  const [pendingServiceModal, setPendingServiceModal] = useState<string | null>(null);

  // Global modifiers and helpers
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControlsHint, setShowControlsHint] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageTitle, setExpandedImageTitle] = useState<string>("");

  // Scroll tracking hooks for hybrid layout
  const [scrollY, setScrollY] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState(-1);

  // Llevar inmediatamente a la primera sección apenas se haga scroll desde el Hero
  useEffect(() => {
    let scrollingActive = false;

    const handleWheel = (e: WheelEvent) => {
      // Si el usuario está arriba del todo y hace scroll hacia abajo, llevarlo de una vez a la sección
      if (window.scrollY < 20 && e.deltaY > 0 && !scrollingActive) {
        e.preventDefault();
        scrollingActive = true;
        const target = document.getElementById("sec-landing-2");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            scrollingActive = false;
          }, 1000);
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY < 20 && !scrollingActive) {
        const touchEndY = e.touches[0].clientY;
        const deltaY = touchStartY - touchEndY; // Positivo es scroll hacia abajo
        if (deltaY > 15) {
          e.preventDefault();
          scrollingActive = true;
          const target = document.getElementById("sec-landing-1");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
            setTimeout(() => {
              scrollingActive = false;
            }, 1000);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Monitor coordinates and set states
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute scrolled percent of overall document
  useEffect(() => {
    const handlePercent = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollPercent(window.scrollY / docHeight);
      }
    };
    window.addEventListener("scroll", handlePercent, { passive: true });
    window.addEventListener("resize", handlePercent);
    setTimeout(handlePercent, 200);
    return () => {
      window.removeEventListener("scroll", handlePercent);
      window.removeEventListener("resize", handlePercent);
    };
  }, [scrollY]);

  // Performance Optimization: Turn WebGL rendering off when past Hero section bounding box
  const webglActive = scrollY < window.innerHeight + 100;

  // Track page coordinates to highlight active navbar indices
  useEffect(() => {
    const handleActiveSelection = () => {
      // 120px offset to account for the header navbar height and margins
      const scrollPos = window.scrollY + 120;
      let found = false;

      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          const bottom = top + rect.height;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSectionId(sec.index);
            found = true;
            break;
          }
        }
      }

      if (window.scrollY < window.innerHeight * 0.4) {
        setActiveSectionId(-1);
      }
    };
    window.addEventListener("scroll", handleActiveSelection, { passive: true });
    // Trigger initially so it starts with correct highlight if loaded mid-page
    handleActiveSelection();
    return () => window.removeEventListener("scroll", handleActiveSelection);
  }, []);

  // Cycling Consalud vs Vigía Text
  useEffect(() => {
    if (!isHeroCycling) return;
    const intervalMs = 50;
    const totalDurationMs = 7500;
    const step = (intervalMs / totalDurationMs) * 100;
    
    const timer = setInterval(() => {
      setHeroCycleProgress(prev => prev + step);
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [isHeroCycling]);

  useEffect(() => {
    if (heroCycleProgress >= 100) {
      setHeroMode(curr => curr === "consalud" ? "vigia" : "consalud");
      setHeroCycleProgress(0);
    }
  }, [heroCycleProgress]);

  // Audio synthesizer chime
  const playRetroChime = (type: "nav" | "click" | "info" | "transition") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === "nav") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      } else if (type === "transition") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(680, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      }
      
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Ignored autostart blocked
    }
  };

  const jumpToLandingSection = (targetId: string, idx: number) => {
    setMobileMenuOpen(false);
    playRetroChime("transition");
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (idx === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Brand Modal presentation timing loop
  const triggerBrandTransition = (newIdx: number, direction: "next" | "prev") => {
    if (isSlideTransitioning) return;
    setSlideDirection(direction);
    setIsSlideTransitioning(true);
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= 5) setBlurAmount(currentStep * 5.5);
      else if (currentStep <= 10) setBlurAmount((10 - currentStep) * 5.5);
      else {
        clearInterval(timer);
        setBlurAmount(0);
      }
    }, 28);

    setTimeout(() => {
      setModalBrandIdx(newIdx);
      setActiveBrandIdx(newIdx);
      playRetroChime("transition");
    }, 140);

    setTimeout(() => {
      setIsSlideTransitioning(false);
    }, 320);
  };

  const handleBrandCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!brandCardRef.current) return;
    const card = brandCardRef.current;
    const rect = card.getBoundingClientRect();
    setBrandCardRotateY(((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 12);
    setBrandCardRotateX(-((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 12);
  };

  const handleBrandCardMouseLeave = () => {
    setBrandCardHovered(false);
    setBrandCardRotateX(0);
    setBrandCardRotateY(0);
  };

  const handleVigiaHeroCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVigiaHeroCardHovered(true);
    if (!vigiaHeroCardRef.current) return;
    const rect = vigiaHeroCardRef.current.getBoundingClientRect();
    setVigiaHeroCardTilt({
      y:  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 10,
      x: -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 10,
    });
  };

  const handleVigiaHeroCardMouseLeave = () => {
    setIsVigiaHeroCardHovered(false);
    setVigiaHeroCardTilt({ x: 0, y: 0 });
  };

  return (
    <Routes>
      <Route path="/vigia" element={<VigiaPage />} />
      <Route path="*" element={
    <div className="relative min-h-screen w-full bg-white text-slate-800 font-sans selection:bg-[#ff8d2b]/20 selection:text-slate-900">

      {/* GLASSMORPHIC FIXED NAVBAR: Full-width Apple-style premium bar with elegant rounded bottom edge */}
      <div className="fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 pointer-events-auto">
        <header className={`w-full backdrop-blur-[12px] backdrop-saturate-[200%] border-b border-white/[0.125] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] relative overflow-hidden transition-all duration-300 rounded-none ${
          scrollY > 250
            ? "bg-[#05123e]/95 border-b-white/[0.15]"
            : "bg-[#05123e]/75 border-b-white/[0.12]"
        }`}>
          <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 2xl:px-24 flex items-center justify-between transition-all duration-300 h-[72px]">

            {/* Logo Brand Identifier */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 w-[200px] h-14">
                <img 
                  src={consaludWhiteLogo} 
                  alt="Consalud Logo" 
                  className="absolute max-w-full max-h-20 object-contain filter drop-shadow-sm transition-all duration-300 opacity-100 scale-100" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Navigation link triggers linked to static page anchors */}
            <nav className="hidden md:flex items-center gap-9 select-none">
              {SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.index;
                return (
                  <button
                    key={sec.index}
                    onClick={() => jumpToLandingSection(sec.targetId, sec.index)}
                    className={`relative py-2 px-0.5 text-[15px] font-mono tracking-widest uppercase transition-colors duration-300 cursor-pointer focus:outline-none ${
                      isActive 
                        ? "text-white font-bold" 
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{sec.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeAppleNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-[#ff8d2b]"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Control widgets panel */}
            <div className="flex items-center gap-4">
              
              {/* VIGIA Interactive Action Button */}
              <button
                onClick={() => {
                  playRetroChime("click");
                  navigate("/vigia");
                }}
                className={`flex items-center justify-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-md select-none transition-all duration-300 cursor-pointer active:scale-95 group shadow-sm hover:shadow-md ${
                  scrollY > 100
                    ? "bg-[#00ef89]/10 border-[#00ef89]/80 hover:border-[#00ef89] hover:bg-[#00ef89]/15"
                    : "bg-[#05123e]/40 border-[#00ef89]/60 hover:border-[#00ef89] hover:bg-[#05123e]/70"
                }`}
                title="Ir a Software VIGÍA SST"
              >
                <img
                  src={vigiaNewLogo}
                  alt="VIGIA"
                  className="h-5 w-auto object-contain brightness-100 drop-shadow-[0_2px_4px_rgba(0,239,137,0.25)]"
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* WhatsApp Contact Button (Desktop/Tablet) */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playRetroChime("click")}
                className="hidden md:flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md select-none transition-all duration-300 cursor-pointer active:scale-95 group shadow-sm hover:shadow-md bg-white/5 border-[#25D366]/40 text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/15 hover:text-white hover:shadow-[0_4px_12px_rgba(37,211,102,0.25)]"
                title="Contactar por WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-bold tracking-wide">WhatsApp</span>
              </a>

              {/* Mobile Hamburger button Toggle */}
              <button
                onClick={() => {
                  playRetroChime("click");
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="md:hidden p-2 rounded-lg transition-all cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>

            </div>
          </div>

          {/* Mobile Dropdown side Drawer */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-3.5 shadow-2xl"
            >
              <div className="flex flex-col gap-2.5">
                <span className="text-[9px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold mb-1">SECCIONES</span>
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.index}
                    onClick={() => jumpToLandingSection(sec.targetId, sec.index)}
                    className={`flex items-center justify-between py-2 px-3.5 rounded-xl transition-all duration-300 text-left cursor-pointer ${
                      activeSectionId === sec.index ? "bg-white/10 text-white font-bold border-l-4 border-[#ff8d2b]" : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-[11px] font-mono tracking-wider uppercase">{sec.label}</span>
                    <span className="text-xs">{sec.logoBadge}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </header>
      </div>

      {/* 1. HERO SECTION: 50/50 split layout */}
      <section className="relative h-[88vh] min-h-[560px] md:h-screen md:min-h-[620px] w-full flex flex-col justify-between overflow-hidden shrink-0 select-none">

        {/* ── CONSALUD: full-width photo layout ── */}
        {heroMode === "consalud" && (
          <>
            {/* Photo background — hero2 + lighter overlay to preserve resolution */}
            <div className="absolute inset-0 z-0">
              <img src={consaludHero2} alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-[#05123e]/55" />
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#05123e]/70 to-transparent" />
            </div>

            {/* Main text + logo card — centered vertically in available space above strip */}
            <motion.div
              key="consalud-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-30 flex items-center pointer-events-none"
              style={{ bottom: "185px", top: "72px" }}
            >
              <div className="w-full px-8 md:px-14 lg:px-16 2xl:px-24 flex items-center justify-between gap-10">

                {/* Left: text + CTA */}
                <div className="max-w-xl lg:max-w-2xl pointer-events-auto select-text">
                  <span className="text-[10px] sm:text-xs font-mono font-black tracking-[0.25em] uppercase text-[#ff8d2b] block mb-[clamp(0.5rem,1.5vh,1rem)]">
                    ALIADO VITAL SST · BOGOTÁ · DESDE 1998
                  </span>
                  <h1 className="text-[clamp(1.75rem,min(6vw,10vh),6rem)] font-black tracking-tight text-white leading-[0.94] mb-[clamp(0.5rem,1.5vh,1rem)]">
                    Tu Aliado <span className="bg-gradient-to-r from-[#05123e] to-[#ff8d2b] bg-clip-text text-transparent">Estratégico  en SST</span>
                  </h1>
                  <p className="text-white/90 text-[clamp(0.875rem,min(1.8vw,3vh),1.375rem)] font-sans font-semibold leading-relaxed max-w-md mb-[clamp(0.75rem,2vh,1.75rem)]">
                    Protejemos a tu equipo y tu empresa con soluciones a la medida sin improvisaciones, con respaldo académico y experiencia en
                    mercado Colombiano de salud ocupacional. <span className="text-[#ff8d2b] font-bold">¡Tu tranquilidad es nuestra prioridad!</span>
                  </p>

                  {/* Mobile slide selector — horizontal, below the text (mobile only) */}
                  <div className="flex md:hidden items-center gap-2 pointer-events-auto select-none max-w-xs mt-2">
                    <button
                      onClick={() => { setHeroMode("consalud"); setHeroCycleProgress(0); playRetroChime("click"); }}
                      className="relative flex-1 py-2.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase overflow-hidden transition-all duration-300 cursor-pointer bg-[#ff8d2b] text-white shadow-sm"
                    >
                      {isHeroCycling && (
                        <span
                          className="absolute inset-0 bg-black/15 origin-left pointer-events-none"
                          style={{ transform: `scaleX(${heroCycleProgress / 100})`, transition: "transform 75ms linear" }}
                        />
                      )}
                      <span className="relative z-10">Consalud</span>
                    </button>
                    <button
                      onClick={() => { setHeroMode("vigia"); setHeroCycleProgress(0); playRetroChime("click"); }}
                      className="relative flex-1 py-2.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase overflow-hidden transition-all duration-300 cursor-pointer bg-white/10 text-slate-300 border border-white/20"
                    >
                      <span className="relative z-10">Vigía</span>
                    </button>
                  </div>
                </div>

                {/* Right: Consalud logo card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden lg:flex shrink-0 w-80 xl:w-96 mr-12 pointer-events-none select-none"
                >
                  <div className="w-full rounded-3xl bg-white/10 border border-white/25 backdrop-blur-md flex flex-col items-center justify-center p-12 shadow-2xl relative overflow-hidden" style={{ minHeight: "min(320px, calc(100vh - 380px))" }}>
                    {/* Corner accents */}
                    <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#ff8d2b]/70 rounded-tl" />
                    <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#ff8d2b]/70 rounded-tr" />
                    <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#ff8d2b]/70 rounded-bl" />
                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#ff8d2b]/70 rounded-br" />
                    <img
                      src={consaludHero1}
                      alt="Consalud"
                      className="w-full h-auto object-contain filter drop-shadow-[0_4px_24px_rgba(255,255,255,0.25)]"
                      style={{ maxHeight: "max(140px, calc(100vh - 460px))" }}
                    />
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-mono font-black tracking-widest text-white/60 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b] animate-pulse" />
                     ALIADO VITAL SST · BOGOTÁ · DESDE 1998
                    </div>
                  </div>
                </motion.div>

              </div>
            </motion.div>

            {/* ── Bottom 4-section strip — absolute, always above carousel controls. Hidden on mobile (see request). ── */}
            <div className="hidden md:grid absolute left-0 right-0 z-30 border-t border-white/20 grid-cols-4 pointer-events-auto" style={{ bottom: "88px" }}>
              <button
                onClick={() => { playRetroChime("nav"); jumpToLandingSection("sec-landing-2", 1); }}
                className="group flex flex-col gap-2 p-4 md:p-5 border-r border-white/20 hover:bg-white/10 transition-all duration-300 text-left backdrop-blur-sm"
              >
                <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-[#ff8d2b]" />
                <span className="text-white font-bold text-sm md:text-base leading-snug">Seguridad y Salud en el Trabajo</span>
                <span className="text-[#ff8d2b] font-bold group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
              <button
                onClick={() => { playRetroChime("nav"); jumpToLandingSection("sec-landing-1", 2); }}
                className="group flex flex-col gap-2 p-4 md:p-5 border-r border-white/20 hover:bg-white/10 transition-all duration-300 text-left backdrop-blur-sm"
              >
                <Users className="w-6 h-6 md:w-7 md:h-7 text-[#ff8d2b]" />
                <span className="text-white font-bold text-sm md:text-base leading-snug">Nosotros</span>
                <span className="text-[#ff8d2b] font-bold group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
              <button
                onClick={() => { playRetroChime("click"); jumpToLandingSection("sec-landing-2", 1); setTimeout(() => setPendingServiceModal("Batería de Riesgo Psicosocial"), 600); }}
                className="group flex flex-col gap-2 p-4 md:p-5 border-r border-white/20 hover:bg-white/10 transition-all duration-300 text-left backdrop-blur-sm"
              >
                <Brain className="w-6 h-6 md:w-7 md:h-7 text-[#ff8d2b]" />
                <span className="text-white font-bold text-sm md:text-base leading-snug">Batería Psicosocial</span>
                <span className="text-[#ff8d2b] font-bold group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
              <button
                onClick={() => { playRetroChime("nav"); jumpToLandingSection("sec-landing-4", 4); }}
                className="group flex flex-col gap-2 p-4 md:p-5 hover:bg-white/10 transition-all duration-300 text-left backdrop-blur-sm"
              >
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-[#ff8d2b]" />
                <span className="text-white font-bold text-sm md:text-base leading-snug">Contacto</span>
                <span className="text-[#ff8d2b] font-bold group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </>
        )}
 
        {/* ── VIGÍA: full photo background + centered card ── */}
        {heroMode === "vigia" && (
          <>
            {/* Flat gradient background + dotted texture, matching the new Vigía brand sheet */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0a1830] via-[#10263a] to-[#0c3a30] overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(56,189,248,0.6)_1px,transparent_1px)] [background-size:24px_24px]"
                style={{ WebkitMaskImage: "linear-gradient(to bottom, black, transparent 65%)", maskImage: "linear-gradient(to bottom, black, transparent 65%)" }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgba(0,239,137,0.55)_1px,transparent_1px)] [background-size:22px_22px]"
                style={{ WebkitMaskImage: "linear-gradient(to top, black, transparent 55%)", maskImage: "linear-gradient(to top, black, transparent 55%)" }}
              />
            </div>

            {/* Main content — mirrors Consalud layout */}
            <motion.div
              key="vigia-layout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-30 flex items-center pointer-events-none"
              style={{ bottom: "185px", top: "128px" }}
            >
              <div className="w-full px-8 md:px-14 lg:px-16 2xl:px-24 flex items-center justify-between gap-10">

                {/* Left: logo + tagline + description card + flow-of-action */}
                <div className="min-w-0 max-w-xl md:max-w-3xl pointer-events-auto select-text ml-4 md:ml-10 lg:ml-16">
                  <div className="flex items-center gap-3 md:gap-5 mb-[clamp(0.35rem,1vh,0.6rem)] md:mb-[clamp(0.75rem,2vh,1.25rem)]">
                    <img
                      src={vigiaRuedaCentro}
                      alt=""
                      className="h-[clamp(1.75rem,6vw,2.5rem)] md:h-[clamp(3.5rem,min(8vw,10vh),6rem)] w-auto object-contain shrink-0"
                    />
                    <img
                      src={vigiaNewLogo}
                      alt="VIGÍA"
                      className="h-[clamp(2rem,7.5vw,3.25rem)] md:h-[clamp(5rem,min(11vw,13.5vh),8.5rem)] w-auto object-contain filter drop-shadow-[0_2px_16px_rgba(0,239,137,0.3)]"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs md:text-[clamp(0.9rem,1.3vw,1.15rem)] font-mono font-black tracking-[0.25em] uppercase text-white/50 block mb-[clamp(1rem,2.5vh,1.5rem)] md:mb-[clamp(2rem,4.5vh,3.25rem)]">
                    Siempre presente. Siempre alerta.
                  </span>

                  {/* Description text — no frame, just weightier type over the hero background */}
                  <div className="relative mb-[clamp(0.85rem,2vh,1.25rem)] md:mb-[clamp(1.75rem,3.5vh,2.5rem)]">
                    <p className="relative text-white text-sm sm:text-base md:text-[clamp(1.25rem,1.9vw,1.65rem)] font-sans font-bold leading-relaxed mb-3 md:mb-5">
                      Vigía alerta antes del incidente. Cámaras con inteligencia artificial colombiana e ingeniería alemana, todo trabajando para que ningún trabajador salga lastimado.
                    </p>
                    <div className="relative flex items-center gap-3 md:gap-4">
                      <span className="text-[9px] sm:text-[10px] md:text-[clamp(0.75rem,1vw,0.9rem)] font-mono font-black tracking-[0.15em] uppercase text-white/40">
                        Siempre presente. Siempre alerta.
                      </span>
                      <span className="w-px h-4 md:h-6 bg-white/15 shrink-0" />
                      {/* Colombia × Alemania flag badges */}
                      <div className="relative flex items-center justify-center w-[2.5rem] h-[1.5rem] md:w-[3.75rem] md:h-[2.25rem] shrink-0">
                        <div className="absolute left-0 w-6 h-6 md:w-9 md:h-9 rounded-full overflow-hidden border border-[#f8fbfa]/70 flex flex-col">
                          <div className="h-1/2 bg-[#FCD116]" />
                          <div className="h-1/4 bg-[#003893]" />
                          <div className="h-1/4 bg-[#CE1126]" />
                        </div>
                        <div className="absolute right-0 w-6 h-6 md:w-9 md:h-9 rounded-full overflow-hidden border border-[#00ef89]/80 flex flex-col">
                          <div className="h-1/3 bg-[#0a0a0a]" />
                          <div className="h-1/3 bg-[#DD0000]" />
                          <div className="h-1/3 bg-[#FFCE00]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flujo de acción */}
                  <div>
                    <p className="text-[10px] md:text-[clamp(0.8rem,1.1vw,1rem)] font-mono font-black tracking-[0.2em] text-[#00ef89] uppercase mb-2.5 md:mb-4">
                      Flujo de Acción
                    </p>
                    <div className="flex items-center gap-2 md:gap-4">
                      {VIGIA_FLOW.map((icon, i) => (
                        <React.Fragment key={i}>
                          <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-[clamp(3.5rem,6vw,4.75rem)] md:h-[clamp(3.5rem,6vw,4.75rem)] p-2 md:p-3.5 rounded-lg md:rounded-xl border border-[#00ef89]/40 bg-[#00ef89]/10 flex items-center justify-center text-[#00ef89] shrink-0">
                            {icon}
                          </div>
                          {i < VIGIA_FLOW.length - 1 && (
                            <span className="text-[#00ef89]/50 font-black text-base md:text-[clamp(1.5rem,2.2vw,2rem)] shrink-0">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Mobile slide selector — horizontal, below the text (mobile only) */}
                  <div className="flex md:hidden items-center gap-2 pointer-events-auto select-none max-w-xs mt-6">
                    <button
                      onClick={() => { setHeroMode("consalud"); setHeroCycleProgress(0); playRetroChime("click"); }}
                      className="relative flex-1 py-2.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase overflow-hidden transition-all duration-300 cursor-pointer bg-white/10 text-slate-300 border border-white/20"
                    >
                      <span className="relative z-10">Consalud</span>
                    </button>
                    <button
                      onClick={() => { setHeroMode("vigia"); setHeroCycleProgress(0); playRetroChime("click"); }}
                      className="relative flex-1 py-2.5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase overflow-hidden transition-all duration-300 cursor-pointer bg-[#05123e] text-white shadow-sm"
                    >
                      {isHeroCycling && (
                        <span
                          className="absolute inset-0 bg-white/15 origin-left pointer-events-none"
                          style={{ transform: `scaleX(${heroCycleProgress / 100})`, transition: "transform 75ms linear" }}
                        />
                      )}
                      <span className="relative z-10">Vigía</span>
                    </button>
                  </div>

                  {/* Mobile CTA — the desktop CTA lives under the wheel badge on the right */}
                  <button
                    onClick={() => { playRetroChime("click"); navigate("/vigia"); }}
                    className="md:hidden mt-5 inline-flex items-center gap-2 px-8 py-[clamp(0.5rem,1.2vh,0.85rem)] rounded-full bg-[#00ef89] text-[#10263a] font-black text-base tracking-wider hover:bg-[#2ec195] transition-all duration-300 shadow-lg hover:shadow-[0_6px_24px_rgba(0,239,137,0.35)] active:scale-[0.97]"
                  >
                    Conocer Vigía <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Right: big spinning Vigía badge + CTA */}
                <div className="hidden md:flex shrink-0 flex-col items-center gap-6 md:gap-8 mr-0 xl:-mr-6 pointer-events-auto select-none">
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative h-[clamp(14rem,min(52vh,32vw),36rem)] w-[clamp(14rem,min(52vh,32vw),36rem)] pointer-events-none select-none filter drop-shadow-[0_12px_60px_rgba(0,239,137,0.3)]"
                  >
                    <img src={vigiaRuedaTexto} alt="" className="absolute inset-0 w-full h-full animate-[spin_24s_linear_infinite]" />
                    <img src={vigiaRuedaCentro} alt="Vigía" className="absolute inset-0 w-full h-full" />
                  </motion.div>
                  <button
                    onClick={() => { playRetroChime("click"); navigate("/vigia"); }}
                    className="inline-flex items-center gap-2 px-8 md:px-10 py-[clamp(0.6rem,1.6vh,1.35rem)] rounded-full bg-[#00ef89] text-[#10263a] font-black text-base md:text-lg tracking-wider hover:bg-[#2ec195] transition-all duration-300 shadow-lg hover:shadow-[0_6px_24px_rgba(0,239,137,0.35)] hover:scale-[1.03]"
                  >
                    Conocer Vigía <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

              </div>
            </motion.div>
          </>
        )}

        {/* Slide selector — frosted segmented control, centered within the safe content zone (below navbar, above bottom strip). Desktop only: on mobile it renders inline below the text instead. */}
        <div
          className="hidden md:flex absolute z-40 pointer-events-auto select-none right-4 md:right-6 items-center"
          style={{ top: "72px", bottom: "185px" }}
        >
          <div className="flex flex-col items-center gap-1 bg-white/85 backdrop-blur-md border border-slate-200/70 shadow-md px-1 py-1 rounded-full">
            {/* Consalud tab */}
            <button
              onClick={() => {
                setHeroMode("consalud");
                setHeroCycleProgress(0);
                playRetroChime("click");
              }}
              className={`relative transition-all duration-300 px-2 py-5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase cursor-pointer overflow-hidden ${
                heroMode === "consalud"
                  ? "bg-[#ff8d2b] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {heroMode === "consalud" && isHeroCycling && (
                <span
                  className="absolute inset-0 bg-black/15 origin-bottom pointer-events-none"
                  style={{ transform: `scaleY(${heroCycleProgress / 100})`, transition: "transform 75ms linear" }}
                />
              )}
              <span className="relative z-10 [writing-mode:vertical-lr] rotate-180">Consalud</span>
            </button>
            {/* Vigía tab */}
            <button
              onClick={() => {
                setHeroMode("vigia");
                setHeroCycleProgress(0);
                playRetroChime("click");
              }}
              className={`relative transition-all duration-300 px-2 py-5 rounded-full text-[10px] font-mono font-black tracking-widest uppercase cursor-pointer overflow-hidden ${
                heroMode === "vigia"
                  ? "bg-[#05123e] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {heroMode === "vigia" && isHeroCycling && (
                <span
                  className="absolute inset-0 bg-white/15 origin-bottom pointer-events-none"
                  style={{ transform: `scaleY(${heroCycleProgress / 100})`, transition: "transform 75ms linear" }}
                />
              )}
              <span className="relative z-10 [writing-mode:vertical-lr] rotate-180">Vigía</span>
            </button>
          </div>
        </div>

        {/* Scroll indicator — centered at the bottom */}
        <div
          onClick={() => jumpToLandingSection("sec-landing-2", 1)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-auto cursor-pointer group text-center [@media(max-height:820px)]:hidden select-none"
        >
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em] leading-none mb-2.5 group-hover:text-white transition-colors duration-300">SCROLL</p>
          <div className="w-5 h-9 rounded-full border-2 border-slate-400 group-hover:border-white transition-colors flex justify-center pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-[#ff8d2b]"
            />
          </div>
        </div>

      </section>

      {/* 2. STATIC RICH CONTENT PORTAL BENEATH GENERAL KEY VIEWPORT */}
      <StaticSections 
        alliedBrands={ALLIED_BRANDS}
        activeBrandIdx={activeBrandIdx}
        setActiveBrandIdx={setActiveBrandIdx}
        brandCardHovered={brandCardHovered}
        setBrandCardHovered={setBrandCardHovered}
        brandCardRef={brandCardRef}
        brandCardRotateX={brandCardRotateX}
        brandCardRotateY={brandCardRotateY}
        handleBrandCardMouseMove={handleBrandCardMouseMove}
        handleBrandCardMouseLeave={handleBrandCardMouseLeave}
        renderBrandLogo={renderBrandLogo}
        setIsBrandModalOpen={setIsBrandModalOpen}
        setModalBrandIdx={setModalBrandIdx}
        playRetroChime={playRetroChime}
        activeMarca={activeMarca}
        setActiveMarca={setActiveMarca}
        pendingContactService={pendingContactService}
        onContactServiceHandled={() => setPendingContactService(null)}
        pendingServiceModal={pendingServiceModal}
        onPendingServiceModalHandled={() => setPendingServiceModal(null)}
      />

      {/* 3. COOP TIMELINE PERSISTENT PRESENTATIONAL MODAL (The full chronological convention journey) */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/60 backdrop-blur-md overflow-y-auto pointer-events-auto">
          
          <div 
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary || "#ff8d2b"}1a 0%, rgba(255, 255, 255, 0.45) 80%, transparent 100%)`
            }}
          />

          <svg className="absolute w-0 h-0 pointer-events-none">
            <defs>
              <filter id="brand-motion-blur">
                <feGaussianBlur stdDeviation={`${blurAmount} 0`} />
              </filter>
            </defs>
          </svg>

          {/* Close button modal exit */}
          <button 
            onClick={() => {
              playRetroChime("click");
              setIsBrandModalOpen(false);
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-slate-600 hover:text-slate-900 transition shadow-xl cursor-pointer"
          >
            ✕
          </button>

          {modalToast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border-b-2 border-orange-500 text-white rounded-xl px-5 py-3 shadow-2xl font-mono text-xs animate-bounce font-bold">
              {modalToast}
            </div>
          )}

          {/* Main timeline visualizer container */}
          <div className="relative w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl flex flex-col md:grid md:grid-cols-12 min-h-[580px] my-auto overflow-hidden">
            
            {/* Top header Winery nodes bar */}
            <div className="md:col-span-12 border-b border-slate-100 bg-slate-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 select-none z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold" style={{ color: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}>
                  CONVENIOS DE COOPERACIÓN SST
                </span>
                <span className="text-xs text-slate-500">
                  Evolución cronológica y sinergia institucional
                </span>
              </div>

              {/* Connected chronorail progress indicator */}
              <div className="relative flex items-center justify-between gap-2 max-w-xl w-full pr-4">
                <div className="absolute left-4 right-4 h-0.5 bg-slate-200 top-1/2 -translate-y-1/2 pointer-events-none rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(modalBrandIdx / (ALLIED_BRANDS.length - 1)) * 100}%`,
                      backgroundColor: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary || "#ff8d2b"
                    }}
                  />
                </div>

                {ALLIED_BRANDS.map((tab, idx) => {
                  const years = ["2020", "2022", "2024", "2026"];
                  const isActive = idx === modalBrandIdx;
                  const itemColor = BRAND_THEMES[tab.name]?.primary || "#ff8d2b";
                  
                  return (
                    <button
                      key={tab.name}
                      onClick={() => {
                        if (idx === modalBrandIdx) return;
                        triggerBrandTransition(idx, idx > modalBrandIdx ? "next" : "prev");
                      }}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div 
                        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 ${
                          isActive ? "bg-white border-slate-450" : "bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-700"
                        }`}
                        style={{
                          borderColor: isActive ? itemColor : undefined,
                          boxShadow: isActive ? `0 0 12px ${itemColor}33` : undefined,
                        }}
                      >
                        {isActive ? (
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: itemColor }} />
                        ) : (
                          <span className="text-[10px] font-bold select-none">{tab.badge}</span>
                        )}
                      </div>
                      <span className="text-[9px] font-mono mt-1 font-bold tracking-wider" style={{ color: isActive ? itemColor : undefined }}>{years[idx]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presentation stage visual stage */}
            <div 
              className="md:col-span-6 relative p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden font-mono text-center min-h-[280px] bg-slate-50/50"
            >
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}
              />

              <div className="text-[140px] font-serif font-black absolute inset-0 flex items-center justify-center text-slate-900/[0.025] pointer-events-none uppercase">
                {["2020", "2022", "2024", "2026"][modalBrandIdx]}
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
                  Fase {modalBrandIdx + 1} de {ALLIED_BRANDS.length}
                </span>
              </div>

              <div 
                className="my-auto flex items-center justify-center py-6"
                style={{ 
                  filter: blurAmount > 0 ? "url(#brand-motion-blur)" : "none",
                  transform: isSlideTransitioning ? `scale(0.9) rotate(${slideDirection === 'next' ? -4 : 4}deg)` : "scale(1)"
                }}
              >
                <div className="w-full flex justify-center items-center scale-110 md:scale-125 transition-all duration-300">
                  {renderBrandLogo(ALLIED_BRANDS[modalBrandIdx].name)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">FASE CONTRATADA:</span>
                <span className="text-xs tracking-widest font-bold font-sans uppercase" style={{ color: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}>
                  {["INICIO", "SUPERVISIÓN", "CAPACITACIÓN", "AMBOS COMPONENTES"][modalBrandIdx]}
                </span>
              </div>
            </div>

            {/* Description details details */}
            <div className="md:col-span-6 p-8 flex flex-col justify-between bg-white text-slate-800">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-bold flex items-center gap-1.5 leading-none">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }} /> RED PREVENCIÓN COLOMBIA
                  </span>
                  <h2 className="text-3xl font-black font-sans text-slate-900 mt-2 mb-1">{ALLIED_BRANDS[modalBrandIdx].fullName}</h2>
                  <span className="text-[10px] font-mono font-bold tracking-wider" style={{ color: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}>
                    Atribución: {ALLIED_BRANDS[modalBrandIdx].role}
                  </span>
                </div>

                <div className="bg-slate-50 border-l-2 border-slate-200 p-4 rounded-r-xl" style={{ borderColor: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}>
                  <p className="text-xs text-slate-650 leading-relaxed italic font-sans select-text">
                    "{ALLIED_BRANDS[modalBrandIdx].desc}"
                  </p>
                </div>

                {/* Specific screenshot galleries for VIGIA */}
                {ALLIED_BRANDS[modalBrandIdx].name === "VIGIA" && (
                  <div className="space-y-3 select-none">
                    <h5 className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider">Capturas de Ecosistema Vigía:</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        onClick={() => {
                          setExpandedImage(vigiaDashboard);
                          setExpandedImageTitle("Dashboard Predictivo de Vigía SST");
                          playRetroChime("info");
                        }}
                        className="rounded-lg overflow-hidden border border-slate-200 hover:border-orange-500/40 bg-slate-50 aspect-[4/3] relative cursor-pointer group transition-all"
                      >
                        <img 
                          src={vigiaDashboard} 
                          alt="Dashboard" 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 flex items-end p-2 opacity-80 group-hover:opacity-40 transition">
                          <span className="text-[8px] font-mono text-white font-bold tracking-widest uppercase">Módulo Analítico</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => {
                          setExpandedImage(vigiaWorker);
                          setExpandedImageTitle("Biometría y Salud Ocupacional Vigía");
                          playRetroChime("info");
                        }}
                        className="rounded-lg overflow-hidden border border-slate-200 hover:border-orange-500/40 bg-slate-50 aspect-[4/3] relative cursor-pointer group transition-all"
                      >
                        <img 
                          src={vigiaWorker} 
                          alt="Worker Check" 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/60 flex items-end p-2 opacity-80 group-hover:opacity-40 transition">
                          <span className="text-[8px] font-mono text-white font-bold tracking-widest uppercase">Vigilancia Médica</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Characteristics Checklist */}
                <div className="space-y-2">
                  <h5 className="text-[9px] font-mono text-slate-400 uppercase font-bold tracking-wider">Principales Atributos:</h5>
                  <ul className="text-xs space-y-1.5 text-slate-650">
                    {(BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="text-[#ff8d2b]" style={{ color: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary }}>✔</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lower legal homologated status card */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col font-mono text-[9px] text-slate-400 leading-tight">
                  <span>ESTADO CONVENIO COLOMBIA:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> ACTIVO & HOMOLOGADO
                  </span>
                </div>

                <button
                  onClick={() => {
                    setModalToast(`Abriendo el ecosistema de ${ALLIED_BRANDS[modalBrandIdx].fullName}...`);
                    playRetroChime("nav");
                    setTimeout(() => setModalToast(""), 2200);
                  }}
                  className="px-4 py-2 border rounded-lg text-[9px] font-mono font-bold uppercase transition hover:opacity-90"
                  style={{
                    backgroundColor: `${BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary}15`,
                    borderColor: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary,
                    color: BRAND_THEMES[ALLIED_BRANDS[modalBrandIdx].name]?.primary
                  }}
                >
                  CONECTAR HOY SST →
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 4. LIGHTBOX IMAGE ZOOM GLASS VIEWPORT */}
      {expandedImage && (
        <div 
          onClick={() => {
            setExpandedImage(null);
            playRetroChime("click");
          }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl pointer-events-auto cursor-zoom-out select-none"
        >
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white font-mono text-xs pointer-events-none">
            <div className="text-left font-sans">
              <span className="text-[10px] text-[#ff8d2b] font-bold font-mono tracking-widest uppercase">{expandedImageTitle}</span>
              <p className="text-xs text-slate-400">Captura de Telemetría Excluyente</p>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
              className="pointer-events-auto p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full cursor-pointer text-slate-300 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          <motion.div
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            className="max-w-4xl max-h-[75vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 flex items-center justify-center relative select-none cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={expandedImage} 
              alt={expandedImageTitle}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <span className="absolute bottom-6 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            Haga clic en el fondo para regresar a las especificaciones
          </span>
        </div>
      )}

      <Footer
        jumpToLandingSection={jumpToLandingSection}
        playRetroChime={playRetroChime}
        whatsappUrl={WHATSAPP_URL}
      />

      {/* Floating WhatsApp Action Button for Mobile Devices */}
      <a 
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playRetroChime("click")}
        className="fixed bottom-6 right-6 z-[95] md:hidden flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] active:scale-95 transition-all duration-300 pointer-events-auto border border-white/10 group"
        title="Contactar por WhatsApp"
      >
        {/* Living pulse background ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping -z-10" style={{ animationDuration: "2.5s" }} />
        <MessageCircle className="w-6.5 h-6.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-300" />
      </a>

    </div>
      } />
    </Routes>
  );
}
