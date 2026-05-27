import * as THREE from 'three';

export function buildHospitalModel(): THREE.Group {
  const group = new THREE.Group();

  // ── Materials ───────────────────────────────────────────────────────────────
  const facadeMat = new THREE.MeshStandardMaterial({
    color: 0xccd5e0,
    roughness: 0.45,
    metalness: 0.1,
    flatShading: true,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x546a7f,
    roughness: 0.35,
    metalness: 0.2,
    flatShading: true,
  });

  const whiteTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
  });

  const blueGlassMat = new THREE.MeshStandardMaterial({
    color: 0x00d8f6,
    emissive: 0x012ca8,
    emissiveIntensity: 0.35,
    roughness: 0.1,
    metalness: 0.8,
    flatShading: true,
  });

  // ── Window helper ────────────────────────────────────────────────────────────
  const buildHospitalWindow = (w: number, h: number): THREE.Group => {
    const winGroup = new THREE.Group();
    winGroup.add(new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), whiteTrimMat));
    const pane = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, h - 0.2, 0.22), blueGlassMat);
    pane.position.z = 0.02;
    winGroup.add(pane);
    const gridVert = new THREE.Mesh(new THREE.BoxGeometry(0.08, h - 0.2, 0.24), whiteTrimMat);
    gridVert.position.z = 0.03;
    const gridHoriz = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, 0.08, 0.24), whiteTrimMat);
    gridHoriz.position.z = 0.03;
    winGroup.add(gridVert, gridHoriz);
    return winGroup;
  };

  // ── Letter helper ────────────────────────────────────────────────────────────
  const lMat = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    emissive: 0xaa1405,
    emissiveIntensity: 0.3,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
  });

  const build3DLetter = (char: string): THREE.Group => {
    const g = new THREE.Group();
    const lw = 0.8, lh = 1.3, ld = 0.18, t = 0.18;
    const seg = (sx: number, sy: number, sz: number, px: number, py: number, pz: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), lMat);
      m.position.set(px, py, pz);
      g.add(m);
    };
    if (char === 'H') {
      seg(t, lh, ld, -lw/2 + t/2, 0, 0);
      seg(t, lh, ld,  lw/2 - t/2, 0, 0);
      seg(lw - t, t, ld, 0, 0, 0);
    } else if (char === 'O') {
      seg(lw - t, t, ld, 0,  lh/2 - t/2, 0);
      seg(lw - t, t, ld, 0, -lh/2 + t/2, 0);
      seg(t, lh - t, ld, -lw/2 + t/2, 0, 0);
      seg(t, lh - t, ld,  lw/2 - t/2, 0, 0);
    } else if (char === 'S') {
      seg(lw, t, ld, 0,  lh/2 - t/2, 0);
      seg(lw, t, ld, 0,  0,           0);
      seg(lw, t, ld, 0, -lh/2 + t/2, 0);
      seg(t, lh/2, ld, -lw/2 + t/2,  lh/4, 0);
      seg(t, lh/2, ld,  lw/2 - t/2, -lh/4, 0);
    } else if (char === 'P') {
      seg(t, lh, ld, -lw/2 + t/2, 0, 0);
      seg(lw - t, t, ld, 0, lh/2 - t/2, 0);
      seg(lw - t, t, ld, 0, 0,           0);
      seg(t, lh/2 - t, ld, lw/2 - t/2, lh/4, 0);
    } else if (char === 'I') {
      seg(t,  lh, ld, 0, 0,           0);
      seg(lw, t,  ld, 0, lh/2 - t/2,  0);
      seg(lw, t,  ld, 0, -lh/2 + t/2, 0);
    } else if (char === 'T') {
      seg(t,        lh - t, ld, 0, -t/2,        0);
      seg(lw + 0.1, t,      ld, 0,  lh/2 - t/2, 0);
    } else if (char === 'A') {
      seg(t,      lh, ld, -lw/2 + t/2, 0,           0);
      seg(t,      lh, ld,  lw/2 - t/2, 0,           0);
      seg(lw - t, t,  ld,  0,           lh/2 - t/2, 0);
      seg(lw - t, t,  ld,  0,           0,           0);
    } else if (char === 'L') {
      seg(t,      lh, ld, -lw/2 + t/2, 0,            0);
      seg(lw - t, t,  ld,  t/2,        -lh/2 + t/2,  0);
    }
    return g;
  };

  // ── Main tower ───────────────────────────────────────────────────────────────
  const towerGroup = new THREE.Group();
  towerGroup.position.set(1.0, 2.0, -1.0);

  const foundation = new THREE.Mesh(new THREE.BoxGeometry(12.3, 0.4, 12.3), roofMat);
  foundation.position.set(0, 0.2, 0);
  towerGroup.add(foundation);

  const mainTower = new THREE.Mesh(new THREE.BoxGeometry(12.0, 14.0, 12.0), facadeMat);
  mainTower.position.y = 7.0;
  towerGroup.add(mainTower);

  const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.6, 12.8), roofMat);
  roofSlab.position.y = 14.3;
  towerGroup.add(roofSlab);

  // Window grid — front (Z+) and right side (X+)
  const rows = [2.8, 7.2, 11.6];
  const cols = [-3.3, 0, 3.3];
  rows.forEach(ry => {
    cols.forEach(rx => {
      const w = buildHospitalWindow(1.8, 1.1);
      w.position.set(rx, ry, 6.05);
      towerGroup.add(w);
    });
    cols.forEach(rz => {
      const w = buildHospitalWindow(1.8, 1.1);
      w.position.set(6.05, ry, rz);
      w.rotation.y = Math.PI / 2;
      towerGroup.add(w);
    });
  });

  // "HOSPITAL" letters on roofline
  "HOSPITAL".split('').forEach((char, i) => {
    const letter = build3DLetter(char);
    letter.position.set((i - 3.5) * 1.1, 15.25, 5.85);
    towerGroup.add(letter);
  });

  group.add(towerGroup);

  // ── Emergency wing (left) ────────────────────────────────────────────────────
  const sideGroup = new THREE.Group();
  sideGroup.position.set(-9.2, 2.0, -1.5);

  const sideBody = new THREE.Mesh(new THREE.BoxGeometry(10.8, 5.2, 6.8), facadeMat);
  sideBody.position.y = 2.6;
  sideGroup.add(sideBody);

  const sideRoof = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.4, 7.8), whiteTrimMat);
  sideRoof.position.set(-0.2, 5.4, 0.5);
  sideGroup.add(sideRoof);

  const glassEntrance = new THREE.Mesh(new THREE.BoxGeometry(3.6, 3.2, 0.15), blueGlassMat);
  glassEntrance.position.set(2.0, 1.6, 3.42);
  sideGroup.add(glassEntrance);

  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.8, 3.3, 0.1), whiteTrimMat);
  doorFrame.position.set(2.0, 1.65, 3.4);
  sideGroup.add(doorFrame);

  const awning = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.15, 2.2), whiteTrimMat);
  awning.position.set(2.0, 3.3, 4.4);
  sideGroup.add(awning);

  const sideWin = buildHospitalWindow(1.8, 0.9);
  sideWin.position.set(-2.4, 3.0, 3.42);
  sideGroup.add(sideWin);

  // Helipad
  const heliPadBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.8, 2.8, 0.08, 16),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9, metalness: 0.1 })
  );
  heliPadBase.position.set(-2.0, 5.61, 0.5);
  sideGroup.add(heliPadBase);

  const heliPadBorder = new THREE.Mesh(
    new THREE.CylinderGeometry(2.82, 2.82, 0.04, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  heliPadBorder.position.set(-2.0, 5.65, 0.5);
  sideGroup.add(heliPadBorder);

  // "H" marking on helipad
  const hMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const hLeft  = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 1.2), hMat);
  hLeft.position.set(-2.4, 5.66, 0.5);
  const hRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 1.2), hMat);
  hRight.position.set(-1.6, 5.66, 0.5);
  const hMid   = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.3), hMat);
  hMid.position.set(-2.0, 5.66, 0.5);
  sideGroup.add(hLeft, hRight, hMid);

  group.add(sideGroup);

  return group;
}
