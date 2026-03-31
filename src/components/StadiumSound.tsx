import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const StadiumSound = () => {
  const [playing, setPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context with stadium ambiance using oscillators
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) {
      // Create ambient stadium sound using Web Audio API
      const ctx = new AudioContext();
      
      // White noise for crowd
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      
      // Filter to make it sound like crowd
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 0.5;
      
      const gain = ctx.createGain();
      gain.gain.value = 0.08;
      
      // Low rumble
      const osc = ctx.createOscillator();
      osc.frequency.value = 120;
      osc.type = 'sawtooth';
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.02;
      
      // LFO for crowd wave effect
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      
      whiteNoise.start();
      osc.start();
      lfo.start();
      
      (audioRef as any).current = { ctx, whiteNoise, osc, lfo };
      setPlaying(true);
    } else if (playing) {
      const audio = audioRef.current as any;
      audio.ctx.suspend();
      setPlaying(false);
    } else {
      const audio = audioRef.current as any;
      audio.ctx.resume();
      setPlaying(true);
    }
    setShowTooltip(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground/80 shadow-lg"
          >
            🔊 Sinta a torcida!
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSound}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          playing
            ? 'bg-primary text-primary-foreground shadow-gold'
            : 'bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30'
        }`}
      >
        {playing ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>
      {playing && (
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none"
        />
      )}
    </div>
  );
};

export default StadiumSound;
