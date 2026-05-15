"use client";

import { useState, useEffect } from "react";

// scrollFraction: 0–1 of total page scroll distance
const NAV_ITEMS = [
  { label: "Inicio",    scrollFraction: 0 },
  { label: "Nosotros",  scrollFraction: 0.30 },
  { label: "Servicios", scrollFraction: 0.58 },
  { label: "Contacto",  scrollFraction: 0.85 },
];

function scrollTo(fraction: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: fraction * max, behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#05123e]/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo(0)}
          className="text-xl font-bold tracking-tight text-[#ff8d2b] bg-transparent border-none cursor-pointer"
        >
          Consalud
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollTo(item.scrollFraction)}
                className="text-sm text-white/70 hover:text-[#ff8d2b] transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => scrollTo(0.85)}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-[#ff8d2b] hover:bg-[#e87a20] text-[#05123e] transition-colors duration-200 cursor-pointer border-none"
        >
          Comenzar
        </button>
      </nav>
    </header>
  );
}
