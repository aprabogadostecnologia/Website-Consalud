import * as THREE from 'three';

export function buildConstruccionModel(): THREE.Group {
  const group = new THREE.Group();

  // ── Materials ───────────────────────────────────────────────────────────────
  const footingMat = new THREE.MeshStandardMaterial({
    color: 0x242846,
    roughness: 0.5,
    metalness: 0.2,
    flatShading: true,
  });

  const tieBeamMat = new THREE.MeshStandardMaterial({
    color: 0x225e6e,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true,
  });

  const colMat = new THREE.MeshStandardMaterial({
    color: 0xa84a1d,
    roughness: 0.45,
    metalness: 0.1,
    flatShading: true,
  });

  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x1a666e,
    roughness: 0.4,
    metalness: 0.1,
    flatShading: true,
  });

  const slabMat = new THREE.MeshStandardMaterial({
    color: 0xbf936b,
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });

  const shearWallMat = new THREE.MeshStandardMaterial({
    color: 0x8f8275,
    roughness: 0.35,
    metalness: 0.1,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide,
  });

  // ── Column grid ─────────────────────────────────────────────────────────────
  const xs = [-4.6, -1.6, 1.6, 4.6];
  const zs = [-4.6, -1.6, 1.6, 4.6];

  xs.forEach(x => {
    zs.forEach(z => {
      const footing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), footingMat);
      footing.position.set(x, 2.2, z);
      group.add(footing);

      const column = new THREE.Mesh(new THREE.BoxGeometry(0.38, 14.1, 0.38), colMat);
      column.position.set(x, 9.05, z);
      group.add(column);
    });
  });

  // ── Tie beams at base (Y = 2.2) ─────────────────────────────────────────────
  for (let i = 0; i < 3; i++) {
    const xMid = (xs[i] + xs[i + 1]) / 2;
    const xLen = Math.abs(xs[i + 1] - xs[i]) - 0.2;
    zs.forEach(z => {
      const tieX = new THREE.Mesh(new THREE.BoxGeometry(xLen, 0.18, 0.18), tieBeamMat);
      tieX.position.set(xMid, 2.2, z);
      group.add(tieX);
    });
  }

  for (let j = 0; j < 3; j++) {
    const zMid = (zs[j] + zs[j + 1]) / 2;
    const zLen = Math.abs(zs[j + 1] - zs[j]) - 0.2;
    xs.forEach(x => {
      const tieZ = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, zLen), tieBeamMat);
      tieZ.position.set(x, 2.2, zMid);
      group.add(tieZ);
    });
  }

  // ── Level beams ─────────────────────────────────────────────────────────────
  const levelHeights = [4.8, 7.6, 10.4, 13.2, 16.0];

  levelHeights.forEach(fy => {
    for (let i = 0; i < 3; i++) {
      const xMid = (xs[i] + xs[i + 1]) / 2;
      const xLen = Math.abs(xs[i + 1] - xs[i]) + 0.38;
      zs.forEach(z => {
        const beamX = new THREE.Mesh(new THREE.BoxGeometry(xLen, 0.36, 0.36), beamMat);
        beamX.position.set(xMid, fy, z);
        group.add(beamX);
      });
    }

    for (let j = 0; j < 3; j++) {
      const zMid = (zs[j] + zs[j + 1]) / 2;
      const zLen = Math.abs(zs[j + 1] - zs[j]) + 0.38;
      xs.forEach(x => {
        const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, zLen), beamMat);
        beamZ.position.set(x, fy, zMid);
        group.add(beamZ);
      });
    }
  });

  // ── Translucent floor slabs ──────────────────────────────────────────────────
  levelHeights.forEach((fy, flIndex) => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const xCent = (xs[i] + xs[i + 1]) / 2;
        const zCent = (zs[j] + zs[j + 1]) / 2;

        if ((i === 0 && j === 1) || (i === 2 && j === 1)) continue;
        if ((i + j + flIndex) % 4 === 1) continue;

        const slab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 2.8), slabMat);
        slab.position.set(xCent, fy - 0.1, zCent);
        group.add(slab);
      }
    }
  });

  // ── Shear walls / elevator cores ────────────────────────────────────────────
  const wall1A = new THREE.Mesh(new THREE.BoxGeometry(2.1, 15.4, 0.15), shearWallMat);
  wall1A.position.set(-3.1, 9.9, -1.6);
  const wall1B = new THREE.Mesh(new THREE.BoxGeometry(0.15, 15.4, 1.2), shearWallMat);
  wall1B.position.set(-4.6, 9.9, -1.0);
  const wall1C = new THREE.Mesh(new THREE.BoxGeometry(0.15, 15.4, 1.2), shearWallMat);
  wall1C.position.set(-4.6, 9.9, -2.2);
  group.add(wall1A, wall1B, wall1C);

  const wall2A = new THREE.Mesh(new THREE.BoxGeometry(2.1, 15.4, 0.15), shearWallMat);
  wall2A.position.set(1.6, 9.9, 3.1);
  const wall2B = new THREE.Mesh(new THREE.BoxGeometry(0.15, 15.4, 1.2), shearWallMat);
  wall2B.position.set(0.0, 9.9, 1.6);
  const wall2C = new THREE.Mesh(new THREE.BoxGeometry(0.15, 15.4, 1.2), shearWallMat);
  wall2C.position.set(0.0, 9.9, 4.6);
  group.add(wall2A, wall2B, wall2C);

  return group;
}
