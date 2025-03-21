import { useEffect, useRef } from 'react';
import { Vector2 } from 'three';

interface CursorEffects {
  position: Vector2;
  velocity: Vector2;
  trail: Vector2[];
}

export const useCursorEffects = (trailLength: number = 10) => {
  const effects = useRef<CursorEffects>({
    position: new Vector2(),
    velocity: new Vector2(),
    trail: Array(trailLength).fill(null).map(() => new Vector2()),
  });

  const lastMousePos = useRef<Vector2>(new Vector2());
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.documentElement.getBoundingClientRect();
      const x = (e.clientX / rect.width) * 2 - 1;
      const y = -(e.clientY / rect.height) * 2 + 1;
      
      // Update velocity
      effects.current.velocity.x = x - lastMousePos.current.x;
      effects.current.velocity.y = y - lastMousePos.current.y;
      
      // Update position
      effects.current.position.set(x, y);
      
      // Update trail
      effects.current.trail.pop();
      effects.current.trail.unshift(new Vector2(x, y));
      
      // Store current position for next frame
      lastMousePos.current.set(x, y);
    };

    const handleMouseDown = () => {
      isMouseDown.current = true;
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [trailLength]);

  return {
    position: effects.current.position,
    velocity: effects.current.velocity,
    trail: effects.current.trail,
    isMouseDown: isMouseDown.current,
  };
};