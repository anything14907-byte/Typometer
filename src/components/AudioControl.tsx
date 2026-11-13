import React from 'react';
import { Volume2, VolumeX, Radio, Rocket } from 'lucide-react';
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
    <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
      {/* Switch Profile Selector */}
      <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-obsidian-900/90 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
        {(['rocket-thrust', 'thock', 'clicky', 'cyber-pulse', 'silent'] as SwitchAudioProfile[]).map(p => (
          <button
            key={p}
            onClick={() => setProfile(p)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold capitalize transition-all flex items-center gap-1 ${
              profile === p
                ? 'bg-rocket-thrust text-white shadow-rocket-thrust'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {p === 'rocket-thrust' && <Rocket className="w-3 h-3 text-white" />}
            <span>
              {p === 'rocket-thrust' ? 'Rocket Thrust' : p === 'cyber-pulse' ? 'Pulse' : p}
            </span>
          </button>
        ))}
      </div>

      {/* Ambient Synth-Wave Drone Hum Toggle */}
      <button
        onClick={() => setAmbientEnabled(!ambientEnabled)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all ${
          ambientEnabled
            ? 'bg-rocket-nebula/20 border-rocket-nebula text-rocket-nebula shadow-neon-violet'
            : 'bg-slate-200/80 dark:bg-obsidian-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Toggle Ambient Thruster Jet Drone Hum"
      >
        <Radio className={`w-3.5 h-3.5 ${ambientEnabled ? 'animate-pulse text-rocket-nebula' : ''}`} />
        <span className="text-[11px] font-sans">
          {ambientEnabled ? 'Jet Drone: ON' : 'Jet Drone: OFF'}
        </span>
      </button>

      {/* Volume Slider */}
      <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-obsidian-900/90 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-800">
        {volume > 0 ? (
          <Volume2 className="w-3.5 h-3.5 text-rocket-thrust" />
        ) : (
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
        )}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          className="w-16 h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rocket-thrust"
        />
      </div>
    </div>
  );
};
