import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import Spacecraft from './Spacecraft';
import SolarSystem from './SolarSystem';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: auto;
  background: var(--color-background);
  z-index: 1;
`;

const LoadingScreen = styled.div<{ $isLoading: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-background);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-neon-blue);
  font-family: var(--font-terminal);
  z-index: 2;
  opacity: ${props => props.$isLoading ? 1 : 0};
  transition: opacity 1s ease-out;
  pointer-events: ${props => props.$isLoading ? 'all' : 'none'};
`;

const Scene = () => {
  const location = useLocation();
  const { camera } = useThree();
  const [, setSceneReady] = useState(false);

  const cameraPositions = {
    '/': [0, 0, 15],
    '/explore': [0, 0, 15],
    '/about': [15, 5, 15],
    '/prizes': [-15, 0, 15],
    '/sponsors': [0, 15, 15],
    '/judges': [0, -15, 15],
    '/faq': [-15, -15, 15],
    '/register': [15, -15, 15],
  };

  useEffect(() => {
    const [x, y, z] = cameraPositions[location.pathname as keyof typeof cameraPositions] || [0, 0, 15];
    const targetPosition = new THREE.Vector3(x, y, z);
    
    // Animate camera position
    const duration = 1.5;
    const start = camera.position.clone();
    const startTime = Date.now();

    function animate() {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Use cubic-bezier easing
      const t = progress;
      const ease = t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

      camera.position.lerpVectors(start, targetPosition, ease);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  }, [location, camera]);

  // Set scene as ready after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSceneReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const isExploreMode = location.pathname === '/explore';

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Spacecraft />
      <SolarSystem />
      
      {/* Camera controls */}
      <OrbitControls
        enabled={isExploreMode}
        enablePan={false}
        enableZoom={true}
        maxDistance={100}
        minDistance={5}
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
      />
      
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  );
};

export default function Experience() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CanvasWrapper>
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'var(--color-background)' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <LoadingScreen $isLoading={isLoading}>
        INITIALIZING HACKATHON UNIVERSE...
        <span className="cursor">_</span>
      </LoadingScreen>
    </CanvasWrapper>
  );
}