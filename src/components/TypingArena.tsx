import React, { useRef, useEffect, useState } from 'react';
import { RotateCcw, Ghost, Code2, Sparkles, Rocket } from 'lucide-react';
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

  // Position caret and ghost cursor
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

        // Auto-scroll smooth tracking
        if (spanRect.bottom > containerRect.bottom - 45) {
          containerRef.current.scrollTop += 38;
        } else if (spanRect.top < containerRect.top + 20) {
          containerRef.current.scrollTop = Math.max(0, containerRef.current.scrollTop - 38);
        }
      }

      // Update Ghost Pacer
      const ghostIdx = Math.max(0, Math.min(ghostCharIndex, targetText.length - 1));
      const ghostSpan = charSpanRefs.current[ghostIdx];
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

  // Global key listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
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
      className="w-full relative rocket-panel rounded-2xl p-6 sm:p-8 border border-cyber-cyan/30 dark:border-cyber-cyan/20 shadow-2xl focus:outline-none select-none transition-all duration-300"
      onClick={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      {/* Top Banner / Mode Badge */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <Rocket className="w-4 h-4 text-rocket-thrust animate-pulse" />
          <span className="text-xs font-display tracking-widest text-slate-800 dark:text-cyber-cyan font-black uppercase">
            {mode === 'code' ? `CODE MATRIX // ${codeLang?.toUpperCase()}` : `MISSION PROTOCOL // ${mode.toUpperCase()}`}
          </span>
          {mode === 'code' && <Code2 className="w-3.5 h-3.5 text-cyber-blue" />}
          {mode === 'adaptive' && (
            <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-rocket-thrust/15 text-rocket-thrust border border-rocket-thrust/30 font-sans font-bold">
              <Sparkles className="w-3 h-3" /> ADAPTIVE BOOST
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-400">
            <Ghost className="w-3.5 h-3.5 text-nebula-purple" />
            <span>GHOST PACER:</span>
            <span className="text-rocket-nebula dark:text-cyber-purple font-bold">{targetWpm} WPM</span>
          </div>

          <button
            onClick={onRestart}
            title="Restart Session (Ctrl + Enter)"
            className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-rocket-thrust transition-colors px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-slate-800 hover:border-rocket-thrust/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-sans font-bold">Restart</span>
          </button>
        </div>
      </div>

      {/* Typing Container */}
      <div 
        ref={containerRef}
        className="relative max-h-72 overflow-y-auto pr-2 font-mono text-xl sm:text-2xl leading-relaxed tracking-wide text-left"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Rocket Gliding Caret */}
        {!isFinished && (
          <div
            className="absolute smooth-caret pointer-events-none z-20 flex flex-col items-center"
            style={{
              left: `${caretPos.left}px`,
              top: `${caretPos.top}px`,
              height: `${caretPos.height}px`,
            }}
          >
            {/* Plasma Rocket Tip */}
            <div className="w-[3px] h-full bg-gradient-to-b from-cyber-cyan via-rocket-amber to-rocket-thrust rounded-full shadow-rocket-thrust animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-rocket-thrust -mt-1 shadow-[0_0_8px_#FF5E00]" />
          </div>
        )}

        {/* Ghost Pacer Cursor */}
        {!isFinished && (
          <div
            className="absolute ghost-caret pointer-events-none z-10 opacity-75 flex flex-col items-center"
            style={{
              left: `${ghostPos.left}px`,
              top: `${ghostPos.top}px`,
            }}
          >
            <div className="w-[2px] h-7 bg-rocket-nebula shadow-neon-violet" />
            <div className="text-[9px] -mt-1 font-mono text-rocket-nebula bg-slate-900/80 px-1 rounded border border-rocket-nebula/40 font-bold">
              GHOST
            </div>
          </div>
        )}

        {/* Character Stream Rendering */}
        <div className="break-words font-mono">
          {targetText.split('').map((char, idx) => {
            const state = charStates[idx];
            const isCurrent = idx === currentIndex;

            // Highly legible colors in both dark and light themes
            let charClass = 'text-slate-400 dark:text-slate-600 transition-colors duration-75';

            if (state === 'correct') {
              charClass = 'text-slate-900 dark:text-slate-100 font-medium';
            } else if (state === 'incorrect') {
              charClass = 'text-white bg-cyber-crimson rounded px-[1px] font-bold shadow-neon-crimson';
            } else if (isCurrent) {
              charClass = 'text-cyber-cyan dark:text-cyber-cyan font-bold';
            }

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
        <div className="absolute inset-0 bg-slate-900/70 dark:bg-obsidian-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-30 cursor-pointer">
          <Rocket className="w-10 h-10 text-rocket-thrust animate-bounce mb-2" />
          <p className="text-white font-display tracking-widest text-lg font-black mb-1">
            MISSION PAUSED
          </p>
          <p className="text-slate-300 text-xs font-mono">
            Click anywhere or press any key to engage thrusters
          </p>
        </div>
      )}

      {/* Footer Hints */}
      <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center gap-3">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">Enter</kbd> Restart</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold">Esc</kbd> Command Palette</span>
        </div>
        <div className="text-right font-bold text-slate-600 dark:text-slate-400">
          <span>{currentIndex} / {targetText.length} CHARS</span>
        </div>
      </div>
    </div>
  );
};
