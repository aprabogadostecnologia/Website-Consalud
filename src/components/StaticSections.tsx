import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Award, FileText, Send, CheckCircle, 
  AlertCircle, ChevronDown, Activity, Heart, ArrowRight,
  HelpCircle, Sparkles, Building, Compass, Landmark, Briefcase, Info,
  Eye, Zap, Shield, Users, AlertTriangle, Leaf, GraduationCap, Scale, ClipboardCheck, X,
  BookOpen, CheckSquare
} from "lucide-react";
import { BRAND_THEMES } from "../App";
// @ts-ignore
// @ts-ignore
import vigiaColorLogo from "../assets/images/vigia.png";
// @ts-ignore
// @ts-ignore
import projectVideo from "../assets/images/Video Project.mp4";
// @ts-ignore
import seguridadSaludBg from "../assets/images/seguridad&salud.webp";
// @ts-ignore
import outsourcingBg from "../assets/images/servicio outsourcing.jpg";
// @ts-ignore
import gestionRiesgoBg from "../assets/images/Gestion de riesgo.png";
// @ts-ignore
import gestionAmbientalBg from "../assets/images/gestion ambiental.jpg";
// @ts-ignore
import capacitacionesBg from "../assets/images/capacitaciones.webp";
// @ts-ignore
import asesoriaLegalBg from "../assets/images/asesoriaLegal.jpg";
// @ts-ignore
import auditoriaBg from "../assets/images/auditoria.png";
// @ts-ignore
import bateriaBg from "../assets/images/bateriaSinFondo.png";
// @ts-ignore
import logoConsalud from "../assets/images/logoConsalud.png";
// @ts-ignore
import consaludLogo from "../assets/images/Consalud.png";
// @ts-ignore
import kevinChaleco from "../assets/images/kevinChaleco.png";
// @ts-ignore
import escritorioDavid from "../assets/images/EscritorioDavid.png";
// @ts-ignore
import vigiaCapture1 from "../assets/images/Captura de pantalla 2026-06-22 111515.png";
// @ts-ignore
import vigiaCapture2 from "../assets/images/Captura de pantalla 2026-06-22 111526.png";
// @ts-ignore
import capturaSST from "../assets/images/Captura de pantalla 2026-05-19 155132.png";
import QuantumCoreBackground from "./QuantumCoreBackground";
import WavesBackground from "./WavesBackground";

interface StaticSectionsProps {
  alliedBrands: any[];
  activeBrandIdx: number;
  setActiveBrandIdx: (idx: number) => void;
  brandCardHovered: boolean;
  setBrandCardHovered: (val: boolean) => void;
  brandCardRef: React.RefObject<HTMLDivElement | null>;
  brandCardRotateX: number;
  brandCardRotateY: number;
  handleBrandCardMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleBrandCardMouseLeave: () => void;
  renderBrandLogo: (name: string) => React.ReactNode;
  setIsBrandModalOpen: (val: boolean) => void;
  setModalBrandIdx: (idx: number) => void;
  playRetroChime: (type: "nav" | "click" | "info" | "transition") => void;
  activeMarca: number | null;
  setActiveMarca: (val: number | null) => void;
  pendingContactService: string | null;
  onContactServiceHandled: () => void;
  pendingServiceModal: string | null;
  onPendingServiceModalHandled: () => void;
}

export interface ServiceItem {
  id: number;
  title: string;
  shortDesc: string;
  longDesc: string;
  colorType: "darkBlue" | "orange" | "cream" | "gradient";
  badge: string;
  benefits: string[];
  actionLabel: string;
  bgImage?: string;
  bgImageFit?: "cover" | "contain";
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 1,
    title: "Seguridad y Salud en el Trabajo",
    shortDesc: "Sistemas de gestión integral para salvaguardar la integridad de su capital humano y cumplir las normas de ley.",
    longDesc: "Acompañamos a su organización en el diseño, implementación y administración completa del Sistema de Gestión de la Seguridad y Salud en el Trabajo (SG-SST), garantizando el cumplimiento riguroso de la Resolución 0312 y el Decreto 1072. Nos enfocamos en la reducción drástica del ausentismo laboral a través de la identificación de peligros, la evaluación proactiva de riesgos y la creación de un ambiente de trabajo seguro, saludable y altamente productivo.",
    colorType: "darkBlue",
    badge: "SG-SST & PREVENCIÓN",
    benefits: [
      "Diseño de profesiograma y matriz de riesgos completa",
      "Planes detallados de prevención de accidentes de trabajo",
      "Alineación estricta y blindada con la Resolución 0312",
      "Estructuración de copasst y comités de convivencia"
    ],
    actionLabel: "Cotizar SG-SST",
    bgImage: seguridadSaludBg,
  },
  {
    id: 2,
    title: "Servicio Outsourcing",
    shortDesc: "Tercerización idónea de profesionales altamente calificados para gestionar sus áreas de SST y bienestar corporativo.",
    longDesc: "Suministramos profesionales y tecnólogos competentes en administración de salud y gestión SST directo en su empresa. Reduzca costos fijos de reclutamiento, administración de personal y capacitación permanente con nuestro talento experto (médicos ocupacionales, ingenieros, prevencionistas y psicólogos organizacionales) quienes operan con el respaldo científico, metodológico y tecnológico de Consalud.",
    colorType: "orange",
    badge: "TALENTO ESPECIALIZADO",
    benefits: [
      "Soporte de médicos ocupacionales in-house o remotos",
      "Ingenieros de prevención y prevencionistas permanentes",
      "Reducción directa de costos operativos de contratación",
      "Garantía de continuidad en la cobertura del servicio"
    ],
    actionLabel: "Solicitar Outsourcing",
    bgImage: outsourcingBg,
  },
  {
    id: 3,
    title: "Gestión de Riesgo",
    shortDesc: "Identificación proactiva, análisis predictivo y mitigación de factores de riesgo crítico antes del siniestro.",
    longDesc: "Diseñamos estrategias preventivas avanzadas enfocadas en la resiliencia operativa de su organización. Empleamos el Ecosistema Vigía para recopilar datos epidemiológicos continuos, evaluar amenazas biomecánicas, psicosociales o físicas, y formular matrices dinámicas que permiten tomar decisiones seguras en tiempo real y evitar reclamaciones o demandas laborales de alto impacto financiero.",
    colorType: "gradient",
    badge: "MONITOREO BIOMÉTRICO",
    benefits: [
      "Alertas tempranas de fatiga extrema y riesgo coronario",
      "Matrices de riesgo dinámicas actualizables con Big Data",
      "Medidas correctoras sobre higiene postural y ergonómica",
      "Prevención activa del burnout y estrés laboral severo"
    ],
    actionLabel: "Analizar Mis Riesgos",
    bgImage: gestionRiesgoBg,
  },
  {
    id: 4,
    title: "Gestión Ambiental",
    shortDesc: "Construcción de prácticas corporativas sostenibles con estricto apego regulatorio y ecológico.",
    longDesc: "Llevamos a su organización hacia un modelo de desarrollo sostenible y carbono-neutro. Estructuramos e implementamos Programas de Gestión Integral de Residuos (PGIR), diseñamos planes de ahorro de recursos críticos (agua y energía) y realizamos auditorías ambientales exhaustivas para garantizar el cumplimiento riguroso de la normativa del Ministerio de Ambiente, protegiendo tanto su entorno como su reputación de marca.",
    colorType: "cream",
    badge: "SOSTENIBILIDAD VERDE",
    benefits: [
      "Alineación legal de licencias y permisos ante entes ambientales",
      "Diseño y puesta en marcha del Plan de Gestión de Residuos (PGIR)",
      "Optimización eco-eficiente de energía, agua y materias primas",
      "Reducción de huella de carbono sustentada con reportes"
    ],
    actionLabel: "Estructurar PGIR",
    bgImage: gestionAmbientalBg,
  },
  {
    id: 5,
    title: "Capacitaciones",
    shortDesc: "Programas de alto impacto pedagógico y certificación de brigadas, comités y cultura de autocuidado.",
    longDesc: "Modelos pedagógicos dinámicos ajustados a la realidad operativa de su empresa. Formamos de manera certificada y oficial a sus Brigadas de Emergencia, COPASST, Comité de Convivencia y personal expuesto a riesgos críticos de trabajo. Fomentamos el autocuidado sólido y preventivo con metodologías de andragogía práctica que aumentan la retención de conocimientos.",
    colorType: "orange",
    badge: "EDUCACIÓN CERTIFICADA",
    benefits: [
      "Certificación formal válida ante inspectores del Ministerio",
      "Metodología andragógica práctica altamente interactiva",
      "Estructuración de Brigadas entrenadas para emergencias reales",
      "Firme sensibilización en salud física, mental y ergonomía"
    ],
    actionLabel: "Ver Catálogo de Cursos",
    bgImage: capacitacionesBg,
  },
  {
    id: 6,
    title: "Asesoría Legal",
    shortDesc: "Blindaje de excelencia jurídica corporativa ante requerimientos ministeriales o reparaciones en salud.",
    longDesc: "Protección jurídica altamente especializada para evitar sanciones directas, multas del Ministerio del Trabajo o costosas indemnizaciones por accidentes laborales. Nuestros abogados expertos estructuran defensas sólidas, redactan descargos ajustados al rigor legal colombiano y guían éticamente a las organizaciones y trabajadores ante la Superintendencia de Salud.",
    colorType: "darkBlue",
    badge: "DEFENSA JURÍDICA",
    benefits: [
      "Representación calificada ante entes de control laboral",
      "Soporte preventivo sólido frente a multas o pliegos de cargo",
      "Estructuración rigurosa de actas, descargos e impugnaciones",
      "Asesoramiento integral en fueros de salud y estabilidad"
    ],
    actionLabel: "Agendar Consulta Jurídica",
    bgImage: asesoriaLegalBg,
  },
  {
    id: 7,
    title: "Auditorías",
    shortDesc: "Exámenes críticos, objetivos e independientes para garantizar la madurez y efectividad de sus sistemas.",
    longDesc: "Evaluaciones sistemáticas e imparciales realizadas por auditores líderes con gran trayectoria en el sector corporativo. Analizamos la consistencia, efectividad y madurez formal del sistema SG-SST, preparando de manera segura a su organización para inspecciones gubernamentales y asegurando una mejora continua robusta que sirva como escudo ante eventuales sanciones.",
    colorType: "cream",
    badge: "MEJORA OPERACIONAL",
    benefits: [
      "Simulación previa de auditorías ministeriales (blindaje)",
      "Reportes de hallazgos interactivos y fáciles de procesar",
      "Diseño de planes de acción correctiva orientados al negocio",
      "Validación objetiva e independiente de efectividad SST"
    ],
    actionLabel: "Programar Auditoría HG",
    bgImage: auditoriaBg,
  },
  {
    id: 8,
    title: "Batería de Riesgo Psicosocial",
    shortDesc: "Evaluación oficial y validada de factores psicosociales intralaborales, extralaborales y de estrés laboral.",
    longDesc: "Aplicamos la Batería de Instrumentos para la Evaluación de Factores de Riesgo Psicosocial del Ministerio de Trabajo de Colombia, herramienta de obligatorio cumplimiento bajo la Resolución 2646 de 2008. Evaluamos condiciones intralaborales (demandas del trabajo, control, liderazgo y relaciones), extralaborales (familia, tiempo fuera, situación económica) y niveles de estrés, entregando diagnósticos detallados y planes de intervención personalizados que protegen la salud mental de su talento y blindan legalmente a su organización.",
    colorType: "gradient",
    badge: "RESOLUCIÓN 2646",
    benefits: [
      "Aplicación digital certificada de la batería oficial del Ministerio",
      "Diagnóstico de factores intralaborales y extralaborales",
      "Informe ejecutivo con niveles de estrés y planes de intervención",
      "Cumplimiento normativo ante la Resolución 2646 de 2008"
    ],
    actionLabel: "Evaluar Riesgo Psicosocial",
    bgImage: bateriaBg,
    bgImageFit: "contain",
  }
];

