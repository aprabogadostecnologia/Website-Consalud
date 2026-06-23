import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import RoadScene from "./components/RoadScene";
import StaticSections from "./components/StaticSections";
// @ts-ignore
import consaludWhiteLogo from "./assets/images/conSaludWhite.png";
// @ts-ignore
import vigiaWhiteLogo from "./assets/images/vigiaWhite.png";
// @ts-ignore
import vigiaColorLogo from "./assets/images/vigia.png";
// @ts-ignore
import heroVigiaImg from "./assets/images/heroVigia.png";
// @ts-ignore
import vigiaDashboard from "./assets/images/vigia_dashboard_1779379879154.png";
// @ts-ignore
import vigiaWorker from "./assets/images/vigia_worker_1779379901252.png";
// @ts-ignore
import reunionImg from "./assets/images/reuinion.webp";
// @ts-ignore
import familiaImg from "./assets/images/familia.jpg";
import {
  Compass, ChevronLeft, ChevronRight, Volume2, VolumeX,
  ArrowRight, Zap, Building, ChevronDown, Brain, ShieldCheck, Activity, Sparkles, CheckCircle,
  MessageCircle, ExternalLink, AlertTriangle, TrendingUp, Heart, Users
} from "lucide-react";
import Footer from "./components/Footer";

// Predefined WhatsApp contact link using standard wa.me scheme and pre-filled message
const WHATSAPP_URL = "https://wa.me/573152003000?text=Hola!%20Quiero%20solicitar%20asesor%C3%ADa%20sobre%20los%20servicios%20de%20SG-SST%20y%20Vig%C3%ADa.";

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
      <span className="text-[8px] text-slate-300 tracking-wide font-medium leading-none mt-1">Conectamos talento, potenciamos personas</span>
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
  { index: 1, label: "nosotros", logoBadge: "🛡️", targetId: "sec-landing-1" },
  { index: 2, label: "servicios", logoBadge: "✚", targetId: "sec-landing-2" },
  { index: 3, label: "productos digitales", logoBadge: "💻", targetId: "sec-landing-3" },
  { index: 4, label: "contacto", logoBadge: "💬", targetId: "sec-landing-4" }
];

