import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';
import { useCursorEffects } from '../hooks/useCursorEffects';

interface ParticlePoint {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  color: THREE.Color;
}

export default function ParticleTrails() {
  const points = useRef<THREE.Points>(null);
  const particles = useRef<ParticlePoint[]>([]);
  const cursor = useCursorEffects(20);
  
  // Initialize particles
  const particleCount = 1000;
  const positions = useMemo(() => new Float32Array(particleCount * 3), []);
  const colors = useMemo(() => new Float32Array(particleCount * 3), []);

  useFrame(() => {
    if (!points.current) return;

    // Convert cursor position to world space
    const mousePos = new THREE.Vector3(
      cursor.position.x * 10,
      cursor.position.y * 5,
      0
    );

    // Add new particles based on velocity
    const speed = cursor.velocity.length();
    const spawnCount = Math.floor(speed * 10) + 1;
    
    for (let i = 0; i < spawnCount && particles.current.length < particleCount; i++) {
      const color = new THREE.Color();
      
      // Color based on velocity
      if (speed > 0.05) {
        color.setHSL(0.6, 1, 0.5); // Blue for fast movement
      } else {
        color.setHSL(0.3, 1, 0.5); // Green for slow movement
      }

      particles.current.push({
        position: mousePos.clone().add(
          new THREE.Vector3(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5
          )
        ),
        velocity: new THREE.Vector3(
          cursor.velocity.x * 2 + (Math.random() - 0.5) * 0.2,
          cursor.velocity.y * 2 + (Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2
        ),
        life: 1.0,
        color
      });
    }

    // Update particles
    let index = 0;
    particles.current = particles.current.filter(particle => {
      // Update position
      particle.position.add(particle.velocity);
      
      // Apply gravity towards center
      const toCenter = particle.position.clone().negate();
      particle.velocity.add(toCenter.multiplyScalar(0.001));
      
      // Add some random movement
      particle.velocity.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ));
      
      // Apply dampening
      particle.velocity.multiplyScalar(0.98);
      
      // Update life
      particle.life -= 0.01;
      
      // Update position and color arrays if particle is still alive
      if (particle.life > 0 && index < particleCount) {
        positions[index * 3] = particle.position.x;
        positions[index * 3 + 1] = particle.position.y;
        positions[index * 3 + 2] = particle.position.z;
        
        const alpha = particle.life;
        colors[index * 3] = particle.color.r * alpha;
        colors[index * 3 + 1] = particle.color.g * alpha;
        colors[index * 3 + 2] = particle.color.b * alpha;
        
        index++;
        return true;
      }
      return false;
    });

    // Update geometry
    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <Points ref={points} limit={particleCount}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
    </Points>
  );
}