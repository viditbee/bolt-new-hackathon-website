import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 15px 25px;
  border-radius: 8px;
  border: 1px solid var(--color-neon-purple);
  color: var(--color-neon-blue);
  font-family: var(--font-terminal);
  backdrop-filter: blur(5px);
  display: flex;
  gap: 25px;
  align-items: center;
  z-index: 100;
  animation: ${fadeIn} 0.5s ease-out;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Key = styled.span`
  background: rgba(0, 243, 255, 0.1);
  border: 1px solid var(--color-neon-blue);
  padding: 4px 8px;
  border-radius: 4px;
  min-width: 30px;
  text-align: center;
  font-size: 12px;
`;

const Description = styled.span`
  color: var(--color-neon-purple);
  font-size: 12px;
`;

const Separator = styled.div`
  width: 1px;
  height: 40px;
  background: var(--color-neon-purple);
  opacity: 0.5;
`;

export default function ControlsHelp() {
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!showHelp) return null;

  return (
    <Container>
      <ControlGroup>
        <ControlRow>
          <Key>W</Key>
          <Key>A</Key>
          <Key>S</Key>
          <Key>D</Key>
          <Description>Movement</Description>
        </ControlRow>
        <ControlRow>
          <Key>↑</Key>
          <Key>←</Key>
          <Key>↓</Key>
          <Key>→</Key>
          <Description>Alternative Movement</Description>
        </ControlRow>
      </ControlGroup>

      <Separator />

      <ControlGroup>
        <ControlRow>
          <Key>SPACE</Key>
          <Description>Move Up</Description>
        </ControlRow>
        <ControlRow>
          <Key>CTRL</Key>
          <Description>Move Down</Description>
        </ControlRow>
      </ControlGroup>

      <Separator />

      <ControlGroup>
        <ControlRow>
          <Key>SHIFT</Key>
          <Description>Boost Speed</Description>
        </ControlRow>
        <ControlRow>
          <Key>MOUSE</Key>
          <Description>Look Around</Description>
        </ControlRow>
      </ControlGroup>

      <Separator />

      <ControlGroup>
        <ControlRow>
          <Key>ESC</Key>
          <Description>Return to Hub</Description>
        </ControlRow>
      </ControlGroup>
    </Container>
  );
}