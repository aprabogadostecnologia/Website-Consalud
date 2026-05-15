Stack técnico
Next.js (App Router) con TypeScript
React 19 + "use client" en todo lo que usa Three.js
Three.js 0.184 + @react-three/fiber + @react-three/drei
TailwindCSS v4 con @tailwindcss/postcss (NO el plugin de Vite)
pnpm como package manager
Estructura de carpetas relevante

src/
├── app/             → rutas Next.js (layout, page, serviciosCon/)
├── components/
│   ├── canvas/      → escena WebGL (PortalScene, PortalTunnel, CameraRig, DataStream)
│   └── layout/      → Navbar, footer
├── views/           → HeroPage (página principal con las 4 secciones)
├── hooks/           → useScrollProgress, useWindowSize
├── styles/          → globals.css (TailwindCSS v4)
├── types/           → SceneProps, NavItem, SectionProps
└── utils/           → clamp, lerp, mapRange
Importante: la carpeta se llama views/ y NO pages/ porque Next.js App Router toma cualquier archivo en pages/ como ruta del Pages Router, lo que crearía conflicto.

Experiencia WebGL (el corazón del sitio)
La página es un portal journey scroll-driven: la cámara viaja por un túnel de anillos (PortalTunnel) mientras el usuario hace scroll. Las 4 secciones (Hero, Nosotros, Servicios, Submarcas) aparecen como overlays con fade-in/out según el progreso del scroll (0→1).

El scroll container tiene height: 500vh con un div sticky adentro
useScrollProgress mide window.scrollY / (scrollHeight - innerHeight)
CameraRig mueve la cámara en Z con lerp suave
Crítico: globals.css NO puede tener height: 100% en body — eso convertiría al body en el scroll container y window.scrollY siempre sería 0
Colores de marca (usar siempre estos)
Uso	Hex
Fondo principal / navbar scroll	#05123e
Naranja (CTAs, acentos, anillos)	#ff8d2b
Azul digital (degradé, íconos)	#0546f2
Fondo 3D canvas	#020c28
Comandos

# Instalar dependencias
pnpm install

# Desarrollo (requiere nvm + Node v24 en WSL)
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
pnpm dev

# Build
pnpm build
Decisiones técnicas importantes
next.config.ts tiene transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"] — obligatorio para que Three.js funcione en Next.js
postcss.config.mjs usa "@tailwindcss/postcss": {} (no tailwindcss: {})
El navbar usa window.scrollTo() programático en vez de anchors href="#id" porque las secciones son overlays, no elementos en el DOM con IDs reales
PortalScene tiene pointerEvents: "none" en el canvas para que el scroll y clicks pasen al DOM