import {
  BoxGeometry, Color, Group, InstancedMesh, Matrix4, Mesh, PerspectiveCamera, PlaneGeometry,
  Quaternion, Scene, ShaderMaterial, Vector3,
} from 'three';
import { useGL, seeded } from './useGL.js';

/* THE FOLD.
   A dusk city on a street grid. Scroll bends the far half of the city up
   into a wall and then over your head into a ceiling — two hinges, so the
   street becomes a cube around you. Buildings are instanced unit boxes;
   windows, outlines, lighting and fog are all procedural in the shader, so
   there are no textures to load. */

const FOG = new Color('#1b2633');

const buildingVert = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vObj;
  varying vec3 vObjN;
  varying vec3 vN;
  varying float vDepth;
  varying vec2 vSeed;
  void main() {
    vec4 local = vec4(position, 1.0);
    vec3 n = normal;
    #ifdef USE_INSTANCING
      local = instanceMatrix * local;
      n = mat3(instanceMatrix) * normal;
      vSeed = instanceMatrix[3].xz;
    #else
      vSeed = vec2(0.0);
    #endif
    vObj = position;
    vObjN = normal;
    vLocal = local.xyz;
    vec4 world = modelMatrix * local;
    vN = normalize(mat3(modelMatrix) * n);
    vec4 mv = viewMatrix * world;
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const buildingFrag = /* glsl */ `
  uniform vec3 uFog;
  uniform float uDensity;
  uniform float uTime;
  varying vec3 vLocal;
  varying vec3 vObj;
  varying vec3 vObjN;
  varying vec3 vN;
  varying float vDepth;
  varying vec2 vSeed;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    vec3 n = normalize(vN);
    vec3 L = normalize(vec3(-0.45, 0.75, 0.35));
    float diff = 0.42 + 0.58 * max(dot(n, L), 0.0);
    float tone = hash(vSeed * 0.37);
    vec3 base = mix(vec3(0.19, 0.24, 0.30), vec3(0.31, 0.33, 0.36), tone);
    vec3 col = base * diff;

    bool side = abs(vObjN.y) < 0.5;
    if (side) {
      float u = abs(vObjN.x) > 0.5 ? vLocal.z : vLocal.x;
      float v = vLocal.y;
      vec2 g = vec2(u * 2.4, v * 1.9);
      vec2 c = floor(g);
      vec2 f = fract(g);
      float win = step(0.22, f.x) * step(f.x, 0.78) * step(0.18, f.y) * step(f.y, 0.72);
      float h = hash(c + vSeed);
      float lit = step(0.64, h);
      float flick = 0.85 + 0.15 * sin(uTime * (1.0 + h * 3.0) + h * 40.0);
      vec3 warm = mix(vec3(1.0, 0.70, 0.36), vec3(0.85, 0.92, 1.0), step(0.9, h));
      vec3 glass = vec3(0.05, 0.07, 0.10) + 0.08 * n.y;
      vec3 wc = mix(glass, warm * flick, lit);
      col = mix(col, wc, win * step(0.6, vLocal.y));
    } else {
      col *= 0.78;
    }

    // ink outline along box edges (unit box, base at y=0)
    vec3 a = abs(vObj - vec3(0.0, 0.5, 0.0));
    float e;
    if (abs(vObjN.x) > 0.5) e = max(a.y, a.z);
    else if (abs(vObjN.z) > 0.5) e = max(a.x, a.y);
    else e = max(a.x, a.z);
    col = mix(col, vec3(0.03, 0.04, 0.06), smoothstep(0.475, 0.5, e) * 0.85);

    float f = 1.0 - exp(-pow(vDepth * uDensity, 2.0));
    gl_FragColor = vec4(mix(col, uFog, f), 1.0);
  }
`;

const groundVert = /* glsl */ `
  varying vec2 vP;
  varying float vDepth;
  void main() {
    vP = position.xz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const groundFrag = /* glsl */ `
  uniform vec3 uFog;
  uniform float uDensity;
  varying vec2 vP;
  varying float vDepth;
  void main() {
    float x = vP.x;
    float z = vP.y;
    vec3 asphalt = vec3(0.09, 0.11, 0.14);
    vec3 walk = vec3(0.20, 0.22, 0.25);
    float ax = abs(x);
    float avenue = step(ax, 5.0);
    float sideStreet = step(abs(mod(ax - 5.0, 16.0) - 14.0), 2.0);
    float cross = step(mod(-z, 14.0), 4.0);
    float road = max(avenue, max(sideStreet, cross));
    vec3 col = mix(walk, asphalt, road);
    float dash = step(ax, 0.08) * step(fract(z * 0.18), 0.5) * avenue;
    col = mix(col, vec3(0.95, 0.72, 0.35), dash);
    float curb = step(abs(ax - 5.0), 0.08);
    col = mix(col, vec3(0.45, 0.48, 0.52), curb);
    // faint architect grid
    vec2 g = abs(fract(vP * 0.5) - 0.5);
    col += 0.025 * step(0.47, max(g.x, g.y));
    float f = 1.0 - exp(-pow(vDepth * uDensity, 2.0));
    gl_FragColor = vec4(mix(col, uFog, f), 1.0);
  }
`;

function buildSegment(rand, zFrom, zTo, mat) {
  const m = new Matrix4();
  const q = new Quaternion();
  const s = new Vector3();
  const p = new Vector3();
  const items = [];
  for (let bz = zFrom; bz > zTo; bz -= 14) {
    for (let side of [-1, 1]) {
      for (let k = 0; k < 7; k++) {
        const x0 = 7 + k * 16;
        // a block spans x0..x0+12 on this side, z bz-4..bz-14
        let cx = x0;
        while (cx < x0 + 12) {
          const w = 2.4 + rand() * 3.2;
          const d = 3 + rand() * 6;
          const tall = rand() < 0.08 ? 26 + rand() * 18 : 4 + rand() * (k === 0 ? 14 : 20);
          const zc = bz - 4 - d / 2 - rand() * (10 - d);
          items.push([side * (cx + w / 2), zc, w, tall, d]);
          cx += w + 0.6;
        }
      }
    }
  }
  const mesh = new InstancedMesh(new BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mat, items.length);
  items.forEach(([x, z, w, h, d], i) => {
    p.set(x, 0, z);
    s.set(w, h, d);
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
  });
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
}

function ground(len, mat, zCenter) {
  // geometry baked into segment space so the shader sees real x/z
  const geo = new PlaneGeometry(260, len);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0, zCenter);
  return new Mesh(geo, mat);
}

export default function CityFold({ progress, className = '' }) {
  const ref = useGL((renderer) => {
    const scene = new Scene();
    scene.background = FOG;
    const camera = new PerspectiveCamera(58, 1, 0.1, 600);

    const uniforms = { uFog: { value: FOG }, uDensity: { value: 0.0085 }, uTime: { value: 0 } };
    const bMat = new ShaderMaterial({ vertexShader: buildingVert, fragmentShader: buildingFrag, uniforms });
    const gMat = new ShaderMaterial({ vertexShader: groundVert, fragmentShader: groundFrag, uniforms });
    const rand = seeded(23);

    // near segment: z 40 .. -30
    const near = new Group();
    near.add(ground(70, gMat, 5));
    near.add(buildSegment(rand, 42, -30, bMat));
    scene.add(near);

    // hinge A at z = -30: the wall
    const hingeA = new Group();
    hingeA.position.z = -30;
    hingeA.add(ground(42, gMat, -21));
    hingeA.add(buildSegment(rand, 0, -42, bMat));
    scene.add(hingeA);

    // hinge B at the top of the wall: the ceiling
    const hingeB = new Group();
    hingeB.position.z = -42;
    hingeB.add(ground(140, gMat, -70));
    hingeB.add(buildSegment(rand, 0, -140, bMat));
    hingeA.add(hingeB);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove);

    const look = new Vector3();
    const ease = (t) => t * t * (3 - 2 * t);
    const clamp = (v) => Math.min(1, Math.max(0, v));

    return {
      resize(w, h) {
        camera.aspect = w / h;
        camera.fov = w < h ? 75 : 58;
        camera.updateProjectionMatrix();
      },
      frame(t) {
        const pr = progress ? progress.get() : 0;
        uniforms.uTime.value = t;
        const a = ease(clamp(pr / 0.55));
        const b = ease(clamp((pr - 0.3) / 0.6));
        hingeA.rotation.x = a * Math.PI * 0.5;
        hingeB.rotation.x = b * Math.PI * 0.5;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        const idle = Math.sin(t * 0.25) * 0.6;
        camera.position.set(mouse.x * 2.2 + idle, 2.2 + pr * 2 - mouse.y * 0.8, 30 - pr * 16);
        look.set(mouse.x * 4, 3 + ease(pr) * 34, -30 + pr * 6);
        camera.lookAt(look);
        camera.rotateZ(Math.sin(t * 0.2) * 0.01 + pr * 0.05);
        renderer.render(scene, camera);
      },
      dispose() {
        window.removeEventListener('pointermove', onMove);
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
        });
        bMat.dispose();
        gMat.dispose();
      },
    };
  }, []);

  return <canvas ref={ref} className={`inc-gl ${className}`} aria-hidden="true" />;
}
