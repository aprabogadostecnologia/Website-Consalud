import React from "react";
import {
  Shield, Users, AlertTriangle, Leaf, BookOpen, Scale, CheckSquare,
  Heart, Eye, Award, Zap,
} from "lucide-react";

// ── Valores ───────────────────────────────────────────────────────────────────
export const VALORES = [
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
    accent: " #05123e ",
  },
  {
    name:   "Experiencia",
    icon:   Award,
    desc:   "Contamos con un equipo de trabajo multidisciplinar con gran trayectoria en diferentes sectores económicos que permiten tener una visión acertada a las necesidades de nuestros clientes.",
    accent: "linear-gradient(90deg, #05123e, #ff8d2b)",
  },
  {
    name:   "Adaptabilidad",
    icon:   Zap,
    desc:   "Tenemos la capacidad de responder adecuada y oportunamente a las exigencias del entorno y de nuestros clientes, generando soluciones específicas para cada uno.",
    accent: " #0546f2",
  },
];

// ── Servicios ─────────────────────────────────────────────────────────────────
export const SERVICIOS = [
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
    accent:  " #0546f2",
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
    accent:  " #0546f2",
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
    accent:  " #0546f2",
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

// ── Marca type & data ─────────────────────────────────────────────────────────
export type Marca = {
  name: string;
  fullName?: string;
  logo: string;
  accent: string;
  badge?: string;
  tagline: string;
  phrase?: string;
  role?: string;
  description: string;
  features: { icon: React.ReactNode; title: string; desc: string }[];
  extras: string[];
  status?: string;
  videoSrc?: string;
};

export const MARCAS: Marca[] = [
  {
    name: "",
    fullName: "Vigía Salud Inteligente",
    logo: "/vigiaWhite.png",
    accent: "#ff8d2b",
    badge: "PLATAFORMA TECNOLÓGICA SST",
    tagline: "Con inteligencia artificial",
    phrase: "Plataforma inteligente de vigilancia epidemiológica y prevención de riesgos para salvaguardar tu bienestar integral.",
    role: "MONITOREO PREDICTIVO & SST",
    description: "Plataforma inteligente de vigilancia laboral mediante IA, cámaras y sensores para detectar riesgos en tiempo real, notificar y generar planes de acción correctivos.",
    features: [
      { icon: <Shield size={16} />, title: "Detección de EPP", desc: "Identifica 6 EPP: cascos, guantes, gafas, tapaoídos, tapabocas y chalecos reflectivos." },
      { icon: <AlertTriangle size={16} />, title: "Control de Distracciones", desc: "Detecta teléfonos en manos del personal y genera alertas visuales inmediatas." },
      { icon: <Eye size={16} />, title: "Seguimiento Ocular 3D", desc: "Determina si un trabajador opera maquinaria mientras usa su celular." },
      { icon: <Zap size={16} />, title: "Alertas en Tiempo Real", desc: "Notificaciones por email con captura de la infracción y app exclusiva del cliente." },
    ],
    extras: [
      "Conteo de producción en tiempo real",
      "Análisis de ergonomía y postura",
      "Detección de emergencias y accidentes",
    ],
    status: "Activa & Disponible",
    videoSrc: "/Video%20Project.mp4",
  },
];

// ── Contacto ──────────────────────────────────────────────────────────────────
export const CONTACTO_INFO = [
  { label: "Email",     value: "direccion@consalud.com.co" },
  { label: "Numero",    value: "311 265 2715 · 324 209 7512" },
  { label: "Dirección", value: "Calle 92 # 16 - 30, Bogotá" },
];

// ── Scroll bands ──────────────────────────────────────────────────────────────
export const PAGE_BANDS = [0, 0.10, 0.22, 0.82, 0.90, 1.00];

export const SECTIONS = [
  { num: "01", label: "Inicio" },
  { num: "02", label: "Nosotros" },
  { num: "03", label: "Servicios" },
  { num: "04", label: "Marcas" },
  { num: "05", label: "Contacto y formulario" },
];
