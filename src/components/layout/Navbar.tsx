"use client";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const NAV_ITEMS = [
  { label: "Inicio",    fraction: 0.00 },
  { label: "Nosotros",  fraction: 0.22 },
  { label: "Servicios", fraction: 0.23 },
  { label: "Marcas",    fraction: 0.73 },
  { label: "Contacto",  fraction: 0.95 },
];

// Band boundaries matching PAGE_BANDS in HeroPage
const BANDS = [0, 0.10, 0.22, 0.78, 0.88, 1.00];

function getActiveIndex(p: number): number {
  for (let i = BANDS.length - 2; i >= 0; i--) {
    if (p >= BANDS[i]) return i;
  }
  return 0;
}

function scrollTo(fraction: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: fraction * max, behavior: "smooth" });
}

export default function Navbar() {
  const p = useScrollProgress();
  const activeIdx = getActiveIndex(p);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 navbar-glass transition-all duration-300">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo(0)}
          className="bg-transparent border-none cursor-pointer flex items-center"
        >
        <img 
            src="/conSaludWhite.png" 
            alt="Consalud" 
            className="h-14 w-auto" // Controla el tamaño aquí
            width={48}              // Mantén estos solo como sugerencia de aspecto/carga
            height={48} 
/>
        </button>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.label}>
              <button
                onClick={() => scrollTo(item.fraction)}
                className="relative text-sm bg-transparent border-none cursor-pointer pb-1 transition-colors duration-200"
                style={{ color: activeIdx === i ? "#ff8d2b" : "rgba(255,255,255,0.6)" }}
              >
                {item.label}
                <span
                  className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300"
                  style={{
                    width:      activeIdx === i ? "100%" : "0%",
                    background: "#f5f3e6",
                  }}
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
