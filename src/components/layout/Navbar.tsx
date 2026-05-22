"use client";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const NAV_ITEMS = [
  { label: "Inicio",    fraction: 0.00 },
  { label: "Nosotros",  fraction: 0.22 },
  { label: "Servicios", fraction: 0.23 },
  { label: "Marcas",    fraction: 0.84 },
  { label: "Contacto",  fraction: 0.95 },
];

const BANDS = [0, 0.10, 0.22, 0.82, 0.90, 1.00];

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
  function openVigia() {
    scrollTo(0.84);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("openVigia"));
    }, 650);
  }

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
            className="h-14 w-auto"
            width={48}
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

        {/* Vigía direct-access button */}
        <button
          onClick={openVigia}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[9px] uppercase font-bold tracking-wider border transition-all duration-300 cursor-pointer bg-white/[0.03] hover:bg-[#ff8d2b]/15 border-[#ff8d2b]/30 text-[#ff8d2b] hover:text-white hover:border-[#ff8d2b]"
          title="Ir directo a Vigía"
        >
          🤝 VIGÍA
        </button>

      </nav>
    </header>
  );
}
