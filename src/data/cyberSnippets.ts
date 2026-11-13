export const CYBER_SUBJECTS = [
  "Quantum neural networks",
  "Sub-atomic processors",
  "The distributed consciousness protocol",
  "Autonomous cyber-telemetry probes",
  "Orbital data relays",
  "Encrypted synaptic bridges",
  "Zero-trust biometric firewalls",
  "High-frequency algorithmic trade daemons",
  "Deep spacetime sensor arrays",
  "Biomechanical neural implants",
  "Sub-dermal fiber optics",
  "The decentralized matrix kernel",
  "Photonic lattice memory modules",
  "Hyper-dimensional tensor cores",
  "Cryogenic quantum supercomputers",
  "Atmospheric electromagnetic shields",
  "Synthetic biological microcontrollers",
  "Autonomous defense swarms",
  "Recursive machine-learning hypergraphs",
  "Nanoscale superconducting waveguides"
];

export const CYBER_VERBS = [
  "orchestrate continuous data streams across",
  "demodulate electromagnetic interference within",
  "synthesize high-bandwidth cognitive feedback loops into",
  "reconstruct corrupted telemetry frames through",
  "accelerate predictive neural computation inside",
  "synchronize multi-spectral sensor matrices beyond",
  "decipher cryptographically isolated subnets penetrating",
  "channel coherent laser pulses directly into",
  "calibrate adaptive resonance parameters across",
  "intercept unauthorized packet injections through",
  "stabilize critical plasma confinement vectors inside",
  "distribute fault-tolerant consensus payloads over",
  "transmute raw sensory voltage spikes into",
  "override antiquated firewall hierarchies safeguarding"
];

export const CYBER_OBJECTS = [
  "the planetary fiber optic grid at nanosecond latencies.",
  "unmapped subterranean server clusters deep beneath Neo-Kyoto.",
  "orbital defense satellites scanning for rogue telemetry pulses.",
  "isolated air-gapped cryptographic vaults holding legacy keys.",
  "the core biometric interface of autonomous flight systems.",
  "interstellar communication beacons pulsing in deep radio silence.",
  "hyperspatial wormhole coordinates stored inside atomic memory.",
  "fault-tolerant blockchain clusters executing autonomous governance.",
  "sub-orbital telemetry relays transmitting through solar storms.",
  "cognitive feedback loops training cybernetic pilots in zero-G.",
  "quantum encryption matrices resisting brute-force decryption.",
  "high-frequency plasma exhausts venting into the orbital void.",
  "distributed edge nodes synchronizing synchronized state vectors."
];

export const PHILOSOPHY_QUOTES = [
  "The line between the biological mind and synthetic logic dissolves as typing velocity approaches reflex speed.",
  "When muscle memory transcends conscious deliberation, the keyboard ceases to be an obstacle and becomes an extension of thought.",
  "Perfection is not born of haste, but of absolute consistency across every single mechanical keystroke.",
  "In the cybernetic telemetry cockpit, true speed is an emergent property of effortless precision.",
  "Do not chase the cursor; let the cursor flow where your intent has already arrived.",
  "Every millisecond saved in motor latency compounds across millions of lines of computational architecture.",
  "The terminal screen does not judge your speed; it merely reflects the clarity and calm of your cognitive state.",
  "To write code at the speed of thought is to manipulate reality through the medium of pure logic."
];

export const CODE_SNIPPETS = {
  typescript: [
    `interface TelemetryStream<T> {\n  readonly id: string;\n  readonly timestamp: number;\n  process(vector: T[]): Promise<boolean>;\n}`,
    `async function calibrateCore(threshold: number): Promise<void> {\n  const flux = await readSensorBuffer();\n  if (flux.variance > threshold) {\n    throw new ReactorCoreAlert('OVERHEAT');\n  }\n}`,
    `export const useBuffer = <K, V>(capacity: number) => {\n  const [cache, setCache] = useState<Map<K, V>>(new Map());\n  return { size: cache.size, set: cache.set };\n};`,
    `type CyberRank = 'Cadet' | 'Operator' | 'Gridrunner' | 'Overclocker';\nconst evaluatePilot = (wpm: number): CyberRank => wpm > 100 ? 'Overclocker' : 'Gridrunner';`
  ],
  python: [
    `def compute_telemetry_vector(nodes: list[dict]) -> float:\n    total_flux = sum(n.get("voltage", 0.0) for n in nodes)\n    return round(total_flux / max(len(nodes), 1), 4)`,
    `class OrbitalReactor:\n    def __init__(self, core_id: str):\n        self.core_id = core_id\n        self.is_active = True\n    def vent_plasma(self, amt: float) -> bool:\n        return self.is_active and amt > 0`,
    `@dataclass\nclass TelemetryPacket:\n    timestamp: int\n    payload: bytes\n    signature: str\n    def is_verified(self) -> bool:\n        return len(self.payload) > 64`,
    `async def stream_firewall_events(timeout: int = 30):\n    async with network_socket() as sock:\n        while packet := await sock.recv():\n            yield decrypt_payload(packet)`
  ],
  rust: [
    `pub struct PlasmaMatrix<T> {\n    pub buffer: Vec<T>,\n    pub capacity: usize,\n    pub is_locked: bool,\n}`,
    `fn calculate_orbital_decay(velocity: f64, drag: f64) -> Result<f64, &'static str> {\n    if velocity <= 0.0 { return Err("Critical stall"); }\n    Ok(velocity * (1.0 - drag))\n}`,
    `impl<T: Send + Sync> TelemetryChannel<T> {\n    pub fn transmit(&self, data: T) -> Result<(), ChannelError> {\n        self.sender.send(data).map_err(|_| ChannelError::Dropped)\n    }\n}`,
    `pub enum ReactorState {\n    Stable(u32),\n    Critical { temperature_k: f32, core_id: u8 },\n    Offline,\n}`
  ]
};

