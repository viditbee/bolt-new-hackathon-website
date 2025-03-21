import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const trailVertexShader = `
  attribute float alpha;
  attribute vec3 color;
  varying float vAlpha;
  varying vec3 vColor;
  varying vec2 vUv;
  
  void main() {
    vAlpha = alpha;
    vColor = color;
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 6.0;
  }
`;

const trailFragmentShader = `
  varying float vAlpha;
  varying vec3 vColor;
  varying vec2 vUv;
  uniform float time;
  
  void main() {
    float brightness = sin(vUv.x * 20.0 + time * 3.0) * 0.5 + 0.5;
    vec3 finalColor = mix(vColor, vec3(1.0), brightness * 0.3);
    float fadeEdge = smoothstep(0.0, 0.2, vAlpha) * smoothstep(1.0, 0.8, vAlpha);
    gl_FragColor = vec4(finalColor, vAlpha * fadeEdge);
  }
`;

interface SpacecraftTrailProps {
  maxPoints?: number;
}

export interface SpacecraftTrailRef {
  updateTrail: (position: THREE.Vector3, velocity: THREE.Vector3) => void;
}

const SpacecraftTrail = forwardRef<SpacecraftTrailRef, SpacecraftTrailProps>(({
  maxPoints = 150
}, ref) => {
  const trailRef = useRef<THREE.Points>(null);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const colorsRef = useRef<THREE.Color[]>([]);
  const alphasRef = useRef<number[]>([]);
  const timeRef = useRef(0);

  // Create initial geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(maxPoints * 3);
    const colors = new Float32Array(maxPoints * 3);
    const alphas = new Float32Array(maxPoints);
    const uvs = new Float32Array(maxPoints * 2);

    // Initialize arrays
    for (let i = 0; i < maxPoints; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.95;
      colors[i * 3 + 2] = 1;

      alphas[i] = 0;
      uvs[i * 2] = i / maxPoints;
      uvs[i * 2 + 1] = 0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    return geo;
  }, [maxPoints]);

  // Create custom shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }, []);

  // Expose updateTrail function
  useImperativeHandle(ref, () => ({
    updateTrail: (position: THREE.Vector3, velocity: THREE.Vector3) => {
      // Add new point
      pointsRef.current.unshift(position.clone());

      // Calculate color based on velocity
      const speed = velocity.length();
      const color = new THREE.Color();
      if (speed > 2) {
        color.setHSL(0.7, 1, 0.5); // Purple for high speed
      } else if (speed > 1) {
        color.setHSL(0.6, 1, 0.5); // Blue for medium speed
      } else {
        color.setHSL(0.5, 1, 0.5); // Cyan for low speed
      }

      colorsRef.current.unshift(color);
      alphasRef.current.unshift(1);

      // Remove excess points
      if (pointsRef.current.length > maxPoints) {
        pointsRef.current.pop();
        colorsRef.current.pop();
        alphasRef.current.pop();
      }

      // Update geometry
      const positions = geometry.attributes.position.array as Float32Array;
      const colors = geometry.attributes.color.array as Float32Array;
      const alphas = geometry.attributes.alpha.array as Float32Array;

      for (let i = 0; i < pointsRef.current.length; i++) {
        const point = pointsRef.current[i];
        const color = colorsRef.current[i];

        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Update alpha with smooth fade out
        alphasRef.current[i] *= 0.97;
        alphas[i] = alphasRef.current[i] * Math.sin(Math.PI * (i / pointsRef.current.length));
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.alpha.needsUpdate = true;
    }
  }));

  useFrame((state) => {
    if (!trailRef.current) return;

    // Update time uniform for animation
    timeRef.current += state.clock.getDelta();
    material.uniforms.time.value = timeRef.current;

    // Update alpha values with wave effect
    const alphas = geometry.attributes.alpha.array as Float32Array;
    for (let i = 0; i < alphasRef.current.length; i++) {
      alphasRef.current[i] *= 0.99;
      const wave = Math.sin(timeRef.current * 5 + i * 0.2) * 0.1 + 0.9;
      alphas[i] = alphasRef.current[i] * wave;
    }
    geometry.attributes.alpha.needsUpdate = true;
  });

  return (
    <points ref={trailRef}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </points>
  );
});

SpacecraftTrail.displayName = 'SpacecraftTrail';

export default SpacecraftTrail;
