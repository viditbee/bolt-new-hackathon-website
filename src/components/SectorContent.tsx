import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SponsorIcon from './SponsorIcon';

// Import only what we need from the SponsorIcon component
type SponsorIconName = 'vite' | 'react' | 'vue' | 'nextjs' | 'nuxt';

const glowAnimation = keyframes`
  0% { text-shadow: 0 0 5px var(--color-neon-blue); }
  50% { text-shadow: 0 0 20px var(--color-neon-blue), 0 0 30px var(--color-neon-blue); }
  100% { text-shadow: 0 0 5px var(--color-neon-blue); }
`;

const typewriterAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 800px;
  text-align: center;
  width: 90%;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--color-neon-blue);
  border-radius: 8px;
  color: white;
  font-family: var(--font-terminal);
  backdrop-filter: blur(10px);
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease;
  z-index: 10;
`;

const Title = styled.h1`
  color: var(--color-neon-blue);
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  animation: ${glowAnimation} 2s infinite;
`;

const Subtitle = styled.h2`
  color: var(--color-neon-purple);
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const Text = styled.p<{ $delay?: number }>`
  margin: 0 auto;
  margin-bottom: 1rem;
  overflow: hidden;
  white-space: nowrap;
  animation: ${typewriterAnimation} 1s steps(50, end) forwards;
  animation-delay: ${props => props.$delay || 0}s;
  opacity: 0.8;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const Card = styled.div<{ $tier?: string }>`
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-neon-purple);
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px ${props => {
      switch (props.$tier) {
        case 'platinum': return 'var(--color-neon-blue)';
        case 'gold': return '#ffd700';
        case 'silver': return '#c0c0c0';
        default: return 'var(--color-neon-purple)';
      }
    }};
  }
`;

const SponsorGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
`;

const CountdownTimer = styled.div`
  font-size: 2rem;
  color: var(--color-neon-green);
  text-align: center;
  margin: 1rem 0;
`;

const PrizeAmount = styled.div`
  font-size: 3rem;
  color: var(--color-neon-blue);
  text-align: center;
  margin: 1rem 0;
  animation: ${glowAnimation} 2s infinite;
`;

interface Judge {
  name: string;
  title: string;
  company: string;
}

interface Sponsor {
  name: string;
  tier: 'platinum' | 'gold' | 'silver';
  icon: SponsorIconName;
}

const judges: Judge[] = [
  { name: "Sarah Chen", title: "AI Research Lead", company: "TechCorp" },
  { name: "Alex Rivera", title: "VP Engineering", company: "InnovateLabs" },
  { name: "Dr. James", title: "CTO", company: "FutureStack" },
];

const sponsors: Sponsor[] = [
  { name: "Vite", tier: "platinum", icon: "vite" },
  { name: "React", tier: "gold", icon: "react" },
  { name: "Vue", tier: "gold", icon: "vue" },
  { name: "Next.js", tier: "silver", icon: "nextjs" },
  { name: "Nuxt", tier: "silver", icon: "nuxt" },
];

export default function SectorContent() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const targetDate = new Date('2025-04-20T00:00:00');
    
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (location.pathname) {
      case '/':
        return (
          <>
            <Title>WELCOME TO HACKATHON.DEV</Title>
            <CountdownTimer>LAUNCH IN: {timeLeft}</CountdownTimer>
            <PrizeAmount>$1,000,000+ IN PRIZES</PrizeAmount>
            <Text $delay={0.5}>Join the world's largest virtual hackathon</Text>
            <Text $delay={1}>Build the future of technology</Text>
            <Text $delay={1.5}>April 20-22, 2025 • Virtual Event</Text>
          </>
        );
      
      case '/about':
        return (
          <>
            <Title>MISSION BRIEFING</Title>
            <Text $delay={0.5}>72 Hours of Innovation</Text>
            <Text $delay={1}>Global Competition</Text>
            <Text $delay={1.5}>Build with cutting-edge tech</Text>
            <Text $delay={2}>Connect with industry leaders</Text>
          </>
        );
      
      case '/prizes':
        return (
          <>
            <Title>REWARD VAULT</Title>
            <PrizeAmount>$1,000,000+</PrizeAmount>
            <Grid>
              <Card>
                <Subtitle>Grand Prize</Subtitle>
                <Text>$500,000</Text>
              </Card>
              <Card>
                <Subtitle>Runner Up</Subtitle>
                <Text>$250,000</Text>
              </Card>
              <Card>
                <Subtitle>Innovation Award</Subtitle>
                <Text>$150,000</Text>
              </Card>
            </Grid>
          </>
        );
      
      case '/sponsors':
        return (
          <>
            <Title>ALLIANCE STATION</Title>
            <SponsorGrid>
              {sponsors.map((sponsor, index) => (
                <Card key={index} $tier={sponsor.tier}>
                  <SponsorIcon name={sponsor.icon} size={64} />
                  <Subtitle>{sponsor.name}</Subtitle>
                  <Text style={{ textTransform: 'uppercase' }}>{sponsor.tier} Tier</Text>
                </Card>
              ))}
            </SponsorGrid>
          </>
        );
      
      case '/judges':
        return (
          <>
            <Title>COMMAND CREW</Title>
            <Grid>
              {judges.map((judge, index) => (
                <Card key={index}>
                  <Subtitle>{judge.name}</Subtitle>
                  <Text>{judge.title}</Text>
                  <Text>{judge.company}</Text>
                </Card>
              ))}
            </Grid>
          </>
        );
      
      case '/faq':
        return (
          <>
            <Title>MISSION PROTOCOLS</Title>
            <Subtitle>Common Questions</Subtitle>
            <Text $delay={0.5}>Q: Who can participate?</Text>
            <Text $delay={1}>A: Anyone 18+ with a passion for technology</Text>
            <Text $delay={1.5}>Q: What can I build?</Text>
            <Text $delay={2}>A: Any software project using approved tech stack</Text>
          </>
        );
      
      case '/register':
        return (
          <>
            <Title>INITIATE DOCKING SEQUENCE</Title>
            <CountdownTimer>REGISTRATION CLOSES IN: {timeLeft}</CountdownTimer>
            <Text $delay={0.5}>Team Size: 1-4 members</Text>
            <Text $delay={1}>Registration Fee: FREE</Text>
            <Text $delay={1.5}>Limited to 10,000 participants</Text>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <Container $visible={visible}>
      {renderContent()}
    </Container>
  );
}