import { Color, Group, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial } from 'three';
import { useGL } from './useGL.js';

/* THE CORRIDOR.
   A long hotel hallway built from four procedural planes (wallpaper,
   wainscot, doors, carpet, ceiling lamps — all shader, no textures).
   Scroll walks you forward while gravity rolls the whole hallway a full turn
   around you. */

const LEN = 260;
const HALF_W = 2.1;
const HALF_H = 1.6;

const vert = /* glsl */ `
  varying vec3 vP;
  varying float vDepth;
  void main() {
    vP = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const frag = /* glsl */ `
  uniform int uKind;        // 0 floor, 1 ceiling, 2 left wall, 3 right wall
  uniform float uTime;
  uniform vec3 uFog;
  varying vec3 vP;
  varying float vDepth;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    float z = vP.z;
    float lampZ = floor(z / 7.0 + 0.5) * 7.0;
    float lampId = lampZ / 7.0;
    float flick = 0.9 + 0.1 * sin(uTime * 7.0 + lampId * 3.1) * step(0.85, hash(lampId));
    vec3 lampPos = vec3(0.0, 1.55, lampZ);
    float d = distance(vP, lampPos);
    float light = (0.18 + 1.35 * exp(-d * d * 0.09)) * flick;

    vec3 col;
    if (uKind == 0) {
      // carpet: deep red with a gold lattice and a center runner
      vec2 c = vec2(vP.x, z) * 1.6;
      vec2 g = abs(fract(c + vec2(0.5 * step(0.5, fract(c.y * 0.5)), 0.0)) - 0.5);
      float diamond = step(g.x + g.y, 0.18);
      col = mix(vec3(0.34, 0.07, 0.06), vec3(0.62, 0.42, 0.16), diamond * 0.8);
      float runner = step(abs(abs(vP.x) - 1.3), 0.05);
      col = mix(col, vec3(0.7, 0.5, 0.2), runner);
    } else if (uKind == 1) {
      col = vec3(0.86, 0.78, 0.62);
      float disc = 1.0 - smoothstep(0.32, 0.38, length(vec2(vP.x, z - lampZ)));
      col = mix(col, vec3(1.6, 1.4, 1.0), disc);
      float beam = step(abs(fract(z / 3.5) - 0.5), 0.02);
      col = mix(col, vec3(0.55, 0.45, 0.3), beam);
    } else {
      float side = uKind == 2 ? 0.0 : 3.5;
      float y = vP.y;
      // damask-ish wallpaper
      vec2 wp = vec2(z * 2.2, y * 2.2);
      vec2 cell = fract(wp) - 0.5;
      float motif = smoothstep(0.24, 0.2, length(cell * vec2(1.0, 0.6)));
      float stripe = step(0.92, fract(z * 1.1));
      col = mix(vec3(0.62, 0.40, 0.20), vec3(0.72, 0.50, 0.26), motif * 0.6);
      col = mix(col, vec3(0.42, 0.24, 0.12), stripe * 0.5);
      // wainscot
      if (y < -0.55) {
        col = vec3(0.24, 0.12, 0.07);
        float panel = step(0.08, fract(z * 0.8)) * step(fract(z * 0.8), 0.92) * step(-1.5, y) * step(y, -0.65);
        col = mix(col, vec3(0.32, 0.17, 0.09), panel);
      }
      float rail = step(abs(y + 0.55), 0.035);
      col = mix(col, vec3(0.75, 0.55, 0.25), rail);
      // doors every 7m, staggered per side
      float dz = mod(z + side, 7.0) - 3.5;
      float door = step(abs(dz), 0.62) * step(y, 0.75);
      float frame = step(abs(dz), 0.75) * step(y, 0.88) * (1.0 - door);
      vec3 doorCol = vec3(0.30, 0.15, 0.08) + 0.05 * step(0.5, fract((y + 1.6) * 1.8));
      col = mix(col, vec3(0.12, 0.06, 0.03), frame);
      col = mix(col, doorCol, door);
      float knob = step(length(vec2(dz - 0.45, y + 0.1)), 0.05);
      col = mix(col, vec3(1.2, 0.9, 0.4), knob);
      float plaque = step(abs(dz), 0.14) * step(abs(y - 0.45), 0.07);
      col = mix(col, vec3(1.1, 0.82, 0.35), plaque);
      // sconce glow above door frames
      float sconce = exp(-pow(length(vec2(dz, y - 1.05)) * 6.0, 2.0));
      col += vec3(1.0, 0.7, 0.35) * sconce * 0.9;
    }
    col *= light;
    float f = 1.0 - exp(-pow(vDepth * 0.045, 1.6));
    gl_FragColor = vec4(mix(col, uFog, f), 1.0);
  }
`;

function surface(kind, uniforms) {
  const mat = new ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: { ...uniforms, uKind: { value: kind } },
  });
  let geo;
  if (kind === 0 || kind === 1) {
    geo = new PlaneGeometry(HALF_W * 2, LEN, 1, 1);
    geo.rotateX(kind === 0 ? -Math.PI / 2 : Math.PI / 2);
    geo.translate(0, kind === 0 ? -HALF_H : HALF_H, -LEN / 2 + 10);
  } else {
    geo = new PlaneGeometry(LEN, HALF_H * 2, 1, 1);
    geo.rotateY(kind === 2 ? Math.PI / 2 : -Math.PI / 2);
    geo.translate(kind === 2 ? -HALF_W : HALF_W, 0, -LEN / 2 + 10);
  }
  return new Mesh(geo, mat);
}

export default function Hallway({ progress, className = '' }) {
  const ref = useGL((renderer) => {
    const scene = new Scene();
    const fog = new Color('#1a0d08');
    scene.background = fog;
    const camera = new PerspectiveCamera(70, 1, 0.05, 200);
    const uniforms = { uTime: { value: 0 }, uFog: { value: fog } };
    const hall = new Group();
    [0, 1, 2, 3].forEach((k) => hall.add(surface(k, uniforms)));
    scene.add(hall);

    return {
      resize(w, h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      },
      frame(t) {
        const p = progress ? progress.get() : 0;
        uniforms.uTime.value = t;
        camera.position.set(0, -0.15 + Math.sin(t * 1.6) * 0.03, 6 - p * 200);
        camera.lookAt(0, -0.05, camera.position.z - 10);
        hall.rotation.z = p * Math.PI * 2;
        hall.position.y = 0;
        renderer.render(scene, camera);
      },
      dispose() {
        hall.traverse((o) => {
          o.geometry?.dispose();
          o.material?.dispose();
        });
      },
    };
  }, []);
  return <canvas ref={ref} className={`inc-gl ${className}`} aria-hidden="true" />;
}
