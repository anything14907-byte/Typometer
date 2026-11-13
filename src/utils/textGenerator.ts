import { 
  CYBER_SUBJECTS, 
  CYBER_VERBS, 
  CYBER_OBJECTS, 
  PHILOSOPHY_QUOTES, 
  CODE_SNIPPETS, 
  SYMBOL_GAUNTLETS, 
  WEAK_KEY_DRILL_TEMPLATES 
} from '../data/cyberSnippets';
import { TestMode, CodeLanguage, KeyHeatmapData } from '../types/telemetry';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Procedural sentence assembler creating unique cyber-prose paragraphs
 */
export function generateProceduralProse(clauseCount: number = 3): string {
  const sentences: string[] = [];

  for (let i = 0; i < clauseCount; i++) {
    // 30% chance to insert an elite philosophy quote
    if (Math.random() < 0.35 && PHILOSOPHY_QUOTES.length > 0) {
      sentences.push(pickRandom(PHILOSOPHY_QUOTES));
    } else {
      const subject = pickRandom(CYBER_SUBJECTS);
      const verb = pickRandom(CYBER_VERBS);
      const obj = pickRandom(CYBER_OBJECTS);
      sentences.push(`${subject} ${verb} ${obj}`);
    }
  }

  return sentences.join(' ');
}

/**
 * Generate code snippet based on selected language
 */
export function generateCodeSnippet(language: CodeLanguage = 'typescript'): string {
  const pool = CODE_SNIPPETS[language] || CODE_SNIPPETS.typescript;
  return pickRandom(pool);
}

/**
 * Generate high-density symbol & data entry gauntlet
 */
export function generateSymbolGauntlet(): string {
  const selected = shuffle(SYMBOL_GAUNTLETS).slice(0, 2);
  return selected.join(' ');
}

/**
 * Generate Weak-Key Adaptive Text targeting the user's specific problem keys
 */
export function generateWeakKeyDrill(keyStats: KeyHeatmapData, fallbackKeys: string[] = ['z', 'x', 'c', 'q']): string {
  // Find top 3 weakest keys based on error rate and latency
  const keyList = Object.entries(keyStats).map(([key, data]) => {
    const errorRate = data.total > 0 ? data.errors / data.total : 0;
    const avgLatency = data.total > 0 ? data.totalLatencyMs / data.total : 0;
    // Score combines high error rate and high latency
    const weaknessScore = (errorRate * 3.0) + (avgLatency / 300);
    return { key: key.toLowerCase(), errorRate, avgLatency, weaknessScore, total: data.total };
  }).filter(k => /^[a-z]$/.test(k.key) && k.total >= 3);

  keyList.sort((a, b) => b.weaknessScore - a.weaknessScore);

  const targetKeys = keyList.length >= 2 
    ? keyList.slice(0, 3).map(k => k.key)
    : fallbackKeys;

  const targetWords: string[] = [];
  targetKeys.forEach(k => {
    const words = WEAK_KEY_DRILL_TEMPLATES[k] || ['quantum', 'matrix', 'cyber'];
    targetWords.push(...shuffle(words).slice(0, 4));
  });

  const connectiveWords = ['the', 'and', 'will', 'with', 'over', 'into', 'from', 'each', 'this', 'that'];
  const shuffledTarget = shuffle(targetWords);

  const assembled: string[] = [];
  for (let i = 0; i < shuffledTarget.length; i++) {
    assembled.push(shuffledTarget[i]);
    if (i % 2 === 1 && Math.random() < 0.7) {
      assembled.push(pickRandom(connectiveWords));
    }
  }

  return assembled.join(' ') + '.';
}

/**
 * Master generator function for the typing arena
 */
export function generateTestText(
  mode: TestMode, 
  codeLang: CodeLanguage = 'typescript', 
  keyStats?: KeyHeatmapData
): string {
  switch (mode) {
    case 'prose':
      return generateProceduralProse(3);
    case 'code':
      return generateCodeSnippet(codeLang);
    case 'symbols':
      return generateSymbolGauntlet();
    case 'adaptive':
      return generateWeakKeyDrill(keyStats || {});
    default:
      return generateProceduralProse(3);
  }
}

