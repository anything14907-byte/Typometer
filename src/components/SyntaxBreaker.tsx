import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, CheckCircle, RotateCcw, ArrowLeft, Lock, Unlock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SyntaxBreakerProps {
  onBack: () => void;
  playKeypress?: (c: string) => void;
  playError?: () => void;
  playComboChime?: (n: number) => void;
}

const HACK_NODES = [
  { level: 1, name: "PORT FIREWALL OVERRIDE", target: "iptables -t nat -A PREROUTING -p tcp --dport 8080 -j REDIRECT" },
  { level: 2, name: "SYNAPSE HASH DECRYPTION", target: "sha256:4f9a0b8c2d1e7f6a5b4c3d2e1f0a9b8c" },
  { level: 3, name: "ROOT KERNEL INJECTION", target: "chmod 777 /sys/kernel/debug/tracing/kprobe_events" },
  { level: 4, name: "ORBITAL PAYLOAD EXECUTION", target: "curl -sX POST https://matrix.core.net/override -d 'status=ROOT'" },
  { level: 5, name: "QUANTUM SINGULARITY BYPASS", target: "export MATRIX_KEY=0xDEADBEEF_C00L_H4CK_2026 && ./detonate.sh" }
];

export const SyntaxBreaker: React.FC<SyntaxBreakerProps> = ({
  onBack,
  playKeypress,
  playError,
  playComboChime,
}) => {
  const [currentNodeIdx, setCurrentNodeIdx] = useState<number>(0);
  const [charIdx, setCharIdx] = useState<number>(0);
  const [traceProgress, setTraceProgress] = useState<number>(0);
  const [isTraced, setIsTraced] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const currentNode = HACK_NODES[currentNodeIdx];

  // Firewall Trace Timer (Advances automatically)
  useEffect(() => {
    if (isTraced || isVictory) return;

    // Faster trace for higher levels
    const intervalTime = Math.max(70, 140 - currentNodeIdx * 15);
    const timer = setInterval(() => {
      setTraceProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          setIsTraced(true);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentNodeIdx, isTraced, isVictory]);

  // Keystroke capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTraced || isVictory) return;
      if (e.key === 'Tab' || e.key === 'Escape') return;

      const expected = currentNode.target[charIdx];
      if (e.key === expected) {
        playKeypress?.(e.key);
        const nextIdx = charIdx + 1;

        if (nextIdx >= currentNode.target.length) {
          // Completed node!
          setScore(s => s + (100 - traceProgress) * 20);
          playComboChime?.(20);

          if (currentNodeIdx + 1 >= HACK_NODES.length) {
            setIsVictory(true);
            try {
              confetti({ particleCount: 90, spread: 80, colors: ['#00F0FF', '#10B981', '#A855F7'] });
            } catch {}
          } else {
            setCurrentNodeIdx(n => n + 1);
            setCharIdx(0);
            setTraceProgress(0); // Reset trace for next node
          }
        } else {
          setCharIdx(nextIdx);
        }
      } else if (e.key.length === 1) {
        playError?.();
        // Error accelerates firewall trace by 3%
        setTraceProgress(p => Math.min(100, p + 3));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [charIdx, currentNode, currentNodeIdx, isTraced, isVictory, traceProgress, playKeypress, playError, playComboChime]);

  const restartHack = () => {
    setCurrentNodeIdx(0);
    setCharIdx(0);
    setTraceProgress(0);
    setIsTraced(false);
    setIsVictory(false);
    setScore(0);
  };

  return (
    <div className="w-full cyber-panel rounded-2xl p-6 border border-cyber-cyan/30 relative">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyber-cyan animate-pulse" />
            <h3 className="text-lg font-display font-extrabold text-white tracking-wider">
              SYNTAX BREAKER // CYBER-HACK
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Decipher security hashes before firewall counter-trace reaches 100%. Mistakes accelerate trace.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded-lg bg-obsidian-900 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return
        </button>
      </div>

      {/* Nodes Status Matrix */}
      <div className="grid grid-cols-5 gap-2 mb-4 font-mono text-xs">
        {HACK_NODES.map((node, i) => {
          const isDone = i < currentNodeIdx;
          const isCurrent = i === currentNodeIdx;
          return (
            <div
              key={node.level}
              className={`p-2 rounded-lg border text-center ${
                isDone
                  ? 'bg-cyber-emerald/15 border-cyber-emerald/50 text-cyber-emerald'
                  : isCurrent
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-neon-cyan'
                  : 'bg-obsidian-900/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-0.5">
                {isDone ? <Unlock className="w-3 h-3 text-cyber-emerald" /> : <Lock className="w-3 h-3" />}
                <span className="font-display font-bold">L{node.level}</span>
              </div>
              <div className="truncate text-[10px]">{node.name.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>

      {/* Firewall Trace Progress Bar */}
      <div className="p-3 rounded-xl bg-obsidian-900 border border-slate-800 mb-6">
        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
          <span className="flex items-center gap-1.5 text-cyber-crimson font-display font-bold">
            <ShieldAlert className="w-4 h-4 animate-bounce" /> FIREWALL COUNTER-TRACE
          </span>
          <span className={`font-bold ${traceProgress > 75 ? 'text-cyber-crimson animate-ping' : 'text-slate-300'}`}>
            {traceProgress}% DETECTED
          </span>
        </div>
        <div className="w-full h-3 bg-obsidian-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              traceProgress > 75 ? 'bg-cyber-crimson shadow-neon-crimson' : traceProgress > 45 ? 'bg-cyber-amber' : 'bg-cyber-cyan'
            }`}
            style={{ width: `${traceProgress}%` }}
          />
        </div>
      </div>

      {/* Decryption Code Terminal */}
      <div className="p-6 rounded-xl bg-obsidian-950 border border-cyber-cyan/30 font-mono text-base sm:text-lg leading-relaxed relative min-h-[160px] flex flex-col justify-center">
        <div className="text-xs text-cyber-blue mb-2 font-display uppercase tracking-wider flex items-center justify-between">
          <span>// TARGET STRING [NODE {currentNode.level}: {currentNode.name}]</span>
          <span>SCORE: {score}</span>
        </div>

        <div className="break-all tracking-wide text-slate-500">
          {currentNode.target.split('').map((ch, idx) => {
            let color = 'text-slate-600';
            if (idx < charIdx) {
              color = 'text-cyber-emerald font-bold';
            } else if (idx === charIdx) {
              color = 'text-cyber-cyan bg-cyber-cyan/20 px-0.5 rounded underline';
            }
            return (
              <span key={idx} className={color}>
                {ch}
              </span>
            );
          })}
        </div>

        {/* Traced Failure Screen */}
        {isTraced && (
          <div className="absolute inset-0 bg-obsidian-950/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <ShieldAlert className="w-14 h-14 text-cyber-crimson mb-2 animate-bounce" />
            <h4 className="text-xl font-display font-black text-cyber-crimson text-glow-crimson mb-1">
              TRACE COMPLETE // NETWORK LOCKED
            </h4>
            <p className="text-xs text-slate-400 font-mono mb-4">
              Firewall localized your terminal signature before encryption key was cracked.
            </p>
            <button
              onClick={restartHack}
              className="px-5 py-2 rounded-xl font-display text-sm font-bold bg-cyber-cyan text-obsidian-950 hover:bg-cyber-blue shadow-neon-cyan flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> RETRY INFILTRATION
            </button>
          </div>
        )}

        {/* Victory Screen */}
        {isVictory && (
          <div className="absolute inset-0 bg-obsidian-950/95 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle className="w-14 h-14 text-cyber-emerald mb-2 animate-bounce" />
            <h4 className="text-xl font-display font-black text-cyber-emerald text-glow-emerald mb-1">
              SYSTEM BREACH ACCOMPLISHED
            </h4>
            <p className="text-xs text-slate-400 font-mono mb-4">
              All 5 security nodes dismantled. Final Hack Score: <strong className="text-cyber-cyan">{score}</strong>
            </p>
            <button
              onClick={restartHack}
              className="px-5 py-2 rounded-xl font-display text-sm font-bold bg-cyber-emerald text-obsidian-950 hover:bg-emerald-400 shadow-neon-emerald flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> INFILTRATE AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

