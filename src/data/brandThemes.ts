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
