import React from "react";
import { Globe, Shield, FileText, ShieldCheck, Phone, MapPin, Mail, MessageCircle } from "lucide-react";
// @ts-ignore
import consaludWhiteLogo from "../assets/images/conSaludWhite.png";

interface FooterProps {
  jumpToLandingSection: (targetId: string, idx: number) => void;
  playRetroChime: (type: "nav" | "click" | "info" | "transition") => void;
  whatsappUrl: string;
}

export default function Footer({ jumpToLandingSection, playRetroChime, whatsappUrl }: FooterProps) {
  return (
    <footer className="w-full relative z-30 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-white/15 pt-16 pb-12 px-6 md:px-14 cursor-default select-none">

      {/* Subtle decorative glowing neon strip top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff8d2b] to-transparent opacity-90" />

      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-white/10 p-1 lg:items-stretch">

          {/* Column 1: Brand & Status */}
          <div className="flex flex-col justify-start gap-5 lg:col-span-2">
            <div className="flex items-center gap-3">
              <img
                src={consaludWhiteLogo}
                alt="Consalud Logo"
                className="h-40 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(255,141,43,0.3)]"
              />
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed font-semibold max-w-xs">
              Alineamos el cumplimiento de la normatividad con tecnología predictiva.<br />
              <span className="text-[#ff8d2b] font-black tracking-wide">Respaldo metodológico, legal y psicológico para la excelencia organizacional.</span>
            </p>
          </div>

          {/* Column 2: Ecosistema Digital (Interactive Links) */}
          <div className="flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-100 font-mono flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#ff8d2b]" />
              Ecosistema Digital
            </h5>
            <ul className="space-y-3.5 text-xs text-slate-200 font-sans">
              <li>
                <button
                  onClick={() => jumpToLandingSection("sec-landing-2", 2)}
                  className="text-slate-200 hover:text-[#ff8d2b] active:text-[#ff8d2b] transition-colors duration-200 cursor-pointer text-left flex items-center gap-1.5 group font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b]/60 group-hover:bg-[#ff8d2b] transition-colors" />
                  Plataforma Vigía SST
                </button>
              </li>
              <li>
                <button
                  onClick={() => jumpToLandingSection("sec-landing-1", 1)}
                  className="text-slate-200 hover:text-[#ff8d2b] active:text-[#ff8d2b] transition-colors duration-200 cursor-pointer text-left flex items-center gap-1.5 group font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b]/60 group-hover:bg-[#ff8d2b] transition-colors" />
                  Quiénes Somos & Valores
                </button>
              </li>
              <li>
                <button
                  onClick={() => jumpToLandingSection("sec-landing-2", 2)}
                  className="text-slate-200 hover:text-[#ff8d2b] active:text-[#ff8d2b] transition-colors duration-200 cursor-pointer text-left flex items-center gap-1.5 group font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b]/60 group-hover:bg-[#ff8d2b] transition-colors" />
                  Asesoría SG-SST Especializada
                </button>
              </li>
              <li>
                <button
                  onClick={() => jumpToLandingSection("sec-landing-4", 4)}
                  className="text-slate-200 hover:text-[#ff8d2b] active:text-[#ff8d2b] transition-colors duration-200 cursor-pointer text-left flex items-center gap-1.5 group font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff8d2b]/60 group-hover:bg-[#ff8d2b] transition-colors" />
                  Preguntas Frecuentes FAQ
                </button>
              </li>
            </ul>
          </div>


          {/* Column 4: Canales Directos */}
          <div className="flex flex-col gap-4">
            <h5 className="text-xs font-bold uppercase tracking-widest text-slate-100 font-mono flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#ff8d2b]" />
              Enlace Directo
            </h5>

            <ul className="space-y-3.5 text-xs text-slate-200 font-sans">
              <li className="flex items-start gap-2 text-slate-200 leading-relaxed font-medium">
                <MapPin className="w-4 h-4 text-[#ff8d2b] shrink-0 mt-0.5" />
                <span>Oficinas Central: Ak 15 #88-66</span>
              </li>
              <li className="flex items-start gap-2 text-slate-200 leading-relaxed font-medium">
                <Phone className="w-4 h-4 text-[#ff8d2b] shrink-0 mt-0.5" />
                <span>+57 305 788 3941</span>
              </li>
              <li className="flex items-center gap-2 text-slate-200 font-medium">
                <Mail className="w-4 h-4 text-[#ff8d2b] shrink-0" />
                <a href="mailto:contacto@consultoresempresariales.com.co" className="text-slate-100 hover:text-[#ff8d2b] transition-colors font-semibold underline decoration-dotted decoration-white/30 hover:decoration-[#ff8d2b]/80">
                  Contacto@consultoresempresariales.com.co
                </a>
              </li>
            </ul>

            <div className="mt-auto pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playRetroChime("click")}
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-[11px] font-mono tracking-wider font-extrabold uppercase rounded-lg shadow-lg shadow-emerald-950/30 transition-all duration-300 border border-emerald-500/40"
              >
                <MessageCircle className="w-4 h-4" />
                Atención WhatsApp 24/7
              </a>
            </div>
          </div>

        </div>

        {/* Underfoot / Copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 font-mono text-[10px] text-slate-300 font-medium text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span>© 2026 CONSALUD COLOMBIA TODOS LOS DERECHOS RESERVADOS.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