export const renderServiceIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Shield className="w-8 h-8" />;
    case 2:
      return <Users className="w-8 h-8" />;
    case 3:
      return <AlertTriangle className="w-8 h-8" />;
    case 4:
      return <Leaf className="w-8 h-8" />;
    case 5:
      return <GraduationCap className="w-8 h-8" />;
    case 6:
      return <Scale className="w-8 h-8" />;
    case 7:
      return <ClipboardCheck className="w-8 h-8" />;
    case 8:
      return <BookOpen className="w-8 h-8" />;
    default:
      return <Activity className="w-8 h-8" />;
  }
};

export const getServiceColors = (type: "darkBlue" | "orange" | "cream" | "gradient", isHovered: boolean) => {
  switch (type) {
    case "darkBlue":
      return {
        bg: "bg-[#05123e]",
        border: isHovered ? "border-[#ff8d2b]" : "border-[#05123e]/20",
        text: "text-white",
        desc: "text-slate-300",
        badge: "bg-[#ff8d2b]/20 text-[#ff8d2b] border-[#ff8d2b]/30",
        iconWrapper: "bg-white/10 text-white border-white/10",
        btn: "bg-white text-[#05123e] hover:bg-[#ff8d2b] hover:text-white",
        glow: "shadow-[0_4px_20px_rgba(5,18,62,0.15)] hover:shadow-[0_20px_45px_rgba(5,18,62,0.4)]"
      };
    case "orange":
      return {
        bg: "bg-[#ff8d2b]",
        border: isHovered ? "border-white" : "border-[#ff8d2b]/20",
        text: "text-white",
        desc: "text-orange-50",
        badge: "bg-[#05123e]/20 text-white border-[#05123e]/30",
        iconWrapper: "bg-white/20 text-white border-white/25",
        btn: "bg-[#05123e] text-white hover:bg-white hover:text-[#05123e]",
        glow: "shadow-[0_4px_20px_rgba(255,141,43,0.15)] hover:shadow-[0_20px_45px_rgba(255,141,43,0.4)]"
      };
    case "cream":
      return {
        bg: "bg-[#f5f3e6]",
        border: isHovered ? "border-[#ff8d2b]" : "border-[#e2dfc9]",
        text: "text-[#05123e]",
        desc: "text-slate-700",
        badge: "bg-[#05123e]/10 text-[#05123e] border-[#05123e]/20",
        iconWrapper: "bg-[#05123e]/10 text-[#05123e] border-[#05123e]/15",
        btn: "bg-[#05123e] text-white hover:bg-[#ff8d2b]",
        glow: "shadow-[0_4px_20px_rgba(245,243,230,0.3)] hover:shadow-[0_20px_45px_rgba(245,243,230,0.6)]"
      };
    case "gradient":
    default:
      return {
        bg: "bg-gradient-to-br from-[#05123e] to-[#ff8d2b]",
        border: isHovered ? "border-white" : "border-slate-800",
        text: "text-white",
        desc: "text-orange-50",
        badge: "bg-white/20 text-white border-white/30",
        iconWrapper: "bg-white/10 text-white border-white/20",
        btn: "bg-white text-[#05123e] hover:bg-[#ff8d2b] hover:text-white",
        glow: "shadow-[0_4px_20px_rgba(255,141,43,0.15)] hover:shadow-[0_20px_45px_rgba(255,141,43,0.35)]"
      };
  }
};

const STATIC_SECTIONS_DATA = [
  {
    index: 2,
    numStr: "03",
    badge: "✚",
    subtitle: "CULTURA PREVENTIVA Y DEBERES",
    title: "Asesoría inteligente de salud ocupacional para empresas",
    desc: "Alinear los deberes de cuidado individual del trabajador con los estándares corporativos permite prevenir un 40% de la siniestralidad. Consalud y el Ecosistema Vigía crean ambientes de trabajo predictivos, seguros y libres de acoso laboral.",
    items: [
      {
        title: "Identificación de Sintomatología Precoz",
        text: "Los sensores inteligentes del Ecosistema Vigía recopilan datos epidemiológicos and detectan de manera proactiva brotes, fatigas extremas o riesgos coronarios."
      },
      {
        title: "SST de Estricto Cumplimiento",
        text: "Asesorías para el diseño automatizado del profesiograma legal, asegurando apego a la Resolución 0312 del Ministerio del Trabajo."
      },
      {
        title: "Empoderamiento del Paciente",
        text: "Educación activa sobre higiene postural, prevención del estrés burnout, y fomento de rutinas saludables en plantas operativas de alto riesgo."
      }
    ]
  }
];

const FAQS_DATA = [
  {
    id: "faq-1",
    q: " ¿Quién es Consalud?",
    a: "Consalud hace parte de un grupo estratégico con más de 30 años de experiencia, respaldado por expertos en Derecho Laboral, Seguridad Social y Derecho Empresarial, además de una unidad especializada en intermediación de seguros y optimización de portafolios."
  },
  {
    id: "faq-2",
    q: "¿Qué servicios ofrece Consalud?",
    a: "Consalud trabaja sobre cinco líneas de acción: prevención de riesgos, formación en talento humano, aseguramiento del cumplimiento legal en SST, acompañamiento cercano y continuo, y cultura del cuidado organizacional."
  },
  {
    id: "faq-3",
    q: " ¿Qué diferencia a Consalud de otras firmas de consultoría en SST?",
    a: "Su modelo de Soporte Académico y Profesional, el respaldo de un grupo empresarial con amplia trayectoria, soluciones a la medida (sin plantillas genéricas) y un enfoque centrado en la persona como eje de la intervención.",
  },
  {
    id: "faq-4",
    q: "¿Consalud trabaja temas de riesgo psicosocial?",
    a: "Sí, dentro de la línea de cultura del cuidado se incluye intervención en riesgo psicosocial, evaluación de clima de seguridad y programas de bienestar integrados."
  }
];
export interface MarcaFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