export default function App() {
  const progress = 0.04; // Fija la cámara en el fondo del Hero (frente a la montaña de inicio)
  const [activeBrandIdx, setActiveBrandIdx] = useState(0);
  const [brandCardHovered, setBrandCardHovered] = useState(false);
  const brandCardRef = useRef<HTMLDivElement>(null);
  const [brandCardRotateX, setBrandCardRotateX] = useState(0);
  const [brandCardRotateY, setBrandCardRotateY] = useState(0);

  // Hero Cycling HUD states
  const [heroMode, setHeroMode] = useState<"consalud" | "vigia" | "bateria">("consalud");
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
        const target = document.getElementById("sec-landing-1");
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
      setHeroMode(curr => {
        if (curr === "consalud") return "vigia";
        if (curr === "vigia") return "bateria";
        return "consalud";
      });
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

  return (
    <div className="relative min-h-screen w-full bg-white text-slate-800 font-sans selection:bg-[#ff8d2b]/20 selection:text-slate-900">
      
      {/* GLASSMORPHIC FIXED NAVBAR: Full-width Apple-style premium bar with elegant rounded bottom edge */}
      <div className="fixed top-0 left-0 right-0 w-full z-40 transition-all duration-300 pointer-events-auto">
        <header className={`w-full backdrop-blur-[12px] backdrop-saturate-[200%] border-b border-white/[0.125] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] relative overflow-hidden transition-all duration-300 rounded-none ${
          scrollY > 250 
            ? "bg-[#05123e]/85 border-b-white/[0.15]" 
            : "bg-[#091f4c]/24 border-b-white/[0.08]"
        }`}>
          <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16 2xl:px-24 flex items-center justify-between transition-all duration-300 h-20">
            
            {/* Logo Brand Identifier */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="relative flex items-center justify-center transition-all duration-300 group-hover:scale-105 w-[160px] h-14">
                <img 
                  src={consaludWhiteLogo} 
                  alt="Consalud Logo" 
                  className="absolute max-w-full max-h-full object-contain filter drop-shadow-sm transition-all duration-300 opacity-100 scale-100" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Navigation link triggers linked to static page anchors */}
            <nav className="hidden md:flex items-center gap-7 select-none">
              {SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.index;
                return (
                  <button
                    key={sec.index}
                    onClick={() => jumpToLandingSection(sec.targetId, sec.index)}
                    className={`relative py-1.5 px-0.5 text-[11px] font-mono tracking-widest uppercase transition-colors duration-300 cursor-pointer focus:outline-none ${
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
            <div className="flex items-center gap-3">
              
              {/* VIGIA Interactive Action Button */}
              <button
                onClick={() => {
                  playRetroChime("click");
                  // Navigate to Productos Digitales (section index 3)
                  jumpToLandingSection("sec-landing-3", 3);
                  // Automatically open VIGIA details card
                  setTimeout(() => {
                    setActiveMarca(0);
                  }, 400); // short delay so the scroll begins smoothly before opening
                }}
                className={`flex items-center justify-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md select-none transition-all duration-300 cursor-pointer active:scale-95 group shadow-sm hover:shadow-md ${
                  scrollY > 100
                    ? "bg-orange-500/10 border-orange-400/80 hover:border-orange-500 hover:bg-orange-500/15"
                    : "bg-[#05123e]/40 border-orange-500/60 hover:border-orange-500 hover:bg-[#05123e]/70"
                }`}
                title="Ir a Software VIGÍA SST"
              >
                <img 
                  src={vigiaWhiteLogo} 
                  alt="VIGIA" 
                  className="h-4.5 sm:h-5 w-auto object-contain brightness-100 drop-shadow-[0_2px_4px_rgba(255,141,43,0.25)]" 
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

              {/* Sound toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if(!soundEnabled) setTimeout(() => playRetroChime("info"), 12);
                }}
                className="p-1.8 rounded-full border transition cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-500" />}
              </button>

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

      {/* 1. HERO SECTION: Lives WebGL canyon 3D experience occupies top 100vh viewport */}
      <section className="relative h-screen min-h-[620px] w-full flex flex-col justify-between overflow-hidden shrink-0 select-none">
        
        {/* Background layer: absolute webgl component */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#010410]" style={{ opacity: window.innerHeight > 0 ? Math.max(0, 1 - scrollY / window.innerHeight) : 1 }}>
          <RoadScene progress={progress} active={webglActive} className="w-full h-full object-cover" />
        </div>

        {/* Atmospheric grid grid & glow overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" style={{ background: "radial-gradient(circle, transparent 40%, rgba(1, 4, 16, 0.8) 100%)" }} />

        {/* Floating flat-integrated HUD overlay inside Hero absolute bounds */}
        <div className={`relative z-20 w-full mx-auto px-6 md:px-14 lg:px-16 2xl:px-24 flex items-center h-full pt-28 md:pt-36 pb-20 pointer-events-none transition-all duration-300 ${
          heroMode === "bateria" ? "max-w-[1536px]" : "max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px]"
        }`}>
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Left side: Information and Selector */}
            <div className={`flex flex-col justify-center pointer-events-auto select-text text-left transition-all duration-300 ${
              heroMode === "bateria"
                ? "md:col-span-4 md:-ml-12"
                : heroMode === "vigia"
                  ? "md:col-span-5 md:-ml-8" 
                  : "md:col-span-7 md:ml-0"
            }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroMode}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6"
                >
                  {/* Eyebrow Tag */}
                  <div className="flex flex-col gap-1.5">
                    <span className={`text-[10px] sm:text-xs font-mono font-black tracking-[0.25em] uppercase block leading-relaxed ${
                      heroMode === "vigia" 
                        ? "text-[#ff8d2b] max-w-[260px] sm:max-w-xs" 
                        : heroMode === "bateria"
                          ? "text-[#ff8d2b]"
                          : "text-[#ff8d2b]"
                    }`}>
                      {heroMode === "vigia" 
                        ? "EL FUTURO DE LA PREVENCIÓN EN COLOMBIA · IA & VISIÓN COMPUTACIONAL" 
                        : heroMode === "consalud"
                          ? "ALIADO VITAL SST · BOGOTÁ · DESDE 1998"
                          : "OBLIGATORIEDAD · MULTAS Y SANCIONES · BENEFICIOS PARA LA EMPRESA"}
                    </span>
                  </div>

                  {/* Title / Logo Area */}
                  {heroMode === "vigia" ? (
                    <div className="space-y-3">
                      {/* Premium Interactive VIGIA Wordmark Logo */}
                      <div className="flex items-center select-none pointer-events-none mb-1">
                        <img 
                          src={vigiaWhiteLogo} 
                          alt="VIGIA Logo" 
                          className="h-20 sm:h-22 md:h-26 w-auto object-contain filter drop-shadow-[0_8px_30px_rgba(255,255,255,0.15)] brightness-100" 
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-white font-sans max-w-xl lg:max-w-2xl xl:max-w-3xl font-medium drop-shadow-md">
                        Vigía alerta antes del incidente, Cámaras con inteligencia artificial colombiana e ingeniería alemana todo trabajando para que ningún trabajador salga lastimado por algo que se pudo ver venir.
                      </p>

                      {/* CTA Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 pointer-events-auto">
                        <button
                          onClick={() => {
                            playRetroChime("nav");
                            jumpToLandingSection("sec-landing-4", 4);
                          }}
                          className="px-8 py-3.5 rounded-full bg-[#ff8d2b] hover:bg-[#ff8d2b]/95 text-[#010410] font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#ff8d2b]/20 hover:shadow-[#ff8d2b]/35 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center gap-2"
                        >
                          Reserva tu demo <span className="text-[10px]">➤</span>
                        </button>
                        <button
                          onClick={() => jumpToLandingSection("sec-landing-3", 3)}
                          className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        >
                          Conocer más
                        </button>
                      </div>
                    </div>
                  ) : heroMode === "consalud" ? (
                    <div className="space-y-4 pt-4">
                      {/* Grand scale typographic display for Consalud */}
                      <img 
                          src={consaludWhiteLogo} 
                          alt="Consalud Logo" 
                          className="h-30 sm:h-34 md:h-38 w-auto object-contain filter drop-shadow-[0_8px_30px_rgba(255,255,255,0.15)] brightness-100"
                          referrerPolicy="no-referrer"
                        />

                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed text-slate-200 font-sans max-w-xl lg:max-w-2xl xl:max-w-3xl font-medium drop-shadow-md">
                        Protegemos a tu equipo con soluciones a la medida sin improvisaciones, con respaldo académico y experiencia real en el mercado colombiano de salud ocupacional.
                      </p>

                      {/* CTA Action Buttons */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 pointer-events-auto">
                        <button
                          onClick={() => {
                            playRetroChime("click");
                            jumpToLandingSection("sec-landing-4", 4);
                          }}
                          className="px-8 py-3.5 rounded-full bg-[#ff8d2b] hover:bg-[#ff8d2b]/95 text-[#010410] font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-[#ff8d2b]/20 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center gap-2"
                        >
                          Diagnóstico Gratuito <span className="text-[10px]"></span>
                        </button>
                        <button
                          onClick={() => jumpToLandingSection("sec-landing-2", 2)}
                          className="px-8 py-3.5 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm tracking-wider transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        >
                          Descubrir Soluciones
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1 text-left">
                      <h1 className="text-4xl sm:text-5.5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-black tracking-tighter text-white leading-[0.95] sm:leading-[0.9] md:leading-[0.85] text-left">
                        Batería de <br />
                        <span className="text-[#ff8d2b]">Riesgo</span> <br />
                        Psicosocial
                      </h1>

                      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium italic text-slate-100 max-w-xl leading-relaxed">
                        "Evaluar hoy, prevenir siempre, cuidar a tu equipo es hacer crecer tu empresa."
                      </p>

                      <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed text-white font-sans max-w-lg lg:max-w-xl xl:max-w-2xl font-medium drop-shadow-md">
                        La Batería de Riesgo Psicosocial permite identificar, medir y prevenir factores que pueden afectar la salud mental, el bienestar y el desempeño de los trabajadores.
                      </p>

                      {/* CTA Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 pointer-events-auto">
                        <button
                          onClick={() => {
                            playRetroChime("nav");
                            jumpToLandingSection("sec-landing-4", 4);
                          }}
                          className="px-6 py-3 rounded-full bg-[#ff8d2b] hover:bg-[#ff8d2b]/90 text-[#010410] font-black text-[11px] sm:text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-[#ff8d2b]/20 hover:shadow-[#ff8d2b]/35 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center gap-2"
                        >
                          EVALUAR AHORA <span className="text-[10px]"></span>
                        </button>
                        <button
                          onClick={() => jumpToLandingSection("sec-landing-1", 1)}
                          className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold text-[11px] sm:text-xs tracking-wider transition-all duration-300 backdrop-blur-sm cursor-pointer"
                        >
                          Consultar Normatividad
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side: Interactive Integrated Graphic Element */}
            <div className={`flex flex-col justify-center transition-all duration-300 ${
              heroMode === "bateria"
                ? "md:col-span-8 min-h-[300px] md:min-h-[460px]"
                : heroMode === "vigia"
                  ? "md:col-span-7 min-h-[340px] md:min-h-[500px]"
                  : "md:col-span-5 min-h-[290px] md:min-h-[420px]"
            }`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroMode}
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -30 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="w-full"
                >
                  {heroMode === "vigia" ? (
                    // PREMIUM TALL VIGIA DASHBOARD PREVIEW IMAGE CARD - Uses object-contain so nothing is cropped
                    <div className="w-full relative pointer-events-auto rounded-3xl border border-white/15 bg-slate-950/30 backdrop-blur-md overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] group/vigiaImg">
                      {/* Subtitle subtle bar */}
                      <div className="absolute top-3 left-4 z-10 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/60 border border-white/10 font-mono text-[9px] text-[#ff8d2b] select-none pointer-events-none">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        VIGÍA SISTEMA ACTIVO · VISTA PRINCIPAL
                      </div>
 
                      {/* Tall portraited dashboard image - fitted without any cropping */}
                      <img 
                        src={heroVigiaImg} 
                        alt="Vigía Panel Principal" 
                        className="w-full h-auto min-h-[340px] md:min-h-[480px] lg:h-[580px] object-contain transition-transform duration-700 ease-out scale-100 group-hover/vigiaImg:scale-102"
                        referrerPolicy="no-referrer"
                      />
 
                      {/* Subtle ambient lens flare border highlight */}
                      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
                    </div>
                  ) : heroMode === "consalud" ? (
                    // CONSALUD BRAND PANEL: wordmark + tagline + overlapping family/team photo collage
                    <div className="w-full flex items-center justify-center py-6 select-none pointer-events-auto">
                      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-br from-[#05123e] via-[#0a1f5f] to-[#05123e] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 sm:p-10">

                        {/* Dotted accent top-left */}
                        <div className="absolute top-6 left-6 grid grid-cols-6 gap-1.5 opacity-70 pointer-events-none">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <span key={i} className="w-1 h-1 rounded-full bg-[#ff8d2b]" />
                          ))}
                        </div>

                        {/* Decorative curved line accents */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400" fill="none">
                          <path d="M260,0 C340,60 380,160 320,260" stroke="#ff8d2b" strokeWidth="1.5" opacity="0.5" />
                          <path d="M300,-20 C400,80 420,220 340,320" stroke="white" strokeWidth="1" opacity="0.15" />
                        </svg>

                        <div className="relative z-10 flex flex-col gap-6">
                          <img
                            src={consaludWhiteLogo}
                            alt="Consalud Logo"
                            className="h-10 sm:h-12 w-auto object-contain"
                            referrerPolicy="no-referrer"
                          />

                          <p className="text-xl sm:text-2xl font-bold text-white leading-snug">
                            Bienestar que construye <span className="text-[#ff8d2b]">futuro</span>
                          </p>

                          {/* Overlapping photo collage: team/work + family */}
                          <div className="relative h-56 sm:h-64 w-full mt-2">
                            <div className="absolute top-0 right-0 w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-xl">
                              <img src={reunionImg} alt="Equipo Consalud trabajando seguro" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 left-0 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10">
                              <img src={familiaImg} alt="Familias protegidas por Consalud" className="w-full h-full object-cover" />
                            </div>
                          </div>

                          {/* Icon row */}
                          <div className="flex items-center gap-5 justify-end pt-2">
                            <Heart className="w-6 h-6 text-white/80" />
                            <Users className="w-6 h-6 text-white/80" />
                            <ShieldCheck className="w-6 h-6 text-white/80" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 md:gap-8 w-full select-text pointer-events-auto">

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 w-full">
                        
                        {/* Card 1: Obligatoriedad */}
                        <div className="rounded-2xl border border-[#22c55e]/25 bg-white/5 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-start gap-4 shadow-[0_12px_40px_rgba(34,197,94,0.12)] hover:shadow-[0_15px_45px_rgba(34,197,94,0.22)] hover:border-[#22c55e]/50 transition-all duration-300 relative overflow-hidden group min-h-[260px] md:min-h-[290px] text-center">
                          {/* Accent top line indicator */}
                          <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#22c55e]" />
                          
                          {/* Centered Tag & Icon above Title */}
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-[9px] sm:text-[11px] font-mono font-bold text-[#22c55e]/80 uppercase tracking-widest leading-none">LEY CO</span>
                            <div className="p-2.5 sm:p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] max-w-fit">
                              <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 " />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-black text-[#22c55e] tracking-tight">Obligatoriedad</h3>
                            <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed font-sans font-medium">
                              Exigida por ley colombiana. Aplica a todas las empresas públicas y privadas. Evaluación cada 2 años.
                            </p>
                          </div>
                          
                          {/* Soft subtle glow spot in background */}
                          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#22c55e]/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                        {/* Card 2: Multas y Sanciones */}
                        <div className="rounded-2xl border border-[#ff8d2b]/25 bg-white/5 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-start gap-4 shadow-[0_12px_40px_rgba(255,141,43,0.12)] hover:shadow-[0_15px_45px_rgba(255,141,43,0.22)] hover:border-[#ff8d2b]/50 transition-all duration-300 relative overflow-hidden group min-h-[260px] md:min-h-[290px] text-center">
                          {/* Accent top line indicator */}
                          <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#ff8d2b]" />
                          
                          {/* Centered Tag & Icon above Title */}
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-[9px] sm:text-[11px] font-mono font-bold text-[#ff8d2b]/80 uppercase tracking-widest leading-none">SST RIESGOS</span>
                            <div className="p-2.5 sm:p-3 rounded-xl bg-[#ff8d2b]/10 border border-[#ff8d2b]/20 text-[#ff8d2b] max-w-fit">
                              <AlertTriangle className="w-7 h-7 sm:w-9 sm:h-9" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-black text-[#ff8d2b] tracking-tight">Multas y Sanciones</h3>
                            <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed font-sans font-medium">
                              Sanciones de 1 a 5.000 SMMLV. Medidas correctivas e investigaciones laborales por incumplimiento.
                            </p>
                          </div>
                          
                          {/* Soft subtle glow spot in background */}
                          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#ff8d2b]/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                        {/* Card 3: Beneficios para la Empresa */}
                        <div className="rounded-2xl border border-[#3b82f6]/25 bg-white/5 backdrop-blur-md p-5 sm:p-6 flex flex-col justify-start gap-4 shadow-[0_12px_40px_rgba(59,130,246,0.12)] hover:shadow-[0_15px_45px_rgba(59,130,246,0.22)] hover:border-[#3b82f6]/50 transition-all duration-300 relative overflow-hidden group min-h-[260px] md:min-h-[290px] text-center">
                          {/* Accent top line indicator */}
                          <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#3b82f6]" />
                          
                          {/* Centered Tag & Icon above Title */}
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="text-[9px] sm:text-[11px] font-mono font-bold text-[#3b82f6]/80 uppercase tracking-widest leading-none">PRODUCTIVIDAD</span>
                            <div className="p-2.5 sm:p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] max-w-fit">
                              <TrendingUp className="w-7 h-7 sm:w-9 sm:h-9" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-black text-[#3b82f6] tracking-tight">Beneficios</h3>
                            <p className="text-xs sm:text-[13px] text-white/95 leading-relaxed font-sans font-medium">
                              Equipos más saludables, mayor productividad y reducción de costos por ausentismo y rotación.
                            </p>
                          </div>
                          
                          {/* Soft subtle glow spot in background */}
                          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#3b82f6]/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Carousel & Scroll Indicator controls (FIDELITY ALIGNED EXACTLY WITH CAPTURE) */}
        <div className="relative z-20 pb-12 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 md:px-14 lg:px-16 2xl:px-24 flex flex-col items-center pointer-events-auto select-none">
          
          {/* Custom Carousel Arrows & Progress Lines widget */}
          <div className="flex items-center justify-center gap-6 mb-7 bg-slate-950/40 backdrop-blur-sm border border-white/5 py-2.5 px-6 rounded-full shadow-lg">
            
            {/* Back action */}
            <button
              onClick={() => {
                playRetroChime("click");
                setHeroMode(curr => {
                  if (curr === "consalud") return "bateria";
                  if (curr === "vigia") return "consalud";
                  return "vigia";
                });
                setIsHeroCycling(false);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className="text-xs">❮</span>
            </button>

            {/* Carousel Active dots/bars indicators */}
            <div className="flex items-center gap-2.5">
              {/* Consalud */}
              <button 
                onClick={() => { setHeroMode("consalud"); setIsHeroCycling(false); playRetroChime("click"); }}
                className={`transition-all duration-300 cursor-pointer ${
                  heroMode === "consalud" 
                    ? "w-7 h-1.5 rounded-full bg-[#ff8d2b]" 
                    : "w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/50"
                }`}
              />
              {/* Vigia */}
              <button 
                onClick={() => { setHeroMode("vigia"); setIsHeroCycling(false); playRetroChime("click"); }}
                className={`transition-all duration-300 cursor-pointer ${
                  heroMode === "vigia" 
                    ? "w-7 h-1.5 rounded-full bg-[#ff8d2b]" 
                    : "w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/50"
                }`}
              />
              {/* Bateria */}
              <button 
                onClick={() => { setHeroMode("bateria"); setIsHeroCycling(false); playRetroChime("click"); }}
                className={`transition-all duration-300 cursor-pointer ${
                  heroMode === "bateria" 
                    ? "w-7 h-1.5 rounded-full bg-[#ff8d2b]" 
                    : "w-2.5 h-2.5 rounded-full bg-white/30 hover:bg-white/50"
                }`}
              />
            </div>

            {/* Next action */}
            <button
              onClick={() => {
                playRetroChime("click");
                setHeroMode(curr => {
                  if (curr === "consalud") return "vigia";
                  if (curr === "vigia") return "bateria";
                  return "consalud";
                });
                setIsHeroCycling(false);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className="text-xs">❯</span>
            </button>
          </div>

          {/* Autoplay progress bar if cycling is alive */}
          {isHeroCycling ? (
            <div className="w-24 h-0.5 bg-white/5 overflow-hidden rounded-full mb-6">
              <div 
                className="h-full transition-all duration-75"
                style={{ 
                  width: `${heroCycleProgress}%`, 
                  backgroundColor: heroMode === "consalud" 
                    ? "#00d8f6" 
                    : heroMode === "vigia" 
                      ? "#ff8d2b" 
                      : "#d946ef" 
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => {
                playRetroChime("info");
                setIsHeroCycling(true);
                setHeroCycleProgress(0);
              }}
              className="text-[15px] font-mono font-black text-[#ff8d2b] tracking-wider mb-6 hover:underline uppercase"
            >
              ► Activar Autoplay
            </button>
          )}

          {/* Animated Scroll down helper exactly matched from reference */}
          <div 
            onClick={() => jumpToLandingSection("sec-landing-1", 1)}
            className="flex flex-col items-center pointer-events-auto cursor-pointer group text-center"
          >
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em] leading-none mb-2.5 group-hover:text-white transition-colors duration-300">SCROLL</p>
            
            {/* Elegant computer mouse animated skeleton */}
            <div className="w-5 h-9 rounded-full border-2 border-slate-400 group-hover:border-white transition-colors flex justify-center pt-1.5 relative">
              <motion.div 
                animate={{
                  y: [0, 8, 0],
                  opacity: [1, 0, 1]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-1 h-2 rounded-full bg-[#ff8d2b]"
              />
            </div>
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
                  <h2 className="text-2xl font-bold font-sans text-slate-900 mt-2 mb-1">{ALLIED_BRANDS[modalBrandIdx].fullName}</h2>
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
  );
}
