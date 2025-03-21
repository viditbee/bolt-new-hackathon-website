import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sphere } from '@react-three/drei';

interface PlanetProps {
  position?: [number, number, number];
}

export default function Planet({ position = [15, 5, -10] }: PlanetProps) {
  const group = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!group.current || !atmosphereRef.current) return;
    
    // Rotate planet slowly
    group.current.rotation.y += 0.001;
    
    // Pulse atmosphere
    const time = state.clock.getElapsedTime();
    const pulse = Math.sin(time) * 0.1 + 0.9;
    atmosphereRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <group ref={group} position={position}>
      {/* Planet core */}
      <Sphere args={[3, 32, 32]}>
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.8}
          roughness={0.5}
          emissive="#00f3ff"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshStandardMaterial
          color="#00f3ff"
          transparent
          opacity={0.1}
          emissive="#00f3ff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Surface details */}
      <group rotation={[Math.PI * 0.1, 0, 0]}>
        <mesh position={[1.5, 1, 1.5]}>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial
            color="#b537f2"
            emissive="#b537f2"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[-1.5, -1, -1.5]}>
          <boxGeometry args={[0.5, 1.5, 0.5]} />
          <meshStandardMaterial
            color="#3dff3e"
            emissive="#3dff3e"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* Orbital ring */}
      <group rotation={[Math.PI * 0.5, 0, 0]}>
        <mesh>
          <ringGeometry args={[3.8, 4, 64]} />
          <meshBasicMaterial
            color="#00f3ff"
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}