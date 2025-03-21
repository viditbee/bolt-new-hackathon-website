import * as THREE from 'three';

export interface Sector {
  id: string;
  name: string;
  path: string;
  position?: [number, number, number];
}

export interface CameraPosition {
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export interface ParticlePoint {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
}

export interface SponsorData {
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  logo: string;
  description: string;
  website: string;
}

export interface PrizeData {
  category: string;
  amount: string;
  description: string;
  sponsor?: string;
  tier: 'grand' | 'category' | 'special';
}

export interface JudgeData {
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}