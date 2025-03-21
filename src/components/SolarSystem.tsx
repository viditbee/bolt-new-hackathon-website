import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';
import { getPlanetTexture, createRingsTexture } from '../utils/getPlanetTexture';

interface PlanetProps {
  name: string;
  position: [number, number, number];
  size: number;
  rotationSpeed?: number;
  atmosphereColor?: string;
  hasRings?: boolean;
  ringSize?: [number, number];
  tilt?: number;
}

const Planet = ({
  name,
  position,
  size,
  rotationSpeed = 0.001,
  atmosphereColor,
  hasRings,
  ringSize,
  tilt = 0
}: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const texture = getPlanetTexture(name);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += rotationSpeed * 0.5;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += rotationSpeed * 0.2;
    }
  });

  return (
    <group position={position} rotation={[tilt, 0, 0]}>
      {/* Planet body */}
      <Sphere ref={planetRef} args={[size, 64, 64]}>
        <meshStandardMaterial
          map={texture}
          metalness={0.2}
          roughness={0.8}
        />
      </Sphere>

      {/* Atmosphere */}
      {atmosphereColor && (
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[size * 1.05, 32, 32]} />
          <meshStandardMaterial
            color={atmosphereColor}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Rings (Saturn) */}
      {hasRings && ringSize && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ringSize[0], ringSize[1], 128]} />
          <meshStandardMaterial
            map={createRingsTexture()}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

export default function SolarSystem() {
  return (
    <group>
      {/* Sun */}
      <group position={[0, 0, -50]}>
        <Sphere args={[5, 64, 64]}>
          <meshStandardMaterial
            color="#ffa726"
            emissive="#ffa726"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </Sphere>
        <pointLight intensity={1} distance={100} decay={2} />
      </group>

      {/* Planets */}
      <Planet
        name="mercury"
        position={[-30, 0, -40]}
        size={1}
        rotationSpeed={0.005}
      />

      <Planet
        name="venus"
        position={[-15, 5, -35]}
        size={1.5}
        rotationSpeed={0.003}
        atmosphereColor="#ffeb3b"
      />

      <Planet
        name="earth"
        position={[15, -5, -30]}
        size={2}
        rotationSpeed={0.002}
        atmosphereColor="#4fc3f7"
      />

      <Planet
        name="mars"
        position={[25, 10, -40]}
        size={1.2}
        rotationSpeed={0.002}
        atmosphereColor="#ff5722"
      />

      <Planet
        name="jupiter"
        position={[-40, -15, -60]}
        size={4}
        rotationSpeed={0.004}
      />

      <Planet
        name="saturn"
        position={[45, 20, -70]}
        size={3.5}
        rotationSpeed={0.003}
        hasRings={true}
        ringSize={[4.5, 8]}
        tilt={0.4}
      />

      <Planet
        name="uranus"
        position={[-60, 0, -80]}
        size={2.5}
        rotationSpeed={0.002}
        tilt={1.7}
        atmosphereColor="#b1d9e3"
      />

      <Planet
        name="neptune"
        position={[70, -25, -90]}
        size={2.4}
        rotationSpeed={0.002}
        atmosphereColor="#1e88e5"
      />
    </group>
  );
}