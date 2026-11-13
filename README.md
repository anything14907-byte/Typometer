# ⚡ TYPOMETER // Cybernetic Telemetry Typing System

> An elite, futuristic, cybernetic typing speed, accuracy, and cognitive reflex training platform. Designed to train muscle memory, burst speed, coding syntax, and focus with real-time biometric telemetry.

![Typometer Telemetry Cockpit](https://img.shields.io/badge/Telemetry-Cybernetic-00f0ff?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/React%2018-TypeScript-a855f7?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/TailwindCSS-Glassmorphism-38bdf8?style=for-the-badge)
![Audio Engine](https://img.shields.io/badge/Web%20Audio-Procedural%20Thock-10b981?style=for-the-badge)

---

## 🚀 Key Highlights & Architectural Features

### 1. 🌌 Cyber-Telemetry Visual Cockpit
- **Aesthetic:** Obsidian `#05070A` backdrop with translucent glassmorphic dark slate panels (`backdrop-blur-md`), razor-thin glowing borders, and electric cyan (`#00F0FF`), neon violet (`#A855F7`), emerald (`#10B981`), and crimson (`#FF2A5F`) accents.
- **Dynamic Reactor Core SVG:** Real-time spinning SVG fusion reactor that dynamically accelerates its rotation and shifts its chromatic glow intensity (Cyan Standby $\rightarrow$ Violet Fusion $\rightarrow$ Solar Amber $\rightarrow$ Crimson Hyperdrive) as WPM and combo streaks increase.
- **Velocity Sparklines:** Live vector sparkline graphing keystroke velocity and latency in real-time.

### 2. 🎯 Precision Typing Engine
- **Gliding Caret Interpolation:** Smooth CSS transform bounding-box interpolation moving seamlessly from character to character without jitter.
- **Ghost Pacer Cursor:** A secondary translucent purple ghost cursor racing across the text at your **Personal Best WPM** (or target speed), letting you race your past peak performance.
- **Zero-Latency Stream:** Real-time token highlighting for correct, incorrect, and pending characters with automated line-by-line scroll tracking.

### 3. 🔊 Procedural Web Audio API Synthesizer (Zero External Audio Dependencies)
- **Deep "Thocky" Mechanical Switches:** Specially tuned oscillator frequency starting at **160Hz** ramping down to **70Hz** with steep exponential gain decay and a mechanical top-out clack ($450\text{Hz} \rightarrow 180\text{Hz}$).
- **Crisp Clicky Switch:** High-pass filtered tactile click simulation ($2200\text{Hz} \rightarrow 800\text{Hz}$).
- **Cyber-Pulse Switch:** Futuristic sci-fi laser chirp.
- **Ambient Synth-Wave Focus Drone Hum:** Continuous 55Hz binaural sub-bass tone with warm low-pass resonance to induce deep cognitive flow state.
- **Harmonic Combo Chimes & Error Buzzes:** Ascending pentatonic crystal chords that ring on combo milestones ($10\times, 20\times, 30\times$), accompanied by low-frequency dissonant error buzzes.

### 4. 🧠 Dynamic Content Engine (Never Repeat Paragraphs)
- **Dynamic Markov / Sentence Assembler:** Procedurally generates completely unique paragraphs every session from hundreds of curated tech, philosophy, and cyber-lore clauses.
- **Code Matrix Mode:** Real-world TypeScript, Python, and Rust snippets with syntax indentation and special characters.
- **Number & Symbol Gauntlet:** High-density data entry with hashes, shell commands, JSON parameters, and regex patterns.
- **Weak-Key Adaptive Mode:** Automatically queries your localStorage telemetry history for your highest error-rate and slowest keys, dynamically constructing sentences heavily weighted toward those exact letters.

### 5. 📊 Post-Run Telemetry & AI Diagnostic Dashboard
- **Interactive WPM vs. Time Curve:** Interactive line chart mapping Net WPM velocity alongside Raw burst speed, with **Crimson error dots** plotted directly on the graph at the exact seconds mistakes were made.
- **Interactive Virtual Keyboard Heatmap:** Full physical keyboard matrix color-coded from **Cool Cyan** (sub-120ms optimal response) to **Fiery Crimson** (high error rate / hesitation). Hovering or clicking any key displays exact strikes, accuracy percentage, and average latency in ms.
- **AI Biomechanical Diagnostics:** Analyzes finger transitions (e.g. left ring finger bottleneck on transitions like `[S -> W]`), raw vs. net speed over-acceleration friction, and generates 1-click **Weak-Key Adaptive Drills**.

### 6. 🎮 3 Built-in Arcade Reflex Mini-Games
1. **Orbital Defense (Meteor Word Blaster):**
   - Full HTML5 Canvas particle engine with neon laser beams, asteroid particle bursts, and screen shake on planetary shield impact.
   - Type descending asteroid keywords to fire laser cannons; maintain a $25\times$ streak to unleash an **EMP Shockwave** that vaporizes all enemies on screen.
2. **Warp Drive (Velocity Tunnel):**
   - First-person 3D perspective starfield tunnel where typing speed directly controls the ship's warp factor ($1.0\text{W} \rightarrow 9.0\text{W+}$).
   - Stalling below speed thresholds drains hull integrity; maintaining high speeds triggers chromatic hyperspace overdrive.
3. **Syntax Breaker (Cyber-Hack):**
   - Timed cryptographic infiltration game. Decrypt security hashes, port firewall overrides, and root payloads before the red firewall counter-trace reaches $100\%$.

### 7. ⏱️ Flow State & Productivity Enhancements
- **Deep Focus Sprint (Pomodoro Flow):** Radial timer alternating between 5-minute warmup drills, 25-minute deep focus sprints, and 5-minute reflex recovery.
- **Career Telemetry Dossier:** Lifetime statistics modal displaying career speed progression curves, all-time keyboard heatmaps, XP/Level progression, and cybernetic rank hierarchy (from *Initiate Receptor* to *Cyber Telemetry God*).
- **Command Palette:** Press <kbd>Esc</kbd> anytime to search modes, games, audio switch profiles, or trigger drills with arrow keys.
- **Hotkeys:** <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to instantly restart a test; <kbd>Esc</kbd> to open Command Palette.

---

## 🛠️ Tech Stack & Architecture

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Glassmorphism, CSS Custom Keyframes & Animations
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti
- **Audio Synthesizer:** Native Web Audio API (OscillatorNode, BiquadFilterNode, GainNode)
- **Graphics:** HTML5 Canvas 2D Context (Particle Engine, 3D Projection Starfield)
- **Persistence:** LocalStorage Engine

---

## 📦 Installation & Quick Start

```bash
# Clone the repository
git clone https://github.com/anything14907-byte/Typometer.git
cd Typometer

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## ⌨️ Controls & Keybindings

| Keybinding | Action |
|---|---|
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | Quick Restart Current Test |
| <kbd>Esc</kbd> | Open Command Palette |
| <kbd>Tab</kbd> | Quick Navigation Lockout Prevention |
| <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>Enter</kbd> | Navigate & Execute in Command Palette |

---

## 📜 License

MIT License. Crafted for elite typists, developers, and cybernetic keyboard enthusiasts.

