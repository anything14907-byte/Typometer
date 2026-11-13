import { useState, useEffect, useCallback } from 'react';
import { SessionResult, UserStats, KeyHeatmapData } from '../types/telemetry';
import { getRankForUser } from '../data/ranks';

const STORAGE_KEY = 'typometer_user_telemetry_v1';

const INITIAL_STATS: UserStats = {
  totalTests: 0,
  totalTimeMinutes: 0,
  bestWpm: 0,
  avgWpm: 0,
  avgAccuracy: 0,
  totalXp: 0,
  level: 1,
  rankTitle: "INITIATE RECEPTOR",
  keyAccuracyMap: {},
  recentSessions: []
};

export function useTelemetryHistory() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error("Failed to save telemetry to localStorage", e);
    }
  }, [stats]);

  /**
   * Save a newly finished session result and update user stats & level
   */
  const recordSession = useCallback((session: SessionResult) => {
    setStats(prev => {
      const newTotalTests = prev.totalTests + 1;
      const newTotalTime = prev.totalTimeMinutes + (session.timeSeconds / 60);
      const newBestWpm = Math.max(prev.bestWpm, session.wpm);
      
      // Calculate weighted averages
      const newAvgWpm = Math.round(
        (prev.avgWpm * prev.totalTests + session.wpm) / newTotalTests
      );
      const newAvgAccuracy = Math.round(
        (prev.avgAccuracy * prev.totalTests + session.accuracy) / newTotalTests
      );

      // XP calculation: (WPM * 2) + (Accuracy * 1.5) + (CharCount * 0.2) + Streak Bonus
      const earnedXp = Math.round(
        (session.wpm * 2) + 
        (session.accuracy * 1.5) + 
        (session.charCount * 0.3)
      );

      const newTotalXp = prev.totalXp + earnedXp;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newTotalXp / 120)) + 1);

      // Update aggregate key stats
      const updatedKeyMap: KeyHeatmapData = { ...prev.keyAccuracyMap };
      Object.entries(session.keyStats).forEach(([key, val]) => {
        if (!updatedKeyMap[key]) {
          updatedKeyMap[key] = { total: 0, errors: 0, totalLatencyMs: 0 };
        }
        updatedKeyMap[key].total += val.total;
        updatedKeyMap[key].errors += val.errors;
        updatedKeyMap[key].totalLatencyMs += val.totalLatencyMs;
      });

      const userRank = getRankForUser(newBestWpm, newTotalXp);

      // Prepend session to recent sessions (keep last 50)
      const updatedSessions = [
        { ...session, xpEarned: earnedXp },
        ...prev.recentSessions.slice(0, 49)
      ];

      return {
        totalTests: newTotalTests,
        totalTimeMinutes: parseFloat(newTotalTime.toFixed(1)),
        bestWpm: newBestWpm,
        avgWpm: newAvgWpm,
        avgAccuracy: newAvgAccuracy,
        totalXp: newTotalXp,
        level: newLevel,
        rankTitle: userRank.title,
        keyAccuracyMap: updatedKeyMap,
        recentSessions: updatedSessions
      };
    });
  }, []);

  const resetTelemetry = useCallback(() => {
    setStats(INITIAL_STATS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    stats,
    recordSession,
    resetTelemetry,
    currentRank: getRankForUser(stats.bestWpm, stats.totalXp)
  };
}

