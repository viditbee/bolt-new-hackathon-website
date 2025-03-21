import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createAmbientSound } from '../utils/createAmbientTrack';

const AudioControl = styled.button<{ $active: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid ${props => props.$active ? 'var(--color-neon-green)' : 'var(--color-neon-blue)'};
  color: ${props => props.$active ? 'var(--color-neon-green)' : 'var(--color-neon-blue)'};
  padding: 8px 16px;
  font-family: var(--font-terminal);
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  z-index: 100;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 10px ${props => props.$active ? 'var(--color-neon-green)' : 'var(--color-neon-blue)'};
  }

  &::before {
    content: ${props => props.$active ? '"AUDIO: ON"' : '"AUDIO: OFF"'};
  }
`;

interface WebAudioAPI extends Window {
  webkitAudioContext: typeof AudioContext;
}

export default function AudioSystem() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop();
        } catch (error) {
          console.error('Error stopping audio source:', error);
        }
        sourceNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (isPlaying && sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      return;
    }

    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContextConstructor = window.AudioContext || (window as unknown as WebAudioAPI).webkitAudioContext;
        audioContextRef.current = new AudioContextConstructor();
      }

      // Resume audio context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create and start new source
      sourceNodeRef.current = createAmbientSound(audioContextRef.current);
      sourceNodeRef.current.start(0); // Explicitly start at time 0
      setIsPlaying(true);
    } catch (error) {
      console.error('Error initializing audio:', error);
      // Reset state on error
      sourceNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <AudioControl 
      $active={isPlaying}
      onClick={toggleAudio}
      aria-label={isPlaying ? 'Disable audio' : 'Enable audio'}
    />
  );
}