export interface CyberRank {
  rankLevel: number;
  minWpm: number;
  minXp: number;
  title: string;
  badge: string;
  color: string;
  description: string;
}

export const CYBER_RANKS: CyberRank[] = [
  {
    rankLevel: 1,
    minWpm: 0,
    minXp: 0,
    title: "INITIATE RECEPTOR",
    badge: "LVL 1",
    color: "#64748B",
    description: "Neural pathways synchronizing with baseline cyber-terminal."
  },
  {
    rankLevel: 2,
    minWpm: 35,
    minXp: 500,
    title: "NEURAL OPERATOR",
    badge: "LVL 2",
    color: "#38BDF8",
    description: "Reflex velocity registered. Muscle memory calibration in progress."
  },
  {
    rankLevel: 3,
    minWpm: 55,
    minXp: 1500,
    title: "CYBERNETIC SCRIBE",
    badge: "LVL 3",
    color: "#00F0FF",
    description: "Fluid keystroke pacing. Latency variance stabilized below 120ms."
  },
  {
    rankLevel: 4,
    minWpm: 75,
    minXp: 3500,
    title: "GRIDRUNNER SPEC-4",
    badge: "LVL 4",
    color: "#A855F7",
    description: "High-density burst capability. Flawless syntax flow maintained."
  },
  {
    rankLevel: 5,
    minWpm: 95,
    minXp: 7000,
    title: "SUB-ORBITAL TYPIST",
    badge: "LVL 5",
    color: "#C084FC",
    description: "Trans-sonic typing cadence. Reactor core achieves sustained fusion."
  },
  {
    rankLevel: 6,
    minWpm: 120,
    minXp: 12000,
    title: "QUANTUM OVERCLOCKER",
    badge: "LVL 6",
    color: "#10B981",
    description: "Hypersonic motor precision. Zero conscious hesitation observed."
  },
  {
    rankLevel: 7,
    minWpm: 145,
    minXp: 20000,
    title: "CYBER TELEMETRY GOD",
    badge: "MAX",
    color: "#FF2A5F",
    description: "Apex biomechanical singularity. Keystrokes warp the spacetime fabric."
  }
];

export function getRankForUser(bestWpm: number, xp: number): CyberRank {
  for (let i = CYBER_RANKS.length - 1; i >= 0; i--) {
    const rank = CYBER_RANKS[i];
    if (bestWpm >= rank.minWpm || xp >= rank.minXp) {
      return rank;
    }
  }
  return CYBER_RANKS[0];
}