export interface Marca {
  name: string;
  fullName: string;
  logo: string;
  accent: string;
  badge: string;
  tagline: string;
  phrase: string;
  role: string;
  description: string;
  features: MarcaFeature[];
  extras: string[];
  videoSrc?: string;
}

export const MARCAS: Marca[] = [
  {
    name: "VIGIA",
    fullName: "Vigía Salud Inteligente",
    logo: "/vigiaWhite.png",
    accent: "#ff8d2b",
    badge: "EL FUTURO DE LA PREVENCIÓN EN COLOMBIA",
    tagline: "Seguridad Predictiva en Tiempo Real",
    phrase: "Sistema de prevencion IA en Tiempo real para SST.",
    role: "PRIMER SISTEMA DE RASTREO VISUAL INTELIGENTE DE COLOMBIA",
    description: "Desarrollada en Colombia con Ingeniería Alemana, Vigía detecta riesgos en milisegundos, notifica al supervisor SST por email o WhatsApp y genera reportes de cumplimiento normativo HSE al instante.",
    features: [
      { icon: <Shield size={16} />, title: "Detección de EPP", desc: "Reconoce casco, chaleco y guantes en milisegundos con 95%+ de confianza. Alerta inmediata por no uso." },
      { icon: <AlertTriangle size={16} />, title: "Control de Celulares", desc: "Rastreo Inteligente de Mirada: detecta manipulación de celular con 93%+ confianza y alerta al instante." },
      { icon: <Zap size={16} />, title: "Alertas en Tiempo Real", desc: "Notificación por email o WhatsApp al supervisor SST con evidencia visual y exportación PDF." },
      { icon: <BookOpen size={16} />, title: "Reportes Automáticos", desc: "Generación automática de reportes de cumplimiento normativo HSE para auditorías y seguimiento." },
    ],
    extras: [
      "Siniestralidad reducción drástica de incidentes y accidentes",
      "Planes de Mejora, datos exactos para cumplimiento normativo HSE",
      "Capital Humano, protección operativa y optimización de costos",
      "Flujo: Cámaras optimizadas → AI Vigía → Alerta Real + soporte documental",
      "Despliegue en días, no meses · Reportes generados al instante",
    ],
    videoSrc: projectVideo,
  },
];

const DcjLogoSvg = () => (
  <div className="flex flex-col items-center justify-center gap-3.5 select-none pointer-events-none p-6 bg-slate-950/50 border border-white/10 backdrop-blur-md rounded-3xl w-full max-w-[280px] sm:max-w-[325px] shadow-[0_15px_45px_rgba(255,141,43,0.18)]">
    <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 filter drop-shadow-[0_4px_12px_rgba(255,141,43,0.32)]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Orange leaf/holding hands circular path around */}
      <path d="M 50 15 A 35 35 0 0 0 15 50 A 35 35 0 0 0 50 85 A 35 35 0 0 0 85 50" stroke="#ff8d2b" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M 15 50 C 15 75, 40 85, 50 85 C 60 85, 85 75, 85 50" fill="url(#leafGradientModal)" opacity="0.2" />
      <defs>
        <linearGradient id="leafGradientModal" x1="0%" y1="0%" x2="100%" y2="100%">
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
    
    <div className="flex flex-col justify-center text-center">
      <div className="flex items-baseline gap-1.5 justify-center leading-none mb-1">
        <span className="text-3xl font-black text-white tracking-tight leading-none font-sans">DCJ</span>
        <span className="text-[10px] font-black text-[#ff8d2b] tracking-wider leading-none">TALENTO HUMANO 3.0</span>
      </div>
      <span className="text-[9px] text-slate-300 tracking-wide font-semibold leading-relaxed mt-1">Conectamos talento, potenciamos personas</span>
    </div>
  </div>
);