export const SYMBOL_GAUNTLETS = [
  "const $data = [ { 'id': 0x4F, 'hash': 'a9#f3!_99', 'port': 8080 }, { 'status': 200 } ];",
  "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOm/9$xP&7Q*w!89k@L#2026 user@core-node-01.local",
  "SELECT * FROM telemetry_logs WHERE error_rate >= 0.05 AND (latency_ms > 120 OR status != 200);",
  "curl -X POST https://api.typometer.io/v2/pulse -H 'Authorization: Bearer 0xDEADBEEF' -d '{\"wpm\": 142}'",
  "export PATH=\"/opt/cyber/bin:$HOME/.cargo/bin:$PATH\" && chmod +x ./deploy_core.sh && ./deploy_core.sh --force",
  "grep -E -o '[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}:[0-9]{2,5}' /var/log/firewall.audit",
  "docker run -d --restart=always -p 9090:9090 -v /etc/typometer:/var/data:ro --name telemetry-core v4.2"
];

export const WEAK_KEY_DRILL_TEMPLATES: Record<string, string[]> = {
  q: ["quantum", "quick", "quarantine", "query", "quench", "quasi", "quote", "squall", "liquid", "opaque"],
  w: ["waveguide", "warp", "switch", "network", "workflow", "forward", "window", "power", "shadow", "glow"],
  e: ["telemetry", "execute", "sensor", "cybernetic", "frequency", "emitter", "terminal", "packet", "speed"],
  r: ["reactor", "circuit", "orbital", "overclock", "matrix", "protocol", "restart", "refactor", "render"],
  t: ["transistor", "teleport", "trajectory", "target", "terminal", "transmitter", "tactical", "system"],
  y: ["cyber", "dynamic", "payload", "sync", "cryptography", "hyper", "frequency", "syntax", "array"],
  u: ["quantum", "subatomic", "circuit", "supercomputer", "vacuum", "neural", "modulate", "status", "focus"],
  i: ["interface", "ignition", "ionosphere", "cybernetic", "kinetic", "digital", "terminal", "silicon"],
  o: ["orbital", "photon", "overclock", "protocol", "optics", "modem", "node", "console", "logic"],
  p: ["plasma", "processor", "protocol", "packet", "pulse", "spectrum", "particle", "probe", "power"],
  a: ["array", "quantum", "accelerate", "autonomous", "matrix", "payload", "reactor", "signal", "datacenter"],
  s: ["synapse", "sensor", "satellite", "system", "spectrum", "subatomic", "syntax", "stream", "status"],
  d: ["daemon", "decrypt", "defense", "drone", "dynamic", "digital", "datacenter", "drive", "decode"],
  f: ["firewall", "fiber", "flux", "frequency", "flight", "format", "function", "fragment", "flow"],
  g: ["grid", "gateway", "guidance", "gauge", "generator", "gigahertz", "glitch", "graviton", "galactic"],
  h: ["hyperspace", "harmonic", "hardware", "hazard", "heuristic", "hexadecimal", "hybrid", "hertz"],
  j: ["trajectory", "injection", "projector", "junction", "adjacent", "adjust", "eject", "jump"],
  k: ["overclock", "keystroke", "kinetic", "kernel", "lock", "block", "dark", "spark", "token"],
  l: ["laser", "lattice", "latency", "logic", "link", "load", "limit", "loop", "linear"],
  z: ["zero", "zenith", "zone", "hazard", "analyzer", "freeze", "matrix", "muzzle", "size"],
  x: ["matrix", "flux", "index", "syntax", "execute", "extract", "external", "oxide", "pixel"],
  c: ["cyber", "circuit", "core", "cadence", "cockpit", "carrier", "channel", "clock", "charge"],
  v: ["velocity", "vector", "vacuum", "voltage", "variance", "vault", "vortex", "virtual", "visor"],
  b: ["biometrics", "buffer", "bandwidth", "beacon", "binary", "bridge", "blast", "boost", "burst"],
  n: ["neural", "nano", "network", "node", "nucleus", "neutron", "navigation", "number", "nexus"],
  m: ["matrix", "memory", "modem", "modulate", "machine", "magnetic", "motor", "matter", "meter"]
};

