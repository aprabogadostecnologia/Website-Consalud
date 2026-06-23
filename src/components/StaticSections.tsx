import React, { useState, useEffect, useRef } from "react";
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
import vigiaWhiteLogo from "../assets/images/vigiaWhite.png";
// @ts-ignore
import vigiaColorLogo from "../assets/images/vigia.png";
// @ts-ignore
import bateriaSinFondo from "../assets/images/bateriaSinFondo.png";
// @ts-ignore
import projectVideo from "../assets/images/Video Project.mp4";
// @ts-ignore
import logoConsalud from "../assets/images/logoConsalud.png";
// @ts-ignore
import consaludLogo from "../assets/images/Consalud.png";
// @ts-ignore
import vigiaDashboard from "../assets/images/vigia_dashboard_1779379879154.png";
// @ts-ignore
import vigiaWorker from "../assets/images/vigia_worker_1779379901252.png";
// @ts-ignore
import capturaSST from "../assets/images/Captura de pantalla 2026-05-19 155132.png";
import QuantumCoreBackground from "./QuantumCoreBackground";
import ServiceRadialGallery from "./ServiceRadialGallery";
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
    actionLabel: "Cotizar SG-SST"
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
    actionLabel: "Solicitar Outsourcing"
  },
  {
    id: 3,
    title: "Gestión de Riesgo",
    shortDesc: "Identificación proactiva, análisis predictivo y mitigación de factores de riesgo crítico antes del siniestro.",
    longDesc: "Diseñamos estrategias preventivas avanzadas enfocadas en la resiliencia operativa de su organización. Empleamos el Ecosistema Vigía para recopilar datos epidemiológicos continuos, evaluar amenazas biomecánicas, psicosociales o físicas, y formular matrices dinámicas que permiten tomar decisiones seguras en tiempo real y evitar reclamaciones o demandas laborales de alto impacto financiero.",
    colorType: "cream",
    badge: "MONITOREO BIOMÉTRICO",
    benefits: [
      "Alertas tempranas de fatiga extrema y riesgo coronario",
      "Matrices de riesgo dinámicas actualizables con Big Data",
      "Medidas correctoras sobre higiene postural y ergonómica",
      "Prevención activa del burnout y estrés laboral severo"
    ],
    actionLabel: "Analizar Mis Riesgos"
  },
  {
    id: 4,
    title: "Gestión Ambiental",
    shortDesc: "Construcción de prácticas corporativas sostenibles con estricto apego regulatorio y ecológico.",
    longDesc: "Llevamos a su organización hacia un modelo de desarrollo sostenible y carbono-neutro. Estructuramos e implementamos Programas de Gestión Integral de Residuos (PGIR), diseñamos planes de ahorro de recursos críticos (agua y energía) y realizamos auditorías ambientales exhaustivas para garantizar el cumplimiento riguroso de la normativa del Ministerio de Ambiente, protegiendo tanto su entorno como su reputación de marca.",
    colorType: "gradient",
    badge: "SOSTENIBILIDAD VERDE",
    benefits: [
      "Alineación legal de licencias y permisos ante entes ambientales",
      "Diseño y puesta en marcha del Plan de Gestión de Residuos (PGIR)",
      "Optimización eco-eficiente de energía, agua y materias primas",
      "Reducción de huella de carbono sustentada con reportes"
    ],
    actionLabel: "Estructurar PGIR"
  },
  {
    id: 5,
    title: "Capacitaciones",
    shortDesc: "Programas de alto impacto pedagógico y certificación de brigadas, comités y cultura de autocuidado.",
    longDesc: "Modelos pedagógicos dinámicos ajustados a la realidad operativa de su empresa. Formamos de manera certificada y oficial a sus Brigadas de Emergencia, COPASST, Comité de Convivencia y personal expuesto a riesgos críticos de trabajo. Fomentamos el autocuidado sólido y preventivo con metodologías de andragogía práctica que aumentan la retención de conocimientos.",
    colorType: "darkBlue",
    badge: "EDUCACIÓN CERTIFICADA",
    benefits: [
      "Certificación formal válida ante inspectores del Ministerio",
      "Metodología andragógica práctica altamente interactiva",
      "Estructuración de Brigadas entrenadas para emergencias reales",
      "Firme sensibilización en salud física, mental y ergonomía"
    ],
    actionLabel: "Ver Catálogo de Cursos"
  },
  {
    id: 6,
    title: "Asesoría Legal",
    shortDesc: "Blindaje de excelencia jurídica corporativa ante requerimientos ministeriales o reparaciones en salud.",
    longDesc: "Protección jurídica altamente especializada para evitar sanciones directas, multas del Ministerio del Trabajo o costosas indemnizaciones por accidentes laborales. Nuestros abogados expertos estructuran defensas sólidas, redactan descargos ajustados al rigor legal colombiano y guían éticamente a las organizaciones y trabajadores ante la Superintendencia de Salud.",
    colorType: "orange",
    badge: "DEFENSA JURÍDICA",
    benefits: [
      "Representación calificada ante entes de control laboral",
      "Soporte preventivo sólido frente a multas o pliegos de cargo",
      "Estructuración rigurosa de actas, descargos e impugnaciones",
      "Asesoramiento integral en fueros de salud y estabilidad"
    ],
    actionLabel: "Agendar Consulta Jurídica"
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
    actionLabel: "Programar Auditoría HG"
  }
];