export default function StaticSections({
  alliedBrands,
  activeBrandIdx,
  setActiveBrandIdx,
  brandCardHovered,
  setBrandCardHovered,
  brandCardRef,
  brandCardRotateX,
  brandCardRotateY,
  handleBrandCardMouseMove,
  handleBrandCardMouseLeave,
  renderBrandLogo,
  setIsBrandModalOpen,
  setModalBrandIdx,
  playRetroChime,
  activeMarca,
  setActiveMarca,
  pendingContactService,
  onContactServiceHandled,
  pendingServiceModal,
  onPendingServiceModalHandled
}: StaticSectionsProps) {
  
  // Accordion drawer faq state
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // "Nosotros" values flip cards — tap-to-flip on mobile (no hover there)
  const [flippedValueCards, setFlippedValueCards] = useState<boolean[]>([false, false, false, false]);
  const toggleValueCardFlip = (idx: number) => {
    setFlippedValueCards((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  // Redesigned services interactive states
  const [hoveredServiceId, setHoveredServiceId] = useState<number | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  const [showContactForm, setShowContactForm] = useState(true);

  const welcomeCardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isWelcomeCardHovered, setIsWelcomeCardHovered] = useState(false);

  // Digital Brand overlay and preview zoom states
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [expandedImageTitle, setExpandedImageTitle] = useState<string>("");

  useEffect(() => {
    if (activeServiceModal !== null || activeMarca !== null || expandedImage !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeServiceModal, activeMarca, expandedImage]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsWelcomeCardHovered(true);
    if (!welcomeCardRef.current) return;
    const rect = welcomeCardRef.current.getBoundingClientRect();
    setTilt({
      y:  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 10,
      x: -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setIsWelcomeCardHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleServiceCta = (serviceTitle: string) => {
    playRetroChime("transition");
    setActiveServiceModal(null);
    setShowContactForm(true);
    
    // Pre-fill form selection
    setFormData(prev => ({
      ...prev,
      serviceOfInterest: serviceTitle
    }));

    // Scroll to contact form
    const contactSection = document.getElementById("sec-landing-4");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        const nameInput = document.getElementsByName("name")[0] as HTMLInputElement;
        if (nameInput) nameInput.focus();
      }, 800);
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    serviceOfInterest: "Seguridad y Salud en el Trabajo"
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchStepText, setDispatchStepText] = useState("");
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingContactService) return;
    handleServiceCta(pendingContactService);
    onContactServiceHandled();
  }, [pendingContactService]);

  useEffect(() => {
    if (!pendingServiceModal) return;
    const service = SERVICES_DATA.find(s => s.title === pendingServiceModal);
    if (service) setActiveServiceModal(service);
    onPendingServiceModalHandled();
  }, [pendingServiceModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const cleaned = name === "phone" ? value.replace(/\D/g, "").slice(0, 12) : value;
    setFormData(prev => ({ ...prev, [name]: cleaned }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (formData.name.trim().length < 10) errors.name = "El nombre debe tener al menos 10 caracteres.";
    if (formData.company.trim().length < 10) errors.company = "La empresa debe tener al menos 10 caracteres.";
    if (!/^\d{7,12}$/.test(formData.phone)) errors.phone = "Ingresa solo dígitos, entre 7 y 12 números.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Ingresa un correo electrónico válido.";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    playRetroChime("info");
    setIsDispatching(true);
    setDispatchProgress(0);
    setDispatchStepText("Conectando con servidores de Consalud...");

    const stages = [
      { pct: 20, text: "Conectando con servidores de Consalud..." },
      { pct: 45, text: "Verificando disponibilidad de asesores..." },
      { pct: 70, text: "Registrando solicitud para asesores especializados..." },
      { pct: 90, text: "Generando matrícula oficial de radicado único..." },
      { pct: 100, text: "¡Solicitud registrada con éxito!" }
    ];

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `CONSALUD-SST-${randomNum}`;

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        service: formData.serviceOfInterest,
        ticket_id: ticketId,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).catch(() => {});

    let currentStage = 0;
    const interval = setInterval(() => {
      setDispatchProgress(prev => {
        const target = stages[currentStage].pct;
        if (prev < target) {
          return prev + 1;
        } else {
          if (currentStage < stages.length - 1) {
            currentStage++;
            setDispatchStepText(stages[currentStage].text);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              playRetroChime("transition");
              setSuccessTicket(ticketId);
              setIsDispatching(false);
            }, 500);
          }
        }
        return prev;
      });
    }, 25);
  };

  const resetForm = () => {
    playRetroChime("click");
    setFormData({
      name: "",
      company: "",
      phone: "",
      email: "",
      serviceOfInterest: "Seguridad y Salud en el Trabajo"
    });
    setSuccessTicket(null);
    setShowContactForm(false);
  };

  return (
    <div className="w-full relative z-30 bg-white border-t border-slate-200 shadow-2xl pt-6 flex flex-col items-center overflow-x-hidden">
      
      {/* Global single WavesBackground spanning all sections fluidly */}
      <WavesBackground />

      {/* 2. SECCIONES DE CONTENIDO ESTÁTICO (Hospital / SST / Legal) */}
      {STATIC_SECTIONS_DATA.map((section) => {
        const isSst = section.index === 2;
        const isLegal = section.index === 3;
        
        if (isSst) {
          return (
            <motion.section 
              key={section.index} 
              id={`sec-landing-${section.index}`} 
              className="w-full bg-transparent text-slate-950 py-10 scroll-mt-20 overflow-hidden relative flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >

              {/* Outer content container */}
              <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-6 md:px-14 lg:px-16 2xl:px-24 relative z-10 flex flex-col items-center">
                {/* Centered Section Header */}
                <div className="text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-10 select-none">
                  <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-[#ff8d2b] font-bold font-mono text-[11px] sm:text-xs tracking-[0.25em] px-5 py-2 rounded-full border border-[#ff8d2b]/15 uppercase mb-6 cursor-default">
                    ✚ PORTAFOLIO CORPORATIVO INTEGRAL
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[62px] xl:text-[70px] 2xl:text-[80px] font-black tracking-tight text-slate-900 mb-4 leading-none">
                    Nuestros <span className="text-[#ff8d2b]">Servicios</span>
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl lg:max-w-4xl mx-auto font-sans font-semibold">
                    Consalud ofrece soluciones metodológicas y jurídicas avanzadas para garantizar el blindaje legal, la seguridad industrial y el bienestar de su talento organizacional.
                  </p>
                </div>

                {/* 4+4 Service Cards Grid */}
                <div className="w-full mt-6 flex flex-col gap-5">
                  {[SERVICES_DATA.slice(0, 4), SERVICES_DATA.slice(4, 8)].map((row, rowIdx) => (
                    <div key={rowIdx} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                      {row.map((service) => {
                        const colors = getServiceColors(service.colorType, false);
                        return (
                          <button
                            key={service.id}
                            onClick={() => {
                              playRetroChime("click");
                              setActiveServiceModal(service);
                            }}
                            className={`group relative rounded-2xl border ${colors.border} ${service.bgImage && service.colorType === "orange" ? "bg-[#05123e]" : colors.bg} ${colors.glow} p-7 md:p-8 flex flex-col items-start gap-5 text-left transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden min-h-[320px]`}
                          >
                            {/* Background image (optional) — no color overlay, sits below content */}
                            {service.bgImage && (
                              <img
                                src={service.bgImage}
                                alt=""
                                className={`absolute inset-0 w-full h-full object-center pointer-events-none select-none ${service.bgImageFit === "contain" ? "object-contain p-8" : "object-cover"}`}
                                style={{ opacity: 0.45 }}
                              />
                            )}
                            {/* Top accent line — always subtly visible */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#ff8d2b] opacity-25 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Badge */}
                            <span className={`relative z-10 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${colors.badge}`}>
                              {service.badge}
                            </span>

                            {/* Icon */}
                            <div className={`relative z-10 p-3.5 rounded-2xl border ${colors.iconWrapper}`}>
                              {renderServiceIcon(service.id)}
                            </div>

                            {/* Title */}
                            <h3 className={`relative z-10 text-lg md:text-xl font-black leading-tight ${colors.text}`}>
                              {service.title}
                            </h3>

                            {/* Short desc */}
                            <p className={`relative z-10 text-sm md:text-base leading-relaxed flex-1 font-semibold ${colors.desc}`}>
                              {service.shortDesc}
                            </p>

                            {/* CTA */}
                            <span className={`relative z-10 inline-flex items-center gap-2 text-xs font-mono font-bold mt-2 px-4 py-2 rounded-full border transition-all duration-300 ${colors.text} opacity-60 group-hover:opacity-100 border-current/30 bg-current/5`}>
                              Ver detalle →
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          );
        }

        return null;
      })}

      <motion.section
        id="sec-vigia-placeholder"
        style={{ display: "none", background: "linear-gradient(160deg, #05123e 0%, #071a52 55%, #0a1f60 100%)" }}
        className="w-full scroll-mt-20 relative overflow-hidden flex justify-center py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] rounded-full bg-[#ff8d2b] opacity-[0.06] blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full bg-[#ff8d2b] opacity-[0.04] blur-[60px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-6 md:px-14 lg:px-16 2xl:px-24 flex flex-col gap-14">

          {/* ── HEADER ── */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="inline-flex items-center gap-2 bg-[#ff8d2b]/10 border border-[#ff8d2b]/25 text-[#ff8d2b] text-[11px] font-mono font-black tracking-[0.25em] uppercase px-5 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b] animate-pulse" />
              {MARCAS[0].badge}
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-[64px] font-black tracking-tight text-white leading-none">
              Plataforma <span className="text-[#ff8d2b]">Vigía</span> SST
            </h2>
            <p className="text-slate-300 text-base sm:text-lg md:text-xl font-sans font-semibold max-w-2xl leading-relaxed">
              {MARCAS[0].description}
            </p>
            <p className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em] uppercase">
              {MARCAS[0].role}
            </p>
          </div>

          {/* ── MAIN GRID: video left / features right ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

            {/* LEFT — logo + video */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={vigiaColorLogo}
                  alt="Vigía Logo"
                  className="h-16 w-auto object-contain drop-shadow-[0_6px_20px_rgba(255,141,43,0.35)]"
                />
                <div className="border-l border-white/10 pl-4">
                  <p className="text-white font-black text-lg leading-tight">{MARCAS[0].tagline}</p>
                  <p className="text-[#ff8d2b] text-xs font-mono tracking-widest uppercase mt-0.5">Colombia × Alemania</p>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/40">
                <div className="px-4 pt-4 pb-2 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-2">Demo en Vivo · Vigía SST</span>
                </div>
                <video
                  src={projectVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  className="w-full aspect-video object-cover"
                />
              </div>
            </div>

            {/* RIGHT — features + extras */}
            <div className="flex flex-col gap-6">
              {/* Phrase banner */}
              <div className="border-l-2 border-[#ff8d2b] pl-4 py-1">
                <p className="text-slate-300 text-sm italic font-sans">"{MARCAS[0].phrase}"</p>
              </div>

              {/* Features 2-col grid */}
              <div>
                <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mb-3">Características Clave</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MARCAS[0].features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/[0.03] border border-white/8 rounded-xl p-3.5 hover:border-[#ff8d2b]/30 transition-colors duration-200">
                      <div className="mt-0.5 text-[#ff8d2b] shrink-0">{feat.icon}</div>
                      <div>
                        <p className="text-xs font-bold text-white mb-0.5">{feat.title}</p>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Extras list */}
              <div>
                <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mb-3">Módulos & Capacidades</p>
                <div className="flex flex-col gap-2">
                  {MARCAS[0].extras.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-[#ff8d2b] text-xs mt-0.5 shrink-0">◆</span>
                      <span className="text-sm text-slate-300 font-sans font-semibold">{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── GALERÍA ── */}
          <div>
            <p className="text-[11px] font-mono font-black tracking-[0.2em] text-slate-500 uppercase mb-4">Plataforma en Acción</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { src: escritorioDavid, label: "ALERTA POR MANIPULACIÓN DE CELULARES", title: "Detección de celulares" },
                { src: kevinChaleco,    label: "ALERTA POR NO USO DE EPPs",            title: "Monitoreo de Bienestar" },
                { src: vigiaCapture1,   label: "CÁMARAS EN VIVO",                      title: "En tiempo real" },
                { src: vigiaCapture2,   label: "ALERTAS POR WHATSAPP/E-MAIL",          title: "Cumplimiento Normativo" },
              ].map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setExpandedImage(img.src); setExpandedImageTitle(img.title); }}
                  className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-[#ff8d2b]/40 bg-slate-950/40 aspect-[4/3] cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(255,141,43,0.15)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full text-[#ff8d2b]">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                      </svg>
                    </div>
                  </div>
                  <img src={img.src} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.12]" />
                  <div className="absolute bottom-2 left-2.5 right-2 z-20 text-left">
                    <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                      {img.label}
                    </span>
                    <p className="text-xs font-bold text-slate-100 mt-0.5 leading-tight">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA BAR ── */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 border-t border-white/8">
            <a
              href={`https://wa.me/573057883941?text=${encodeURIComponent("Hola, quiero solicitar una demo de la *Plataforma Vigía SST* de Consalud. Me gustaría conocer más sobre cómo puede ayudar a mi empresa.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-7 rounded-xl font-mono text-sm font-black uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Solicitar Demo por WhatsApp
            </a>
            <button
              onClick={() => {
                setFormData(prev => ({ ...prev, serviceOfInterest: "Software Vigía SST" }));
                setShowContactForm(true);
                document.getElementById("sec-landing-4")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center gap-2 py-3 px-7 rounded-xl font-mono text-sm font-black uppercase tracking-widest border border-[#ff8d2b]/50 text-[#ff8d2b] hover:bg-[#ff8d2b]/10 hover:border-[#ff8d2b] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
            >
              Agendar Demo →
            </button>
          </div>

        </div>
      </motion.section>

      {/* 3.5. SECCIÓN DEDICADA: QUIÉNES SOMOS & NUESTROS VALORES */}
      <motion.section
        id="sec-landing-1"
        className="w-full bg-transparent text-slate-950 py-10 scroll-mt-20 relative overflow-hidden flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Outer content container */}
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-6 md:px-14 lg:px-16 2xl:px-24 relative z-10 flex flex-col items-center">

          {/* Centered Header of Section */}
          <div className="text-center max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-10 select-none">
            <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-[#ff8d2b] font-bold font-mono text-[11px] sm:text-xs tracking-[0.25em] px-5 py-2 rounded-full border border-[#ff8d2b]/15 uppercase mb-6 cursor-default">
              ✚ QUIÉNES SOMOS & NUESTROS VALORES
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-[58px] lg:text-[62px] xl:text-[70px] 2xl:text-[80px] font-black tracking-tight text-slate-900 leading-tight mb-4">
              Expertos que simplifican la <span className="text-[#ff8d2b]">normativa SST</span>
            </h2>
            <p className="text-slate-600 font-sans text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl lg:max-w-4xl mx-auto font-semibold">
              Desde 1998 en Bogotá, acompañamos a empresas colombianas con un modelo a la medida, equipo interdisciplinar, respaldo académico y cero improvisaciones.
            </p>
          </div>

          {/* Grid of 4 Flip Cards with hover effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full mb-12">

            {/* Card 1: Responsabilidad */}
            <div
              onClick={() => { toggleValueCardFlip(0); playRetroChime("click"); }}
              className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer"
            >
              <div
                className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedValueCards[0] ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#05123e] flex flex-col items-center justify-center p-6 shadow-[0_12px_30px_rgba(5,18,62,0.25)] group-hover:shadow-[0_25px_50px_rgba(5,18,62,0.45)] transition-shadow duration-500"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="w-18 h-18 rounded-full bg-white/5 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                    <Heart className="w-10 h-10 text-[#ff8d2b]" />
                  </div>
                  <h4 className="text-[22px] xl:text-[24px] font-extrabold text-white font-sans tracking-wide">
                    Responsabilidad
                  </h4>
                  <div className="w-8 h-0.5 bg-[#ff8d2b] mt-3 opacity-80" />
                  <span className="text-[15px] font-mono text-white/50 tracking-wider mt-4 hidden md:inline">Pasa el cursor para ver ↑</span>
                  <span className="text-[15px] font-mono text-white/50 tracking-wider mt-4 md:hidden">Toca para ver ↑</span>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#05123e] flex flex-col items-center justify-center p-6 text-center shadow-[0_12px_30px_rgba(5,18,62,0.25)] group-hover:shadow-[0_25px_50px_rgba(5,18,62,0.45)] transition-shadow duration-500"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-xl xl:text-[20px] font-semibold text-white leading-relaxed font-sans max-w-xs px-2">
                    Bienestar integral y acompañamiento permanente en tus procesos sin excepciones.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Integridad */}
            <div
              onClick={() => { toggleValueCardFlip(1); playRetroChime("click"); }}
              className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer"
            >
              <div
                className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedValueCards[1] ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#ff8d2b] flex flex-col items-center justify-center p-6 shadow-[0_12px_30px_rgba(255,141,43,0.25)] group-hover:shadow-[0_25px_50px_rgba(255,141,43,0.45)] transition-shadow duration-500"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="w-18 h-18 rounded-full bg-white/10 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                    <Eye className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-[22px] xl:text-[24px] font-extrabold text-white font-sans tracking-wide">
                    Integridad
                  </h4>
                  <div className="w-8 h-0.5 bg-white mt-3 opacity-80" />
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4 hidden md:inline">Pasa el cursor para ver ↑</span>
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4 md:hidden">Toca para ver ↑</span>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#ff8d2b] flex flex-col items-center justify-center p-6 text-center shadow-[0_12px_30px_rgba(255,141,43,0.25)] group-hover:shadow-[0_25px_50px_rgba(255,141,43,0.45)] transition-shadow duration-500"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-xl xl:text-[20px] font-semibold text-white leading-relaxed font-sans max-w-xs px-2">
                    Transparencia absoluta, confidencialidad estricta y lealtad con tu empresa.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Experiencia */}
            <div
              onClick={() => { toggleValueCardFlip(2); playRetroChime("click"); }}
              className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer"
            >
              <div
                className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedValueCards[2] ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#f5f3e6] border border-slate-200 flex flex-col items-center justify-center p-6 shadow-[0_12px_30px_rgba(180,170,140,0.18)] group-hover:shadow-[0_25px_50px_rgba(180,170,140,0.35)] transition-shadow duration-500"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="w-18 h-18 rounded-full bg-slate-900/5 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                    <Award className="w-10 h-10 text-[#05123e]" />
                  </div>
                  <h4 className="text-[22px] xl:text-[24px] font-extrabold text-slate-900 font-sans tracking-wide">
                    Experiencia
                  </h4>
                  <div className="w-8 h-0.5 bg-[#05123e] mt-3 opacity-60" />
                  <span className="text-[15px] font-mono text-slate-500 tracking-wider mt-4 hidden md:inline">Pasa el cursor para ver ↑</span>
                  <span className="text-[15px] font-mono text-slate-500 tracking-wider mt-4 md:hidden">Toca para ver ↑</span>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#f5f3e6] border border-slate-200 flex flex-col items-center justify-center p-6 text-center shadow-[0_12px_30px_rgba(180,170,140,0.18)] group-hover:shadow-[0_25px_50px_rgba(180,170,140,0.35)] transition-shadow duration-500"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-xl xl:text-[20px] font-semibold text-[#05123e] leading-relaxed font-sans max-w-xs px-2">
                    27 años de trayectoria, respaldo académico y un equipo interdisciplinar idóneo.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 4: Adaptabilidad */}
            <div
              onClick={() => { toggleValueCardFlip(3); playRetroChime("click"); }}
              className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer"
            >
              <div
                className={`relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] md:group-hover:[transform:rotateY(180deg)] ${flippedValueCards[3] ? "[transform:rotateY(180deg)]" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#05123e] to-[#ff8d2b] flex flex-col items-center justify-center p-6 shadow-[0_12px_30px_rgba(5,18,62,0.12),_0_12px_30px_rgba(255,141,43,0.15)] group-hover:shadow-[0_25px_50px_rgba(5,18,62,0.22),_0_25px_50px_rgba(255,141,43,0.28)] transition-shadow duration-500"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="w-18 h-18 rounded-full bg-white/10 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                    <Zap className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-[22px] xl:text-[24px] font-extrabold text-white font-sans tracking-wide">
                    Adaptabilidad
                  </h4>
                  <div className="w-8 h-0.5 bg-white mt-3 opacity-80" />
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4 hidden md:inline">Pasa el cursor para ver ↑</span>
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4 md:hidden">Toca para ver ↑</span>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#05123e] to-[#ff8d2b] flex flex-col items-center justify-center p-6 text-center shadow-[0_12px_30px_rgba(5,18,62,0.12),_0_12px_30px_rgba(255,141,43,0.15)] group-hover:shadow-[0_25px_50px_rgba(5,18,62,0.22),_0_25px_50px_rgba(255,141,43,0.28)] transition-shadow duration-500"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <p className="text-base sm:text-lg lg:text-xl xl:text-[20px] font-semibold text-white leading-relaxed font-sans max-w-xs px-2">
                    Soluciones a la medida que responden a cambios de normativas y exigencias del mercado.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Centered highlights / metrics row beneath the cards */}
          <div className="mt-16 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto border border-slate-100 rounded-3xl bg-slate-50/50 py-10 px-8 flex flex-col sm:flex-row items-center justify-around gap-8 text-center transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:border-transparent hover:bg-gradient-to-r hover:from-[#05123e] hover:to-[#ff8d2b] group cursor-default">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-5xl md:text-6xl xl:text-7xl font-black text-[#ff8d2b] group-hover:text-white font-mono leading-none tracking-tight transition-colors duration-500">27+</span>
              <span className="text-xs xl:text-sm font-mono font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/80 transition-colors duration-500">años de experiencia</span>
            </div>
            <div className="h-10 w-px bg-slate-200 group-hover:bg-white/20 hidden sm:block transition-colors duration-500" />
            <div className="flex flex-col items-center space-y-2">
              <span className="text-5xl md:text-6xl xl:text-7xl font-black text-[#05123e] group-hover:text-white font-mono leading-none tracking-tight transition-colors duration-500">7</span>
              <span className="text-xs xl:text-sm font-mono font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/80 transition-colors duration-500">servicios especializados</span>
            </div>
            <div className="h-10 w-px bg-slate-200 group-hover:bg-white/20 hidden sm:block transition-colors duration-500" />
            <div className="flex flex-col items-center space-y-2">
              <span className="text-5xl md:text-6xl xl:text-7xl font-black text-[#ff8d2b] group-hover:text-white font-mono leading-none tracking-tight transition-colors duration-500">100%</span>
              <span className="text-xs xl:text-sm font-mono font-bold uppercase tracking-widest text-slate-500 group-hover:text-white/80 transition-colors duration-500">soluciones a la medida</span>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 4. SECCIÓN CONTACTO, RADICADO Y PREGUNTAS FRECUENTES (Asistencia / Support stops) */}
      <motion.section 
        id="sec-landing-4" 
        className="w-full bg-transparent text-slate-950 py-10 scroll-mt-20 overflow-hidden relative flex justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Outer content container */}
        <div className="w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] px-6 md:px-14 lg:px-16 2xl:px-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-stretch">
          
          {/* Left panel: Interactive FAQ list (Winery Catalog drawer Style) */}
          <div className="lg:col-span-5 select-none space-y-6 flex flex-col justify-center">
            <div className="space-y-3 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-[#ff8d2b] font-black font-mono text-[11px] sm:text-xs tracking-[0.25em] px-5 py-2 rounded-full border border-[#ff8d2b]/15 uppercase mb-6 cursor-default">
                💬 CANAL DE AYUDA DIRECTA
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] xl:text-[50px] 2xl:text-[58px] font-black tracking-tight text-slate-900 leading-tight">
                ¿Tienes dudas sobre <span className="text-[#ff8d2b]">Nosotros?</span>
              </h3>
            </div>

            {/* Accordion List */}
            <div className="flex flex-col gap-3">
              {FAQS_DATA.map((faq, index) => {
                const isOpen = activeFaqId === faq.id;
                return (
                  <div 
                    key={faq.id}
                    className={`relative rounded-xl border transition-all duration-500 overflow-hidden ${
                      isOpen 
                        ? "bg-white border-transparent shadow-lg shadow-[#05123e]/5 ring-1 ring-slate-100 scale-[1.01]" 
                        : "bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:scale-[1.002]"
                    }`}
                  >
                    {/* Active vertical accent gradient bar on the far-left border */}
                    {isOpen && (
                      <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b from-[#05123e] to-[#ff8d2b]" />
                    )}

                    <button
                      onClick={() => {
                        playRetroChime("click");
                        setActiveFaqId(isOpen ? null : faq.id);
                      }}
                      className="w-full flex items-start justify-between p-4 focus:outline-none text-left cursor-pointer gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Styled index counter */}
                        <span className={`font-mono text-[10.5px] lg:text-xs font-black tracking-wide shrink-0 pt-0.5 ${
                          isOpen ? "text-[#ff8d2b]" : "text-slate-400"
                        }`}>
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        <span className={`text-xs sm:text-[14px] lg:text-[15px] xl:text-[16px] font-black tracking-wide leading-snug ${
                          isOpen ? "text-[#05123e]" : "text-slate-700"
                        }`}>
                          {faq.q}
                        </span>
                      </div>
                      <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen ? "bg-[#ff8d2b]/15 text-[#ff8d2b] rotate-180" : "bg-slate-200/50 text-slate-500"
                      }`}>
                        <ChevronDown className="w-3 h-3" />
                      </div>
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="px-4 pb-4 pt-1 pl-[36px] text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] text-slate-500 leading-relaxed select-text font-sans font-semibold border-t border-slate-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Modern Card & Form with 3D Tilt interaction */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {!showContactForm ? (
                // 1. WELCOME CARD WITH 3D TILT EFFECT
                <motion.div
                  key="welcome-card"
                  ref={welcomeCardRef}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  onMouseEnter={() => setIsWelcomeCardHovered(true)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    playRetroChime("click");
                    setShowContactForm(true);
                  }}
                  style={{
                    width: "100%",
                    maxWidth: 540,
                    height: 520,
                    margin: "0 auto",
                    position: "relative",
                    cursor: "pointer",
                    userSelect: "none",
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isWelcomeCardHovered ? 1.02 : 1})`,
                    transition: isWelcomeCardHovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 24,
                    border: `1px solid ${isWelcomeCardHovered ? "rgba(255, 141, 43, 0.45)" : "rgba(5, 18, 62, 0.15)"}`,
                    background: isWelcomeCardHovered ? "rgba(5, 18, 62, 0.96)" : "rgba(5, 18, 62, 0.92)",
                    backdropFilter: "blur(12px)",
                    boxShadow: isWelcomeCardHovered 
                      ? "0 20px 40px rgba(255, 141, 43, 0.15), 0 10px 25px rgba(5,18,62,0.2)" 
                      : "0 10px 30px rgba(5, 18, 62, 0.12)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 22,
                    padding: 44,
                    overflow: "hidden",
                    transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
                  }}>
                    {/* Glow blob */}
                    <div style={{
                      position: "absolute",
                      top: -60,
                      right: -60,
                      width: 180,
                      height: 180,
                      background: "radial-gradient(circle, rgba(255, 141, 43, 0.2), transparent 70%)",
                      borderRadius: "50%",
                      filter: "blur(24px)",
                      pointerEvents: "none",
                      opacity: isWelcomeCardHovered ? 1 : 0.6,
                      transition: "opacity 0.4s",
                    }} />

                    {/* Logo con spin en hover */}
                    <div style={{ perspective: 1000, display: "flex", justifyContent: "center" }}>
                      <motion.img
                        src={logoConsalud}
                        alt="Consalud"
                        draggable={false}
                        animate={{ rotateY: isWelcomeCardHovered ? 360 : 0 }}
                        transition={isWelcomeCardHovered ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] } : { duration: 0.4 }}
                        style={{ height: 110, objectFit: "contain", display: "block" }}
                        onError={(e) => {
                          // Fallback to Consalud.png if logoConsalud.png is empty
                          (e.currentTarget as HTMLImageElement).src = consaludLogo;
                        }}
                      />
                    </div>

                    {/* Texto */}
                    <div style={{ textAlign: "center" }}>
                      <p style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "#ff8d2b",
                        margin: "0 0 10px"
                      }}>
                        Trabajemos juntos
                      </p>
                      <h3 style={{
                        fontSize: 29,
                        fontWeight: 900,
                        color: "white",
                        margin: 0,
                        letterSpacing: 0.5,
                        lineHeight: 1.2
                      }}>
                        Protege a tu equipo hoy
                      </h3>
                    </div>

                    <div style={{ height: 2, width: 44, background: "#ff8d2b" }} />

                    <p style={{
                      fontSize: 15,
                      color: "rgba(255, 255, 255, 0.8)",
                      textAlign: "center",
                      lineHeight: 1.6,
                      margin: "0 10px",
                      fontWeight: 500
                    }}>
                      Soluciones SST a la medida con respaldo académico y cero improvisaciones. Haz clic para contactar ahora mismo.
                    </p>

                    {/* Botón */}
                    <div style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#white",
                      backgroundColor: "#ff8d2b",
                      borderRadius: 24,
                      padding: "10px 28px",
                      boxShadow: "0 4px 15px rgba(255, 141, 43, 0.3)",
                      transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
                    }}
                    className="hover:scale-[1.04] active:scale-[0.98] cursor-pointer"
                    >
                      Contactar Especialista →
                    </div>
                  </div>
                </motion.div>
              ) : (
                // 2. FORMULARIO DE CONTACTO
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="relative rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl overflow-hidden w-full max-w-[580px] mx-auto"
                >
                  {/* Decorative corner glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff8d2b]/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Internal Form Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono tracking-widest text-[#ff8d2b] uppercase font-black">CANAL INTEGRAL DE ATENCIÓN</span>
                      <h4 className="text-lg font-black text-[#05123e] mt-0.5">Formulario de Contacto</h4>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#f5f3e6] flex items-center justify-center text-[#ff8d2b] border border-[#ff8d2b]/10">
                      <Building className="w-5 h-5" />
                    </div>
                  </div>

                  {!successTicket ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* 1. Nombre Completo */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider">
                          Nombre Completo *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Ej. Julián Esteban Rodríguez"
                          className={`bg-slate-50 border text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:outline-none transition focus:ring-1 ${formErrors.name ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-[#ff8d2b] focus:ring-[#ff8d2b]/20"}`}
                        />
                        {formErrors.name && <span className="text-[10px] text-red-500 font-mono">{formErrors.name}</span>}
                      </div>

                      {/* 2 & 3. Empresa & Teléfono */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider">
                            Empresa *
                          </label>
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Ej. Consalud S.A.S"
                            className={`bg-slate-50 border text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:outline-none transition focus:ring-1 ${formErrors.company ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-[#ff8d2b] focus:ring-[#ff8d2b]/20"}`}
                          />
                          {formErrors.company && <span className="text-[10px] text-red-500 font-mono">{formErrors.company}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider">
                            Teléfono / Celular *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Ej. 3214567890"
                            maxLength={12}
                            className={`bg-slate-50 border text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:outline-none transition focus:ring-1 ${formErrors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-[#ff8d2b] focus:ring-[#ff8d2b]/20"}`}
                          />
                          {formErrors.phone && <span className="text-[10px] text-red-500 font-mono">{formErrors.phone}</span>}
                        </div>
                      </div>

                      {/* 4. Correo Electrónico */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Ej. contacto@empresa.com"
                          className={`bg-slate-50 border text-xs px-3.5 py-2.5 rounded-lg text-[#05123e] focus:bg-white focus:outline-none transition focus:ring-1 ${formErrors.email ? "border-red-400 focus:border-red-400 focus:ring-red-200" : "border-slate-200 focus:border-[#ff8d2b] focus:ring-[#ff8d2b]/20"}`}
                        />
                        {formErrors.email && <span className="text-[10px] text-red-500 font-mono">{formErrors.email}</span>}
                      </div>

                      {/* 5. Servicio de Interés */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase font-black tracking-wider">
                          Servicio de Interés *
                        </label>
                        <select
                          name="serviceOfInterest"
                          value={formData.serviceOfInterest}
                          onChange={handleInputChange}
                          className="bg-[#f5f3e6]/40 border border-[#e2dfc9] text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:border-[#ff8d2b] focus:outline-none transition cursor-pointer"
                        >
                          <option value="Seguridad y Salud en el Trabajo">Seguridad y Salud en el Trabajo</option>
                          <option value="Servicio Outsourcing">Servicio Outsourcing</option>
                          <option value="Software Vigía SST">Software Vigía SST (Producto Digital)</option>
                          <option value="Batería Psicosocial Digital">Batería Psicosocial Digital (Producto Digital)</option>
                          <option value="Gestión de Riesgo">Gestión de Riesgo (Biológico, SST, etc.)</option>
                          <option value="Gestión Ambiental">Gestión Ambiental</option>
                          <option value="Capacitaciones">Capacitaciones & Brigadas</option>
                          <option value="Asesoría Legal">Asesoría Legal (Resolución 0312, etc.)</option>
                          <option value="Auditorías">Auditorías / Diagnósticos</option>
                        </select>
                      </div>

                      {/* Dynamic dispatch or plain submit button */}
                      <div className="pt-4 border-t border-slate-100">
                        {isDispatching ? (
                          <div className="space-y-2.5 select-none animate-pulse">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span className="text-[#ff8d2b] uppercase tracking-wider font-bold">{dispatchStepText}</span>
                              <span className="text-slate-600 font-bold">{dispatchProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#05123e] to-[#ff8d2b] transition-all duration-75"
                                style={{ width: `${dispatchProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button
                              type="submit"
                              className="flex-1 py-3 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-[#010410] bg-[#ff8d2b] hover:bg-[#ff8d2b]/95 hover:text-white hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition cursor-pointer text-center"
                            >
                              Enviar Solicitud Consalud →
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                playRetroChime("click");
                                setShowContactForm(false);
                              }}
                              className="py-3 px-5 border border-slate-200 rounded-xl font-sans text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer text-center"
                            >
                              Atrás
                            </button>
                          </div>
                        )}
                      </div>
                    </form>
                  ) : (
                    // CONFIRMATION SCREEN
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-6 space-y-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 text-3xl shadow-lg shadow-emerald-500/5 font-bold">
                        ✔
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-mono tracking-widest text-[#ff8d2b] uppercase font-black">
                          ¡RADICACIÓN EXITOSA EN COLOMBIA!
                        </span>
                        <h5 className="text-xl font-extrabold font-sans text-[#05123e]">
                          Hemos recibido su solicitud
                        </h5>
                        <p className="text-xs text-slate-500 font-sans max-w-sm leading-relaxed mx-auto">
                          Nos pondremos en contacto con su empresa (<strong className="text-slate-700">{formData.company}</strong>) para brindarle acompañamiento preventivo en el servicio de <strong className="text-slate-700">{formData.serviceOfInterest}</strong>.
                        </p>
                      </div>

                      {/* High quality docket container */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 w-full max-w-sm divide-y divide-slate-100 font-mono text-left select-all shadow-inner">
                        <div className="flex justify-between items-center text-[10px] pb-2">
                          <span className="text-slate-500 uppercase font-black">CÓDIGO RADICADO:</span>
                          <span className="text-[#ff8d2b] font-extrabold tracking-wider">{successTicket}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] pt-2 pb-2">
                          <span className="text-slate-500">TITULAR REGISTRADO:</span>
                          <span className="text-[#05123e] font-bold truncate max-w-[200px]">{formData.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-[9px] pt-2">
                          <span className="text-slate-500">ACOMPAÑAMIENTO ASIGNADO:</span>
                          <span className="text-emerald-600 font-black">&lt; 1 Hora (Asesor Bogotá)</span>
                        </div>
                      </div>

                      <button
                        onClick={resetForm}
                        className="px-6 py-2.5 bg-[#05123e] hover:bg-[#ff8d2b] text-white rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider transition cursor-pointer select-none active:scale-95"
                      >
                        Establecer nuevo contacto ←
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </motion.section>

      {/* Interactive Detail Modal for Services with smooth spring animations */}
      <AnimatePresence>
        {activeServiceModal && (
          <div 
            onClick={() => {
              playRetroChime("click");
              setActiveServiceModal(null);
            }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto pt-36 px-4 sm:px-6 pb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto"
            >
              {/* Colored accent header bar depending on colorType */}
              <div className={`h-3 w-full ${
                activeServiceModal.colorType === 'darkBlue' ? 'bg-[#05123e]' :
                activeServiceModal.colorType === 'orange' ? 'bg-[#ff8d2b]' :
                activeServiceModal.colorType === 'cream' ? 'bg-[#e2dfc9]' :
                'bg-gradient-to-r from-[#05123e] to-[#ff8d2b]'
              }`} />

              <div className="p-8 sm:p-10 space-y-7">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 pr-6">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#ff8d2b] uppercase">
                      {activeServiceModal.badge}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-[#05123e] tracking-tight leading-tight">
                      {activeServiceModal.title}
                    </h3>
                  </div>

                  {/* Icon badge floating */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200 text-[#05123e] shrink-0 shadow-sm">
                    {renderServiceIcon(activeServiceModal.id)}
                  </div>
                </div>

                {/* Extended Details Body */}
                <div className="space-y-4">
                  <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans select-text whitespace-pre-wrap font-semibold">
                    {activeServiceModal.longDesc}
                  </p>
                </div>

                {/* Key Benefits grid list */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-mono tracking-wider text-slate-400 uppercase font-black mb-4">
                    Beneficios y especificaciones clave:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeServiceModal.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-3 text-base text-slate-700 leading-snug">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-sans font-semibold">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions banner */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    onClick={() => handleServiceCta(activeServiceModal.title)}
                    className="flex-1 py-3.5 px-6 rounded-xl font-mono text-sm font-bold uppercase tracking-widest text-white bg-[#05123e] hover:bg-[#ff8d2b] hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition cursor-pointer text-center select-none"
                  >
                    {activeServiceModal.actionLabel} →
                  </button>

                  <a
                    href={`https://wa.me/573057883941?text=${encodeURIComponent(`Hola, quiero solicitar asesoría sobre el servicio de *${activeServiceModal.title}* de Consalud.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-mono text-sm font-bold uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] transition cursor-pointer text-center select-none"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.525 5.847L.057 23.43a.75.75 0 0 0 .924.908l5.35-1.453A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 0 1-4.953-1.355l-.355-.21-3.668.996.984-3.74-.23-.375A9.713 9.713 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>

                  <button
                    onClick={() => setActiveServiceModal(null)}
                    className="py-3.5 px-6 border border-slate-200 rounded-xl font-sans text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer text-center select-none"
                  >
                    Cerrar catálogo
                  </button>
                </div>
              </div>

              {/* Float Close trigger */}
              <button
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── INTERACTIVE EXPANSION OVERLAY ── */}
      <AnimatePresence>
        {activeMarca !== null && (() => {
          const marca = MARCAS[activeMarca];
          const isVigia = activeMarca === 0;
          return (
            <motion.div
              key="marca-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-3 pt-36 pb-4 bg-slate-950/85 backdrop-blur-md pointer-events-auto"
              onClick={() => setActiveMarca(null)}
            >
              {/* Close button — fixed to viewport, always visible, clear of navbar */}
              <button
                className="fixed top-[148px] right-6 z-[60] flex items-center justify-center w-11 h-11 bg-slate-800 hover:bg-[#ff8d2b] border border-white/25 hover:border-[#ff8d2b] rounded-2xl text-slate-300 hover:text-white transition-all duration-200 cursor-pointer shadow-2xl backdrop-blur-sm"
                onClick={(e) => { e.stopPropagation(); setActiveMarca(null); }}
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 8 }}
                transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  width: "min(1440px, 97vw)",
                  height: "calc(100vh - 160px)",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `1px solid ${marca.accent}33`,
                  boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${marca.accent}15`,
                }}
                className="grid grid-cols-1 md:grid-cols-5 bg-slate-900 border"
                onClick={e => e.stopPropagation()}
              >
                {/* LEFT PANEL */}
                <div className="md:col-span-2 bg-slate-950 border-r border-slate-800 p-8 flex flex-col items-center justify-center relative min-h-[380px] h-full">
                  {/* Badge */}
                  <div 
                    style={{ color: marca.accent, borderColor: `${marca.accent}44` }}
                    className="absolute top-5 left-5 text-[8px] font-black tracking-[0.2em] uppercase border rounded px-2.5 py-1"
                  >
                    {marca.badge ?? "TECNOLOGÍA SST"}
                  </div>

                  <div className="text-center relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6">
                    {isVigia ? (
                      <div className="w-48 h-48 md:w-60 md:h-60 flex items-center justify-center transition-transform duration-500 hover:scale-105">
                        <img
                          src={vigiaColorLogo}
                          alt="Vigía Logo"
                          className="w-full h-auto max-h-full object-contain filter drop-shadow-[0_10px_25px_rgba(255,141,43,0.35)]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="transition-transform duration-500 hover:scale-105">
                        <DcjLogoSvg />
                      </div>
                    )}
                  </div>

                  {/* Footer: centrado */}
                  <div className="absolute bottom-5 left-5 right-5 flex flex-col items-center gap-1">
                    <p className="text-[8px] font-bold tracking-[0.22em] text-slate-500 uppercase text-center">
                      {isVigia ? "Un supervisor no puede estar en todos lados" : "IDENTIFICAR, MEDIR Y PREVENIR"}
                    </p>
                    <p className="text-[11px] font-black tracking-wide text-slate-300 text-center">
                      {isVigia ? (
                        <>COLOMBIA <span className="text-[#ff8d2b]">𝓍</span> ALEMANIA</>
                      ) : (
                        <>RESOLUCIÓN <span className="text-[#22c55e]">2404</span> DE 2019</>
                      )}
                    </p>
                  </div>
                </div>

                {/* RIGHT PANEL - SCROLLABLE */}
                <div className="md:col-span-3 bg-slate-900/98 p-6 md:p-8 overflow-y-auto h-full flex flex-col gap-5 text-left select-text">
                  <p style={{ color: marca.accent }} className="text-[9px] font-black tracking-[0.18em] uppercase m-0 leading-none">
                    SOFTWARE SST AUTORIZADO
                  </p>

                  <div>
                    <h3 className="text-3xl font-black text-white leading-tight m-0 mb-1">
                      {marca.fullName}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider m-0 uppercase">
                      {marca.role}
                    </p>
                  </div>

                  {/* Phrase info banner */}
                  <div className="border-l-2 pl-3 py-1 text-slate-300 text-xs italic font-sans" style={{ borderColor: marca.accent }}>
                    "{marca.phrase}"
                  </div>

                  {/* Description box */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[14px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 font-mono">
                      VISIÓN Y PROPÓSITO
                    </p>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans m-0 font-semibold">
                      {marca.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div>
                    <p className="text-[14px] font-bold tracking-wider text-slate-500 uppercase mb-3 font-mono">
                      CARACTERÍSTICAS CLAVE
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {marca.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5 bg-slate-950/20 border border-white/5 rounded-lg p-2.5">
                          <div className="mt-0.5" style={{ color: marca.accent }}>
                            {feat.icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white mb-0.5">{feat.title}</p>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">{feat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Extras list */}
                  <div>
                    <p className="text-[14px] font-bold tracking-wider text-slate-500 uppercase mb-2.5 font-mono">
                      MÓDULOS & CAPACIDADES ADICIONALES
                    </p>
                    <div className="flex flex-col gap-2">
                      {marca.extras.map((ex, exIdx) => (
                        <div key={exIdx} className="flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: marca.accent }}>◆</span>
                          <span className="text-sm text-slate-200 font-sans font-semibold">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video demo */}
                  {isVigia && marca.videoSrc && (
                    <div>
                      <p className="text-[14px] font-bold tracking-wider text-slate-500 uppercase mb-2.5 font-mono">
                        DEMO EN VIVO
                      </p>
                      <video
                        src={marca.videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls
                        className="w-full rounded-xl border border-white/10 bg-black block aspect-video shadow-md"
                      />
                    </div>
                  )}

                  {/* Image gallery */}
                  <div>
                    <p className="text-[14px] font-bold tracking-wider text-slate-400 uppercase mb-2.5 font-mono">
                      PLATAFORMA EN ACCIÓN
                    </p>
                    <div className="grid grid-cols-2 gap-3.5 select-none">
                      {isVigia ? (
                        <>
                          <div
                            onClick={() => {
                              setExpandedImage(escritorioDavid);
                              setExpandedImageTitle("Dashboard Predictivo de Vigía SST");
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ff8d2b] backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={escritorioDavid} alt="Dashboard Predictivo de Vigía SST" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                                ALERTA POR MANIPULACION DE CELLULARES
                              </span>
                              <p className="text-[14px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Detección de celulares</p>
                            </div>
                          </div>

                          <div
                            onClick={() => {
                              setExpandedImage(kevinChaleco);
                              setExpandedImageTitle("Vigilancia de Salud Industrial Vigía");
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ff8d2b] backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={kevinChaleco} alt="Vigilancia de Salud Industrial Vigía" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                              ALERTA POR NO USO DE EPPs
                              </span>
                              <p className="text-[14px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Monitoreo de Bienestar</p>
                            </div>
                          </div>

                          <div
                            onClick={() => {
                              setExpandedImage(vigiaCapture1);
                              setExpandedImageTitle("Detección en Tiempo Real Vigía");
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ff8d2b] backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={vigiaCapture1} alt="Detección en Tiempo Real Vigía" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                                CÁMARAS EN VIVO
                              </span>
                              <p className="text-[14px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">En tiempo real</p>
                            </div>
                          </div>

                          <div
                            onClick={() => {
                              setExpandedImage(vigiaCapture2);
                              setExpandedImageTitle("Reporte Automático de Cumplimiento Vigía");
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(239,124,16,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-[#ff8d2b] backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={vigiaCapture2} alt="Reporte Automático de Cumplimiento Vigía" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                                ALERTAS POR WHATSAPP/E-MAIL
                              </span>
                              <p className="text-[10px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Cumplimiento Normativo</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => { 
                              setExpandedImage(capturaSST); 
                              setExpandedImageTitle("Módulo de Reportes de Estrés y Demográfico Legal"); 
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-blue-500 backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={capturaSST} alt="Diagnóstico Psicosocial Clínico" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-blue-400 uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-blue-500/20">
                                DIAGNÓSTICO LEGAL
                              </span>
                              <p className="text-[10px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Res. 2404 de 2019</p>
                            </div>
                          </div>

                          <div
                            onClick={() => { 
                              setExpandedImage(escritorioDavid);
                              setExpandedImageTitle("Ecosistema Consolidado de Riesgo Psicosocial General");
                            }}
                            className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/40 bg-slate-950/40 aspect-[4/3] flex flex-col shadow-inner cursor-zoom-in transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 pointer-events-none">
                              <div className="bg-slate-950/80 border border-white/10 p-2 rounded-full shadow-lg text-blue-500 backdrop-blur-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                </svg>
                              </div>
                            </div>
                            <img src={escritorioDavid} alt="Resumen Gerencial del Ecosistema" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-blue-400 uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-blue-500/20">
                                ANALÍTICA GENERAL
                              </span>
                              <p className="text-[10px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Factores de Estrés</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bottom contact CTA inside modal */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <a
                      href={`https://wa.me/573057883941?text=${encodeURIComponent(isVigia
                        ? "Hola, quiero solicitar una demo de la *Plataforma Vigía SST* de Consalud. Me gustaría conocer más sobre cómo puede ayudar a mi empresa."
                        : "Hola, quiero solicitar información sobre la *Batería Psicosocial Digital* de Consalud.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-white bg-green-600 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/20 active:scale-[0.98] transition cursor-pointer text-center select-none w-full sm:w-auto"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Escribir por WhatsApp
                    </a>
                    <button
                      style={{ borderColor: marca.accent, color: marca.accent }}
                      className="py-2.5 px-5 rounded-xl font-sans text-xs font-extrabold uppercase hover:bg-white/5 transition-all text-center border font-mono select-none w-full sm:w-auto"
                      onClick={() => {
                        setActiveMarca(null);
                        setFormData(prev => ({
                          ...prev,
                          serviceOfInterest: isVigia ? "Software Vigía SST" : "Batería Psicosocial Digital"
                        }));
                        setShowContactForm(true);
                        const contactSection = document.getElementById("sec-landing-4");
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      AGENDA TU DEMO →
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Zoom modal for screenshots */}
      <AnimatePresence>
        {expandedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
            onClick={() => setExpandedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
              <img src={expandedImage} alt={expandedImageTitle} className="w-full h-auto max-h-[75vh] object-contain rounded-t-2xl" />
              <div className="bg-slate-900 border-t border-white/5 p-4 flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-mono text-[#ff8d2b] uppercase font-bold tracking-wider">VISTA EN DETALLE</p>
                  <h4 className="text-base font-black text-white mt-1 font-sans">{expandedImageTitle}</h4>
                </div>
                <button 
                  onClick={() => setExpandedImage(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 text-xs font-bold transition-all"
                >
                  Cerrar Vista
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
