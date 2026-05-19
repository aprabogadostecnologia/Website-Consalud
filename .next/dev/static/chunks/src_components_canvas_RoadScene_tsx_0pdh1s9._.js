(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/canvas/RoadScene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RoadScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.6_react@19.2.6__react@19.2.6/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/three@0.184.0/node_modules/three/build/three.module.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// ── Consalud palette ──────────────────────────────────────────────────────────
const C = {
    bg: 0x05123e,
    neonA: 0xff8d2b,
    neonB: 0x0546f2,
    neonC: 0xffa040,
    road: 0x020e2e,
    roadEmit: 0x0a1828,
    wire: 0x0a1a5c,
    mtnSolid: 0x020c30
};
// Road path t-values for each of the 5 section stops
const STOP_TS = [
    0.04,
    0.24,
    0.50,
    0.73,
    0.92
];
// Scroll band boundaries — Servicios (index 2) gets extra space for the service carousel
const BANDS = [
    0,
    0.10,
    0.22,
    0.78,
    0.88,
    1.00
];
// Fraction of each band spent orbiting before traveling to next stop
const ORBIT_FRAC = [
    0.72,
    0.72,
    0.08,
    0.72,
    1.00
];
function getSec(s) {
    const sc = Math.max(0, Math.min(0.9999, s));
    let sec = 0;
    for(let i = 1; i <= 4; i++){
        if (sc >= BANDS[i]) sec = i;
        else break;
    }
    return [
        sec,
        (sc - BANDS[sec]) / (BANDS[sec + 1] - BANDS[sec])
    ];
}
function getRoadT(scroll) {
    const [sec, w] = getSec(scroll);
    const from = STOP_TS[sec];
    const to = STOP_TS[Math.min(sec + 1, 4)];
    const of = ORBIT_FRAC[sec];
    if (w < of) return from;
    const t = (w - of) / (1 - of);
    return from + (to - from) * t * t * (3 - 2 * t);
}
function getOrbitAlpha(scroll) {
    const [sec, w] = getSec(scroll);
    const of = ORBIT_FRAC[sec];
    if (w >= of) return 0;
    if (w < 0.06) return w / 0.06;
    if (w < of - 0.06) return 1;
    return 1 - (w - (of - 0.06)) / 0.06;
}
function getCurrentSection(scroll) {
    return getSec(scroll)[0];
}
// ── Terrain ───────────────────────────────────────────────────────────────────
function noise(x, z) {
    return Math.sin(x * 0.003 + 0.71) * Math.cos(z * 0.0025 + 1.30) * 38 + Math.sin(x * 0.0055 - 1.10) * Math.cos(z * 0.0048 + 2.40) * 20 + Math.sin(x * 0.011 + 2.30) * Math.cos(z * 0.0095 - 0.80) * 10 + Math.sin(x * 0.022 - 0.60) * Math.cos(z * 0.019 + 1.70) * 5 + Math.sin(x * 0.004 + z * 0.0035 + 1.1) * 18 + Math.cos(x * 0.003 - z * 0.005 - 0.6) * 13 + Math.sin(x * 0.018 + z * 0.012 + 2.2) * Math.cos(x * 0.009 - z * 0.014) * 7;
}
function profile(zn) {
    if (zn < 0.25) return 65 + Math.sin(zn * 10) * 4;
    if (zn < 0.46) {
        const t = (zn - .25) / .21;
        const s = t * t * (3 - 2 * t);
        return 65 - s * 62;
    }
    if (zn < 0.56) return 3 + Math.sin(zn * 18) * 1.5;
    if (zn < 0.80) {
        const t = (zn - .56) / .24;
        const s = t * t * (3 - 2 * t);
        return 3 + s * 56;
    }
    return 59 + Math.sin(zn * 14) * 5;
}
function terrainH(x, z, zn = 0.5) {
    return noise(x, z) * 0.55 + profile(zn);
}
function RoadScene({ progress, className }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const progressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(progress);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoadScene.useEffect": ()=>{
            progressRef.current = progress;
        }
    }["RoadScene.useEffect"], [
        progress
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RoadScene.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            // ── Renderer ──────────────────────────────────────────────────────────────
            const renderer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WebGLRenderer"]({
                canvas,
                antialias: true,
                alpha: true
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(window.innerWidth, window.innerHeight);
            const scene = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Scene"]();
            scene.background = null;
            renderer.setClearColor(0x010208, 1);
            const camera = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PerspectiveCamera"](72, window.innerWidth / window.innerHeight, 0.5, 3000);
            const TW = 1800, TD = 4000;
            const zWorldMin = -TD / 2;
            // ── Terrain ───────────────────────────────────────────────────────────────
            const terrainGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](TW, TD, 120, 240);
            terrainGeo.rotateX(-Math.PI / 2);
            const tPos = terrainGeo.attributes.position;
            let minH = 1e9, maxH = -1e9;
            const hs = new Float32Array(tPos.count);
            for(let i = 0; i < tPos.count; i++){
                const wx = tPos.getX(i), wz = tPos.getZ(i);
                const zn = 1 - (wz - zWorldMin) / TD;
                const y = terrainH(wx, wz, zn);
                tPos.setY(i, y);
                hs[i] = y;
                if (y < minH) minH = y;
                if (y > maxH) maxH = y;
            }
            terrainGeo.computeVertexNormals();
            const range = maxH - minH;
            const vc = new Float32Array(tPos.count * 3);
            for(let i = 0; i < tPos.count; i++){
                const t = (hs[i] - minH) / range;
                let r, g, b;
                if (t < .15) {
                    r = .02;
                    g = .05;
                    b = .20;
                } else if (t < .35) {
                    const s = (t - .15) / .20;
                    r = .02 + s * .02;
                    g = .05 + s * .04;
                    b = .20 + s * .10;
                } else if (t < .55) {
                    const s = (t - .35) / .20;
                    r = .03 + s * .04;
                    g = .07 + s * .04;
                    b = .28 + s * .12;
                } else if (t < .75) {
                    const s = (t - .55) / .20;
                    r = .06 + s * .08;
                    g = .09 + s * .04;
                    b = .36 + s * .12;
                } else if (t < .90) {
                    const s = (t - .75) / .15;
                    r = .12 + s * .10;
                    g = .11 + s * .06;
                    b = .44 + s * .08;
                } else {
                    const s = (t - .90) / .10;
                    r = .20 + s * .30;
                    g = .15 + s * .25;
                    b = .50 + s * .18;
                }
                vc[i * 3] = r;
                vc[i * 3 + 1] = g;
                vc[i * 3 + 2] = b;
            }
            terrainGeo.setAttribute("color", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](vc, 3));
            const terrainMesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](terrainGeo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                vertexColors: true,
                roughness: .9,
                metalness: .04
            }));
            terrainMesh.renderOrder = 0;
            scene.add(terrainMesh);
            // Neon wireframe grid
            const wGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlaneGeometry"](TW, TD, 55, 110);
            wGeo.rotateX(-Math.PI / 2);
            const wPos = wGeo.attributes.position;
            for(let i = 0; i < wPos.count; i++){
                const wz = wPos.getZ(i);
                wPos.setY(i, terrainH(wPos.getX(i), wz, 1 - (wz - zWorldMin) / TD) + 0.3);
            }
            wGeo.computeVertexNormals();
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](wGeo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                color: C.wire,
                wireframe: true,
                transparent: true,
                opacity: .14
            })));
            // ── Mountains ─────────────────────────────────────────────────────────────
            for(let zi = 0; zi < 80; zi++){
                const wz = zWorldMin + zi / 80 * TD;
                const zn = 1 - (wz - zWorldMin) / TD;
                const baseH = profile(zn);
                for (const side of [
                    -1,
                    1
                ]){
                    for(let m = 0; m < Math.floor(2 + Math.random() * 3); m++){
                        const dist = 165 + Math.random() * 240;
                        const wx = side * dist + (Math.random() - .5) * 40;
                        const ty = terrainH(wx, wz, zn);
                        const hMul = baseH > 10 ? 1.0 : 0.4;
                        const h = (20 + Math.random() * 60) * hMul;
                        const w = 14 + Math.random() * 32;
                        const seg = 5 + Math.floor(Math.random() * 5);
                        const geo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](w, h, seg);
                        geo.rotateY(Math.random() * Math.PI * 2);
                        const solid = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                            color: C.mtnSolid,
                            roughness: .95
                        }));
                        solid.position.set(wx, ty + h / 2, wz);
                        scene.add(solid);
                        const wireColor = side === 1 ? C.neonA : C.neonB;
                        const wire = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](geo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                            color: wireColor,
                            wireframe: true,
                            transparent: true,
                            opacity: .06 + Math.random() * .14
                        }));
                        wire.position.set(wx, ty + h / 2, wz);
                        scene.add(wire);
                        if (h * hMul > 55) {
                            const sg = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConeGeometry"](w * .25, h * .2, seg);
                            sg.rotateY(Math.random() * Math.PI * 2);
                            const snow = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](sg, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                                color: 0xaaddff,
                                transparent: true,
                                opacity: .6
                            }));
                            snow.position.set(wx, ty + h - .02, wz);
                            scene.add(snow);
                        }
                    }
                }
            }
            // ── Road path ─────────────────────────────────────────────────────────────
            const PATH = ({
                "RoadScene.useEffect.PATH": ()=>{
                    const pts = [];
                    for(let i = 0; i < 300; i++){
                        const zn = i / 300;
                        const wz = zWorldMin + (1 - zn) * TD * .92 + TD * .04;
                        const amp = zn > .24 && zn < .48 || zn > .57 && zn < .82 ? 85 : 38;
                        const cf = Math.min(1, Math.max(0, (zn - 0.02) / 0.13));
                        const wx = cf * (Math.sin(zn * Math.PI * 2 * 6 + .30) * amp * .58 + Math.sin(zn * Math.PI * 2 * 10 + 1.7) * amp * .28 + Math.sin(zn * Math.PI * 2 * 3 - .80) * amp * .38);
                        pts.push(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](wx, terrainH(wx, wz, zn) + 1.1, wz));
                    }
                    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](pts, false, "catmullrom", .5);
                }
            })["RoadScene.useEffect.PATH"]();
            const N = 2200;
            const pathPts = PATH.getPoints(N);
            const UP_V = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0);
            // ── Road mesh ─────────────────────────────────────────────────────────────
            const roadGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
            roadGroup.renderOrder = 2;
            const shape = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Shape"]();
            shape.moveTo(-5, 0);
            shape.lineTo(5, 0);
            shape.lineTo(5, -.4);
            shape.lineTo(-5, -.4);
            shape.closePath();
            roadGroup.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ExtrudeGeometry"](shape, {
                steps: N,
                bevelEnabled: false,
                extrudePath: PATH
            }), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                color: C.road,
                roughness: .85,
                emissive: C.roadEmit,
                emissiveIntensity: .5,
                polygonOffset: true,
                polygonOffsetFactor: -6,
                polygonOffsetUnits: -6
            })));
            function addTube(offset, col, r) {
                const ep = pathPts.map({
                    "RoadScene.useEffect.addTube.ep": (p, i)=>{
                        const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
                        return p.clone().addScaledVector(right, offset).add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 0.15, 0));
                    }
                }["RoadScene.useEffect.addTube.ep"]);
                roadGroup.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TubeGeometry"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CatmullRomCurve3"](ep), N, r, 8, false), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                    color: col,
                    polygonOffset: true,
                    polygonOffsetFactor: -14,
                    polygonOffsetUnits: -14
                })));
            }
            addTube(-5.1, C.neonA, .22);
            addTube(5.1, C.neonA, .22);
            addTube(0, C.neonB, .09);
            addTube(-4.2, C.neonC, .055);
            addTube(4.2, C.neonC, .055);
            for(let i = 40; i < N - 40; i += 65){
                const base = pathPts[i].clone();
                const right = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().crossVectors(PATH.getTangentAt(i / N), UP_V).normalize();
                for (const si of [
                    -1,
                    1
                ]){
                    const pos = base.clone().addScaledVector(right, si * 6.8);
                    const pole = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](.11, .13, 7, 7), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                        color: 0x080824
                    }));
                    pole.position.copy(pos);
                    pole.position.y += 3.5;
                    roadGroup.add(pole);
                    const bulb = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](.38, 8, 8), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                        color: si === -1 ? C.neonA : C.neonB
                    }));
                    bulb.position.copy(pos);
                    bulb.position.y += 7.5;
                    roadGroup.add(bulb);
                }
            }
            scene.add(roadGroup);
            // ── Road flags — cloth simulation (Verlet + springs) ─────────────────────
            const FLAG_W = 6.5, FLAG_H = 3.0, POLE_H = 16;
            const CW = 9, CH = 6; // particle grid: (segsX+1) × (segsY+1)
            // Canvas texture for flag 0: navy background + logo composited on load
            const flagCanvas = document.createElement('canvas');
            flagCanvas.width = 512;
            flagCanvas.height = 256;
            const flagCtx = flagCanvas.getContext('2d');
            flagCtx.fillStyle = '#05123e';
            flagCtx.fillRect(0, 0, 512, 256);
            const logoFlagTex = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](flagCanvas);
            const logoImg = new window.Image();
            logoImg.onload = ({
                "RoadScene.useEffect": ()=>{
                    const pad = 40;
                    const aspect = logoImg.width / logoImg.height;
                    const maxH = flagCanvas.height - pad * 2;
                    const maxW = flagCanvas.width - pad * 2;
                    let w = maxH * aspect, h = maxH;
                    if (w > maxW) {
                        w = maxW;
                        h = w / aspect;
                    }
                    flagCtx.drawImage(logoImg, (flagCanvas.width - w) / 2, (flagCanvas.height - h) / 2, w, h);
                    logoFlagTex.needsUpdate = true;
                }
            })["RoadScene.useEffect"];
            logoImg.src = '/logoConsalud.png';
            const SECTION_FLAGS = [
                {
                    num: "02",
                    label: "Nosotros",
                    icon: {
                        "RoadScene.useEffect": (ctx, cx, cy, r)=>{
                            ctx.beginPath();
                            ctx.arc(cx - r * .35, cy - r * .15, r * .32, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(cx + r * .25, cy - r * .20, r * .24, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(cx - r * .15, cy + r * .55, r * .50, Math.PI, 0);
                            ctx.fill();
                            ctx.beginPath();
                            ctx.arc(cx + r * .42, cy + r * .55, r * .38, Math.PI, 0);
                            ctx.fill();
                        }
                    }["RoadScene.useEffect"]
                },
                {
                    num: "03",
                    label: "Servicios",
                    icon: {
                        "RoadScene.useEffect": (ctx, cx, cy, r)=>{
                            ctx.beginPath();
                            ctx.moveTo(cx, cy - r * .70);
                            ctx.lineTo(cx + r * .60, cy - r * .35);
                            ctx.lineTo(cx + r * .60, cy + r * .15);
                            ctx.quadraticCurveTo(cx + r * .60, cy + r * .70, cx, cy + r * .85);
                            ctx.quadraticCurveTo(cx - r * .60, cy + r * .70, cx - r * .60, cy + r * .15);
                            ctx.lineTo(cx - r * .60, cy - r * .35);
                            ctx.closePath();
                            ctx.fill();
                        }
                    }["RoadScene.useEffect"]
                },
                {
                    num: "04",
                    label: "Marcas",
                    icon: {
                        "RoadScene.useEffect": (ctx, cx, cy, r)=>{
                            ctx.beginPath();
                            for(let i = 0; i < 10; i++){
                                const rad = i % 2 === 0 ? r * .70 : r * .30;
                                const a = i * Math.PI / 5 - Math.PI / 2;
                                i === 0 ? ctx.moveTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a)) : ctx.lineTo(cx + rad * Math.cos(a), cy + rad * Math.sin(a));
                            }
                            ctx.closePath();
                            ctx.fill();
                        }
                    }["RoadScene.useEffect"]
                },
                {
                    num: "05",
                    label: "Contacto",
                    icon: {
                        "RoadScene.useEffect": (ctx, cx, cy, r)=>{
                            const hw = r * .75, hh = r * .52;
                            ctx.fillRect(cx - hw, cy - hh, hw * 2, hh * 2);
                            ctx.strokeStyle = '#05123e';
                            ctx.lineWidth = 5;
                            ctx.beginPath();
                            ctx.moveTo(cx - hw, cy - hh);
                            ctx.lineTo(cx, cy + hh * .3);
                            ctx.lineTo(cx + hw, cy - hh);
                            ctx.stroke();
                        }
                    }["RoadScene.useEffect"]
                }
            ];
            function makeSecTex(d) {
                const W = 512, H = 256;
                const cv = document.createElement('canvas');
                cv.width = W;
                cv.height = H;
                const ctx = cv.getContext('2d');
                ctx.fillStyle = '#05123e';
                ctx.fillRect(0, 0, W, H);
                ctx.fillStyle = '#ff8d2b';
                ctx.fillRect(0, 0, 8, H);
                ctx.font = 'bold 108px system-ui, sans-serif';
                ctx.fillStyle = 'rgba(255,141,43,0.12)';
                ctx.textBaseline = 'middle';
                ctx.fillText(d.num, 18, H / 2);
                ctx.fillStyle = 'rgba(255,141,43,0.88)';
                d.icon(ctx, W * .76, H * .44, 42);
                ctx.font = 'bold 36px system-ui, sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'middle';
                ctx.fillText(d.label, 130, H * .40);
                ctx.fillStyle = '#ff8d2b';
                ctx.fillRect(130, H * .62, 200, 3);
                return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CanvasTexture"](cv);
            }
            const clothFlags = [];
            for(let fi = 0; fi < 5; fi++){
                const ti = STOP_TS[fi];
                const fPt = PATH.getPoint(ti);
                const fTan = PATH.getTangentAt(ti).normalize();
                const fRight = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().crossVectors(fTan, UP_V).normalize();
                const side = fi % 2 === 0 ? 1 : -1;
                const fBase = fPt.clone().addScaledVector(fRight, side * 9.5);
                const fbZn = Math.max(0, Math.min(1, 1 - (fBase.z - zWorldMin) / TD));
                fBase.y = Math.max(fPt.y - 1, terrainH(fBase.x, fBase.z, fbZn));
                const fGroup = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"]();
                fGroup.position.copy(fBase);
                fGroup.rotation.y = Math.atan2(fTan.x, fTan.z);
                scene.add(fGroup);
                // Pole
                const poleM = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CylinderGeometry"](0.08, 0.11, POLE_H, 7), new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshStandardMaterial"]({
                    color: 0x0a0a28,
                    metalness: 0.6,
                    roughness: 0.4
                }));
                poleM.position.y = POLE_H / 2;
                fGroup.add(poleM);
                // Cloth particles in group local space
                const yBase = POLE_H - FLAG_H / 2 - 0.3;
                const particles = [];
                for(let row = 0; row < CH; row++){
                    for(let col = 0; col < CW; col++){
                        const x = col * (FLAG_W / (CW - 1));
                        const y = yBase + FLAG_H / 2 - row * (FLAG_H / (CH - 1));
                        particles.push({
                            pos: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, y, 0),
                            prev: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](x, y, 0),
                            fixed: col === 0
                        });
                    }
                }
                // Springs: structural + shear + bend
                const springs = [];
                const addSpr = {
                    "RoadScene.useEffect.addSpr": (a, b, stiff)=>springs.push({
                            a,
                            b,
                            restLen: particles[a].pos.distanceTo(particles[b].pos),
                            stiff
                        })
                }["RoadScene.useEffect.addSpr"];
                for(let row = 0; row < CH; row++){
                    for(let col = 0; col < CW; col++){
                        const idx = row * CW + col;
                        if (col < CW - 1) addSpr(idx, idx + 1, 1.00); // structural H
                        if (row < CH - 1) addSpr(idx, idx + CW, 1.00); // structural V
                        if (col < CW - 1 && row < CH - 1) {
                            addSpr(idx, idx + CW + 1, 0.70);
                            addSpr(idx + 1, idx + CW, 0.70);
                        } // shear
                        if (col < CW - 2) addSpr(idx, idx + 2, 0.50); // bend H
                        if (row < CH - 2) addSpr(idx, idx + CW * 2, 0.50); // bend V
                    }
                }
                // Build indexed BufferGeometry from particle grid
                const positions = new Float32Array(CW * CH * 3);
                const uvs = new Float32Array(CW * CH * 2);
                const indices = [];
                for(let row = 0; row < CH; row++){
                    for(let col = 0; col < CW; col++){
                        const i = row * CW + col;
                        positions[i * 3] = particles[i].pos.x;
                        positions[i * 3 + 1] = particles[i].pos.y;
                        positions[i * 3 + 2] = 0;
                        uvs[i * 2] = col / (CW - 1);
                        uvs[i * 2 + 1] = 1 - row / (CH - 1);
                        if (col < CW - 1 && row < CH - 1) {
                            const a = row * CW + col, b = a + 1, c = (row + 1) * CW + col, d = c + 1;
                            indices.push(a, c, b, b, c, d);
                        }
                    }
                }
                const clothGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
                clothGeo.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](positions, 3));
                clothGeo.setAttribute("uv", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](uvs, 2));
                clothGeo.setIndex(indices);
                const posAttr = clothGeo.attributes.position;
                const flagMat = fi === 0 ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                    map: logoFlagTex,
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                }) : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MeshBasicMaterial"]({
                    map: makeSecTex(SECTION_FLAGS[fi - 1]),
                    side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleSide"]
                });
                const flagMesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](clothGeo, flagMat);
                fGroup.add(flagMesh);
                clothFlags.push({
                    particles,
                    springs,
                    posAttr,
                    phase: fi * 1.4
                });
            }
            // ── Sky dome (animated clouds) ────────────────────────────────────────────
            const skyMat = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShaderMaterial"]({
                side: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BackSide"],
                depthTest: false,
                depthWrite: false,
                uniforms: {
                    uTime: {
                        value: 0
                    }
                },
                vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
                fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.0 + vec2(1.7, 9.2); a *= 0.5; }
          return v;
        }

        void main() {
          float yNorm = vUv.y;

          // horizon: warm amber (Consalud #ff8d2b muted) -> purple -> near-black zenith
          vec3 horiz  = vec3(0.30, 0.10, 0.03);
          vec3 mid    = vec3(0.06, 0.04, 0.22);
          vec3 zenith = vec3(0.01, 0.01, 0.07);
          vec3 sky = yNorm < 0.5
            ? mix(horiz, mid,    yNorm * 2.0)
            : mix(mid,   zenith, (yNorm - 0.5) * 2.0);

          // two cloud layers at different speeds for depth
          vec2 uv1 = vUv * vec2(4.0, 2.0) + vec2(uTime * 0.007, 0.0);
          vec2 uv2 = vUv * vec2(2.5, 1.3) + vec2(uTime * 0.004, uTime * 0.002);
          float c = smoothstep(0.38, 0.64, fbm(uv1)) * 0.65
                  + smoothstep(0.40, 0.66, fbm(uv2)) * 0.35;
          float cloudFade = smoothstep(0.08, 0.35, yNorm);

          vec3 cloudCol = vec3(0.24, 0.18, 0.42);
          vec3 col = mix(sky, cloudCol, c * 0.88 * cloudFade);
          gl_FragColor = vec4(col, 1.0);
        }
      `
            });
            const skyMesh = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SphereGeometry"](2400, 32, 16), skyMat);
            skyMesh.renderOrder = -1;
            scene.add(skyMesh);
            // ── Stars ─────────────────────────────────────────────────────────────────
            const starGeo = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferGeometry"]();
            const starPos = new Float32Array(6000 * 3);
            for(let i = 0; i < 6000 * 3; i += 3){
                starPos[i] = (Math.random() - .5) * 2500;
                starPos[i + 1] = 80 + Math.random() * 650;
                starPos[i + 2] = (Math.random() - .5) * 5500;
            }
            starGeo.setAttribute("position", new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BufferAttribute"](starPos, 3));
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Points"](starGeo, new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointsMaterial"]({
                color: 0xffffff,
                size: .7,
                sizeAttenuation: true
            })));
            // ── Lights ────────────────────────────────────────────────────────────────
            scene.add(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AmbientLight"](0x0a0a30, 6));
            const dir = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DirectionalLight"](0x2211cc, 3);
            dir.position.set(300, 800, -600);
            scene.add(dir);
            const cL1 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](C.neonA, 16, 150);
            const cL2 = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](C.neonB, 16, 150);
            const bL = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointLight"](0x1a0066, 6, 300);
            scene.add(cL1, cL2, bL);
            const CAM_HEIGHT = 7, CAM_BACK = 18;
            const camPos = PATH.getPoint(.002).clone().add(PATH.getTangentAt(.002).normalize().multiplyScalar(-CAM_BACK));
            camPos.y += CAM_HEIGHT;
            const camTarget = PATH.getPoint(.018).clone();
            camTarget.y += 1;
            const camUp = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](0, 1, 0);
            camera.position.copy(camPos);
            camera.lookAt(camTarget);
            const onResize = {
                "RoadScene.useEffect.onResize": ()=>{
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                }
            }["RoadScene.useEffect.onResize"];
            window.addEventListener("resize", onResize);
            let frame = 0, animId = 0;
            function animate() {
                animId = requestAnimationFrame(animate);
                frame++;
                skyMat.uniforms.uTime.value += 0.016;
                const scroll = progressRef.current;
                const roadT = getRoadT(scroll);
                const oAlpha = getOrbitAlpha(scroll);
                const sec = getCurrentSection(scroll);
                const vPos = PATH.getPoint(roadT);
                const vTan = PATH.getTangentAt(roadT).normalize();
                // Travel camera calculations
                const travelPos = vPos.clone().addScaledVector(vTan, -CAM_BACK);
                travelPos.y += CAM_HEIGHT;
                // Floor: never let travelPos clip below terrain (happens on steep uphill sections)
                const tvZn = Math.max(0, Math.min(1, 1 - (travelPos.z - zWorldMin) / TD));
                travelPos.y = Math.max(travelPos.y, terrainH(travelPos.x, travelPos.z, tvZn) + CAM_HEIGHT);
                const travelLook = PATH.getPoint(Math.min(roadT + .022, .968)).clone();
                travelLook.y += 1;
                const stopPos = PATH.getPoint(STOP_TS[sec]);
                const angle = frame * 0.0035;
                const orbitPos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"](stopPos.x + Math.cos(angle) * 38, stopPos.y + 10, stopPos.z + Math.sin(angle) * 38);
                const orbitLook = stopPos.clone();
                orbitLook.y += 3;
                const targetPos = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().lerpVectors(travelPos, orbitPos, oAlpha);
                const targetLook = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Vector3"]().lerpVectors(travelLook, orbitLook, oAlpha);
                camPos.lerp(targetPos, .028);
                camTarget.lerp(targetLook, .04);
                // Hard floor after lerp: camera never goes underground even with scroll lag
                const camZn = Math.max(0, Math.min(1, 1 - (camPos.z - zWorldMin) / TD));
                camPos.y = Math.max(camPos.y, terrainH(camPos.x, camPos.z, camZn) + 4);
                camera.position.copy(camPos);
                camera.up.copy(camUp);
                camera.lookAt(camTarget);
                // Lights follow vehicle
                cL1.position.set(vPos.x - 6, vPos.y + 5, vPos.z);
                cL2.position.set(vPos.x + 6, vPos.y + 5, vPos.z);
                bL.position.set(vPos.x, vPos.y + 18, vPos.z + 18);
                // ── Cloth physics (Verlet integration) ───────────────────────────────
                const ft = skyMat.uniforms.uTime.value;
                const GRAV = -0.006;
                const DAMP = 0.985;
                const SUBS = 6;
                for (const cf of clothFlags){
                    // Wind fades to 0 when camera is orbiting (user is reading)
                    const windMult = 1 - oAlpha;
                    const wStr = (0.9 + Math.sin(ft * 0.5 + cf.phase) * 0.40 + Math.sin(ft * 1.4 + cf.phase * 0.7) * 0.25) * 0.038 * windMult;
                    // Verlet integrate
                    for (const p of cf.particles){
                        if (p.fixed) continue;
                        const vx = (p.pos.x - p.prev.x) * DAMP;
                        const vy = (p.pos.y - p.prev.y) * DAMP + GRAV;
                        const vz = (p.pos.z - p.prev.z) * DAMP + wStr;
                        p.prev.copy(p.pos);
                        p.pos.x += vx;
                        p.pos.y += vy;
                        p.pos.z += vz;
                    }
                    // Constraint relaxation
                    for(let sub = 0; sub < SUBS; sub++){
                        for (const s of cf.springs){
                            const pa = cf.particles[s.a], pb = cf.particles[s.b];
                            const dx = pb.pos.x - pa.pos.x, dy = pb.pos.y - pa.pos.y, dz = pb.pos.z - pa.pos.z;
                            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-8;
                            const corr = (dist - s.restLen) / dist * s.stiff * 0.5;
                            if (!pa.fixed) {
                                pa.pos.x += dx * corr;
                                pa.pos.y += dy * corr;
                                pa.pos.z += dz * corr;
                            }
                            if (!pb.fixed) {
                                pb.pos.x -= dx * corr;
                                pb.pos.y -= dy * corr;
                                pb.pos.z -= dz * corr;
                            }
                        }
                    }
                    // Upload positions to GPU
                    const attr = cf.posAttr;
                    for(let i = 0; i < cf.particles.length; i++){
                        attr.setXYZ(i, cf.particles[i].pos.x, cf.particles[i].pos.y, cf.particles[i].pos.z);
                    }
                    attr.needsUpdate = true;
                }
                renderer.render(scene, camera);
            }
            animate();
            return ({
                "RoadScene.useEffect": ()=>{
                    cancelAnimationFrame(animId);
                    window.removeEventListener("resize", onResize);
                    renderer.dispose();
                    scene.traverse({
                        "RoadScene.useEffect": (obj)=>{
                            if (!(obj instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$three$40$0$2e$184$2e$0$2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mesh"])) return;
                            obj.geometry.dispose();
                            const m = obj.material;
                            Array.isArray(m) ? m.forEach({
                                "RoadScene.useEffect": (x)=>x.dispose()
                            }["RoadScene.useEffect"]) : m.dispose();
                        }
                    }["RoadScene.useEffect"]);
                }
            })["RoadScene.useEffect"];
        }
    }["RoadScene.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$6_react$40$19$2e$2$2e$6_$5f$react$40$19$2e$2$2e$6$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: className,
        style: {
            pointerEvents: "none",
            animation: "sceneFadeIn 0.6s ease-out 0s both"
        }
    }, void 0, false, {
        fileName: "[project]/src/components/canvas/RoadScene.tsx",
        lineNumber: 653,
        columnNumber: 10
    }, this);
}
_s(RoadScene, "zDt1/gX72jmfkH8o+QTqHvVDGic=");
_c = RoadScene;
var _c;
__turbopack_context__.k.register(_c, "RoadScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/canvas/RoadScene.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/canvas/RoadScene.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_canvas_RoadScene_tsx_0pdh1s9._.js.map