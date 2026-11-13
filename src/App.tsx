import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Terminal, 
  Code2, 
  Hash, 
  Sparkles, 
  Crosshair, 
  ShieldAlert, 
  Trophy, 
  Flame, 
  Keyboard, 
  RotateCcw,
  SlidersHorizontal,
  Sun,
  Moon
} from 'lucide-react';

import { TestMode, GameMode, CodeLanguage, SessionResult, AppTheme } from './types/telemetry';
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
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('typometer_theme') as AppTheme) || 'dark';
  });

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

  // Apply Theme to <html> root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('typometer_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Telemetry Engine & LocalStorage
  const { stats, recordSession, currentRank } = useTelemetryHistory();

  // Audio Synthesizer (100% reliable)
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

  // Global hotkeys (Esc for Command Palette)
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
    <div className="min-h-screen rocket-bg text-slate-800 dark:text-slate-100 flex flex-col font-mono selection:bg-rocket-thrust/30 selection:text-rocket-thrust transition-colors duration-300">
      {/* Top Rocket Mission Control Header */}
      <header className="w-full border-b border-slate-200 dark:border-cyber-blue/20 bg-white/80 dark:bg-obsidian-950/85 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Logo & Aerospace Staging */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-rocket-flame via-rocket-thrust to-rocket-amber flex items-center justify-center shadow-rocket-thrust">
              <Rocket className="w-5 h-5 text-white animate-flame-flicker" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-display font-black tracking-widest text-slate-900 dark:text-white">
                  TYPOMETER
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rocket-thrust/15 text-rocket-thrust border border-rocket-thrust/40 font-mono font-bold">
                  ROCKET MISSION v2.7
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                Aerospace Cognitive Typing & Telemetry Engine
              </p>
            </div>
          </div>

          {/* Gamified Mission Modes Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-obsidian-900/90 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-xs">
            {/* Standard Mode */}
            <button
              onClick={() => { setGameMode('standard'); setActiveSession(null); }}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all flex items-center gap-1.5 ${
                gameMode === 'standard'
                  ? 'bg-rocket-thrust text-white shadow-rocket-thrust'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Standard Flight</span>
            </button>

            {/* Orbital Defense */}
            <button
              onClick={() => setGameMode('orbital')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all flex items-center gap-1.5 ${
                gameMode === 'orbital'
                  ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Orbital Blaster</span>
            </button>

            {/* Warp Drive */}
            <button
              onClick={() => setGameMode('warp')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all flex items-center gap-1.5 ${
                gameMode === 'warp'
                  ? 'bg-rocket-nebula text-white shadow-neon-violet'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Warp Tunnel</span>
            </button>

            {/* Syntax Breaker */}
            <button
              onClick={() => setGameMode('hack')}
              className={`px-3 py-1.5 rounded-lg font-display text-xs font-black transition-all flex items-center gap-1.5 ${
                gameMode === 'hack'
                  ? 'bg-cyber-crimson text-white shadow-neon-crimson'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Syntax Hack</span>
            </button>
          </div>

          {/* Right Action Tools & Theme Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-obsidian-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-amber-400 hover:scale-105 transition-all shadow-sm"
              title={`Switch to ${theme === 'dark' ? 'Light (Apollo)' : 'Dark (Deep Space)'} Theme`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Focus Sprint Timer Button */}
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-display text-xs font-bold transition-all ${
                showPomodoro
                  ? 'bg-rocket-thrust/20 border-rocket-thrust text-rocket-thrust'
                  : 'bg-slate-200/80 dark:bg-obsidian-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rocket-thrust" />
              <span>Sprint</span>
            </button>

            {/* Pilot Dossier Button */}
            <button
              onClick={() => setShowCareerModal(true)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-obsidian-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-rocket-amber transition-all flex items-center gap-1.5 font-mono text-xs font-bold"
            >
              <Trophy className="w-3.5 h-3.5 text-rocket-amber" />
              <span>PB {stats.bestWpm || 0}</span>
            </button>

            {/* Command Palette */}
            <button
              onClick={() => setShowCommandPalette(true)}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-obsidian-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title="Command Palette (Esc)"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Cockpit Arena */}
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

        {/* Standard Mission Mode */}
        {gameMode === 'standard' && (
          <div className="w-full space-y-4">
            
            {/* Mode Selector & Audio Toolbar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-2">
              <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-obsidian-900/90 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-xs">
                {/* Cyber-Prose */}
                <button
                  onClick={() => { setTestMode('prose'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-black transition-all ${
                    testMode === 'prose'
                      ? 'bg-rocket-thrust text-white shadow-rocket-thrust'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Mission Prose</span>
                </button>

                {/* Code Matrix */}
                <button
                  onClick={() => { setTestMode('code'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-black transition-all ${
                    testMode === 'code'
                      ? 'bg-cyber-cyan text-slate-950 shadow-neon-cyan'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Code Matrix</span>
                </button>

                {/* Symbols */}
                <button
                  onClick={() => { setTestMode('symbols'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-black transition-all ${
                    testMode === 'symbols'
                      ? 'bg-cyber-emerald text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Hash className="w-3.5 h-3.5" />
                  <span>Gauntlet</span>
                </button>

                {/* Weak-Key Adaptive */}
                <button
                  onClick={() => { setTestMode('adaptive'); setActiveSession(null); }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-display font-black transition-all ${
                    testMode === 'adaptive'
                      ? 'bg-rocket-nebula text-white shadow-neon-violet'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Weak-Key Adaptive</span>
                </button>
              </div>

              {/* Code language selector if in Code mode */}
              {testMode === 'code' && (
                <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-obsidian-900/90 p-1 rounded-xl border border-slate-300 dark:border-slate-800 text-xs font-mono">
                  {(['typescript', 'python', 'rust'] as CodeLanguage[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold transition-all ${
                        codeLang === lang
                          ? 'bg-rocket-thrust text-white font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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

            {/* Live Rocket Telemetry HUD */}
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

            {/* In-Session Typing Arena or Results Dashboard */}
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

      {/* Aerodynamic Launch Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-obsidian-950/90 py-2.5 px-6 text-center text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rocket-thrust animate-ping" />
          <span className="font-bold text-slate-700 dark:text-slate-300">ROCKET TELEMETRY ONLINE // TRANSONIC SPEED BUFFER</span>
        </div>
        <div>
          <span>Press <kbd className="text-slate-700 dark:text-slate-400 font-bold">Esc</kbd> Command Palette | <kbd className="text-slate-700 dark:text-slate-400 font-bold">Ctrl+Enter</kbd> Restart</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
