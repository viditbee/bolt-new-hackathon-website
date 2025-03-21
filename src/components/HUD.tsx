import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px var(--color-neon-blue); }
  50% { box-shadow: 0 0 20px var(--color-neon-blue); }
  100% { box-shadow: 0 0 5px var(--color-neon-blue); }
`;

const HUDContainer = styled.nav`
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(0, 243, 255, 0.2)' : 'rgba(0, 0, 0, 0.7)'};
  border: 1px solid ${props => props.$active ? 'var(--color-neon-green)' : 'var(--color-neon-blue)'};
  color: ${props => props.$active ? 'var(--color-neon-green)' : 'var(--color-neon-blue)'};
  padding: 12px 20px;
  font-family: var(--font-terminal);
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  min-width: 200px;
  text-align: left;

  &:hover {
    background: rgba(0, 243, 255, 0.2);
    transform: translateX(-5px);
    animation: ${glowAnimation} 2s infinite;
  }

  &::before {
    content: '>';
    margin-right: 8px;
    opacity: ${props => props.$active ? '1' : '0.5'};
  }
`;

const sectors = [
  { id: 'explore', name: 'EXPLORE UNIVERSE', path: '/explore' },
  { id: 'launch-bay', name: 'LAUNCH BAY', path: '/' },
  { id: 'mission-control', name: 'MISSION CONTROL', path: '/about' },
  { id: 'reward-vault', name: 'REWARD VAULT', path: '/prizes' },
  { id: 'alliance-station', name: 'ALLIANCE STATION', path: '/sponsors' },
  { id: 'command-crew', name: 'COMMAND CREW', path: '/judges' },
  { id: 'communication-hub', name: 'COMMUNICATION HUB', path: '/faq' },
  { id: 'docking-bay', name: 'DOCKING BAY', path: '/register' },
];

export default function HUD() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSector, setActiveSector] = useState(location.pathname);

  const handleNavigation = (path: string) => {
    setActiveSector(path);
    navigate(path);
  };

  return (
    <HUDContainer>
      {sectors.map(sector => (
        <NavButton
          key={sector.id}
          $active={activeSector === sector.path}
          onClick={() => handleNavigation(sector.path)}
        >
          {sector.name}
        </NavButton>
      ))}
    </HUDContainer>
  );
}