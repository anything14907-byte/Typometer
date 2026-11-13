import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code2, 
  Hash, 
  Sparkles, 
  Crosshair, 
  Rocket, 
  ShieldAlert, 
  Trophy, 
  Flame, 
  Keyboard, 
  RotateCcw,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';

import { TestMode, GameMode, CodeLanguage, SessionResult } from './types/telemetry';
import { useTypingEngine } from './hooks/useTypingEngine';
import { useAudioSynth } from './hooks/useAudioSynth';
import { useTelemetryHistory } from './hooks/useTelemetryHistory';

import { TelemetryHUD } from './components/TelemetryHUD';
import { TypingArena } from './components/TypingArena';
import { ResultsDashboard } from './components/ResultsDashboard';
import { OrbitalDefense } from './components/OrbitalDefense';
import { WarpDrive } from './components/WarpDrive';
import { SyntaxBreaker } from './components/SyntaxBreaker';
import { PomodoroSprint } from './components/PomodoroSprint';
import { WeakKeyDrillModal } from './components/WeakKeyDrillModal';
import { CommandPalette } from './components/CommandPalette';
import { CareerTelemetryModal } from './components/CareerTelemetryModal';
import { AudioControl } from './components/AudioControl';

export function App() {
  const [testMode, setTestMode] = useState<TestMode>('prose');
  const [gameMode, setGameMode] = useState<GameMode>('standard');
  const [codeLang, setCodeLang] = useState<CodeLanguage>('typescript');
  const [targetWpm, setTargetWpm] = useState<number>(85);

  const [activeSession, setActiveSession] = useState<SessionResult | null>(null);
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);
  const [showCareerModal, setShowCareerModal] = useState<boolean>(false);
  const [showWeakDrillModal, setShowWeakDrillModal] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [drillTargetKeys, setDrillTargetKeys] = useState<string[]>([]);

  // Telemetry Engine & LocalStorage
  const { stats, recordSession, currentRank } = useTelemetryHistory();

  // Audio Synthesizer
  const {
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
  } = useAudioSynth();

  // Typing Engine
  const {
    targetText,
    currentIndex,
    charStates,
    isStarted,
    isFinished,
    liveWpm,
    liveRawWpm,
    liveAccuracy,
    currentLatency,
    combo,
    maxCombo,
    ghostCharIndex,
    wpmTimeline,
    handleKeyDown,
    restartTest,
  } = useTypingEngine({
    mode: testMode,
    codeLang,
    targetWpm: stats.bestWpm > 30 ? stats.bestWpm : targetWpm,
    aggregateKeyStats: stats.keyAccuracyMap,
    onSessionComplete: (session) => {
      recordSession(session);
      setActiveSession(session);
    },
    onKeypressSound: playKeypress,
    onErrorSound: playError,
    onComboChime: playComboChime,
  });

  // Global hotkeys for Esc (Command Palette)
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
  }, []);

  const handleLaunchWeakKeyDrill = (keys: string[]) => {
    setDrillTargetKeys(keys);
    setShowWeakDrillModal(true);
  };

  const handleStartTargetedDrill = (customText: string) => {
    setTestMode('adaptive');
    setGameMode('standard');
    setActiveSession(null);
    restartTest(customText);
  };

  const restartCurrentTest = () => {
    setActiveSession(null);
    restartTest();
  };

  return (
    <div className="min-h-screen cyber-bg scanline-overlay text-slate-100 flex flex-col font-mono selection:bg-cyber-cyan/30 selection:text-cyber-cyan">
      {/* Top Cybernetic Telemetry Header */}
      <header className="w-full border-b border-cyber-blue/20 bg-obsidian-950/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Logo & Version */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-obsidian-900 border border-cyber-cyan/50 flex items-center justify-center shadow-neon-cyan">
              <Terminal className="w-5 h-5 text-cyber-cyan animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-display font-black text-white tracking-widest">
                  TYPOMETER
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30 font-mono">
                  v2.6 TELEMETRY
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Advanced Biomechanical Typing Cockpit
              </p>
            </div>
          </div>

          {/* Gamified Mode Switcher HUD */}
          <div className="flex items-center gap-1.5 bg-obsidian-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            {/* Standard Mode */}
            <button
              onClick={() => { setGameMode('standard'); setActiveSession(null); }}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 ${
                gameMode === 'standard'
                  ? 'bg-cyber-cyan text-obsidian-950 shadow-neon-cyan'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>

            {/* Orbital Defense */}
            <button
              onClick={() => setGameMode('orbital')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 ${
                gameMode === 'orbital'
                  ? 'bg-cyber-violet text-white shadow-neon-violet'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Orbital Defense</span>
            </button>

            {/* Warp Drive */}
            <button
              onClick={() => setGameMode('warp')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 ${
                gameMode === 'warp'
                  ? 'bg-cyber-emerald text-obsidian-950 shadow-neon-emerald'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Warp Drive</span>
            </button>

            {/* Syntax Breaker */}
            <button
              onClick={() => setGameMode('hack')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all flex items-center gap-1.5 ${
                gameMode === 'hack'
                  ? 'bg-cyber-crimson text-white shadow-neon-crimson'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Syntax Breaker</span>
            </button>
          </div>

          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Focus Sprint Timer Button */}
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-display text-xs font-bold transition-all ${
                showPomodoro
                  ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                  : 'bg-obsidian-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Deep Sprint</span>
            </button>

            {/* Lifetime Telemetry Dossier Button */}
            <button
              onClick={() => setShowCareerModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-300 hover:text-cyber-amber hover:border-cyber-amber/40 transition-all flex items-center gap-1.5 font-mono text-xs"
            >
              <Trophy className="w-3.5 h-3.5 text-cyber-amber" />
              <span className="font-display font-bold">{currentRank.badge}</span>
              <span className="text-slate-500">| PB {stats.bestWpm} WPM</span>
            </button>

            {/* Command Palette Trigger */}
            <button
              onClick={() => setShowCommandPalette(true)}
              className="p-1.5 rounded-xl bg-obsidian-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Command Palette (Esc)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Cockpit Arena Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col justify-center">
        
        {/* Game Mode 1: Orbital Defense */}
        {gameMode === 'orbital' && (
          <OrbitalDefense
            onBack={() => setGameMode('standard')}
            playLaserSound={playLaserSound}
            playShockwaveSound={playShockwaveSound}
          />
        )}

        {/* Game Mode 2: Warp Drive */}
        {gameMode === 'warp' && (
          <WarpDrive
            onBack={() => setGameMode('standard')}
            playKeypress={playKeypress}
            playError={playError}
          />
        )}

        {/* Game Mode 3: Syntax Breaker */}
        {gameMode === 'hack' && (
          <SyntaxBreaker
            onBack={() => setGameMode('standard')}
            playKeypress={playKeypress}
            playError={playError}
            playComboChime={playComboChime}
          />
        )}

        {/* Standard Telemetry Mode */}
        {gameMode === 'standard' && (
          <div className="w-full space-y-4">
            
            {/* Multi-Domain Sub-Mode Selector & Audio Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-1 bg-obsidian-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                {/* Cyber-Prose */}
                <button
                  onClick={() => { setTestMode('prose'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-bold transition-all ${
                    testMode === 'prose'
                      ? 'bg-cyber-cyan text-obsidian-950 shadow-neon-cyan'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Cyber-Prose</span>
                </button>

                {/* Code Matrix */}
                <button
                  onClick={() => { setTestMode('code'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-bold transition-all ${
                    testMode === 'code'
                      ? 'bg-cyber-blue text-obsidian-950 shadow-neon-cyan'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Matrix</span>
                </button>

                {/* Numbers & Symbols */}
                <button
                  onClick={() => { setTestMode('symbols'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-bold transition-all ${
                    testMode === 'symbols'
                      ? 'bg-cyber-emerald text-obsidian-950 shadow-neon-emerald'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Gauntlet</span>
                </button>

                {/* Weak-Key Adaptive */}
                <button
                  onClick={() => { setTestMode('adaptive'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-bold transition-all ${
                    testMode === 'adaptive'
                      ? 'bg-cyber-violet text-white shadow-neon-violet'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Weak-Key Adaptive</span>
                </button>
              </div>

              {/* If in Code Matrix mode, show Language Selector */}
              {testMode === 'code' && (
                <div className="flex items-center gap-1 bg-obsidian-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                  {(['typescript', 'python', 'rust'] as CodeLanguage[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-2.5 py-1 rounded-lg uppercase font-mono text-[11px] font-bold transition-all ${
                        codeLang === lang
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Synthesizer Controls */}
              <AudioControl
                profile={profile}
                setProfile={setProfile}
                ambientEnabled={ambientEnabled}
                setAmbientEnabled={setAmbientEnabled}
                volume={volume}
                setVolume={setVolume}
              />
            </div>

            {/* Live Real-time Telemetry HUD */}
            <TelemetryHUD
              liveWpm={liveWpm}
              rawWpm={liveRawWpm}
              accuracy={liveAccuracy}
              latencyMs={currentLatency}
              combo={combo}
              maxCombo={maxCombo}
              wpmTimeline={wpmTimeline}
              targetWpm={stats.bestWpm > 30 ? stats.bestWpm : targetWpm}
              isStarted={isStarted}
            />

            {/* In-Session Typing Arena or Post-Run Results Dashboard */}
            {isFinished && activeSession ? (
              <ResultsDashboard
                session={activeSession}
                onRestart={restartCurrentTest}
                onLaunchWeakKeyDrill={handleLaunchWeakKeyDrill}
              />
            ) : (
              <TypingArena
                targetText={targetText}
                currentIndex={currentIndex}
                charStates={charStates}
                ghostCharIndex={ghostCharIndex}
                isStarted={isStarted}
                isFinished={isFinished}
                mode={testMode}
                codeLang={codeLang}
                targetWpm={stats.bestWpm > 30 ? stats.bestWpm : targetWpm}
                onKeyDown={handleKeyDown}
                onRestart={restartCurrentTest}
              />
            )}

            {/* Optional Pomodoro Sprint Drawer */}
            {showPomodoro && (
              <div className="mt-6">
                <PomodoroSprint
                  onClose={() => setShowPomodoro(false)}
                  onPhaseChangeAlert={playComboChime ? () => playComboChime(30) : undefined}
                />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Weak-Key Adaptive Drill Modal */}
      <WeakKeyDrillModal
        initialKeys={drillTargetKeys}
        isOpen={showWeakDrillModal}
        onClose={() => setShowWeakDrillModal(false)}
        onStartDrill={handleStartTargetedDrill}
      />

      {/* Career Telemetry Dossier Modal */}
      <CareerTelemetryModal
        isOpen={showCareerModal}
        onClose={() => setShowCareerModal(false)}
        stats={stats}
        currentRank={currentRank}
        onLaunchDrill={(keys) => {
          setShowCareerModal(false);
          handleLaunchWeakKeyDrill(keys);
        }}
        onLaunchGame={(g) => {
          setShowCareerModal(false);
          setGameMode(g);
        }}
      />

      {/* Command Palette (Esc) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onSelectGameMode={mode => setGameMode(mode)}
        onSelectTestMode={mode => {
          setTestMode(mode);
          setActiveSession(null);
          restartTest();
        }}
        onSelectAudioProfile={setProfile}
        onToggleAmbient={() => setAmbientEnabled(!ambientEnabled)}
        onRestart={restartCurrentTest}
      />

      {/* Subtle Laser Status Footer */}
      <footer className="w-full border-t border-slate-900 bg-obsidian-950/90 py-2.5 px-6 text-center text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald" />
          <span>NEURAL LINK ONLINE // ZERO LATENCY BUFFER</span>
        </div>
        <div>
          <span>Press <kbd className="text-slate-400">Esc</kbd> for Command Palette | <kbd className="text-slate-400">Ctrl+Enter</kbd> to Restart</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

