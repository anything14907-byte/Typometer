import { useEffect, useRef, useState, useCallback } from 'react';

export type SwitchAudioProfile = 'rocket-thrust' | 'thock' | 'clicky' | 'cyber-pulse' | 'silent';

export function useAudioSynth() {
  const [profile, setProfile] = useState<SwitchAudioProfile>(() => {
    return (localStorage.getItem('typometer_audio_profile') as SwitchAudioProfile) || 'rocket-thrust';
  });
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(() => {
    return localStorage.getItem('typometer_ambient_enabled') === 'true';
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('typometer_volume');
    return saved !== null ? parseFloat(saved) : 0.7;
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Initialize and guarantee unlocked Audio Context
  const ensureAudioContext = useCallback((): AudioContext | null => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch {
      return null;
    }
  }, []);

  // Global user gesture unlock for browser Autoplay policies
  useEffect(() => {
    const unlock = () => {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener('keydown', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('touchstart', unlock, { passive: true });

    return () => {
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('typometer_audio_profile', profile);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('typometer_ambient_enabled', String(ambientEnabled));
  }, [ambientEnabled]);

  useEffect(() => {
    localStorage.setItem('typometer_volume', String(volume));
  }, [volume]);

  // Ambient Drone management
  useEffect(() => {
    if (!ambientEnabled || volume === 0) {
      if (ambientGainRef.current && audioCtxRef.current) {
        try {
          ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
        } catch {}
      }
      return;
    }

    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      if (!ambientGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.connect(ctx.destination);
        ambientGainRef.current = masterGain;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(60, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(60.4, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        ambientOsc1Ref.current = osc1;
        ambientOsc2Ref.current = osc2;
      }

      const targetGain = 0.06 * volume;
      ambientGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.5);
    } catch {}
  }, [ambientEnabled, volume, ensureAudioContext]);

  /**
   * Play Keypress procedural sound (100% reliable)
   */
  const playKeypress = useCallback((keyChar: string = 'a') => {
    if (profile === 'silent' || volume === 0) return;

    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const trigger = () => {
        const now = ctx.currentTime;
        const pitchShift = ((keyChar.charCodeAt(0) % 7) - 3) * 6;

        if (profile === 'rocket-thrust') {
          // Punchy aerospace switch with mechanical clack & subtle flame sub-punch
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(420, now);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(180 + pitchShift, now);
          osc.frequency.exponentialRampToValueAtTime(65, now + 0.05);

          gain.gain.setValueAtTime(0.5 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.06);

          // Metallic clack
          const clack = ctx.createOscillator();
          const clackGain = ctx.createGain();
          clack.type = 'triangle';
          clack.frequency.setValueAtTime(950 + pitchShift * 10, now);
          clack.frequency.exponentialRampToValueAtTime(250, now + 0.02);

          clackGain.gain.setValueAtTime(0.2 * volume, now);
          clackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

          clack.connect(clackGain);
          clackGain.connect(ctx.destination);

          clack.start(now);
          clack.stop(now + 0.025);

        } else if (profile === 'thock') {
          // Deep mechanical thock
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(150 + pitchShift, now);
          osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

          gain.gain.setValueAtTime(0.55 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.055);

        } else if (profile === 'clicky') {
          // Crisp blue switch click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1600, now);

          osc.type = 'square';
          osc.frequency.setValueAtTime(2400 + pitchShift * 20, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.025);

          gain.gain.setValueAtTime(0.3 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.03);

        } else if (profile === 'cyber-pulse') {
          // Futuristic laser pulse
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800 + pitchShift * 15, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.045);

          gain.gain.setValueAtTime(0.25 * volume, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.05);
        }
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(trigger).catch(() => {});
      } else {
        trigger();
      }
    } catch {}
  }, [profile, volume, ensureAudioContext]);

  /**
   * Procedural Error Buzz
   */
  const playError = useCallback(() => {
    if (profile === 'silent' || volume === 0) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const trigger = () => {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(90, now);
        osc2.frequency.setValueAtTime(130, now);

        gain.gain.setValueAtTime(0.35 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.13);
        osc2.stop(now + 0.13);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(trigger).catch(() => {});
      } else {
        trigger();
      }
    } catch {}
  }, [profile, volume, ensureAudioContext]);

  /**
   * Combo Chime (Ascending harmonic crystal chords)
   */
  const playComboChime = useCallback((comboCount: number) => {
    if (profile === 'silent' || volume === 0) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const trigger = () => {
        const now = ctx.currentTime;
        const scale = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        const noteIndex = Math.min(Math.floor(comboCount / 5), scale.length - 1);
        const freq = scale[noteIndex];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);

        gain.gain.setValueAtTime(0.3 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(trigger).catch(() => {});
      } else {
        trigger();
      }
    } catch {}
  }, [profile, volume, ensureAudioContext]);

  /**
   * Laser Fire Sound
   */
  const playLaserSound = useCallback(() => {
    if (volume === 0) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);

      gain.gain.setValueAtTime(0.3 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }, [volume, ensureAudioContext]);

  /**
   * EMP Shockwave Sound
   */
  const playShockwaveSound = useCallback(() => {
    if (volume === 0) return;
    try {
      const ctx = ensureAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

      gain.gain.setValueAtTime(0.45 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }, [volume, ensureAudioContext]);

  return {
    profile,
    setProfile,
    ambientEnabled,
    setAmbientEnabled,
    volume,
    setVolume,
    playKeypress,
    playError,
    playComboChime,
    playLaserSound,
    playShockwaveSound,
  };
}
