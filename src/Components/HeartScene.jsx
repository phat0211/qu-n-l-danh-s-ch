import React, { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial, Text } from "@react-three/drei";
import * as THREE from "three";


function useResponsiveConfig() {
  const [config, setConfig] = useState({
    cameraZ: 3.8,
    fontSize: 0.13,
    imageScale: [1.2, 0.8],
    imageY: 0.8,
    orbitRadiusX: 1.6,
    orbitRadiusZ: 1.0,
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {

        setConfig({
          cameraZ: 4.5,
          fontSize: 0.09,
          imageScale: [0.9, 0.6],
          imageY: 0.7,
          orbitRadiusX: 1.2,
          orbitRadiusZ: 0.75,
        });
      } else {
 
        setConfig({
          cameraZ: 3.8,
          fontSize: 0.13,
          imageScale: [1.2, 0.8],
          imageY: 0.8,
          orbitRadiusX: 1.6,
          orbitRadiusZ: 1.0,
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return config;
}


function GalaxyImage({ imageY, imageScale }) {
  const texture = useMemo(
    () => new THREE.TextureLoader().load(require("../asset/mấy thg lozz.jpg")),
    []
  );
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = imageY + Math.sin(t * 0.8) * 0.04;
      ref.current.rotation.y = Math.sin(t * 0.4) * 0.25;
      ref.current.material.opacity = Math.min(1, t * 0.4);
    }
  });

  return (
    <mesh ref={ref} position={[0, imageY, 0]}>
      <planeGeometry args={imageScale} />
      <meshBasicMaterial map={texture} transparent opacity={0} />
    </mesh>
  );
}


function makeGalaxyPoints(count = 2000, radius = 1.6) {
  const positions = new Float32Array(count * 3);
  const base = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 8;
    const r = Math.pow(Math.random(), 0.6) * radius;
    const x = Math.cos(angle) * r;
    const y = (Math.random() - 0.5) * 0.08;
    const z = Math.sin(angle) * r;
    positions.set([x, y, z], i * 3);
    base.push([x, y, z]);
  }
  return { positions, base };
}

function GalaxyParticles() {
  const ref = useRef();
  const { positions, base } = useMemo(() => makeGalaxyPoints(2000, 1.8), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < base.length; i++) {
      const [x, y, z] = base[i];
      const angle = Math.atan2(z, x) + t * 0.08;
      const dist = Math.sqrt(x * x + z * z);
      arr[i * 3] = Math.cos(angle) * dist;
      arr[i * 3 + 1] = y + Math.sin(t * 1.5 + i * 0.02) * 0.03;
      arr[i * 3 + 2] = Math.sin(angle) * dist;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.015}
        color="#ffd27f"
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}


function Firework() {
  const ref = useRef();
  const count = 300;
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const velocities = useMemo(
    () =>
      Array.from({ length: count }, () => [
        (Math.random() - 0.5) * 0.08,
        Math.random() * 0.15 + 0.05,
        (Math.random() - 0.5) * 0.08,
      ]),
    [count]
  );

  useFrame(() => {
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < velocities.length; i++) {
      arr[i * 3] += velocities[i][0];
      arr[i * 3 + 1] += velocities[i][1];
      arr[i * 3 + 2] += velocities[i][2];
      velocities[i][1] -= 0.002;
      if (arr[i * 3 + 1] < 0) {
        arr.set([0, 0, 0], i * 3);
        velocities[i][0] = (Math.random() - 0.5) * 0.08;
        velocities[i][1] = Math.random() * 0.15 + 0.05;
        velocities[i][2] = (Math.random() - 0.5) * 0.08;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[0, 1.2, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.02}
        color="#fff8e7"
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}


function OrbitingMainText({
  text = "Chúc AE Trung Thu vui vẻ",
  radiusX,
  radiusZ,
  y = -0.45,
  fontSize,
  color = "#ffd27f",
  speed = 0.25,
  repeat = 6,
  gap = 0.4,
}) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * speed;
      ref.current.position.y = y + Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: repeat }).map((_, i) => {
        const a = (i / repeat) * Math.PI * 2;
        const offset = i * gap;
        const x = Math.cos(a) * radiusX;
        const z = Math.sin(a) * radiusZ;
        const waveY = Math.sin(a * 2.2 + offset) * 0.06;
        const tilt = Math.sin((i / repeat) * Math.PI) * 0.25;

        return (
          <Text
            key={i}
            position={[x, waveY + y, z]}
            rotation={[tilt, -a + Math.PI / 2, 0]}
            fontSize={fontSize}
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.01}
          >
            {text}
            <meshBasicMaterial toneMapped={false} color={color} />
          </Text>
        );
      })}
    </group>
  );
}


export default function HeartScene() {
  const config = useResponsiveConfig();

  return (
    <div style={{ width: "100%", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0.3, config.cameraZ], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 2]} intensity={1} color="#ffd27f" />

        <GalaxyParticles />
        <GalaxyImage imageY={config.imageY} imageScale={config.imageScale} />
        <Firework />
        <OrbitingMainText
          radiusX={config.orbitRadiusX}
          radiusZ={config.orbitRadiusZ}
          fontSize={config.fontSize}
        />
      </Canvas>
    </div>
  );
}
