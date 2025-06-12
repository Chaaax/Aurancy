import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: { value: "#0f0f1f" }
        },
       particles: {
          number: { value: 250 },
          color: { value: "#a855f7" },
          shape: { type: "circle" },
          opacity: { value: 0.25 },
          size: { value: { min: 1, max: 4 } },
          links: {
            enable: true,
            distance: 60,
            color: "#9333ea",
            opacity: 0.3,
            width: 1
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            outModes: { default: "bounce" }
          }
        },
        fullScreen: { enable: false }, // importante para manter no fundo do dashboard
      }}
      style={{
        position: 'absolute',
        zIndex: -1,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

