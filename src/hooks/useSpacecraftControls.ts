import { useEffect, useRef } from 'react';
import { Vector3, Euler, Quaternion } from 'three';

interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  boost: boolean;
}

export const useSpacecraftControls = () => {
  const controls = useRef<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    boost: false,
  });

  const velocity = useRef(new Vector3(0, 0, 0));
  const rotation = useRef(new Euler(0, 0, 0));
  const mousePosition = useRef({ x: 0, y: 0 });
  const direction = useRef(new Vector3(0, 0, 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = true;
          break;
        case 'Space':
          controls.current.up = true;
          break;
        case 'ControlLeft':
        case 'ControlRight':
          controls.current.down = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.boost = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          controls.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          controls.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          controls.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          controls.current.right = false;
          break;
        case 'Space':
          controls.current.up = false;
          break;
        case 'ControlLeft':
        case 'ControlRight':
          controls.current.down = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          controls.current.boost = false;
          break;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const updateMovement = (delta: number) => {
    // Base movement parameters
    const acceleration = 2; // Reduced from 20
    const maxSpeed = controls.current.boost ? 2 : 1; // Reduced from 30/15
    const dampening = 0.98;
    const rotationSpeed = 1.5;
    const rotationDampening = 0.95;

    // Calculate movement direction in local space
    const moveVector = new Vector3(0, 0, 0);
    if (controls.current.forward) moveVector.z -= 1;
    if (controls.current.backward) moveVector.z += 1;
    if (controls.current.left) moveVector.x -= 1;
    if (controls.current.right) moveVector.x += 1;
    if (controls.current.up) moveVector.y += 1;
    if (controls.current.down) moveVector.y -= 1;

    // Normalize movement vector if length > 1
    if (moveVector.length() > 0) {
      moveVector.normalize();
    }

    // Create quaternion from mouse rotation
    const mouseQuat = new Quaternion();
    mouseQuat.setFromEuler(new Euler(
      -mousePosition.current.y * Math.PI * 0.25,
      -mousePosition.current.x * Math.PI * 0.25,
      0,
      'XYZ'
    ));

    // Apply mouse rotation to movement vector
    moveVector.applyQuaternion(mouseQuat);

    // Apply acceleration
    velocity.current.add(
      moveVector.multiplyScalar(acceleration * delta)
    );

    // Apply speed limit
    if (velocity.current.length() > maxSpeed) {
      velocity.current.normalize().multiplyScalar(maxSpeed);
    }

    // Apply dampening
    velocity.current.multiplyScalar(dampening);

    // Calculate rotation based on velocity and mouse
    const targetRotationZ = -velocity.current.x * 0.5;
    const targetRotationX = velocity.current.z * 0.5;

    rotation.current.x += (targetRotationX - rotation.current.x) * rotationSpeed * delta;
    rotation.current.z += (targetRotationZ - rotation.current.z) * rotationSpeed * delta;
    rotation.current.y = -mousePosition.current.x * Math.PI * 0.25;

    // Apply rotation dampening
    rotation.current.x *= rotationDampening;
    rotation.current.z *= rotationDampening;

    // Update direction vector
    direction.current.set(0, 0, 1).applyEuler(rotation.current);

    return {
      velocity: velocity.current.clone(),
      rotation: rotation.current.clone(),
      direction: direction.current.clone(),
      isMoving: moveVector.length() > 0,
      isBoosting: controls.current.boost
    };
  };

  return { updateMovement };
};
