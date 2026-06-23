import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SERVICES_DATA, renderServiceIcon, getServiceColors, ServiceItem } from "./StaticSections";

interface ServiceRadialGalleryProps {
  setActiveServiceModal: (service: ServiceItem) => void;
  playRetroChime: (type: string) => void;
}

export default function ServiceRadialGallery({ setActiveServiceModal, playRetroChime }: ServiceRadialGalleryProps) {
  const REAL_COUNT = SERVICES_DATA.length;
  // Circular buffer: [lastClone, ...real services, firstClone] so a card is always
  // peeking on both sides of the active one, and the carousel can loop endlessly.
  // Computed inside the component (not at module scope) because StaticSections.tsx
  // and this file import each other, so SERVICES_DATA isn't guaranteed to be
  // initialized yet when this module first evaluates.
  const LOOP_DATA: ServiceItem[] = [
    SERVICES_DATA[REAL_COUNT - 1],
    ...SERVICES_DATA,
    SERVICES_DATA[0],
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveredServiceId, setHoveredServiceId] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const cardWidth = isMobile ? 290 : 380;
  const gap = 24; // gap-6
  const step = cardWidth + gap;

  // Start on the first real card (loop index 1), with the cloned last card already peeking on the left.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft = step;
    setScrollLeft(step);
  }, [step]);

  const activeIndex = Math.round(scrollLeft / step); // index within LOOP_DATA
  const realIndex = ((activeIndex - 1) % REAL_COUNT + REAL_COUNT) % REAL_COUNT;

  const scrollToLoopIndex = (index: number, playSound = true) => {
    if (!scrollRef.current) return;
    if (playSound) {
      playRetroChime("hover");
    }
    scrollRef.current.scrollTo({
      left: index * step,
      behavior: "smooth"
    });
  };

  // Automatic carousel cycling: maintains the main card centered, then smoothly transitions to the next
  useEffect(() => {
    if (isPaused || hoveredServiceId !== null) return;

    const interval = setInterval(() => {
      scrollToLoopIndex(activeIndex + 1, false); // false to avoid triggering hover chimes on auto-cycle
    }, 2000); // 2000ms loop provides ~1.2 seconds static and ~0.8 seconds smooth transition

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, hoveredServiceId, step]);

  // Once a scroll (manual or automatic) settles on one of the cloned edge cards, snap invisibly
  // to the matching real card so the loop continues seamlessly in either direction.
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const left = e.currentTarget.scrollLeft;
    setScrollLeft(left);

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      const el = scrollRef.current;
      if (!el) return;
      const settledIndex = Math.round(el.scrollLeft / step);
      if (settledIndex <= 0) {
        el.scrollLeft = REAL_COUNT * step;
        setScrollLeft(REAL_COUNT * step);
      } else if (settledIndex >= REAL_COUNT + 1) {
        el.scrollLeft = step;
        setScrollLeft(step);
      }
    }, 250);
  };

  const handlePrev = () => scrollToLoopIndex(activeIndex - 1);
  const handleNext = () => scrollToLoopIndex(activeIndex + 1);

  return (
    <div
      className="w-full flex flex-col items-center select-none relative overflow-visible px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Outer wrapper with 3D context */}
      <div className="w-full relative py-6 overflow-visible" style={{ perspective: "1200px" }}>

        {/* Horizontal scroll container with snaps */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-none py-14 relative overflow-y-visible"
          style={{
            paddingLeft: `calc(50% - ${cardWidth / 2}px)`,
            paddingRight: `calc(50% - ${cardWidth / 2}px)`,
            scrollBehavior: "smooth"
          }}
        >
          {LOOP_DATA.map((service, index) => {
            const targetScroll = index * step;
            const diff = scrollLeft - targetScroll;
            const maxDistance = step * 1.8;
            const pct = Math.max(-1, Math.min(1, diff / maxDistance));

            // Radial transformations
            const scale = 1 - Math.abs(pct) * 0.07;
            const rotationY = -pct * 12; // Rotate less to keep them flatter and easier to read
            const translateZ = -Math.abs(pct) * 60; // Keep them closer to the front plane
            const rotationZ = -pct * 2;
            const blur = Math.max(0, Math.abs(pct) * 0.5); // Very soft blur for better visibility of background cards
            const grayscale = Math.abs(pct) * 25; // Soft grayscale to show colors slightly
            const opacity = 1 - Math.abs(pct) * 0.2; // Brighter layout (up to 80% clear instead of 50%)

            const isHovered = hoveredServiceId === service.id;
            const colors = getServiceColors(service.colorType, isHovered);

            return (
              <motion.div
                key={`${service.id}-${index}`}
                onMouseEnter={() => setHoveredServiceId(service.id)}
                onMouseLeave={() => setHoveredServiceId(null)}
                onClick={() => {
                  if (activeIndex !== index) {
                    scrollToLoopIndex(index);
                  } else {
                    playRetroChime("click");
                    setActiveServiceModal(service);
                  }
                }}
                className={`snap-center shrink-0 group relative p-7 rounded-2xl overflow-hidden isolate border transition-all duration-300 cursor-pointer flex flex-col justify-between ${colors.bg} ${colors.border} ${colors.glow}`}
                style={{
                  width: cardWidth,
                  minHeight: isMobile ? 385 : 430,
                  transform: `rotateY(${rotationY}deg) translateZ(${translateZ}px) rotateZ(${rotationZ}deg) scale(${scale})`,
                  filter: `blur(${blur}px) grayscale(${grayscale}%)`,
                  opacity: opacity,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  WebkitMaskImage: "-webkit-radial-gradient(white, black)"
                }}
              >
                {/* Visual indicator for active center card */}
                {activeIndex === index && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-orange-500/20 pointer-events-none animate-pulse" />
                )}

                <div className="space-y-6" style={{ transform: "translateZ(20px)" }}>
                  {/* Card head meta row */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md border ${colors.badge}`}>
                      {service.badge}
                    </span>
                    <span className={`text-[11px] font-mono font-bold ${service.colorType === 'cream' ? 'text-slate-500' : 'text-white/40'}`}>
                      SRV-0{service.id}
                    </span>
                  </div>

                  {/* Icon wrapper */}
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 ${colors.iconWrapper} ${
                    isHovered ? "scale-110 rotate-3" : ""
                  }`}>
                    {renderServiceIcon(service.id)}
                  </div>

                  {/* Text Container */}
                  <div className="space-y-3">
                    <h3 className={`text-xl font-extrabold tracking-tight leading-snug ${colors.text}`}>
                      {service.title}
                    </h3>
                    <p className={`text-sm sm:text-base leading-relaxed font-sans select-text font-medium ${colors.desc}`}>
                      {service.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between" style={{ transform: "translateZ(10px)" }}>
                  <span className={`text-xs sm:text-sm font-bold font-sans tracking-wide ${service.colorType === 'cream' ? 'text-[#05123e]' : 'text-white'}`}>
                    Conocer detalles
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-350 ${
                    activeIndex === index ? "bg-[#ff8d2b] text-white rotate-45 scale-110" : "bg-white/5 text-slate-400"
                  }`}>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Previous and Next arrow buttons positioned at the sides of the carousel container */}
        <button
          onClick={handlePrev}
          className="absolute left-0 md:-left-6 lg:-left-14 xl:-left-20 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 border-slate-200 bg-white/95 text-slate-800 hover:bg-[#ff8d2b] hover:text-white hover:border-[#ff8d2b] hover:scale-110 active:scale-95 cursor-pointer shadow-black/5"
          aria-label="Anterior servicio"
        >
          <ChevronLeft className="w-5.5 h-5.5 stroke-[2.5]" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-0 md:-right-6 lg:-right-14 xl:-right-20 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full border shadow-lg flex items-center justify-center transition-all duration-300 border-slate-200 bg-white/95 text-slate-800 hover:bg-[#ff8d2b] hover:text-white hover:border-[#ff8d2b] hover:scale-110 active:scale-95 cursor-pointer shadow-black/5"
          aria-label="Siguiente servicio"
        >
          <ChevronRight className="w-5.5 h-5.5 stroke-[2.5]" />
        </button>

        {/* Ambient background shadow backing the curved depth */}
        <div className="absolute top-1/2 left-0 right-0 h-40 bg-slate-900/5 -translate-y-1/2 blur-3xl pointer-events-none -z-10" />
      </div>

      {/* Control Dots & Arrow Navigation */}
      <div className="flex flex-col items-center gap-3.5 mt-8 w-full justify-center max-w-4xl border-t border-slate-100 pt-6">
        {/* Bullet dots representing index (directly below card) */}
        <div className="flex items-center gap-2">
          {SERVICES_DATA.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToLoopIndex(index + 1)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                realIndex === index ? "w-7 bg-[#ff8d2b]" : "w-2.5 bg-slate-200 hover:bg-slate-350"
              }`}
              style={{ contentVisibility: "auto" }}
              aria-label={`Go to service ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Indicator Text (below bullet dots) */}
        <span className="text-xs font-semibold text-slate-500 font-sans tracking-wide text-center">
          Desliza o usa las flechas laterales • <span className="text-slate-800 font-bold">{realIndex + 1} de {REAL_COUNT}</span>
        </span>
      </div>
    </div>
  );
}
