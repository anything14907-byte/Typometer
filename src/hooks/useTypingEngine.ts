import { useState, useEffect, useRef, useCallback } from 'react';
import { TestMode, CodeLanguage, WpmPoint, KeyHeatmapData, SessionResult } from '../types/telemetry';
import { generateTestText } from '../utils/textGenerator';
import { calculateConsistency } from '../utils/telemetryStats';

export interface UseTypingEngineOptions {
  mode: TestMode;
  codeLang?: CodeLanguage;
  targetWpm?: number;
  aggregateKeyStats?: KeyHeatmapData;
  onSessionComplete?: (session: SessionResult) => void;
  onKeypressSound?: (char: string) => void;
  onErrorSound?: () => void;
  onComboChime?: (combo: number) => void;
}

export function useTypingEngine({
  mode,
  codeLang = 'typescript',
  targetWpm = 75,
  aggregateKeyStats,
  onSessionComplete,
  onKeypressSound,
  onErrorSound,
  onComboChime
}: UseTypingEngineOptions) {
  const [targetText, setTargetText] = useState<string>(() => 
    generateTestText(mode, codeLang, aggregateKeyStats)
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [charStates, setCharStates] = useState<('pending' | 'correct' | 'incorrect')[]>(() => 
    new Array(targetText.length).fill('pending')
  );

  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveRawWpm, setLiveRawWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [currentLatency, setCurrentLatency] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  const [ghostCharIndex, setGhostCharIndex] = useState<number>(0);
  const [wpmTimeline, setWpmTimeline] = useState<WpmPoint[]>([]);

  // Internal measurement tracking
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const totalTypedCountRef = useRef<number>(0);
  const correctCountRef = useRef<number>(0);
  const errorCountRef = useRef<number>(0);
  const keyStatsRef = useRef<KeyHeatmapData>({});
  const timerIntervalRef = useRef<number | null>(null);

  /**
   * Reset / regenerate the typing test
   */
  const restartTest = useCallback((customText?: string) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const newText = customText || generateTestText(mode, codeLang, aggregateKeyStats);
    setTargetText(newText);
    setCurrentIndex(0);
    setCharStates(new Array(newText.length).fill('pending'));
    setIsStarted(false);
    setIsFinished(false);
    setLiveWpm(0);
    setLiveRawWpm(0);
    setLiveAccuracy(100);
    setCurrentLatency(0);
    setCombo(0);
    setMaxCombo(0);
    setGhostCharIndex(0);
    setWpmTimeline([]);

    startTimeRef.current = null;
    lastKeyTimeRef.current = null;
    totalTypedCountRef.current = 0;
    correctCountRef.current = 0;
    errorCountRef.current = 0;
    keyStatsRef.current = {};
  }, [mode, codeLang, aggregateKeyStats]);

  // Handle mode or language change
  useEffect(() => {
    restartTest();
  }, [mode, codeLang]);

  // Real-time telemetry ticker
  useEffect(() => {
    if (isStarted && !isFinished) {
      timerIntervalRef.current = window.setInterval(() => {
        if (!startTimeRef.current) return;
        const now = Date.now();
        const elapsedSeconds = Math.max(0.1, (now - startTimeRef.current) / 1000);
        const elapsedMinutes = elapsedSeconds / 60;

        // WPM calculation: (correct chars / 5) / minutes
        const currentWpm = Math.round((correctCountRef.current / 5) / elapsedMinutes);
        const currentRaw = Math.round((totalTypedCountRef.current / 5) / elapsedMinutes);
        const accuracy = totalTypedCountRef.current > 0
          ? Math.round((correctCountRef.current / totalTypedCountRef.current) * 100)
          : 100;

        setLiveWpm(currentWpm);
        setLiveRawWpm(currentRaw);
        setLiveAccuracy(accuracy);

        // Update Ghost Pacer position
        // targetWpm chars per second = (targetWpm * 5) / 60
        const ghostChars = Math.min(targetText.length, Math.floor(elapsedSeconds * ((targetWpm * 5) / 60)));
        setGhostCharIndex(ghostChars);

        // Append timeline point for chart
        setWpmTimeline(prev => [
          ...prev,
          {
            second: Math.round(elapsedSeconds),
            wpm: currentWpm,
            rawWpm: currentRaw,
            errors: errorCountRef.current,
            accuracy: accuracy
          }
        ]);
      }, 1000);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [isStarted, isFinished, targetText.length, targetWpm]);

  /**
   * Core Keystroke Input Handler (called by keydown)
   */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFinished) return;

    // Ignore modifier keys and special function keys
    if (e.ctrlKey || e.metaKey || e.altKey || e.key === 'Tab' || e.key === 'Escape' || e.key === 'CapsLock') {
      return;
    }

    const now = performance.now();

    // Start timing on first printable keystroke
    if (!isStarted) {
      if (e.key.length === 1 || e.key === 'Enter') {
        setIsStarted(true);
        startTimeRef.current = Date.now();
        lastKeyTimeRef.current = now;
      } else {
        return;
      }
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        const prevIdx = currentIndex - 1;
        setCharStates(prev => {
          const updated = [...prev];
          updated[prevIdx] = 'pending';
          return updated;
        });
        setCurrentIndex(prevIdx);
        setCombo(0);
      }
      return;
    }

    // Process character keystroke
    if (e.key.length === 1 || e.key === 'Enter') {
      e.preventDefault();

      const expectedChar = targetText[currentIndex];
      const typedChar = e.key === 'Enter' ? '\n' : e.key;

      // Calculate latency for this stroke
      const latency = lastKeyTimeRef.current ? Math.round(now - lastKeyTimeRef.current) : 100;
      lastKeyTimeRef.current = now;
      setCurrentLatency(latency);

      const isCorrect = typedChar === expectedChar;
      totalTypedCountRef.current += 1;

      // Update Key Statistics for heatmap
      const keyNorm = expectedChar.toLowerCase();
      if (!keyStatsRef.current[keyNorm]) {
        keyStatsRef.current[keyNorm] = { total: 0, errors: 0, totalLatencyMs: 0 };
      }
      keyStatsRef.current[keyNorm].total += 1;
      keyStatsRef.current[keyNorm].totalLatencyMs += latency;

      if (isCorrect) {
        correctCountRef.current += 1;
        onKeypressSound?.(typedChar);

        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > maxCombo) {
          setMaxCombo(newCombo);
        }

        // Combo milestone sounds (every 10 or 25)
        if (newCombo % 10 === 0) {
          onComboChime?.(newCombo);
        }
      } else {
        errorCountRef.current += 1;
        keyStatsRef.current[keyNorm].errors += 1;
        onErrorSound?.();
        setCombo(0);
      }

      // Update charStates array
      setCharStates(prev => {
        const updated = [...prev];
        updated[currentIndex] = isCorrect ? 'correct' : 'incorrect';
        return updated;
      });

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check test completion
      if (nextIndex >= targetText.length) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        setIsFinished(true);

        const testEndTime = Date.now();
        const totalDurationSec = Math.max(1, Math.round((testEndTime - (startTimeRef.current || testEndTime)) / 1000));
        const finalMinutes = totalDurationSec / 60;
        const finalWpm = Math.round((correctCountRef.current / 5) / finalMinutes);
        const finalRawWpm = Math.round((totalTypedCountRef.current / 5) / finalMinutes);
        const finalAccuracy = Math.round((correctCountRef.current / totalTypedCountRef.current) * 100);
        const finalConsistency = calculateConsistency(wpmTimeline);

        const sessionResult: SessionResult = {
          id: `sess_${Date.now()}`,
          date: new Date().toISOString(),
          mode,
          codeLang,
          wpm: finalWpm,
          rawWpm: finalRawWpm,
          accuracy: finalAccuracy,
          consistency: finalConsistency,
          timeSeconds: totalDurationSec,
          charCount: targetText.length,
          errorCount: errorCountRef.current,
          wpmTimeline: wpmTimeline.length > 0 ? wpmTimeline : [{
            second: totalDurationSec,
            wpm: finalWpm,
            rawWpm: finalRawWpm,
            errors: errorCountRef.current,
            accuracy: finalAccuracy
          }],
          keyStats: { ...keyStatsRef.current },
          xpEarned: 0,
          targetWpm,
          completed: true
        };

        onSessionComplete?.(sessionResult);
      }
    }
  }, [
    isFinished, 
    isStarted, 
    currentIndex, 
    targetText, 
    combo, 
    maxCombo, 
    mode, 
    codeLang, 
    targetWpm, 
    wpmTimeline, 
    onKeypressSound, 
    onErrorSound, 
    onComboChime, 
    onSessionComplete
  ]);

  return {
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
    keyStats: keyStatsRef.current,
    handleKeyDown,
    restartTest
  };
}

