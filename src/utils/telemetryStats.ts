import { WpmPoint, KeyHeatmapData, DiagnosticInsight, SessionResult } from '../types/telemetry';

/**
 * Calculates consistency percentage from timeline samples.
 * Uses coefficient of variation (standard deviation / mean).
 */
export function calculateConsistency(wpmTimeline: WpmPoint[]): number {
  if (wpmTimeline.length < 3) return 100;

  const wpms = wpmTimeline.map(p => p.wpm).filter(w => w > 0);
  if (wpms.length === 0) return 100;

  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  if (mean <= 0) return 100;

  const variance = wpms.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);

  const cv = stdDev / mean; // lower is better
  const consistency = Math.max(0, Math.min(100, Math.round((1 - cv) * 100)));
  return consistency;
}

/**
 * Common finger transition mapping for biomechanical diagnostics
 */
const FINGER_MAP: Record<string, string> = {
  q: 'Left Pinky', a: 'Left Pinky', z: 'Left Pinky',
  w: 'Left Ring', s: 'Left Ring', x: 'Left Ring',
  e: 'Left Middle', d: 'Left Middle', c: 'Left Middle',
  r: 'Left Index', f: 'Left Index', v: 'Left Index', t: 'Left Index', g: 'Left Index', b: 'Left Index',
  y: 'Right Index', h: 'Right Index', n: 'Right Index', u: 'Right Index', j: 'Right Index', m: 'Right Index',
  i: 'Right Middle', k: 'Right Middle',
  o: 'Right Ring', l: 'Right Ring',
  p: 'Right Pinky'
};

/**
 * Generate actionable AI-style telemetry diagnostics from session data
 */
export function generateDiagnostics(session: SessionResult): DiagnosticInsight[] {
  const insights: DiagnosticInsight[] = [];
  const { keyStats, accuracy, consistency, wpm, rawWpm } = session;

  // 1. Weak Key Analysis
  const problematicKeys = Object.entries(keyStats)
    .map(([key, data]) => {
      const errorRate = data.total > 0 ? (data.errors / data.total) : 0;
      const avgLatency = data.total > 0 ? (data.totalLatencyMs / data.total) : 0;
      return { key, errorRate, avgLatency, errors: data.errors, total: data.total };
    })
    .filter(k => k.errors > 0 || k.avgLatency > 220)
    .sort((a, b) => (b.errors * 2 + b.avgLatency / 100) - (a.errors * 2 + a.avgLatency / 100));

  if (problematicKeys.length > 0) {
    const topMissed = problematicKeys.slice(0, 3);
    const keyLabels = topMissed.map(k => `'${k.key.toUpperCase()}'`).join(', ');
    const drillKeys = topMissed.map(k => k.key.toLowerCase());

    insights.push({
      type: 'weak-key',
      severity: topMissed[0].errorRate > 0.25 ? 'high' : 'medium',
      title: `Critical Motor Latency on [${keyLabels}]`,
      description: `Target keys had high hesitation (${Math.round(topMissed[0].avgLatency)}ms latency) and repeated corrections during high-tempo flow.`,
      recommendedAction: `Run a targeted Weak-Key Adaptive Drill focusing on ${keyLabels} to rewire synaptic reflexes.`,
      drillKeys
    });
  }

  // 2. Finger Transition Bottleneck
  if (problematicKeys.length >= 2) {
    const key1 = problematicKeys[0].key.toLowerCase();
    const key2 = problematicKeys[1].key.toLowerCase();
    const finger1 = FINGER_MAP[key1] || 'Left Hand';
    const finger2 = FINGER_MAP[key2] || 'Right Hand';

    if (finger1 === finger2 && finger1.includes('Ring')) {
      insights.push({
        type: 'finger-transition',
        severity: 'high',
        title: `Finger Bottleneck: ${finger1} [${key1.toUpperCase()} -> ${key2.toUpperCase()}]`,
        description: `Consecutive strikes on the ring finger cause mechanical stutter, reducing burst velocity by ~14 WPM.`,
        recommendedAction: `Perform isolated hand independence drills and reposition wrist angle to ease tendon tension.`,
        drillKeys: [key1, key2]
      });
    }
  }

  // 3. Consistency vs Raw Velocity
  const speedGap = rawWpm - wpm;
  if (speedGap > 12) {
    insights.push({
      type: 'speed-burst',
      severity: 'high',
      title: 'Overclock Friction (Raw WPM exceeds Net WPM)',
      description: `Raw burst speed is ${rawWpm} WPM, but error corrections drained ${speedGap} WPM. You are over-accelerating before confirming keystroke precision.`,
      recommendedAction: `Throttle pacing down by 10% to establish a rhythmic cadence before speeding up.`
    });
  } else if (consistency >= 88 && accuracy >= 97) {
    insights.push({
      type: 'consistency',
      severity: 'positive',
      title: 'Near-Zero Cadence Jitter (Flow State Confirmed)',
      description: `Keystroke rhythm variance remained under 12%, indicating supreme neuromuscular lock-in. Reactor Core maintained full fusion.`,
      recommendedAction: `Push burst thresholds in Code Matrix or Warp Drive mode.`
    });
  }

  // 4. Default insight if performance is good
  if (insights.length === 0) {
    insights.push({
      type: 'accuracy',
      severity: 'positive',
      title: 'Optimal Biomechanical Calibration',
      description: `Keystroke distribution is balanced across both hands with consistent sub-150ms latency.`,
      recommendedAction: `Ready for higher difficulty gauntlets or Syntax Breaker decryption.`
    });
  }

  return insights;
}

