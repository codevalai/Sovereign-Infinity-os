export type CityNode = 'Tokyo' | 'Zurich' | 'Reykjavik' | 'Singapore' | 'Virginia';

export type GameTitle = 'GTA6' | 'Minecraft' | 'Forza' | 'Cyberpunk' | 'Elden Ring' | 'Doom';

export type FeedMode = 'v1' | 'v2' | 'v3' | 'v4';

export type AgentRole = 'CEO_ORCHESTRATOR' | 'WORKER_ENGINE' | 'AUDITOR_ALETHEIA' | 'CHIEF_CRYPTO' | 'ORACLE_STATE';

export interface HudState {
  health: number;
  stamina?: number;
  ammo?: number;
  shield?: number;
  speed?: number;
  wantedLevel?: number;
  level?: number;
  inventorySlots?: number;
  score?: number;
}

export interface SovereignEventPayload {
  game: GameTitle;
  agentId: string;
  cityNode: CityNode;
  frameDigest: string; // FNV-1a 32-bit hex
  hudState: HudState;
  intent: string;
  action: string;
  reward: number;
  highlight: boolean;
  highlightReason: string;
  tacticalSummary: string;
  threatLevel: number;
  driverHook: string;
  latencyMs?: number;
  entropy?: number;
}

export interface SovereignEvent {
  eventId: string;
  sequenceNumber: number;
  namespace: 'gameplay.feed';
  issuer: AgentRole;
  timestamp: number;
  payload: SovereignEventPayload;
  signature: string; // ML-KEM-768
  merkleRoot?: string;
  verified?: boolean;
}

export interface SwarmLoad {
  ceo: number;
  worker: number;
  auditor: number;
  crypto: number;
}

export interface ByzantineNode {
  id: string;
  name: CityNode;
  code: 'TOK' | 'ZUR' | 'REY' | 'SIN' | 'VIR';
  status: 'ONLINE' | 'DEGRADED' | 'PARTITIONED' | 'CORRUPTED';
  rttMs: number;
  bftVote: 'ACCEPT' | 'REJECT' | 'PARTITIONED';
  tps: number;
  cryptoSig: string;
  lastBlockFNV: string;
  latitude: number;
  longitude: number;
}

export interface MeshLink {
  source: 'TOK' | 'ZUR' | 'REY' | 'SIN' | 'VIR';
  target: 'TOK' | 'ZUR' | 'REY' | 'SIN' | 'VIR';
  rttMs: number;
  jitterMs: number;
  packetLoss: number;
  status: 'ACTIVE' | 'CHAOS_INJECTED' | 'SEVERED';
}

export interface CognitionEntity {
  id: string;
  label: string;
  category: 'HOSTILE' | 'NEUTRAL' | 'OBJECTIVE' | 'OBSTACLE';
  x: number; // 0-100%
  y: number; // 0-100%
  width: number;
  height: number;
  confidence: number;
  distanceMeters: number;
  azimuthDeg: number;
}

export interface IntentNode {
  level: 'META' | 'STRATEGIC' | 'TACTICAL' | 'PRIMITIVE';
  label: string;
  description: string;
  subActuations: string[];
  weight: number;
}

export interface ControllerAxisState {
  lx: number;
  ly: number;
  rx: number;
  ry: number;
  lt: number;
  rt: number;
  responseCurve: 'LINEAR' | 'EXPONENTIAL' | 'S_CURVE';
  kalmanSmoothing: number;
}

export interface RewardSliderWeights {
  survival: number;
  threatMitigation: number;
  kineticFlow: number;
  poiseDepletion: number;
  spatialDominion: number;
}
