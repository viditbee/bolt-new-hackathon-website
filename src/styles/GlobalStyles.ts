import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --color-background: #0a0a0f;
    --color-text: #ffffff;
    --color-neon-blue: #00f3ff;
    --color-neon-purple: #b537f2;
    --color-neon-green: #3dff3e;
    --font-main: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    --font-terminal: 'JetBrains Mono', 'Courier New', Courier, monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--color-background);
    color: var(--color-text);
    font-family: var(--font-main);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
  }

  canvas {
    touch-action: none;
  }

  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-neon-blue);
    border-radius: 3px;
  }

  /* Terminal Text Animation */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .cursor {
    animation: blink 1s infinite;
  }

  /* Glow Effects */
  .glow {
    filter: drop-shadow(0 0 10px var(--color-neon-blue));
  }

  .glow-purple {
    filter: drop-shadow(0 0 10px var(--color-neon-purple));
  }

  .glow-green {
    filter: drop-shadow(0 0 10px var(--color-neon-green));
  }

  /* Interactive Elements */
  button, a {
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
      filter: brightness(1.2);
    }
  }
`;

export default GlobalStyles;