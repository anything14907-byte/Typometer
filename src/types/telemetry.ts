export type TestMode = 'prose' | 'code' | 'symbols' | 'adaptive';

export type GameMode = 'standard' | 'orbital' | 'warp' | 'hack';

export type CodeLanguage = 'typescript' | 'python' | 'rust';

export interface KeystrokeEvent {
  key: string;
  timestamp: number;
  expected: string;
  isCorrect: boolean;
  latencyMs: number;
}

export interface WpmPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
  accuracy: number;
}

export interface KeyHeatmapData {
  [key: string]: {
    total: number;
    errors: number;
    totalLatencyMs: number;
  };
}

export interface SessionResult {
  id: string;
  date: string;
  mode: TestMode;
  codeLang?: CodeLanguage;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeSeconds: number;
  charCount: number;
  errorCount: number;
  wpmTimeline: WpmPoint[];
  keyStats: KeyHeatmapData;
  xpEarned: number;
  targetWpm?: number;
  completed: boolean;
}

export interface UserStats {
  totalTests: number;
  totalTimeMinutes: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  totalXp: number;
  level: number;
  rankTitle: string;
  keyAccuracyMap: KeyHeatmapData;
  recentSessions: SessionResult[];
}

export interface DiagnosticInsight {
  type: 'weak-key' | 'finger-transition' | 'speed-burst' | 'consistency' | 'accuracy';
  severity: 'high' | 'medium' | 'positive';
  title: string;
  description: string;
  recommendedAction: string;
  drillKeys?: string[];
}

export type SwitchAudioProfile = 'rocket-thrust' | 'thock' | 'clicky' | 'cyber-pulse' | 'silent';

export type AppTheme = 'dark' | 'light';
