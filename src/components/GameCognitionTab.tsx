import React, { useState } from 'react';
import { Eye, Layers, Radar, Gamepad2, Sliders, Share2, Wrench, Shield, CheckCircle2, ChevronRight } from 'lucide-react';
import { GAME_PERCEPTION_ENTITIES, CROSS_GAME_SKILLS } from '../data/initialData';
import { CognitionEntity, RewardSliderWeights } from '../types';

export const GameCognitionTab: React.FC = () => {
  const [activeSubLayer, setActiveSubLayer] = useState<number>(1);
  const [selectedGamePerception, setSelectedGamePerception] = useState<string>('GTA6');
  const [selectedEntity, setSelectedEntity] = useState<CognitionEntity | null>(null);

  // Unified Control state
  const [responseCurve, setResponseCurve] = useState<'LINEAR' | 'EXPONENTIAL' | 'S_CURVE'>('S_CURVE');
  const [kalmanSmoothing, setKalmanSmoothing] = useState<number>(0.85);
  const [leftStickX, setLeftStickX] = useState<number>(-0.45);
  const [leftStickY, setLeftStickY] = useState<number>(0.80);

  // Reward Shaping state
  const [rewardWeights, setRewardWeights] = useState<RewardSliderWeights>({
    survival: 0.35,
    threatMitigation: 0.25,
    kineticFlow: 0.20,
    poiseDepletion: 0.10,
    spatialDominion: 0.10,
  });

  const calculatedReward = (
    rewardWeights.survival * 1.5 +
    rewardWeights.threatMitigation * 1.8 +
    rewardWeights.kineticFlow * 1.2 +
    rewardWeights.poiseDepletion * 2.4 +
    rewardWeights.spatialDominion * 1.1
  ).toFixed(2);

  const entities = GAME_PERCEPTION_ENTITIES[selectedGamePerception] || [];

  return (
    <div className="space-y-6">
      {/* 7-Component Sublayer Navigation */}
      <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono-code font-bold text-cyan-400 uppercase tracking-wider">
            7-Component Game Cognition Architecture
          </span>
          <span className="text-xs text-slate-500 font-mono-code">Layer {activeSubLayer} of 7</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { id: 1, name: '1. Perception', icon: Eye },
            { id: 2, name: '2. Intent Hierarchy', icon: Layers },
            { id: 3, name: '3. State Radar', icon: Radar },
            { id: 4, name: '4. Unified Control', icon: Gamepad2 },
            { id: 5, name: '5. Reward Shaping', icon: Sliders },
            { id: 6, name: '6. Skill Transfer', icon: Share2 },
            { id: 7, name: '7. Drivers Fleet', icon: Wrench },
          ].map((layer) => {
            const Icon = layer.icon;
            const isActive = activeSubLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveSubLayer(layer.id)}
                className={`p-2.5 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition-all border ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-[11px] font-mono-code whitespace-nowrap">{layer.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Perception Layer */}
      {activeSubLayer === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono-code">
                  Interactive Scene Segmentation &amp; Bounding Boxes
                </h3>
                <p className="text-xs text-slate-400">
                  Ring -1 VLA neural segmentation direct from Direct3D &amp; Vulkan framebuffers
                </p>
              </div>

              {/* Game Selector for Perception */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                {['GTA6', 'Minecraft', 'Elden Ring', 'Forza', 'Cyberpunk', 'Doom'].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGamePerception(g);
                      setSelectedEntity(null);
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-mono-code transition-all ${
                      selectedGamePerception === g
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Visual Canvas with Bounding Boxes */}
            <div className="relative w-full aspect-video rounded-lg bg-[#060a12] border border-slate-800 overflow-hidden flex items-center justify-center select-none">
              {/* Grid backdrop */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Horizon & Crosshair overlay */}
              <div className="absolute inset-x-0 top-1/2 border-t border-cyan-900/40" />
              <div className="absolute inset-y-0 left-1/2 border-l border-cyan-900/40" />

              {/* Canvas HUD Overlay Text */}
              <div className="absolute top-3 left-3 text-[10px] font-mono-code text-cyan-400/80 bg-black/60 px-2 py-1 rounded border border-cyan-900/60">
                MODEL: VLA-RING-1 · FRAME BUFFER: 3840x2160 · INFERENCE: 0.42ms
              </div>

              {/* Bounding Boxes */}
              {entities.map((ent) => {
                const isSelected = selectedEntity?.id === ent.id;
                const colorMap = {
                  HOSTILE: 'border-rose-500 bg-rose-500/10 text-rose-300',
                  OBSTACLE: 'border-amber-500 bg-amber-500/10 text-amber-300',
                  OBJECTIVE: 'border-cyan-400 bg-cyan-400/10 text-cyan-200',
                  NEUTRAL: 'border-emerald-400 bg-emerald-400/10 text-emerald-200',
                };
                return (
                  <div
                    key={ent.id}
                    onClick={() => setSelectedEntity(ent)}
                    style={{
                      left: `${ent.x}%`,
                      top: `${ent.y}%`,
                      width: `${ent.width}%`,
                      height: `${ent.height}%`,
                    }}
                    className={`absolute border-2 rounded transition-all cursor-pointer flex flex-col justify-between p-1 ${
                      colorMap[ent.category]
                    } ${isSelected ? 'ring-2 ring-white scale-105 z-20' : 'hover:opacity-100 opacity-90'}`}
                  >
                    <span className="text-[9px] font-mono-code font-bold truncate">
                      {ent.label} [{(ent.confidence * 100).toFixed(0)}%]
                    </span>
                    <span className="text-[9px] font-mono-code text-right">
                      {ent.distanceMeters}m
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Entity Details Sidebar */}
          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Segmented Entity Inspector</span>
            </h4>

            {selectedEntity ? (
              <div className="space-y-3 font-mono-code text-xs">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-cyan-300 font-bold text-sm">{selectedEntity.label}</div>
                  <div className="text-slate-400">
                    Category:{' '}
                    <span
                      className={`font-bold ${
                        selectedEntity.category === 'HOSTILE'
                          ? 'text-rose-400'
                          : selectedEntity.category === 'OBSTACLE'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    >
                      {selectedEntity.category}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Confidence:{' '}
                    <span className="text-emerald-400">
                      {(selectedEntity.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Distance: <span className="text-white">{selectedEntity.distanceMeters}m</span>
                  </div>
                  <div className="text-slate-400">
                    Azimuth:{' '}
                    <span className="text-white">{selectedEntity.azimuthDeg}&deg; Relative</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-[11px] text-cyan-300 leading-relaxed">
                  ✓ Object vector mapped to 3D Cartesian coordinates for predictive kinematic
                  actuation.
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 font-mono-code text-xs space-y-2">
                <p>Click on any bounding box in the scene above to inspect target telemetry.</p>
              </div>
            )}

            {/* Entity catalog list */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono-code text-slate-400 uppercase font-bold">
                Active Detections ({entities.length})
              </span>
              <div className="space-y-1">
                {entities.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => setSelectedEntity(e)}
                    className={`w-full text-left p-2 rounded text-xs font-mono-code flex items-center justify-between transition-colors ${
                      selectedEntity?.id === e.id
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                        : 'bg-slate-900/60 text-slate-300 hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{e.label}</span>
                    <span className="text-slate-500 text-[10px]">{e.distanceMeters}m</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Intent Hierarchy Layer */}
      {activeSubLayer === 2 && (
        <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white font-mono-code">
              4-Level Intent Decomposition Hierarchy
            </h3>
            <p className="text-xs text-slate-400">
              Decomposing long-horizon objectives down into 1000Hz motor primitives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono-code text-xs">
            {/* Level 1: Meta */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-800/60">
                  TIER 1 · META INTENT
                </span>
                <span className="text-slate-500 text-[10px]">Horizon: ~60s</span>
              </div>
              <h4 className="text-sm font-bold text-white">SECURE_DISTRICT_DOMINANCE</h4>
              <p className="text-slate-400 text-xs">
                Global macro-goal: Clear regional hostiles, preserve vehicle integrity, and exit
                patrol perimeter.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
                Agent: CEO_ORCHESTRATOR
              </div>
            </div>

            {/* Level 2: Strategic */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800/60">
                  TIER 2 · STRATEGIC
                </span>
                <span className="text-slate-500 text-[10px]">Horizon: ~10s</span>
              </div>
              <h4 className="text-sm font-bold text-white">SLIPSTREAM_FLANK_EVASION</h4>
              <p className="text-slate-400 text-xs">
                Route optimization: Draft behind primary cruiser, generate suction pocket, prepare
                ram angle.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
                Agent: MACRO_STRATEGIC_OVERSEER
              </div>
            </div>

            {/* Level 3: Tactical */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800/60">
                  TIER 3 · TACTICAL
                </span>
                <span className="text-slate-500 text-[10px]">Horizon: ~1.2s</span>
              </div>
              <h4 className="text-sm font-bold text-white">PIT_MANEUVER_ACTUATION</h4>
              <p className="text-slate-400 text-xs">
                Sub-second dynamic action: Torque steer left 0.8, tap handbrake 150ms, countersteer
                into rear quarter panel.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
                Agent: WORKER_ENGINE
              </div>
            </div>

            {/* Level 4: Primitive */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-800/60">
                  TIER 4 · PRIMITIVE
                </span>
                <span className="text-slate-500 text-[10px]">Horizon: 1ms (1000Hz)</span>
              </div>
              <h4 className="text-sm font-bold text-white">XINPUT_ANALOG_WAVEFORM</h4>
              <p className="text-slate-400 text-xs">
                Raw Direct3D / IPC packet: LX=-0.782, RT=0.920, BTN_B=1. Kalman filtered against
                noise.
              </p>
              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
                Agent: KINEMATIC_EXECUTION_DRONE
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. State Reconstruction: 360° Tactical Radar */}
      {activeSubLayer === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 flex flex-col items-center justify-center space-y-3">
            <h4 className="text-sm font-bold text-white font-mono-code">
              360&deg; Tactical Spatial Radar Matrix
            </h4>
            <div className="relative w-72 h-72 rounded-full border border-cyan-800/60 bg-[#040810] flex items-center justify-center">
              {/* Polar concentric rings */}
              <div className="absolute w-56 h-56 rounded-full border border-slate-800" />
              <div className="absolute w-40 h-40 rounded-full border border-slate-800/80" />
              <div className="absolute w-24 h-24 rounded-full border border-slate-800/60" />
              {/* Axes */}
              <div className="absolute inset-x-0 top-1/2 border-t border-slate-800" />
              <div className="absolute inset-y-0 left-1/2 border-l border-slate-800" />
              {/* Center player marker */}
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse z-10" />

              {/* Sweeping radar beam */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(6, 182, 212, 0.15) 30deg, transparent 60deg)',
                  animation: 'spin 3s linear infinite',
                }}
              />

              {/* Entity Blips */}
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"
                style={{ top: '24%', left: '38%' }}
                title="Cruiser #1 (14m, 340°)"
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500"
                style={{ top: '35%', left: '72%' }}
                title="Cruiser #2 (22m, 45°)"
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"
                style={{ top: '65%', left: '52%' }}
                title="Spikestrip (8m, 5°)"
              />
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"
                style={{ top: '15%', left: '50%' }}
                title="Escape Corridor (45m)"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-code text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Hostile
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Obstacle
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Objective
              </span>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4 font-mono-code text-xs">
            <h4 className="text-sm font-bold text-white">Spatial Voxel &amp; Radar State</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Polar Coordinate Bounds:</span>
                <p className="text-white font-bold mt-1">R_MAX = 50.0m · AZIMUTH = 0&deg;–360&deg;</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Occlusion State:</span>
                <p className="text-white font-bold mt-1">RAYCAST COLLISION TILES: 1,024 VOXELS</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Predictive Velocity Vector:</span>
                <p className="text-emerald-400 font-bold mt-1">V_T = [38.4 m/s, 12.1&deg; HEADING]</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Unified Control: Dual-Analog & Kalman Filter */}
      {activeSubLayer === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white font-mono-code">
              Dual-Analog Actuation Curves
            </h4>
            <div className="space-y-3 font-mono-code text-xs">
              <div>
                <label className="text-slate-300 font-semibold mb-1 block">Response Curve:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['LINEAR', 'EXPONENTIAL', 'S_CURVE'] as const).map((curve) => (
                    <button
                      key={curve}
                      onClick={() => setResponseCurve(curve)}
                      className={`py-1.5 px-2 rounded text-xs transition-colors border ${
                        responseCurve === curve
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {curve}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Kalman Smoothing Filter:</span>
                  <span className="text-cyan-400 font-bold">
                    {(kalmanSmoothing * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.99"
                  step="0.01"
                  value={kalmanSmoothing}
                  onChange={(e) => setKalmanSmoothing(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Left Stick X (Steer):</span>
                  <span className="text-amber-400 font-bold">{leftStickX.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.05"
                  value={leftStickX}
                  onChange={(e) => setLeftStickX(parseFloat(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Left Stick Y (Throttle):</span>
                  <span className="text-emerald-400 font-bold">{leftStickY.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-1.0"
                  max="1.0"
                  step="0.05"
                  value={leftStickY}
                  onChange={(e) => setLeftStickY(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 flex flex-col justify-between space-y-4 font-mono-code text-xs">
            <h4 className="text-sm font-bold text-white">Visual Analog Stick Output (1000Hz)</h4>
            <div className="flex items-center justify-around py-4">
              {/* Left Stick Visualizer */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-slate-400 text-[11px]">LEFT STICK</span>
                <div className="relative w-32 h-32 rounded-full bg-[#050810] border-2 border-slate-700 flex items-center justify-center">
                  <div
                    className="w-10 h-10 rounded-full bg-cyan-500/80 border border-cyan-300 shadow-md shadow-cyan-500 absolute transition-all"
                    style={{
                      transform: `translate(${leftStickX * 36}px, ${-leftStickY * 36}px)`,
                    }}
                  />
                </div>
                <span className="text-cyan-300 text-[11px]">
                  ({leftStickX.toFixed(2)}, {leftStickY.toFixed(2)})
                </span>
              </div>

              {/* Response Curve Explanation */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 max-w-xs space-y-2">
                <span className="text-cyan-400 font-bold">Active Filter:</span>
                <p className="text-slate-300 text-[11px]">
                  {responseCurve === 'S_CURVE'
                    ? 'S-Curve sigmoid response provides smooth micro-adjustments around deadzone and rapid maximum deflection at limits.'
                    : responseCurve === 'EXPONENTIAL'
                    ? 'Exponential sensitivity yields high precision around origin.'
                    : '1:1 direct linear response.'}
                </p>
                <p className="text-emerald-400 text-[11px]">Kalman latency: &lt;0.05ms</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Reward Shaping: Multi-Objective Reinforcement Learning */}
      {activeSubLayer === 5 && (
        <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono-code">
                Multi-Objective Reinforcement Learning Formulation
              </h3>
              <p className="text-xs text-slate-400">
                Dynamic slider weights formulating cumulative reward R = &sum; w_i &middot; r_i
              </p>
            </div>
            <div className="px-4 py-2 rounded-lg bg-emerald-950/80 border border-emerald-700/60 font-mono-code">
              <span className="text-xs text-slate-400 mr-2">TOTAL RL REWARD:</span>
              <span className="text-base font-bold text-emerald-300">+{calculatedReward}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono-code text-xs">
            <div className="space-y-4">
              {[
                {
                  key: 'survival' as const,
                  label: 'Survival Objective (r_surv)',
                  val: rewardWeights.survival,
                },
                {
                  key: 'threatMitigation' as const,
                  label: 'Threat Mitigation (r_threat)',
                  val: rewardWeights.threatMitigation,
                },
                {
                  key: 'kineticFlow' as const,
                  label: 'Kinetic Flow & Speed (r_flow)',
                  val: rewardWeights.kineticFlow,
                },
                {
                  key: 'poiseDepletion' as const,
                  label: 'Poise & Defense Depletion (r_poise)',
                  val: rewardWeights.poiseDepletion,
                },
                {
                  key: 'spatialDominion' as const,
                  label: 'Spatial Dominion (r_space)',
                  val: rewardWeights.spatialDominion,
                },
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span>{item.label}</span>
                    <span className="text-cyan-400 font-bold">{(item.val * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={item.val}
                    onChange={(e) =>
                      setRewardWeights({
                        ...rewardWeights,
                        [item.key]: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white">Mathematical Formulation</h4>
              <pre className="p-3 rounded bg-black/80 border border-slate-800 text-cyan-300 text-[11px] overflow-x-auto leading-relaxed">
{`R_t = w_1·R_surv(s_t) 
    + w_2·R_threat(s_t, a_t) 
    + w_3·R_flow(v_t, a_t) 
    + w_4·R_poise(Δhp, Δstm) 
    + w_5·R_space(voxel_occ)

Current Vector:
[${rewardWeights.survival.toFixed(2)}, ${rewardWeights.threatMitigation.toFixed(2)}, ${rewardWeights.kineticFlow.toFixed(2)}, ${rewardWeights.poiseDepletion.toFixed(2)}, ${rewardWeights.spatialDominion.toFixed(2)}]`}
              </pre>
              <p className="text-slate-400 text-xs">
                Weights are verified through the Merkle Audit Spine on every checkpoint commit.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Cross-Game Skill Transfer Layer */}
      {activeSubLayer === 6 && (
        <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono-code">
              Cross-Game Latent Skill Transfer Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Transferring learned mechanical invariants across disjoint game engines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CROSS_GAME_SKILLS.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono-code text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{skill.skillName}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold">
                    {(skill.transferCosine * 100).toFixed(1)}% Cosine
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-cyan-400 font-bold">{skill.donorGame}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-amber-400 font-bold">{skill.targetGame}</span>
                </div>

                <div className="p-2.5 rounded bg-black/60 border border-slate-800 text-[11px] text-slate-300">
                  {skill.mechanics}
                </div>

                <div className="text-[10px] text-slate-500 truncate">
                  Latent Tensor: {skill.latentEmbedding}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. Drivers Fleet Layer */}
      {activeSubLayer === 7 && (
        <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4 font-mono-code text-xs">
          <div>
            <h3 className="text-sm font-bold text-white">
              Sovereign Fleet Driver Manager
            </h3>
            <p className="text-xs text-slate-400">
              Low-overhead Ring -0 / Ring -1 capture interfaces across graphics APIs and memory hooks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Direct3D Hook v2.4 (IPC)',
                games: 'GTA 6, Cyberpunk, Forza',
                fps: '144 FPS',
                latency: '0.18ms',
                status: 'ACTIVE',
              },
              {
                name: 'Vulkan Memory Hook v1.9',
                games: 'Doom Eternal',
                fps: '240 FPS',
                latency: '0.12ms',
                status: 'ACTIVE',
              },
              {
                name: 'IPC Shared Memory Hook v3.1',
                games: 'Elden Ring',
                fps: '120 FPS',
                latency: '0.22ms',
                status: 'ACTIVE',
              },
              {
                name: 'MineRL Sockets v1.8',
                games: 'Minecraft / MineDojo',
                fps: '60 TPS',
                latency: '0.45ms',
                status: 'ACTIVE',
              },
              {
                name: 'Telemetry UDP Hook v4.0',
                games: 'Forza Motorsport',
                fps: '360 Hz',
                latency: '0.08ms',
                status: 'ACTIVE',
              },
              {
                name: 'eBPF / XDP Zero-Copy Bypass',
                games: 'Global Network Frames',
                fps: '10M PPS',
                latency: '0.02ms',
                status: 'ACTIVE',
              },
            ].map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{d.name}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {d.status}
                  </span>
                </div>
                <div className="text-slate-400 text-xs">Target: {d.games}</div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-slate-300 text-[11px]">
                  <span>Capture Rate: {d.fps}</span>
                  <span className="text-cyan-400 font-bold">Latency: {d.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
