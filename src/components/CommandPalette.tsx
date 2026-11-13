import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Terminal, 
  Code2, 
  Gamepad2, 
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
    { id: 'mode-prose', title: 'Switch to Cyber-Prose Mode', icon: Terminal, category: 'Mode', run: () => onSelectTestMode('prose') },
    { id: 'mode-code', title: 'Switch to Code Matrix Mode', icon: Code2, category: 'Mode', run: () => onSelectTestMode('code') },
    { id: 'mode-symbols', title: 'Switch to Number & Symbol Gauntlet', icon: Terminal, category: 'Mode', run: () => onSelectTestMode('symbols') },
    { id: 'mode-adaptive', title: 'Switch to Weak-Key Adaptive Mode', icon: Flame, category: 'Mode', run: () => onSelectTestMode('adaptive') },
    { id: 'game-orbital', title: 'Play Orbital Defense (Word Blaster)', icon: Crosshair, category: 'Arcade', run: () => onSelectGameMode('orbital') },
    { id: 'game-warp', title: 'Play Warp Drive (Velocity Tunnel)', icon: Rocket, category: 'Arcade', run: () => onSelectGameMode('warp') },
    { id: 'game-hack', title: 'Play Syntax Breaker (Cyber-Hack)', icon: ShieldAlert, category: 'Arcade', run: () => onSelectGameMode('hack') },
    { id: 'audio-thock', title: 'Audio Switch: Deep Thocky Mechanical (160Hz)', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('thock') },
    { id: 'audio-clicky', title: 'Audio Switch: Crisp Clicky Blue', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('clicky') },
    { id: 'audio-pulse', title: 'Audio Switch: Cyber-Pulse Laser Chirp', icon: Volume2, category: 'Audio', run: () => onSelectAudioProfile('cyber-pulse') },
    { id: 'audio-ambient', title: 'Toggle Ambient Synth-Wave Drone Hum', icon: Volume2, category: 'Audio', run: () => onToggleAmbient() },
    { id: 'test-restart', title: 'Quick Restart Current Session', icon: RotateCcw, category: 'Action', run: () => onRestart() },
  ];

  const filtered = actions.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation inside command palette
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl cyber-panel-glow rounded-2xl border border-cyber-cyan/50 overflow-hidden shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-obsidian-900/90">
          <Search className="w-5 h-5 text-cyber-cyan mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or jump to game/mode..."
            className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-slate-500"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-white"
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
                      ? 'bg-cyber-cyan text-obsidian-950 font-bold shadow-neon-cyan'
                      : 'text-slate-300 hover:bg-obsidian-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-obsidian-950' : 'text-cyber-cyan'}`} />
                    <span>{item.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-display ${
                    isSelected ? 'bg-obsidian-950/20 text-obsidian-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.category}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              No cybernetic protocols matching "{query}"
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-obsidian-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Use <kbd className="text-slate-300">↑</kbd> <kbd className="text-slate-300">↓</kbd> to navigate, <kbd className="text-slate-300">Enter</kbd> to run</span>
          <span><kbd className="text-slate-300">Esc</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};

