import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Experience from './components/Experience';
import HUD from './components/HUD';
import AudioSystem from './components/AudioSystem';
import SectorContent from './components/SectorContent';
import ControlsHelp from './components/ControlsHelp';
import GlobalStyles from './styles/GlobalStyles';
import useNavigationControls from './hooks/useNavigationControls';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const Interface = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;

  & > * {
    pointer-events: auto;
  }
`;

const VersionInfo = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--color-neon-blue);
  border-radius: 4px;
  font-family: var(--font-terminal);
  color: var(--color-neon-blue);
  font-size: 12px;
  backdrop-filter: blur(5px);
  display: flex;
  gap: 20px;
  align-items: center;
  z-index: 1;

  &::before {
    content: '>';
    margin-right: 8px;
  }
`;

const StatusIndicator = styled.div<{ $status: 'online' | 'connecting' }>`
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$status === 'online' ? 'var(--color-neon-green)' : 'var(--color-neon-purple)'};
    animation: ${props => props.$status === 'connecting' ? 'blink 1s infinite' : 'none'};
  }
`;

const ConnectionStatus = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--color-neon-purple);
  border-radius: 4px;
  font-family: var(--font-terminal);
  color: var(--color-neon-purple);
  font-size: 14px;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

function AppContent() {
  const location = useLocation();
  const isExploreMode = location.pathname === '/explore';
  
  // Initialize navigation controls
  useNavigationControls();

  return (
    <AppContainer>
      <Experience />
      <Interface>
        <ConnectionStatus>
          <StatusIndicator $status="online" />
          NETWORK STATUS: CONNECTED TO HACKATHON.DEV
        </ConnectionStatus>
        <HUD />
        <AudioSystem />
        {!isExploreMode && (
          <Routes>
            <Route path="/" element={<SectorContent />} />
            <Route path="/about" element={<SectorContent />} />
            <Route path="/prizes" element={<SectorContent />} />
            <Route path="/sponsors" element={<SectorContent />} />
            <Route path="/judges" element={<SectorContent />} />
            <Route path="/faq" element={<SectorContent />} />
            <Route path="/register" element={<SectorContent />} />
          </Routes>
        )}
        {isExploreMode && <ControlsHelp />}
        <VersionInfo>
          <StatusIndicator $status="online" />
          SYSTEM VERSION: 1.0.0
          <span>|</span>
          UPTIME: OPTIMAL
        </VersionInfo>
      </Interface>
    </AppContainer>
  );
}

export default function App() {
  return (
    <Router>
      <GlobalStyles />
      <AppContent />
    </Router>
  );
}
