import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { cameraForBuilding, HOME_CAMERA, isSelectionGesture } from "./world-config.mjs";
import { places, type Place } from "./places.mjs";
function Unavailable({ onUnavailable }: { onUnavailable: () => void }) {
  useEffect(onUnavailable, [onUnavailable]);
  return null;
}
function Building({
  p,
  select,
  night,
}: {
  p: Place;
  select: (id: string) => void;
  night: boolean;
}) {
  const [hover, setHover] = useState(false);
  useEffect(
    () => () => {
      document.body.style.cursor = "auto";
    },
    [],
  );
  return (
    <group
      position={p.pos}
      scale={hover ? 1.08 : 1}
      onClick={(e) => {
        e.stopPropagation();
        if(isSelectionGesture(e.delta))select(p.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
    >
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.45, 1.4, 1.3]} />
        <meshStandardMaterial color={p.color} flatShading />
      </mesh>
      {p.id === "contact" ? (
        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.38, 0.58, 1.1, 6]} />
          <meshStandardMaterial color="#f9cda4" />
        </mesh>
      ) : (
        <mesh position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1.12, 0.85, 4]} />
          <meshStandardMaterial
            color={p.id === "projects" ? "#709ec3" : "#bc92a9"}
            flatShading
          />
        </mesh>
      )}
      <mesh position={[0, 0.14, 0.2]} receiveShadow>
        <boxGeometry args={[1.7, 0.16, 1.8]} />
        <meshStandardMaterial color="#e9d8bb" />
      </mesh>
      <mesh position={[0, 0.56, 0.665]}>
        <boxGeometry args={[0.36, 0.82, 0.05]} />
        <meshStandardMaterial color="#547d7a" />
      </mesh>
      <mesh position={[0.11, 0.56, 0.704]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshStandardMaterial color="#e8bf7a" />
      </mesh>
      {[-0.48, 0.48].map((x) => (
        <group key={x} position={[x, 0.99, 0.67]}>
          <mesh>
            <boxGeometry args={[0.33, 0.4, 0.055]} />
            <meshStandardMaterial color="#f5efdd" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.23, 0.3, 0.02]} />
            <meshStandardMaterial
              color={night ? "#ffe5a2" : "#a3cdd5"}
              emissive={night ? "#ffce75" : "#000000"}
              emissiveIntensity={night ? 0.7 : 0}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[0.74, 0.98, 0]}>
        <boxGeometry args={[0.025, 0.36, 0.5]} />
        <meshStandardMaterial
          color={night ? "#ffe5a2" : "#a3cdd5"}
          emissive={night ? "#ffce75" : "#000000"}
          emissiveIntensity={night ? 0.7 : 0}
        />
      </mesh>
      {p.id === "contact" && (
        <group>
          <mesh position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.41, 0.41, 0.38, 8]} />
            <meshStandardMaterial
              color={night ? "#ffe2a1" : "#a3cdd5"}
              emissive={night ? "#ffc467" : "#000000"}
              emissiveIntensity={night ? 1 : 0}
            />
          </mesh>
          <mesh position={[0, 2.4, 0]}>
            <coneGeometry args={[0.6, 0.35, 8]} />
            <meshStandardMaterial color="#638f8a" />
          </mesh>
        </group>
      )}
      {p.id === "projects" && (
        <mesh position={[-0.35, 1.92, -0.18]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[0.4, 0.18, 0.35]} />
          <meshStandardMaterial color="#c3e0e5" />
        </mesh>
      )}
      <Html position={[0, 2.85, 0]} center zIndexRange={[10, 0]}>
        <button className="building-label" onClick={() => select(p.id)}>
          {p.subtitle}
        </button>
      </Html>
    </group>
  );
}
function Tree({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.7, 6]} />
        <meshStandardMaterial color="#98785d" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <coneGeometry args={[0.52, 1.2, 7]} />
        <meshStandardMaterial color="#81bd9c" />
      </mesh>
    </group>
  );
}
function CameraRig({
  selected,
  reset,
  reducedMotion,
}: {
  selected: string | null;
  reset: number;
  reducedMotion: boolean;
}) {
  const controls = useRef<OrbitControlsImpl | null>(null);
  const { camera } = useThree();
  const target = useRef(new Vector3());
  const position = useRef(new Vector3(10, 10, 13));
  const focusing = useRef(false);
  useEffect(() => {
    const p = places.find((x) => x.id === selected);
    const view = p ? cameraForBuilding(p.pos) : HOME_CAMERA;
    target.current.set(...view.target);
    position.current.set(...view.position);
    focusing.current = true;
  }, [selected, reset]);
  useFrame((_, delta) => {
    const k = reducedMotion ? 1 : 1 - Math.exp(-3 * Math.min(delta, 0.1));
    if (focusing.current && controls.current) {
      controls.current.target.lerp(target.current, k);
      controls.current.update();
      camera.position.lerp(position.current, k);
      if (camera.position.distanceTo(position.current) < 0.04)
        focusing.current = false;
    }
  });
  return (
    <OrbitControls
      ref={controls}
      enablePan={false}
      enableDamping
      minDistance={7}
      maxDistance={25}
      maxPolarAngle={1.4}
      onStart={() => {
        focusing.current = false;
      }}
    />
  );
}
export default function World({
  select,
  reset,
  selected,
  night,
  reducedMotion,
  onUnavailable,
}: {
  select: (id: string) => void;
  reset: number;
  selected: string | null;
  night: boolean;
  reducedMotion: boolean;
  onUnavailable: () => void;
}) {
  const cleanup=useRef<()=>void>(()=>{});
  useEffect(()=>()=>cleanup.current(),[]);
  return (
    <Canvas
      fallback={<Unavailable onUnavailable={onUnavailable} />}
      onCreated={({ gl }) => {
        const canvas=gl.domElement;
        const lost=(event:Event)=>{event.preventDefault();onUnavailable()};
        canvas.addEventListener('webglcontextlost',lost);
        cleanup.current=()=>canvas.removeEventListener('webglcontextlost',lost);
      }}
      shadows
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [10, 10, 13], fov: 40 }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={night ? 0.8 : 1.6} />
      <directionalLight
        position={[5, 12, 6]}
        intensity={night ? 1 : 2.2}
        castShadow
      />
      {night && (
        <pointLight position={[0, 4, 0]} intensity={20} color="#ffe0a3" />
      )}
      <Float
        speed={reducedMotion ? 0 : 0.6}
        floatIntensity={reducedMotion ? 0 : 0.12}
        rotationIntensity={0}
      >
        <mesh position={[0, -0.55, 0]} receiveShadow>
          <cylinderGeometry args={[6.6, 5.7, 1.1, 10]} />
          <meshStandardMaterial color="#bca489" flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <cylinderGeometry args={[6.62, 6.62, 0.17, 10]} />
          <meshStandardMaterial color="#b9dfb2" flatShading />
        </mesh>
        {places.map((p) => {
          const length = Math.hypot(p.pos[0], p.pos[2]);
          return (
            <mesh
              key={"path-" + p.id}
              position={[p.pos[0] / 2, 0.12, p.pos[2] / 2]}
              rotation={[0, Math.atan2(p.pos[0], p.pos[2]), 0]}
              receiveShadow
            >
              <boxGeometry args={[0.45, 0.03, length]} />
              <meshStandardMaterial color="#e8d7b7" />
            </mesh>
          );
        })}
        <mesh
          position={[0, 0.14, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[0.72, 10]} />
          <meshStandardMaterial color="#ebdec2" />
        </mesh>
        <group position={[0.3, 0.15, 3.1]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.75, 9]} />
            <meshStandardMaterial color="#8bbec6" flatShading />
          </mesh>
          <mesh position={[0.2, 0.045, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.24, 0.265, 16]} />
            <meshStandardMaterial color="#d1e7e4" />
          </mesh>
        </group>
        {[
          [4.7, 1.4],
          [-4.6, -0.8],
          [2.8, -4.4],
        ].map(([x, z], i) => (
          <mesh
            key={"rock-" + i}
            position={[x, 0.22, z]}
            scale={[0.55, 0.32, 0.4]}
            castShadow
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#d4d5bf" flatShading />
          </mesh>
        ))}
        {places.map((p) => (
          <Building key={p.id} p={p} select={select} night={night} />
        ))}
        {[
          [-4, -3],
          [-4, 2],
          [0, 4],
          [3.8, 3.1],
          [4.5, -2.5],
          [-1, -4.5],
        ].map(([x, z], i) => (
          <Tree key={i} x={x} z={z} />
        ))}
      </Float>
      <CameraRig
        selected={selected}
        reset={reset}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
