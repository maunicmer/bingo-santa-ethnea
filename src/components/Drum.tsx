import { useEffect, useRef } from 'react';
import { useBingoStore } from '../stores/gameStore';

// Web Audio API - sonidos sintéticos, sin archivos externos
const playDrumSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Ruido de bolas moviéndose
    const bufferSize = ctx.sampleRate * 1.0;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufferSize) * 0.3;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch { /* silent fail */ }
};

const playBellSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Campana tipo "ding"
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
    
    // Segundo armónico
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.5);
    
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.8);
  } catch { /* silent fail */ }
};

export const Drum = () => {
  const currentNumber = useBingoStore((state) => state.currentNumber);
  const drawPhase = useBingoStore((state) => state.drawPhase);
  const isFinished = useBingoStore((state) => state.isFinished);
  const hasPlayedSound = useRef(false);

  // Sonido de giro al entrar en fase spinning
  useEffect(() => {
    if (drawPhase === 'spinning' && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      playDrumSound();
    }
    if (drawPhase === 'revealed') {
      hasPlayedSound.current = false;
      playBellSound();
    }
  }, [drawPhase]);

  const isSpinning = drawPhase === 'spinning';
  const isRevealing = drawPhase === 'revealing';
  const isRevealed = drawPhase === 'revealed';

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 select-none">
      <style>{`
        @keyframes drumSpin {
          0% { transform: rotateX(0deg) rotateZ(0deg); }
          25% { transform: rotateX(5deg) rotateZ(90deg); }
          50% { transform: rotateX(-3deg) rotateZ(180deg); }
          75% { transform: rotateX(4deg) rotateZ(270deg); }
          100% { transform: rotateX(0deg) rotateZ(360deg); }
        }
        @keyframes drumShake {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-3px) rotate(-1deg); }
          20% { transform: translateX(3px) rotate(1deg); }
          30% { transform: translateX(-2px) rotate(-0.5deg); }
          40% { transform: translateX(2px) rotate(0.5deg); }
          50% { transform: translateX(-3px) rotate(-1deg); }
          60% { transform: translateX(3px) rotate(1deg); }
          70% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          90% { transform: translateX(-1px); }
        }
        @keyframes ballBounce {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          40% { transform: translateY(-20px) scale(1.1); opacity: 1; }
          60% { transform: translateY(10px) scale(0.95); }
          80% { transform: translateY(-5px) scale(1.02); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes innerBallFloat {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, -8px); }
          50% { transform: translate(-3px, 5px); }
          75% { transform: translate(8px, -3px); }
        }
        @keyframes innerBallFloatFast {
          0% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-10px, -15px) rotate(72deg); }
          40% { transform: translate(15px, 8px) rotate(144deg); }
          60% { transform: translate(-8px, -12px) rotate(216deg); }
          80% { transform: translate(12px, 5px) rotate(288deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(230, 57, 70, 0.4); }
          50% { box-shadow: 0 0 40px rgba(230, 57, 70, 0.8), 0 0 60px rgba(230, 57, 70, 0.3); }
        }
        @keyframes numberPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .drum-spinning {
          animation: drumSpin 0.6s linear infinite, drumShake 0.3s ease-in-out infinite;
        }
        .drum-container {
          perspective: 800px;
        }
        .inner-ball {
          animation: innerBallFloat 3s ease-in-out infinite;
        }
        .inner-ball-fast {
          animation: innerBallFloatFast 0.4s linear infinite;
        }
        .revealed-ball {
          animation: ballBounce 0.8s ease-out forwards, glow 2s ease-in-out infinite;
        }
        .revealed-number {
          animation: numberPop 0.6s ease-out 0.2s both;
        }
      `}</style>

      {/* Contenedor del tambor */}
      <div className="drum-container relative flex flex-col items-center">
        
        {/* Parte superior del tambor */}
        <div 
          className={`
            relative w-56 h-40 md:w-72 md:h-48
            rounded-t-[40%] rounded-b-[15%]
            overflow-hidden
            ${isSpinning ? 'drum-spinning' : ''}
            transition-transform duration-300
          `}
          style={{
            background: 'linear-gradient(180deg, #c9a84c 0%, #e9c46a 20%, #f1faee 50%, #e9c46a 80%, #b8953f 100%)',
            boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          {/* Malla/malla del tambor */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 31%, transparent 32%),
                radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 31%, transparent 32%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
            }}
          />

          {/* Brillo metálico */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.2) 100%)',
            }}
          />

          {/* Bolas adentro */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full ${isSpinning ? 'inner-ball-fast' : 'inner-ball'}`}
                style={{
                  width: `${14 + (i % 3) * 4}px`,
                  height: `${14 + (i % 3) * 4}px`,
                  left: `${15 + (i * 7) % 70}%`,
                  top: `${20 + (i * 11) % 50}%`,
                  background: i % 2 === 0 
                    ? 'radial-gradient(circle at 30% 30%, #fff, #e63946, #a61e2e)'
                    : 'radial-gradient(circle at 30% 30%, #fff, #1d3557, #0d1b2a)',
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>

          {/* Decoración de aros */}
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 w-[90%] h-4 rounded-full"
            style={{ background: 'linear-gradient(180deg, #b8953f, #e9c46a, #b8953f)' }}
          />
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-3 rounded-full"
            style={{ background: 'linear-gradient(180deg, #b8953f, #e9c46a, #b8953f)' }}
          />
        </div>

        {/* Base del tambor */}
        <div 
          className="w-48 h-6 md:w-60 md:h-8 -mt-2 rounded-b-2xl"
          style={{
            background: 'linear-gradient(180deg, #8b7355, #5c4a32)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
          }}
        />

        {/* Patas del tambor */}
        <div className="flex gap-16 md:gap-20 -mt-1">
          <div 
            className="w-3 h-8 md:h-10 rounded-b-lg"
            style={{ background: 'linear-gradient(180deg, #8b7355, #5c4a32)' }}
          />
          <div 
            className="w-3 h-8 md:h-10 rounded-b-lg"
            style={{ background: 'linear-gradient(180deg, #8b7355, #5c4a32)' }}
          />
        </div>

        {/* Área de revelación - la bola cae acá */}
        <div className="mt-6 h-40 md:h-48 flex items-center justify-center">
          {isFinished ? (
            <span className="text-5xl md:text-6xl font-bold text-bingo-gold text-center leading-tight animate-bounce">
              ¡BINGO!
            </span>
          ) : isRevealed && currentNumber ? (
            <div className="revealed-ball flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-bingo-red border-4 border-bingo-gold shadow-2xl">
              <span className="revealed-number text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
                {currentNumber}
              </span>
            </div>
          ) : isRevealing ? (
            <div className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
              <div className="w-20 h-20 rounded-full bg-bingo-red/50 animate-ping" />
            </div>
          ) : (
            <div className="flex flex-col items-center text-white/40">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-5xl md:text-6xl">?</span>
              </div>
              <p className="mt-4 text-lg md:text-xl">¡Sacá un número!</p>
            </div>
          )}
        </div>

      </div>

      {/* Info de partida */}
      <p className="mt-4 text-lg md:text-xl text-bingo-gold font-semibold text-center">
        {isFinished 
          ? 'Todos los números han salido'
          : isSpinning 
            ? '¡Girando...!'
            : isRevealing
              ? '¡Y el número es...!'
              : `Números restantes: ${useBingoStore.getState().availableNumbers.length}`
        }
      </p>
    </div>
  );
};
