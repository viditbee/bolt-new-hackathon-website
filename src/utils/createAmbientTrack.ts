export const createAmbientTrack = (audioContext: AudioContext): AudioBuffer => {
  // Create a 10-second buffer
  const sampleRate = audioContext.sampleRate;
  const duration = 10;
  const bufferSize = sampleRate * duration;
  const buffer = audioContext.createBuffer(2, bufferSize, sampleRate);

  // Get channels
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  // Create ambient pad sound
  for (let i = 0; i < bufferSize; i++) {
    const time = i / sampleRate;
    
    // Base frequency modulation
    const freq1 = 50 + Math.sin(time * 0.1) * 20;
    const freq2 = 75 + Math.sin(time * 0.15) * 15;
    const freq3 = 150 + Math.sin(time * 0.2) * 10;
    
    // Generate oscillators
    const osc1 = Math.sin(time * freq1 * 2 * Math.PI);
    const osc2 = Math.sin(time * freq2 * 2 * Math.PI);
    const osc3 = Math.sin(time * freq3 * 2 * Math.PI);
    
    // Combine oscillators with different amplitudes
    const combined = (osc1 * 0.3 + osc2 * 0.2 + osc3 * 0.1);
    
    // Apply envelope
    const envelope = Math.min(time * 0.5, 1) * Math.min((duration - time) * 0.5, 1);
    
    // Add some stereo variation
    const stereoPhase = Math.sin(time * 0.5);
    
    // Write to channels with subtle stereo movement
    leftChannel[i] = combined * envelope * (1 + stereoPhase * 0.2);
    rightChannel[i] = combined * envelope * (1 - stereoPhase * 0.2);
  }

  return buffer;
};

export const createAmbientSound = (audioContext: AudioContext): AudioBufferSourceNode => {
  const buffer = createAmbientTrack(audioContext);
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();
  
  source.buffer = buffer;
  source.loop = true;
  
  // Add some reverb-like effect
  const convolver = audioContext.createConvolver();
  const reverbBuffer = createReverbBuffer(audioContext);
  convolver.buffer = reverbBuffer;
  
  // Create a filter for warmth
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  
  // Connect nodes
  source.connect(filter);
  filter.connect(convolver);
  convolver.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set initial volume
  gainNode.gain.value = 0.2;
  
  return source;
};

// Helper function to create reverb buffer
function createReverbBuffer(audioContext: AudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * 3; // 3 seconds
  const buffer = audioContext.createBuffer(2, length, sampleRate);
  const leftChannel = buffer.getChannelData(0);
  const rightChannel = buffer.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const decay = Math.exp(-i / (sampleRate * 0.5));
    const noise = Math.random() * 2 - 1;
    
    leftChannel[i] = noise * decay;
    rightChannel[i] = noise * decay;
  }

  return buffer;
}