import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Float } from "@react-three/drei";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { cameraForBuilding, HOME_CAMERA } from "./world-config.mjs";
import { places, type Place } from "./places.mjs";
function Unavailable({ onUnavailable }: { onUnavailable: () => void }) {
  useEffect(onUnavailable, [onUnavailable]);
  return null;
}
function Building({ p, select }: { p: Place; select: (id: string) => void }) {
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
        select(p.id);
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
      <Html position={[0, 2.55, 0]} center>
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
  return (
    <Canvas
      fallback={<Unavailable onUnavailable={onUnavailable} />}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", onUnavailable, {
          once: true,
        });
      }}
      shadows
      camera={{ position: [10, 10, 13], fov: 40 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={[night ? "#25384d" : "#eaf6f6"]} />
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
        {places.map((p) => (
          <Building key={p.id} p={p} select={select} />
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
