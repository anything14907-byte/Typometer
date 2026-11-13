import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Ghost, Code2, Sparkles } from 'lucide-react';
import { TestMode, CodeLanguage } from '../types/telemetry';

interface TypingArenaProps {
  targetText: string;
  currentIndex: number;
  charStates: ('pending' | 'correct' | 'incorrect')[];
  ghostCharIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  mode: TestMode;
  codeLang?: CodeLanguage;
  targetWpm: number;
  onKeyDown: (e: KeyboardEvent) => void;
  onRestart: () => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  targetText,
  currentIndex,
  charStates,
  ghostCharIndex,
  isFinished,
  mode,
  codeLang,
  targetWpm,
  onKeyDown,
  onRestart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({ left: 0, top: 0, height: 28 });
  const [ghostPos, setGhostPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Update Caret and Ghost position whenever index changes or on resize
  useEffect(() => {
    const updateCaret = () => {
      const activeSpan = charSpanRefs.current[currentIndex];
      if (activeSpan && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const spanRect = activeSpan.getBoundingClientRect();

        setCaretPos({
          left: spanRect.left - containerRect.left,
          top: spanRect.top - containerRect.top,
          height: spanRect.height || 28,
        });

        // Auto-scroll container to keep active line in view
        if (spanRect.bottom > containerRect.bottom - 40) {
          containerRef.current.scrollTop += 36;
        } else if (spanRect.top < containerRect.top + 20) {
          containerRef.current.scrollTop = Math.max(0, containerRef.current.scrollTop - 36);
        }
      }

      // Update Ghost Pacer Position
      const ghostSpan = charSpanRefs.current[Math.min(ghostCharIndex, targetText.length - 1)];
      if (ghostSpan && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const ghostRect = ghostSpan.getBoundingClientRect();
        setGhostPos({
          left: ghostRect.left - containerRect.left,
          top: ghostRect.top - containerRect.top,
        });
      }
    };

    updateCaret();
    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [currentIndex, ghostCharIndex, targetText.length]);

  // Global key listener when typing arena is active
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Tab + Enter to restart
      if (e.key === 'Tab') {
        // Prevent default tab navigation so user can quickly restart
        e.preventDefault();
        return;
      }
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        onRestart();
        return;
      }
      onKeyDown(e);
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onKeyDown, onRestart]);

  return (
    <div 
      className="w-full relative cyber-panel rounded-2xl p-6 sm:p-8 border border-cyber-blue/30 shadow-2xl focus:outline-none select-none transition-all duration-300"
      onClick={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      {/* Top Banner / Mode Badge */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyber-cyan animate-ping" />
          <span className="text-xs font-display tracking-widest text-cyber-cyan font-bold uppercase">
            {mode === 'code' ? `CODE MATRIX // ${codeLang?.toUpperCase()}` : `${mode.toUpperCase()} SYNAPSE LINK`}
          </span>
          {mode === 'code' && <Code2 className="w-3.5 h-3.5 text-cyber-blue" />}
          {mode === 'adaptive' && (
            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-cyber-violet/20 text-cyber-violet border border-cyber-violet/30 font-sans">
              <Sparkles className="w-3 h-3" /> WEAK-KEY ADAPTIVE
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <Ghost className="w-3.5 h-3.5 text-cyber-violet" />
            <span className="text-slate-400">GHOST PACER:</span>
            <span className="text-cyber-violet font-bold">{targetWpm} WPM</span>
          </div>

          <button
            onClick={onRestart}
            title="Restart Session (Ctrl + Enter)"
            className="flex items-center gap-1 text-slate-400 hover:text-cyber-cyan transition-colors px-2 py-1 rounded bg-obsidian-900 border border-slate-800 hover:border-cyber-cyan/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-sans">Restart</span>
          </button>
        </div>
      </div>

      {/* Typing Container with Visual Gliding Caret and Ghost Pacer */}
      <div 
        ref={containerRef}
        className="relative max-h-72 overflow-y-auto pr-2 font-mono text-xl sm:text-2xl leading-relaxed tracking-wide text-left"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Smooth Gliding Active Caret */}
        {!isFinished && (
          <div
            className="absolute smooth-caret pointer-events-none z-20 flex flex-col items-center"
            style={{
              left: `${caretPos.left}px`,
              top: `${caretPos.top}px`,
              height: `${caretPos.height}px`,
            }}
          >
            <div className="w-[3px] h-full bg-cyber-cyan shadow-neon-cyan animate-pulse rounded-full" />
          </div>
        )}

        {/* Ghost Pacer Cursor */}
        {!isFinished && (
          <div
            className="absolute ghost-caret pointer-events-none z-10 opacity-70 flex flex-col items-center"
            style={{
              left: `${ghostPos.left}px`,
              top: `${ghostPos.top}px`,
            }}
          >
            <div className="w-[2px] h-7 bg-cyber-violet border-r border-cyber-purple shadow-neon-violet" />
            <div className="text-[9px] -mt-1 font-mono text-cyber-violet bg-obsidian-950/80 px-1 rounded border border-cyber-violet/40">
              GHOST
            </div>
          </div>
        )}

        {/* Character Stream Rendering */}
        <div className="break-words font-mono">
          {targetText.split('').map((char, idx) => {
            const state = charStates[idx];
            const isCurrent = idx === currentIndex;

            let charClass = 'text-slate-600 transition-colors duration-75';

            if (state === 'correct') {
              charClass = 'text-slate-100';
            } else if (state === 'incorrect') {
              charClass = 'text-cyber-crimson bg-cyber-crimson/20 rounded px-[1px] text-glow-crimson font-bold';
            } else if (isCurrent) {
              charClass = 'text-cyber-cyan';
            }

            // Line break handling for code snippets
            if (char === '\n') {
              return (
                <span
                  key={idx}
                  ref={el => (charSpanRefs.current[idx] = el)}
                  className={`${charClass} inline-block`}
                >
                  ↵
                  <br />
                </span>
              );
            }

            return (
              <span
                key={idx}
                ref={el => (charSpanRefs.current[idx] = el)}
                className={`${charClass} inline-block relative`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Focus Warning Prompt if Blurred */}
      {!isFocused && !isFinished && (
        <div className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-30 cursor-pointer">
          <p className="text-cyber-cyan font-display tracking-widest text-lg font-bold mb-2">
            TELEMETRY LINK PAUSED
          </p>
          <p className="text-slate-400 text-xs font-mono">
            Click anywhere or press any key to resume telemetry capture
          </p>
        </div>
      )}

      {/* Footer Hints */}
      <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> to Quick Restart</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Esc</kbd> for Command Palette</span>
        </div>
        <div className="text-right">
          <span>{currentIndex} / {targetText.length} CHARS</span>
        </div>
      </div>
    </div>
  );
};

