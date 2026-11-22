import {
  CanvasTexture, CircleGeometry, Group, LatheGeometry, Mesh, MeshBasicMaterial, MeshMatcapMaterial,
  PerspectiveCamera, Scene, SRGBColorSpace, Vector2,
} from 'three';
import { useGL } from './useGL.js';

/* A brushed-steel spinning top, turned on a lathe. Matcap shading from a
   canvas-painted sphere, so it reads as polished metal with no lights.
   mode 'spin'  — spins forever, precessing gently.
   mode 'ending' — spins, then the wobble grows on a 10s loop (the CSS
                   cut-to-black is timed to the same loop). */

function matcap() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(90, 80, 10, 128, 128, 128);
  grd.addColorStop(0, '#ffffff');
  grd.addColorStop(0.18, '#e4ebf2');
  grd.addColorStop(0.45, '#8e9cab');
  grd.addColorStop(0.75, '#3b4552');
  grd.addColorStop(1, '#0c1016');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  // warm rim from the room
  const rim = g.createRadialGradient(128, 128, 96, 128, 128, 128);
  rim.addColorStop(0, 'rgba(255,170,80,0)');
  rim.addColorStop(1, 'rgba(255,170,80,.55)');
  g.fillStyle = rim;
  g.fillRect(0, 0, 256, 256);
  // brushed rings
  g.globalAlpha = 0.08;
  for (let r = 10; r < 128; r += 5) {
    g.strokeStyle = r % 10 ? '#000' : '#fff';
    g.beginPath();
    g.arc(128, 128, r, 0, Math.PI * 2);
    g.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function shadowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.65)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export default function TotemGL({ mode = 'spin', className = '' }) {
  const ref = useGL((renderer) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 2.6, 7.2);
    camera.lookAt(0, 0.95, 0);

    const pts = [
      [0.0, 0.0], [0.08, 0.05], [0.3, 0.32], [0.55, 0.62], [0.78, 0.92], [0.92, 1.12], [0.97, 1.24],
      [0.95, 1.32], [0.8, 1.38], [0.45, 1.42], [0.2, 1.45], [0.15, 1.5], [0.15, 2.2], [0.19, 2.25],
      [0.17, 2.32], [0.0, 2.34],
    ].map(([r, y]) => new Vector2(r, y));
    const mat = new MeshMatcapMaterial({ matcap: matcap() });
    const body = new Mesh(new LatheGeometry(pts, 64), mat);

    // engraved rings, slightly darker
    const ringMat = new MeshMatcapMaterial({ matcap: mat.matcap, color: 0x8a96a3 });
    const ring = new Mesh(new LatheGeometry([new Vector2(0.86, 1.0), new Vector2(0.9, 1.04), new Vector2(0.94, 1.1)], 64), ringMat);

    const spin = new Group();
    spin.add(body, ring);
    const tilt = new Group();
    tilt.add(spin);
    scene.add(tilt);

    const shadow = new Mesh(new CircleGeometry(1.1, 32), new MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.002;
    scene.add(shadow);

    let start = 0;
    return {
      resize(w, h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      frame(t, dt) {
        if (!start) start = t;
        const loopT = mode === 'ending' ? ((t - start) % 10) / 10 : 0;
        const wob = mode === 'ending' ? 0.05 + Math.pow(loopT, 3) * 0.32 : 0.06;
        const speed = mode === 'ending' ? 26 - loopT * 14 : 24;
        spin.rotation.y += dt * speed;
        tilt.rotation.z = Math.sin(t * 3.1) * wob;
        tilt.rotation.x = Math.cos(t * 3.1) * wob;
        tilt.position.x = Math.sin(t * 0.9) * 0.08;
        shadow.position.x = tilt.position.x + tilt.rotation.z * -0.4;
        shadow.scale.setScalar(1 + wob * 0.6);
        renderer.render(scene, camera);
      },
      dispose() {
        scene.traverse((o) => {
          o.geometry?.dispose();
          o.material?.map?.dispose();
          o.material?.dispose?.();
        });
        mat.matcap.dispose();
      },
    };
  }, [mode]);
  return <canvas ref={ref} className={`inc-gl inc-totemgl ${className}`} aria-hidden="true" />;
}
