import { useRef, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 2px var(--color)); }
  50% { filter: drop-shadow(0 0 10px var(--color)); }
  100% { filter: drop-shadow(0 0 2px var(--color)); }
`;

const IconWrapper = styled.div<{ $color: string; $size: number; $glowing: boolean }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  position: relative;
  transition: all 0.3s ease;
  --color: ${props => props.$color};
  
  animation: ${props => props.$glowing ? glowAnimation : 'none'} 2s infinite;

  &:hover {
    transform: scale(1.1);
    animation: ${glowAnimation} 1s infinite;
  }

  svg {
    width: 100%;
    height: 100%;
    fill: ${props => props.$color};
  }
`;

const sponsors = {
  vite: {
    color: '#646CFF',
    svg: `<svg viewBox="0 0 32 32">
      <path d="M29.8836 6.146L16.7418 29.6457c-.2053.3697-.7409.3697-.9462 0L2.6539 6.1459C2.4305 5.7517 2.7381 5.2857 3.1771 5.3137l13.6193.9205c.0622.0042.1244.0042.1866 0l12.7265-.9205c.439-.0297.7466.4363.5741.8323z"/>
    </svg>`
  },
  react: {
    color: '#61DAFB',
    svg: `<svg viewBox="0 0 32 32">
      <path d="M16 13.146c-1.573 0-2.854 1.281-2.854 2.854s1.281 2.854 2.854 2.854 2.854-1.281 2.854-2.854-1.281-2.854-2.854-2.854zm0-1.431c1.573 0 2.854-1.281 2.854-2.854S17.573 6.006 16 6.006s-2.854 1.281-2.854 2.854S14.427 11.715 16 11.715zm0 7.146c-1.573 0-2.854 1.281-2.854 2.854s1.281 2.854 2.854 2.854 2.854-1.281 2.854-2.854-1.281-2.854-2.854-2.854z"/>
    </svg>`
  },
  vue: {
    color: '#41B883',
    svg: `<svg viewBox="0 0 32 32">
      <path d="M24.4 3.925H30l-14 24.15L2 3.925h10.71l3.29 5.6 3.22-5.6z"/>
    </svg>`
  },
  nextjs: {
    color: '#000000',
    svg: `<svg viewBox="0 0 32 32">
      <path d="M23.749 30.005c-.119.063-.109.083.005.025.037-.015.068-.036.095-.061 0-.021 0-.021-.1.036zm.24-.13c-.057.047-.057.047.011.016.036-.021.068-.041.068-.047 0-.027-.015-.021-.079.031zm.156-.094c-.057.047-.057.047.011.016.037-.021.068-.043.068-.048 0-.025-.015-.02-.079.032zm.158-.093c-.057.047-.057.047.009.015.037-.02.068-.041.068-.047 0-.025-.015-.02-.077.032zm.213-.141c-.109.073-.147.12-.047.068.067-.041.181-.131.161-.131-.043.016-.079.043-.115.063z"/>
    </svg>`
  },
  nuxt: {
    color: '#00DC82',
    svg: `<svg viewBox="0 0 32 32">
      <path d="M22.915 19.786l3.907-6.821c.684-1.245.244-2.427-.973-2.427h-3.766c-1.104 0-2.006.901-2.006 2.005v9.639c0 1.104.902 2.005 2.006 2.005h3.766c1.217 0 1.657-1.182.973-2.427l-3.907-6.821zm-14.092 0l3.907-6.821c.684-1.245.244-2.427-.973-2.427H7.991c-1.104 0-2.006.901-2.006 2.005v9.639c0 1.104.902 2.005 2.006 2.005h3.766c1.217 0 1.657-1.182.973-2.427l-3.907-6.821z"/>
    </svg>`
  }
};

interface SponsorIconProps {
  name: keyof typeof sponsors;
  size?: number;
}

export default function SponsorIcon({ name, size = 24 }: SponsorIconProps) {
  const [isGlowing, setIsGlowing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Random glow effect timing
    const startRandomGlow = () => {
      timeoutRef.current = window.setTimeout(() => {
        setIsGlowing(true);
        timeoutRef.current = window.setTimeout(() => {
          setIsGlowing(false);
          startRandomGlow();
        }, 2000);
      }, Math.random() * 5000);
    };

    startRandomGlow();

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sponsor = sponsors[name];
  if (!sponsor) return null;

  return (
    <IconWrapper
      $color={sponsor.color}
      $size={size}
      $glowing={isGlowing}
      dangerouslySetInnerHTML={{ __html: sponsor.svg }}
    />
  );
}