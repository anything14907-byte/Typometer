import React from 'react';
import { Volume2, VolumeX, Radio, Disc } from 'lucide-react';
import { SwitchAudioProfile } from '../types/telemetry';

interface AudioControlProps {
  profile: SwitchAudioProfile;
  setProfile: (p: SwitchAudioProfile) => void;
  ambientEnabled: boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
}

export const AudioControl: React.FC<AudioControlProps> = ({
  profile,
  setProfile,
  ambientEnabled,
  setAmbientEnabled,
  volume,
  setVolume,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
      {/* Switch Profile Selector */}
      <div className="flex items-center gap-1 bg-obsidian-900/80 p-1 rounded-xl border border-slate-800">
        {(['thock', 'clicky', 'cyber-pulse', 'silent'] as SwitchAudioProfile[]).map(p => (
          <button
            key={p}
            onClick={() => setProfile(p)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold capitalize transition-all ${
              profile === p
                ? 'bg-cyber-cyan text-obsidian-950 shadow-neon-cyan'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {p === 'cyber-pulse' ? 'Cyber Pulse' : p}
          </button>
        ))}
      </div>

      {/* Ambient Synth-Wave Drone Hum Toggle */}
      <button
        onClick={() => setAmbientEnabled(!ambientEnabled)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          ambientEnabled
            ? 'bg-cyber-violet/20 border-cyber-violet text-cyber-violet shadow-neon-violet'
            : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-300'
        }`}
        title="Toggle 55Hz Binaural Ambient Drone Hum"
      >
        <Radio className={`w-3.5 h-3.5 ${ambientEnabled ? 'animate-pulse text-cyber-violet' : ''}`} />
        <span className="text-[11px] font-sans">
          {ambientEnabled ? 'Ambient Drone: ON' : 'Ambient Drone: OFF'}
        </span>
      </button>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 bg-obsidian-900/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
        {volume > 0 ? (
          <Volume2 className="w-3.5 h-3.5 text-cyber-cyan" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-500" />
        )}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
        />
      </div>
    </div>
  );
};

