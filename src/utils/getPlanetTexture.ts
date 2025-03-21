import * as THREE from 'three';

// Helper to create a colored texture
const createColorTexture = (color: string): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext('2d')!;
  
  // Create gradient background
  const gradient = context.createLinearGradient(0, 0, 512, 256);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, adjustColor(color, -20));
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 256);
  
  // Add some noise for texture
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const brightness = Math.random() * 30 - 15;
    context.fillStyle = adjustColor(color, brightness);
    context.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

// Helper to adjust color brightness
const adjustColor = (color: string, amount: number): string => {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Planet texture generator
export const getPlanetTexture = (planet: string): THREE.Texture => {
  switch (planet) {
    case 'mercury':
      return createColorTexture('#8c7664');
    case 'venus':
      return createColorTexture('#e6b87c');
    case 'earth':
      return createColorTexture('#4b67ab');
    case 'mars':
      return createColorTexture('#c1440e');
    case 'jupiter':
      return createColorTexture('#b8956c');
    case 'saturn':
      return createColorTexture('#edca7c');
    case 'uranus':
      return createColorTexture('#b1d9e3');
    case 'neptune':
      return createColorTexture('#3d66cf');
    default:
      return createColorTexture('#ffffff');
  }
};

// Saturn rings texture generator
export const createRingsTexture = (): THREE.Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const context = canvas.getContext('2d')!;

  // Create rings gradient
  const gradient = context.createLinearGradient(0, 0, 1024, 0);
  gradient.addColorStop(0, 'rgba(237, 202, 124, 0.1)');
  gradient.addColorStop(0.4, 'rgba(237, 202, 124, 0.5)');
  gradient.addColorStop(0.6, 'rgba(237, 202, 124, 0.5)');
  gradient.addColorStop(1, 'rgba(237, 202, 124, 0.1)');

  context.fillStyle = gradient;
  context.fillRect(0, 0, 1024, 128);

  // Add ring gaps
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * 1024;
    const width = Math.random() * 50 + 10;
    context.fillStyle = 'rgba(0, 0, 0, 0.5)';
    context.fillRect(x, 0, width, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};