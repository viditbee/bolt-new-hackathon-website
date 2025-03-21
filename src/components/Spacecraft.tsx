import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, MeshStandardMaterial } from 'three';
import { useSpacecraftControls } from '../hooks/useSpacecraftControls';
import SpacecraftTrail, { SpacecraftTrailRef } from './SpacecraftTrail';

interface SpacecraftMesh extends Mesh {
  material: MeshStandardMaterial;
}

export default function Spacecraft() {
  const group = useRef<Group>(null);
  const shipBody = useRef<SpacecraftMesh>(null);
  const engineGlowRef = useRef<Mesh>(null);
  const trailRef = useRef<SpacecraftTrailRef>(null);
  const { updateMovement } = useSpacecraftControls();

  useFrame((state, delta) => {
    if (!group.current || !shipBody.current || !engineGlowRef.current) return;

    // Update movement based on keyboard controls
    const { velocity, rotation, isMoving, isBoosting } = updateMovement(delta);
    group.current.position.add(velocity);
    
    // Update rotation
    shipBody.current.rotation.z = rotation.z;
    shipBody.current.rotation.x = rotation.x;
    
    // Add hover effect
    const time = state.clock.getElapsedTime();
    group.current.position.y += Math.sin(time * 2) * 0.002;
    
    // Update engine glow
    const glowIntensity = isMoving ? (isBoosting ? 2 : 1) : 0.5;
    shipBody.current.material.emissiveIntensity = glowIntensity;
    engineGlowRef.current.scale.setScalar(0.8 + Math.sin(time * 10) * 0.2 * glowIntensity);

    // Update trail
    if (trailRef.current && (isMoving || isBoosting)) {
      trailRef.current.updateTrail(group.current.position, velocity);
    }
  });

  return (
    <>
      <SpacecraftTrail ref={trailRef} maxPoints={150} />
      <group ref={group}>
        <group scale={[1.2, 1.2, 1.2]}>
          {/* Main ship body */}
          <mesh ref={shipBody}>
            <capsuleGeometry args={[0.5, 1.5, 4, 16]} />
            <meshStandardMaterial
              color="#2a2a2a"
              emissive="#00f3ff"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>

          {/* Cockpit dome */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.4, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
            <meshStandardMaterial
              color="#00f3ff"
              emissive="#00f3ff"
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
              metalness={1}
              roughness={0}
              toneMapped={false}
            />
          </mesh>

          {/* Wings */}
          <group position={[0, -0.2, 0]}>
            {/* Left wing */}
            <mesh position={[0.8, 0, 0]} rotation={[0, 0, Math.PI * 0.15]}>
              <boxGeometry args={[1.2, 0.1, 0.4]} />
              <meshStandardMaterial
                color="#b537f2"
                emissive="#b537f2"
                emissiveIntensity={1}
                toneMapped={false}
              />
            </mesh>
            {/* Right wing */}
            <mesh position={[-0.8, 0, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
              <boxGeometry args={[1.2, 0.1, 0.4]} />
              <meshStandardMaterial
                color="#b537f2"
                emissive="#b537f2"
                emissiveIntensity={1}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* Engine boosters */}
          <group position={[0, -1, 0]}>
            {/* Center engine */}
            <mesh ref={engineGlowRef}>
              <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
              <meshStandardMaterial
                color="#3dff3e"
                emissive="#3dff3e"
                emissiveIntensity={2}
                transparent
                opacity={0.8}
                toneMapped={false}
              />
            </mesh>
            {/* Side engines */}
            <mesh position={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
              <meshStandardMaterial
                color="#3dff3e"
                emissive="#3dff3e"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
              <meshStandardMaterial
                color="#3dff3e"
                emissive="#3dff3e"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* Detail stripes */}
          <mesh position={[0, 0, 0.45]}>
            <boxGeometry args={[0.8, 0.05, 0.1]} />
            <meshStandardMaterial
              color="#00f3ff"
              emissive="#00f3ff"
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.45]}>
            <boxGeometry args={[0.8, 0.05, 0.1]} />
            <meshStandardMaterial
              color="#00f3ff"
              emissive="#00f3ff"
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}