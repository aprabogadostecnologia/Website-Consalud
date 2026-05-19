"use client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { label: "Inicio",    fraction: 0.00 },
  { label: "Nosotros",  fraction: 0.22 },
  { label: "Servicios", fraction: 0.48 },
  { label: "Marcas",    fraction: 0.73 },
  { label: "Contacto",  fraction: 0.95 },
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
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo(0)}
          className="bg-transparent border-none cursor-pointer flex items-center"
        >
          <img src="/Consalud.png" alt="Consalud" className="h-9 w-auto"
            width={40}
            height={40}
          />
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollTo(item.fraction)}
                className="text-sm text-white/60 hover:text-[#ff8d2b] transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
