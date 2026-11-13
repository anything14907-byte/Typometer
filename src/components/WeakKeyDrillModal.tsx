import React, { useState } from 'react';
import { Target, X, Play, Sparkles } from 'lucide-react';
import { WEAK_KEY_DRILL_TEMPLATES } from '../data/cyberSnippets';

interface WeakKeyDrillModalProps {
  initialKeys: string[];
  isOpen: boolean;
  onClose: () => void;
  onStartDrill: (customText: string, targetKeys: string[]) => void;
}

export const WeakKeyDrillModal: React.FC<WeakKeyDrillModalProps> = ({
  initialKeys,
  isOpen,
  onClose,
  onStartDrill,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(initialKeys.length > 0 ? initialKeys : ['s', 'w', 'a']);

  if (!isOpen) return null;

  const toggleKey = (k: string) => {
    setSelectedKeys(prev => 
      prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]
    );
  };

  const handleLaunch = () => {
    // Generate specialized targeted text
    const targetWords: string[] = [];
    selectedKeys.forEach(k => {
      const words = WEAK_KEY_DRILL_TEMPLATES[k.toLowerCase()] || ['matrix', 'cyber', 'vector'];
      targetWords.push(...words);
    });

    const shuffled = [...targetWords].sort(() => Math.random() - 0.5).slice(0, 22);
    const generated = shuffled.join(' ') + '.';

    onStartDrill(generated, selectedKeys);
    onClose();
  };

  const allAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg cyber-panel-glow rounded-2xl p-6 border border-cyber-cyan/40 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-cyber-cyan" />
          <h3 className="text-lg font-display font-extrabold text-white tracking-wider">
            SYNAPTIC WEAK-KEY REWIRING DRILL
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Select your high-latency or error-prone keys to generate a precision sentence loaded with targeted muscle memory transitions.
        </p>

        {/* Selected Keys Display */}
        <div className="mb-4 p-3 rounded-xl bg-obsidian-900/90 border border-slate-800">
          <span className="text-[11px] font-display text-cyber-cyan uppercase font-bold block mb-1.5">
            CURRENT TARGET BOTTLE-NECKS:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {selectedKeys.length > 0 ? (
              selectedKeys.map(k => (
                <span
                  key={k}
                  className="px-2.5 py-1 rounded bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40 font-mono text-sm font-bold flex items-center gap-1"
                >
                  [{k.toUpperCase()}]
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 font-mono">None selected</span>
            )}
          </div>
        </div>

        {/* Alphabet Selector Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 mb-6">
          {allAlphabet.map(k => {
            const isSelected = selectedKeys.includes(k);
            return (
              <button
                key={k}
                onClick={() => toggleKey(k)}
                className={`h-9 rounded border font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyber-cyan text-obsidian-950 border-cyber-cyan shadow-neon-cyan'
                    : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {k.toUpperCase()}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={handleLaunch}
          disabled={selectedKeys.length === 0}
          className="w-full py-3 rounded-xl font-display text-sm font-bold bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue shadow-neon-cyan flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          START TARGETED DRILL NOW
        </button>
      </div>
    </div>
  );
};

