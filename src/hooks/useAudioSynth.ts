import { useEffect, useRef, useState, useCallback } from 'react';
import { SwitchAudioProfile } from '../types/telemetry';

export function useAudioSynth() {
  const [profile, setProfile] = useState<SwitchAudioProfile>(() => {
    return (localStorage.getItem('typometer_audio_profile') as SwitchAudioProfile) || 'thock';
  });
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(() => {
    return localStorage.getItem('typometer_ambient_enabled') === 'true';
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('typometer_volume');
    return saved !== null ? parseFloat(saved) : 0.6;
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOsc1Ref = useRef<OscillatorNode | null>(null);
  const ambientOsc2Ref = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Initialize Audio Context on demand
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtxClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Save settings to localStorage
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
        ambientGainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
      return;
    }

    try {
      const ctx = getAudioContext();
      if (!ambientGainRef.current) {
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
        masterGain.connect(ctx.destination);
        ambientGainRef.current = masterGain;

        // Sub oscillator 1 (55Hz Root A1)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        // Sub oscillator 2 (55.4Hz subtle binaural beating)
        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(55.4, ctx.currentTime);

        // Lowpass filter for deep smooth warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(2.5, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();

        ambientOsc1Ref.current = osc1;
        ambientOsc2Ref.current = osc2;
      }

      // Smooth fade in
      const targetGain = 0.05 * volume;
      ambientGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.8);
    } catch {
      // Audio context policy handles gracefully
    }
  }, [ambientEnabled, volume, getAudioContext]);

  /**
   * Play Keypress procedural mechanical switch
   */
  const playKeypress = useCallback((keyChar: string = 'a') => {
    if (profile === 'silent' || volume === 0) return;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Slight pitch variation based on key code for natural realism
      const pitchVariance = ((keyChar.charCodeAt(0) % 7) - 3) * 4;

      if (profile === 'thock') {
        // Deep Thocky switch: 120Hz–180Hz initial punch with fast exponential decay
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);

        osc.type = 'sine';
        const startFreq = 160 + pitchVariance;
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.045);

        gain.gain.setValueAtTime(0.4 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);

        // Subtle mechanical top-out clack
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(450, now);
        clickOsc.frequency.exponentialRampToValueAtTime(180, now + 0.015);

        clickGain.gain.setValueAtTime(0.12 * volume, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(now);
        clickOsc.stop(now + 0.02);

      } else if (profile === 'clicky') {
        // Crisp tactile click (blue switch style)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2200 + pitchVariance * 25, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.02);

        gain.gain.setValueAtTime(0.28 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);

      } else if (profile === 'cyber-pulse') {
        // High-tech laser chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(850 + pitchVariance * 15, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

        gain.gain.setValueAtTime(0.2 * volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      }
    } catch {
      // Audio context handling
    }
  }, [profile, volume, getAudioContext]);

  /**
   * Procedural Error Buzz (Low dissonant saw wave)
   */
  const playError = useCallback(() => {
    if (profile === 'silent' || volume === 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(95, now);
      osc2.frequency.setValueAtTime(135, now); // Dissonant tritone interval

      gain.gain.setValueAtTime(0.25 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.13);
      osc2.stop(now + 0.13);
    } catch {
      // Audio context handling
    }
  }, [profile, volume, getAudioContext]);

  /**
   * Combo Chime (Ascending harmonic crystal arpeggio based on streak level)
   */
  const playComboChime = useCallback((comboCount: number) => {
    if (profile === 'silent' || volume === 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Pentatonic scale base frequencies
      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5, D5, E5, G5, A5, C6
      const noteIndex = Math.min(Math.floor(comboCount / 5), scale.length - 1);
      const freq = scale[noteIndex];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.22 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Audio context handling
    }
  }, [profile, volume, getAudioContext]);

  /**
   * Laser Fire Sound for Orbital Defense
   */
  const playLaserSound = useCallback(() => {
    if (volume === 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.2 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }, [volume, getAudioContext]);

  /**
   * EMP Shockwave Sound for 25x streaks
   */
  const playShockwaveSound = useCallback(() => {
    if (volume === 0) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

      gain.gain.setValueAtTime(0.4 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }, [volume, getAudioContext]);

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

