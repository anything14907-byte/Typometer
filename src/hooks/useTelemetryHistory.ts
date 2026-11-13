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
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATS,
          ...parsed,
          bestWpm: parsed.bestWpm || 0,
          totalXp: parsed.totalXp || 0,
          keyAccuracyMap: parsed.keyAccuracyMap || {},
          recentSessions: Array.isArray(parsed.recentSessions) ? parsed.recentSessions : []
        };
      }
    } catch {
      // fallback
    }
    return INITIAL_STATS;
  });

  // Sync to localStorage safely
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
      const newTotalTests = (prev.totalTests || 0) + 1;
      const newTotalTime = (prev.totalTimeMinutes || 0) + (session.timeSeconds / 60);
      const newBestWpm = Math.max(prev.bestWpm || 0, session.wpm);
      
      const newAvgWpm = Math.round(
        ((prev.avgWpm || 0) * (prev.totalTests || 0) + session.wpm) / newTotalTests
      );
      const newAvgAccuracy = Math.round(
        ((prev.avgAccuracy || 0) * (prev.totalTests || 0) + session.accuracy) / newTotalTests
      );

      const earnedXp = Math.round(
        (session.wpm * 2) + 
        (session.accuracy * 1.5) + 
        (session.charCount * 0.3)
      );

      const newTotalXp = (prev.totalXp || 0) + earnedXp;
      const newLevel = Math.max(1, Math.floor(Math.sqrt(newTotalXp / 120)) + 1);

      const updatedKeyMap: KeyHeatmapData = { ...(prev.keyAccuracyMap || {}) };
      if (session.keyStats) {
        Object.entries(session.keyStats).forEach(([key, val]) => {
          if (!updatedKeyMap[key]) {
            updatedKeyMap[key] = { total: 0, errors: 0, totalLatencyMs: 0 };
          }
          updatedKeyMap[key].total += val.total;
          updatedKeyMap[key].errors += val.errors;
          updatedKeyMap[key].totalLatencyMs += val.totalLatencyMs;
        });
      }

      const userRank = getRankForUser(newBestWpm, newTotalXp);
      const existingSessions = Array.isArray(prev.recentSessions) ? prev.recentSessions : [];
      const updatedSessions = [
        { ...session, xpEarned: earnedXp },
        ...existingSessions.slice(0, 49)
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
    currentRank: getRankForUser(stats.bestWpm || 0, stats.totalXp || 0)
  };
}