export const renderServiceIcon = (id: number) => {
  switch (id) {
    case 1:
      return <Shield className="w-6 h-6" />;
    case 2:
      return <Users className="w-6 h-6" />;
    case 3:
      return <AlertTriangle className="w-6 h-6" />;
    case 4:
      return <Leaf className="w-6 h-6" />;
    case 5:
      return <GraduationCap className="w-6 h-6" />;
    case 6:
      return <Scale className="w-6 h-6" />;
    case 7:
      return <ClipboardCheck className="w-6 h-6" />;
    default:
      return <Activity className="w-6 h-6" />;
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
    q: "¿Qué plazo tiene la EPS para entregar medicamentos no POS o de alto costo?",
    a: "Según la normatividad de la Superintendencia de Salud de Colombia, una vez autorizados los medicamentos, la EPS debe entregarlos en un plazo no mayor a 48 horas. De presentar retraso injustificado, se puede radicar un reclamo de urgencia vital asistido legalmente."
  },
  {
    id: "faq-2",
    q: "¿Qué es el Programa de Vigilancia Epidemiológica del Ecosistema Vigía?",
    a: "Es un convenio interactivo de cooperación SST que utiliza algoritmos predictivos para monitorear biometría y condiciones ergonómicas. El programa detecta indicios de patologías ocupacionales antes de que se consolide una incapacidad laboral, salvando bienestar y optimizando la productividad empresarial."
  },
  {
    id: "faq-3",
    q: "¿Es legal que me exijan pagarés o cheques de garantía en Urgencias?",
    a: "No. En Colombia, la Ley de Urgencia Vital prohíbe de forma tajante a cualquier clínica u hospital (Público o Privado) pedir garantías de pago, dinero en efectivo, cheques o pagarés para atender una emergencia médica que comprometa la vida o deje secuelas severas."
  },
  {
    id: "faq-4",
    q: "¿Cómo apelo una licencia médica rechazada injustamente?",
    a: "Si el fondo de pensiones o la administradora de salud rechaza un período de incapacidad, el trabajador tiene el derecho de apelar en primera y segunda instancia con informes médicos especializados complementarios, acción en la cual los abogados de Consalud brindan acompañamiento directo."
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
    phrase: "Vigía alerta antes del incidente Cámaras normales, inteligencia artificial colombiana e ingeniería alemana todo trabajando para que ningún trabajador salga lastimado por algo que se pudo ver venir.",
    role: "PRIMER SISTEMA DE RASTREO VISUAL INTELIGENTE DE COLOMBIA",
    description: "Desarrollada en Colombia con Ingeniería Alemana, Vigía detecta riesgos en milisegundos, notifica al supervisor SST por email o WhatsApp y genera reportes de cumplimiento normativo HSE al instante.",
    features: [
      { icon: <Shield size={16} />, title: "Detección de EPP", desc: "Reconoce casco, chaleco y guantes en milisegundos con 95%+ de confianza. Alerta inmediata por no uso." },
      { icon: <AlertTriangle size={16} />, title: "Control de Celulares", desc: "Rastreo Inteligente de Mirada: detecta manipulación de celular con 93%+ confianza y alerta al instante." },
      { icon: <Eye size={16} />, title: "Seguimiento Ocular 3D", desc: "Determina si un trabajador opera maquinaria mientras usa su celular. Prevención antes del incidente." },
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
  {
    name: "BATERIA",
    fullName: "Batería Psicosocial Digital",
    logo: "",
    accent: "#22c55e",
    badge: "EVALUACIÓN DE RIESGO DE LEY",
    tagline: "Medición Integral de Estrés y Clima Laboral",
    phrase: "Cumple la Resolución 2404 de 2019 con psicólogos expertos con licencia SST.",
    role: "EVALUACIÓN ONLINE BAJO NORMATIVA MINISTERIO DEL TRABAJO",
    description: "Plataforma online ágil y segura para la aplicación de la batería de riesgo psicosocial de forma virtual o física en toda Colombia. Reduce costos en logística y recibe reportes y planes de intervención firmados por psicólogos especialistas con licencia SST vigente.",
    features: [
      { icon: <ClipboardCheck size={16} />, title: "Aplicación de Ley", desc: "Cumplimiento garantizado de la Resolución 2404 de 2019 y Resolución 2764 de 2022." },
      { icon: <Users size={16} />, title: "Resultados Agrupados", desc: "Informes detallados por demografía, áreas, cargos e índices generales de estrés extralaboral e intralaboral." },
      { icon: <ShieldCheck size={16} />, title: "Licencia SST Vigente", desc: "Todos los reportes y planes de prevención son validados y firmados por psicólogos especialistas acreditados." },
      { icon: <Zap size={16} />, title: "Plataforma Virtual Segura", desc: "Software intuitivo que optimiza tiempos de respuesta y resguarda la privacidad de la información." },
      { icon: <BookOpen size={16} />, title: "Plan de Intervención", desc: "Incluye guías prácticas de intervención psicosocial para disminuir el ausentismo y mejorar el bienestar laboral." },
    ],
    extras: [
      "Estrés y Burnout — prevención activa basada en indicadores científicos",
      "Logística Eficiente — aplicación 100% virtual o híbrida con soporte presencial",
      "Confidencialidad Absoluta — cumplimiento estricto del secreto profesional psicólogo-paciente",
      "Flujo: Envío de links → Respuesta asistida → Firma especializada → Informe gerencial",
      "Acompañamiento en programas de vigilancia epidemiológica psicosocial (PVE)",
    ],
    videoSrc: "",
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
  setActiveMarca
}: StaticSectionsProps) {
  
  // Accordion drawer faq state
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // Redesigned services interactive states
  const [hoveredServiceId, setHoveredServiceId] = useState<number | null>(null);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceItem | null>(null);

  const [showContactForm, setShowContactForm] = useState(false);

  const welcomeCardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isWelcomeCardHovered, setIsWelcomeCardHovered] = useState(false);

  // Card 1: Software Vigía
  const cardVigiaRef = useRef<HTMLDivElement | null>(null);
  const [tiltVigia, setTiltVigia] = useState({ x: 0, y: 0 });
  const [isVigiaHovered, setIsVigiaHovered] = useState(false);

  // Card 2: Batería Psicosocial
  const cardBateriaRef = useRef<HTMLDivElement | null>(null);
  const [tiltBateria, setTiltBateria] = useState({ x: 0, y: 0 });
  const [isBateriaHovered, setIsBateriaHovered] = useState(false);

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

  const handleVigiaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsVigiaHovered(true);
    if (!cardVigiaRef.current) return;
    const rect = cardVigiaRef.current.getBoundingClientRect();
    setTiltVigia({
      y:  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 10,
      x: -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 10,
    });
  };

  const handleVigiaMouseLeave = () => {
    setIsVigiaHovered(false);
    setTiltVigia({ x: 0, y: 0 });
  };

  const handleBateriaMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsBateriaHovered(true);
    if (!cardBateriaRef.current) return;
    const rect = cardBateriaRef.current.getBoundingClientRect();
    setTiltBateria({
      y:  ((e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)) * 10,
      x: -((e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)) * 10,
    });
  };

  const handleBateriaMouseLeave = () => {
    setIsBateriaHovered(false);
    setTiltBateria({ x: 0, y: 0 });
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
  
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchProgress, setDispatchProgress] = useState(0);
  const [dispatchStepText, setDispatchStepText] = useState("");
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company || !formData.phone || !formData.email || !formData.serviceOfInterest) {
      alert("Por favor diligencie todos los campos obligatorios.");
      return;
    }

    playRetroChime("info");
    setIsDispatching(true);
    setDispatchProgress(0);
    setDispatchStepText("Conectando con servidores de Consalud...");

    // Simulated multi-stage medical pre-visor legal checks
    const stages = [
      { pct: 20, text: "Conectando con servidores de Consalud..." },
      { pct: 45, text: "Verificando disponibilidad de asesores..." },
      { pct: 70, text: "Registrando solicitud para asesores especializados..." },
      { pct: 90, text: "Generando matrícula oficial de radicado único..." },
      { pct: 100, text: "¡Solicitud registrada con éxito!" }
    ];

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
              const randomNum = Math.floor(100000 + Math.random() * 900000);
              setSuccessTicket(`CONSALUD-SST-${randomNum}`);
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

      {/* 1.5. SECCIÓN DEDICADA: QUIÉNES SOMOS & NUESTROS VALORES */}
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
            <h2 className="text-3.5xl sm:text-4.5xl md:text-[52px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-black tracking-tight text-slate-900 leading-tight mb-4">
              Expertos que simplifican la <span className="text-[#ff8d2b]">normativa SST</span>
            </h2>
            <p className="text-slate-600 font-sans text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl lg:max-w-4xl mx-auto font-medium">
              Desde 1998 en Bogotá, acompañamos a empresas colombianas con un modelo a la medida, equipo interdisciplinar, respaldo académico y cero improvisaciones.
            </p>
          </div>

          {/* Grid of 4 Flip Cards with hover effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 w-full mb-12">
            
            {/* Card 1: Responsabilidad */}
            <div className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer">
              <div 
                className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
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
                  <span className="text-[15px] font-mono text-white/50 tracking-wider mt-4">Pasa el cursor para ver ↑</span>
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
            <div className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer">
              <div 
                className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
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
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4">Pasa el cursor para ver ↑</span>
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
            <div className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer">
              <div 
                className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
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
                  <span className="text-[15px] font-mono text-slate-500 tracking-wider mt-4">Pasa el cursor para ver ↑</span>
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
            <div className="w-full h-[280px] xl:h-[310px] 2xl:h-[340px] group [perspective:1000px] cursor-pointer">
              <div 
                className="relative w-full h-full text-center transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
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
                  <span className="text-[15px] font-mono text-white/70 tracking-wider mt-4">Pasa el cursor para ver ↑</span>
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
                  <h2 className="text-3.5xl sm:text-4.5xl md:text-[52px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-black tracking-tight text-slate-900 mb-4 leading-none">
                    Nuestros <span className="text-[#ff8d2b]">Servicios</span>
                  </h2>
                  <p className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed max-w-2xl lg:max-w-4xl mx-auto font-sans font-medium">
                    Consalud ofrece soluciones metodológicas y jurídicas avanzadas para garantizar el blindaje legal, la seguridad industrial y el bienestar de su talento organizacional.
                  </p>
                </div>

                {/* Scroll-Driven Space-Action Radial Gallery of the 7 Services */}
                <div className="w-full mt-4">
                  <ServiceRadialGallery 
                    setActiveServiceModal={setActiveServiceModal} 
                    playRetroChime={playRetroChime as (type: string) => void} 
                  />
                </div>
              </div>
            </motion.section>
          );
        }

        return null;
      })}

      {/* 3. SECCIÓN PRODUCTOS DIGITALES (Premium SaaS product section) */}
      <motion.section 
        id="sec-landing-3" 
        className="relative w-full max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-6 md:px-14 lg:px-16 2xl:px-24 py-16 scroll-mt-20 overflow-hidden flex flex-col items-center justify-center text-center text-slate-900"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >

        {/* Content Wrapper layered over WebGL background */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 font-bold font-mono text-[11px] sm:text-xs tracking-[0.25em] px-5 py-2 rounded-full border border-blue-100 uppercase mb-6 cursor-default">
            💻 PRODUCTOS DIGITALES
          </div>
          <h2 className="text-3.5xl sm:text-4.5xl md:text-[52px] lg:text-[56px] xl:text-[64px] 2xl:text-[72px] font-black tracking-tight text-slate-900 mb-4 leading-none font-sans">
            Nuestros <span className="text-[#ff8d2b]">Productos Digitales</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xl lg:max-w-4xl mx-auto font-sans leading-relaxed mb-6 font-medium">
            Herramientas de software y plataformas SaaS diseñadas para optimizar, simplificar y automatizar el cumplimiento del sistema de gestión SST en tu empresa.
          </p>

        {/* Two gorgeous high-end 3D tilt cards side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto items-stretch justify-items-center mb-6">
          
          {/* Card 1: Software Vigía SST */}
          <motion.div
            key="vigia-card"
            ref={cardVigiaRef}
            onMouseEnter={() => setIsVigiaHovered(true)}
            onMouseMove={handleVigiaMouseMove}
            onMouseLeave={handleVigiaMouseLeave}
            onClick={() => {
              playRetroChime("click");
              setActiveMarca(0);
            }}
            style={{
              width: "100%",
              maxWidth: 410,
              minHeight: 520,
              position: "relative",
              cursor: "pointer",
              userSelect: "none",
              transform: `perspective(900px) rotateX(${tiltVigia.x}deg) rotateY(${tiltVigia.y}deg) scale(${isVigiaHovered ? 1.03 : 1})`,
              transition: isVigiaHovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
              transformStyle: "preserve-3d"
            }}
            className="flex flex-col relative"
          >
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              border: `1px solid ${isVigiaHovered ? "rgba(255, 141, 43, 0.45)" : "rgba(255, 141, 43, 0.2)"}`,
              background: isVigiaHovered ? "rgba(5, 18, 62, 0.93)" : "rgba(255, 255, 255, 1)",
              backdropFilter: isVigiaHovered ? "blur(8px)" : undefined,
              boxShadow: isVigiaHovered 
                ? "0 12px 45px rgba(255, 141, 43, 0.25), 0 6px 30px rgba(0,0,0,0.4)" 
                : "0 10px 30px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "40px 28px 32px 28px",
              overflow: "hidden",
              transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
            }}>
              {/* Glow blob */}
              <div style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                background: "radial-gradient(circle, rgba(239, 124, 16, 0.25), transparent 70%)",
                borderRadius: "50%",
                filter: "blur(20px)",
                pointerEvents: "none",
                opacity: isVigiaHovered ? 1 : 0,
                transition: "opacity 0.4s",
              }} />

              {/* Top Badge */}
              <div 
                style={{ 
                  color: isVigiaHovered ? "#ff8d2b" : "#e06b00", 
                  borderColor: isVigiaHovered ? "rgba(255, 141, 43, 0.3)" : "rgba(224, 107, 0, 0.4)" 
                }}
                className={`absolute top-5 left-5 text-[8px] font-black tracking-[0.2em] uppercase border rounded px-2.5 py-1 z-10 select-none transition-colors duration-300 ${isVigiaHovered ? "bg-slate-950/40" : "bg-[#ff8d2b]/10"}`}
              >
                EL FUTURO DE LA PREVENCIÓN EN COLOMBIA
              </div>

              {/* Logo icon with spin on hover */}
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="flex items-center justify-center transition-all duration-300 w-full"
              >
                <img 
                  src={isVigiaHovered ? vigiaWhiteLogo : vigiaColorLogo} 
                  alt="VIGIA" 
                  className="h-16 md:h-20 w-auto object-contain transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Slogan & Phrase */}
              <div style={{ transform: "translateZ(30px)" }} className="text-center relative z-10 max-w-[340px]">
                <h3 className={`text-base sm:text-lg font-extrabold tracking-tight leading-snug transition-colors duration-300 ${isVigiaHovered ? "text-[#ff8d2b]" : "text-[#e06b00]"}`}>
                  Seguridad Predictiva en Tiempo Real
                </h3>
                <div className={`w-12 h-[2px] opacity-40 rounded-full mx-auto my-2.5 transition-colors duration-300 ${isVigiaHovered ? "bg-[#ff8d2b]" : "bg-[#e06b00]"}`} />
                <p className={`text-xs sm:text-sm leading-relaxed font-sans font-medium transition-colors duration-300 ${isVigiaHovered ? "text-slate-300" : "text-slate-800"}`}>
                 Vigía alerta antes del inicidente. Cámaras con inteligencia artificial colombiana e ingeniería Alemana todo trabajando para que ningún trabajador salga lastimado por algo que se pudo ver venir.
                </p>
              </div>

              {/* Bottom footer metadata indicators */}
              <div style={{ transform: "translateZ(40px)" }} className={`relative z-10 flex flex-col items-center gap-1.5 w-full text-center mt-2 border-t pt-3 transition-colors duration-300 ${isVigiaHovered ? "border-white/5" : "border-slate-200"}`}>
                <p className={`text-[9px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${isVigiaHovered ? "text-slate-400" : "text-slate-500 font-extrabold"}`}>
                 seguridad Predectiva en Tiempo Real
                </p>
                <p className={`text-[11px] font-black tracking-wide transition-colors duration-300 ${isVigiaHovered ? "text-white" : "text-[#0a1f5f]"}`}>
                  COLOMBIA <span className={isVigiaHovered ? "text-[#ff8d2b]" : "text-[#e06b00]"}>𝓍</span> ALEMANIA
                </p>

                <span className={`inline-flex items-center gap-1.5 mt-3 py-1.5 px-5 rounded-full font-sans text-[10px] font-black tracking-wider transition-all duration-300 shadow-md ${isVigiaHovered ? "text-white border border-[#ff8d2b]/20 bg-[#ff8d2b]/10 hover:bg-[#ff8d2b]" : "text-white bg-[#e06b00] border border-[#e06b00]/30 hover:bg-[#c85f00]"}`}>
                  VER DETALLES →
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Batería Psicosocial Digital */}
          <motion.div
            key="bateria-card"
            ref={cardBateriaRef}
            onMouseEnter={() => setIsBateriaHovered(true)}
            onMouseMove={handleBateriaMouseMove}
            onMouseLeave={handleBateriaMouseLeave}
            onClick={() => {
              playRetroChime("click");
              setActiveMarca(1);
            }}
            style={{
              width: "100%",
              maxWidth: 410,
              minHeight: 520,
              position: "relative",
              cursor: "pointer",
              userSelect: "none",
              transform: `perspective(900px) rotateX(${tiltBateria.x}deg) rotateY(${tiltBateria.y}deg) scale(${isBateriaHovered ? 1.03 : 1})`,
              transition: isBateriaHovered ? "transform 0.08s linear" : "transform 0.45s cubic-bezier(0.23,1,0.32,1)",
              transformStyle: "preserve-3d"
            }}
            className="flex flex-col relative"
          >
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              border: `1px solid ${isBateriaHovered ? "rgba(34, 197, 94, 0.45)" : "rgba(34, 197, 94, 0.2)"}`,
              background: isBateriaHovered ? "rgba(255, 255, 255, 1)" : "rgba(5, 18, 62, 0.93)",
              backdropFilter: isBateriaHovered ? "blur(8px)" : undefined,
              boxShadow: isBateriaHovered 
                ? "0 12px 45px rgba(34, 197, 94, 0.25), 0 6px 30px rgba(0,0,0,0.4)" 
                : "0 6px 30px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "40px 28px 32px 28px",
              overflow: "hidden",
              transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",
            }}>
              {/* Glow blob */}
              <div style={{
                position: "absolute",
                top: -40,
                right: -40,
                width: 140,
                height: 140,
                background: "radial-gradient(circle, rgba(34, 197, 94, 0.25), transparent 70%)",
                borderRadius: "50%",
                filter: "blur(20px)",
                pointerEvents: "none",
                opacity: isBateriaHovered ? 1 : 0,
                transition: "opacity 0.4s",
              }} />

              {/* Top Badge */}
              <div 
                style={{ 
                  color: isBateriaHovered ? "#15803d" : "#22c55e", 
                  borderColor: isBateriaHovered ? "rgba(21, 128, 61, 0.4)" : "rgba(34, 197, 94, 0.3)" 
                }}
                className={`absolute top-5 left-5 text-[8px] font-black tracking-[0.2em] uppercase border rounded px-2.5 py-1 z-10 select-none transition-colors duration-300 ${isBateriaHovered ? "bg-green-500/10" : "bg-slate-950/40"}`}
              >
                EVALUACIÓN DE RIESGO DE LEY
              </div>

              {/* Logo icon with spin on hover */}
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="flex items-center justify-center transition-all duration-300 w-full"
              >
                <img 
                  src={bateriaSinFondo} 
                  alt="BATERIA" 
                  className="h-16 md:h-20 w-auto object-contain transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Slogan & Phrase */}
              <div style={{ transform: "translateZ(30px)" }} className="text-center relative z-10 max-w-[340px]">
                <h3 className={`text-base sm:text-lg font-extrabold tracking-tight leading-snug transition-colors duration-300 ${isBateriaHovered ? "text-[#15803d]" : "text-[#22c55e]"}`}>
                  Cuidar a tu equipo es hacer crecer tu empresa
                </h3>
                <div className={`w-12 h-[2px] opacity-40 rounded-full mx-auto my-2.5 transition-colors duration-300 ${isBateriaHovered ? "bg-[#15803d]" : "bg-[#22c55e]"}`} />
                <p className={`text-xs sm:text-sm leading-relaxed font-sans font-medium transition-colors duration-300 ${isBateriaHovered ? "text-slate-800" : "text-slate-300"}`}>
                  La Batería de Riesgo Psicosocial permite identificar, medir y prevenir factores que pueden afectar la salud mental, el bienestar y el desempeño de los trabajadores.
                </p>
              </div>

              {/* Bottom footer metadata indicators */}
              <div style={{ transform: "translateZ(40px)" }} className={`relative z-10 flex flex-col items-center gap-1.5 w-full text-center mt-2 border-t pt-3 transition-colors duration-300 ${isBateriaHovered ? "border-slate-200" : "border-white/5"}`}>
                <p className={`text-[9px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${isBateriaHovered ? "text-slate-500 font-extrabold" : "text-slate-400"}`}>
                  identificar, medir y prevenir
                </p>
                <p className={`text-[11px] font-black tracking-wide transition-colors duration-300 ${isBateriaHovered ? "text-[#0a1f5f]" : "text-white"}`}>
                  RESOLUCIÓN <span className={isBateriaHovered ? "text-[#15803d]" : "text-[#22c55e]"}>2404</span> DE 2019
                </p>

                <span className={`inline-flex items-center gap-1.5 mt-3 py-1.5 px-5 rounded-full font-sans text-[10px] font-black tracking-wider transition-all duration-300 shadow-md ${isBateriaHovered ? "text-white bg-[#15803d] border border-[#15803d]/30 hover:bg-[#166534]" : "text-white border border-[#22c55e]/20 bg-[#22c55e]/10 hover:bg-[#22c55e]"}`}>
                  VER DETALLES →
                </span>
              </div>
            </div>
          </motion.div>

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
              <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-[#ff8d2b] font-bold font-mono text-[11px] sm:text-xs tracking-[0.25em] px-5 py-2 rounded-full border border-[#ff8d2b]/15 uppercase mb-6 cursor-default">
                💬 CANAL DE AYUDA DIRECTA
              </div>
              <h3 className="text-2.5xl sm:text-3.5xl md:text-[38px] lg:text-[42px] xl:text-[46px] 2xl:text-[52px] font-black tracking-tight text-slate-900 leading-tight">
                ¿Tienes dudas sobre <span className="text-[#ff8d2b]">Nosotros?</span>
              </h3>
              <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-600 leading-relaxed font-sans font-medium max-w-lg lg:max-w-xl">
                La normatividad de salud puede ser compleja. Respaldamos tu derecho con respuestas directas y claras basadas en jurisprudencias de la Superintendencia de Salud.
              </p>
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
                        <span className={`text-xs sm:text-[14px] lg:text-[15px] xl:text-[16px] font-bold tracking-wide leading-snug ${
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
                          <div className="px-4 pb-4 pt-1 pl-[36px] text-xs sm:text-[13px] lg:text-[14px] xl:text-[15px] text-slate-500 leading-relaxed select-text font-sans font-medium border-t border-slate-100">
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
                        fontWeight: 700,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "#ff8d2b",
                        margin: "0 0 10px"
                      }}>
                        Trabajemos juntos
                      </p>
                      <h3 style={{
                        fontSize: 26,
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
                          required
                          className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:border-[#ff8d2b] focus:ring-1 focus:ring-[#ff8d2b]/20 focus:outline-none transition"
                        />
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
                            required
                            className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:border-[#ff8d2b] focus:ring-1 focus:ring-[#ff8d2b]/20 focus:outline-none transition"
                          />
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
                            placeholder="Ej. +57 321 456 7890"
                            required
                            className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-slate-800 focus:bg-white focus:border-[#ff8d2b] focus:ring-1 focus:ring-[#ff8d2b]/20 focus:outline-none transition"
                          />
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
                          required
                          className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg text-[#05123e] focus:bg-white focus:border-[#ff8d2b] focus:ring-1 focus:ring-[#ff8d2b]/20 focus:outline-none transition"
                        />
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
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.45 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden pointer-events-auto"
            >
              {/* Colored accent header bar depending on colorType */}
              <div className={`h-2.5 w-full ${
                activeServiceModal.colorType === 'darkBlue' ? 'bg-[#05123e]' :
                activeServiceModal.colorType === 'orange' ? 'bg-[#ff8d2b]' :
                activeServiceModal.colorType === 'cream' ? 'bg-[#e2dfc9]' :
                'bg-gradient-to-r from-[#05123e] to-[#ff8d2b]'
              }`} />

              <div className="p-6 sm:p-8 space-y-6">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 pr-6">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff8d2b] uppercase">
                      {activeServiceModal.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-[#05123e] tracking-tight leading-tight">
                      {activeServiceModal.title}
                    </h3>
                  </div>

                  {/* Icon badge floating */}
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-200 text-[#05123e] shrink-0 shadow-sm">
                    {renderServiceIcon(activeServiceModal.id)}
                  </div>
                </div>

                {/* Extended Details Body */}
                <div className="space-y-4">
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans select-text whitespace-pre-wrap font-medium">
                    {activeServiceModal.longDesc}
                  </p>
                </div>

                {/* Key Benefits grid list */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-black mb-3">
                    Beneficios y especificaciones clave:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeServiceModal.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="font-sans font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions banner */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <button
                    onClick={() => handleServiceCta(activeServiceModal.title)}
                    className="flex-1 py-3 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-white bg-[#05123e] hover:bg-[#ff8d2b] hover:shadow-lg hover:shadow-orange-500/10 active:scale-[0.98] transition cursor-pointer text-center select-none"
                  >
                    {activeServiceModal.actionLabel} →
                  </button>

                  <button
                    onClick={() => setActiveServiceModal(null)}
                    className="py-3 px-5 border border-slate-200 rounded-xl font-sans text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:scale-[0.98] transition cursor-pointer text-center select-none"
                  >
                    Cerrar catálogo
                  </button>
                </div>
              </div>

              {/* Float Close trigger */}
              <button 
                onClick={() => setActiveServiceModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto pointer-events-auto"
              onClick={() => setActiveMarca(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
                style={{
                  width: "min(900px, 92vw)",
                  maxHeight: "90vh",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: `1px solid ${marca.accent}33`,
                  boxShadow: `0 24px 80px rgba(0,0,0,0.7), 0 0 60px ${marca.accent}15`,
                }}
                className="grid grid-cols-1 md:grid-cols-5 bg-slate-900 border"
                onClick={e => e.stopPropagation()}
              >
                {/* LEFT PANEL */}
                <div className="md:col-span-2 bg-slate-950 border-r border-slate-800 p-8 flex flex-col items-center justify-center relative min-h-[300px]">
                  {/* Badge */}
                  <div 
                    style={{ color: marca.accent, borderColor: `${marca.accent}44` }}
                    className="absolute top-5 left-5 text-[8px] font-black tracking-[0.2em] uppercase border rounded px-2.5 py-1"
                  >
                    {marca.badge ?? "TECNOLOGÍA SST"}
                  </div>

                  {/* Cerrar mobile/desktop button */}
                  <button
                    className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg p-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs z-30"
                    onClick={() => setActiveMarca(null)}
                  >
                    ✕
                  </button>

                  <div className="text-center relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6">
                    {isVigia ? (
                      <div className="w-44 h-44 md:w-56 md:h-56 flex items-center justify-center transition-transform duration-500 hover:scale-105">
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
                <div className="md:col-span-3 bg-slate-900/98 p-6 md:p-8 overflow-y-auto max-h-[90vh] md:max-h-[640px] flex flex-col gap-5 text-left select-text">
                  <p style={{ color: marca.accent }} className="text-[9px] font-black tracking-[0.18em] uppercase m-0 leading-none">
                    SOFTWARE SST AUTORIZADO
                  </p>

                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight m-0 mb-1">
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
                    <p className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mb-1.5 font-mono">
                      VISIÓN Y PROPÓSITO
                    </p>
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans m-0 font-medium">
                      {marca.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div>
                    <p className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mb-3 font-mono">
                      CARACTERÍSTICAS CLAVE
                    </p>
                    <div className="grid grid-cols-1 hover:grid-cols-1 gap-2.5">
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
                    <p className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mb-2.5 font-mono">
                      MÓDULOS & CAPACIDADES ADICIONALES
                    </p>
                    <div className="flex flex-col gap-2">
                      {marca.extras.map((ex, exIdx) => (
                        <div key={exIdx} className="flex items-center gap-2">
                          <span className="text-[10px]" style={{ color: marca.accent }}>◆</span>
                          <span className="text-sm text-slate-200 font-sans font-medium">{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video demo */}
                  {isVigia && marca.videoSrc && (
                    <div>
                      <p className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mb-2.5 font-mono">
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
                    <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase mb-2.5 font-mono">
                      PLATAFORMA EN ACCIÓN
                    </p>
                    <div className="grid grid-cols-2 gap-3.5 select-none">
                      {isVigia ? (
                        <>
                          <div
                            onClick={() => { 
                              setExpandedImage(vigiaDashboard); 
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
                            <img src={vigiaDashboard} alt="Dashboard Predictivo de Vigía SST" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                                TELEMETRÍA SST
                              </span>
                              <p className="text-[10px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Módulo Predictivo</p>
                            </div>
                          </div>

                          <div
                            onClick={() => { 
                              setExpandedImage(vigiaWorker); 
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
                            <img src={vigiaWorker} alt="Vigilancia de Salud Industrial Vigía" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
                            <div className="absolute bottom-2 left-2.5 right-2 text-left z-20">
                              <span className="text-[7px] font-mono tracking-widest text-[#ff8d2b] uppercase font-bold bg-black/75 px-1.5 py-0.5 rounded border border-[#ff8d2b]/20">
                                BIOMETRÍA RÁPIDA
                              </span>
                              <p className="text-[10px] font-sans font-bold text-slate-100 mt-0.5 leading-tight">Monitoreo de Bienestar</p>
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
                              setExpandedImage(vigiaDashboard); 
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
                            <img src={vigiaDashboard} alt="Resumen Gerencial del Ecosistema" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.12]" />
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
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 font-sans tracking-wide">
                        ¿Interesado en una implementación piloto?
                      </p>
                    </div>
                    <button
                      style={{ borderColor: marca.accent, color: marca.accent }}
                      className="py-2 px-5 rounded-full font-sans text-xs font-extrabold uppercase hover:bg-white/5 transition-all text-center border font-mono select-none"
                      onClick={() => {
                        setActiveMarca(null);
                        // Open contact form preselected with this product
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
                  <h4 className="text-sm font-bold text-white mt-1 font-sans">{expandedImageTitle}</h4>
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
