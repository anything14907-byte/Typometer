import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Code2, 
  Volume2, 
  RotateCcw, 
  ShieldAlert, 
  Rocket, 
  Crosshair, 
  Flame,
  X
} from 'lucide-react';
import { GameMode, TestMode, SwitchAudioProfile } from '../types/telemetry';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGameMode: (mode: GameMode) => void;
  onSelectTestMode: (mode: TestMode) => void;
  onSelectAudioProfile: (prof: SwitchAudioProfile) => void;
  onToggleAmbient: () => void;
  onRestart: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectGameMode,
  onSelectTestMode,
  onSelectAudioProfile,
  onToggleAmbient,
  onRestart,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const actions = [
    { id: 'mode-prose', title: 'Mission Cyber-Prose Mode', icon: Rocket, category: 'Flight', run: () => onSelectTestMode('prose') },
    { id: 'mode-code', title: 'Code Matrix (TS / Python / Rust)', icon: Code2, category: 'Syntax', run: () => onSelectTestMode('code') },
    { id: 'mode-symbols', title: 'Number & Symbol Gauntlet', icon: Terminal, category: 'Gauntlet', run: () => onSelectTestMode('symbols') },
    { id: 'mode-adaptive', title: 'Weak-Key Adaptive Drill', icon: Flame, category: 'Training', run: () => onSelectTestMode('adaptive') },
    { id: 'game-orbital', title: 'Orbital Defense (Word Blaster)', icon: Crosshair, category: 'Arcade', run: () => onSelectGameMode('orbital') },
    { id: 'game-warp', title: 'Warp Drive (Velocity Tunnel)', icon: Rocket, category: 'Arcade', run: () => onSelectGameMode('warp') },
    { id: 'game-hack', title: 'Syntax Breaker (Cyber-Hack)', icon: ShieldAlert, category: 'Arcade', run: () => onSelectGameMode('hack') },
    { id: 'audio-rocket', title: 'Audio: Rocket Thrust Mechanical Ignition', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('rocket-thrust') },
    { id: 'audio-thock', title: 'Audio: Deep Thocky Mechanical Switch', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('thock') },
    { id: 'audio-clicky', title: 'Audio: Crisp Clicky Blue Switch', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('clicky') },
    { id: 'audio-pulse', title: 'Audio: Cyber Pulse Laser Chirp', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('cyber-pulse') },
    { id: 'audio-ambient', title: 'Toggle Ambient Thruster Jet Drone Hum', icon: Volume2, category: 'Audio', run: () => onToggleAmbient() },
    { id: 'test-restart', title: 'Restart Current Session', icon: RotateCcw, category: 'Action', run: () => onRestart() },
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          filtered[selectedIndex].run();
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 dark:bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rocket-panel-glow rounded-2xl border border-rocket-thrust/40 overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-obsidian-900/90">
          <Search className="w-5 h-5 text-rocket-thrust mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or jump to rocket mode..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white font-mono text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.run();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-mono text-xs transition-all ${
                    isSelected
                      ? 'bg-rocket-thrust text-white font-black shadow-rocket-thrust'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-rocket-thrust'}`} />
                    <span>{item.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-display font-bold ${
                    isSelected ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-400">
              No rocket mission protocols matching "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-obsidian-950 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Use <kbd className="text-slate-800 dark:text-slate-300 font-bold">↑</kbd> <kbd className="text-slate-800 dark:text-slate-300 font-bold">↓</kbd> to navigate, <kbd className="text-slate-800 dark:text-slate-300 font-bold">Enter</kbd> to run</span>
          <span><kbd className="text-slate-800 dark:text-slate-300 font-bold">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
