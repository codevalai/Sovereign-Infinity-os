import React, { useState } from 'react';
import { Cpu, Terminal, Network, ShieldCheck, Play, RotateCcw, Zap, Layers, Binary, Check, ArrowRight, CornerDownLeft } from 'lucide-react';

export const WireProtocolsDriversTab: React.FC = () => {
  const [activePillar, setActivePillar] = useState<1 | 2 | 3 | 4>(1);

  // Pillar 1: FlatBuffers vs JSON Benchmark state
  const [activeOffsetRow, setActiveOffsetRow] = useState<number | null>(0);

  // Pillar 2: Interactive Ring Buffer state
  const [ringHead, setRingHead] = useState<number>(42);
  const [ringTail, setRingTail] = useState<number>(36);
  const [ringPublishedCount, setRingPublishedCount] = useState<number>(10240);
  const [ringConsumedCount, setRingConsumedCount] = useState<number>(10234);

  const handlePublishRing = () => {
    setRingHead((prev) => (prev + 1) % 64);
    setRingPublishedCount((c) => c + 1);
  };

  const handleConsumeRing = () => {
    if (ringTail !== ringHead) {
      setRingTail((prev) => (prev + 1) % 64);
      setRingConsumedCount((c) => c + 1);
    }
  };

  const handleResetRing = () => {
    setRingHead(0);
    setRingTail(0);
  };

  // Pillar 3: Rust sovereign-audit-cli Terminal state
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<Array<{ cmd: string; output: string[] }>>([
    {
      cmd: 'sovereign-audit verify --node TOK --sequence 1018..1022 --strict',
      output: [
        '[INF] Initializing sovereign-audit-cli v5.0 (x86_64-unknown-linux-gnu)...',
        '[INF] Loading DAG spine for Tokyo node [TOK]...',
        '[INF] Recomputing FNV-1a frame digests across 5 frames...',
        '[OK]  Seq #1018 (Doom):       Frame 0xC90A11F4 verified (0 drift).',
        '[OK]  Seq #1019 (Cyberpunk):  Frame 0x18B991F2 verified (0 drift).',
        '[OK]  Seq #1020 (Elden Ring): Frame 0x2FE70A4E verified (0 drift).',
        '[OK]  Seq #1021 (Minecraft):  Frame 0xF40300E7 verified (0 drift).',
        '[OK]  Seq #1022 (Forza):       Frame 0x578B1226 verified (0 drift).',
        '[INF] Validating ML-KEM-768 lattice non-repudiation proofs (FIPS 203)...',
        '[OK]  Public key 0xTOK49A matched root authority.',
        '[RES] INVARIANT SECURED: (= replayed live) 0.00% state drift verified.',
      ],
    },
  ]);

  const handleRunCli = (commandToRun?: string) => {
    const cmd = (commandToRun || cliInput).trim();
    if (!cmd) return;

    let response: string[] = [];

    if (cmd.includes('verify')) {
      response = [
        '[INF] Loading DAG spine for target node...',
        '[INF] Parsing FlatBuffers zero-copy binary chunks...',
        '[OK]  Frame digests recomputed matches 100% bit-for-bit.',
        '[OK]  ML-KEM-768 lattice signatures valid.',
        '[RES] INVARIANT SECURED: 0% State Drift.',
      ];
    } else if (cmd.includes('audit-chain')) {
      response = [
        '[INF] Auditing global Merkle spine tree across 250 Anycast nodes...',
        '[OK]  Root Hash: 0x882A7C4F9901B3A0D12F98CE5390F1A1',
        '[OK]  Depth: 16 layers, 65,536 leaves verified without branch corruption.',
        '[RES] BFT consensus validated: Supermajority 5/5 unanimous.',
      ];
    } else if (cmd.includes('bench-wire')) {
      response = [
        '[BENCH] Benchmark: Deserialization Latency (1,000,000 events)',
        '  Standard JSON:       1,240 ns / op (heap allocations: 48 allocs/op)',
        '  Protocol Buffers:      185 ns / op (heap allocations: 6 allocs/op)',
        '  FlatBuffers (Zero-Copy): 12 ns / op (heap allocations: 0 allocs/op)',
        '[SPEEDUP] FlatBuffers is 103.3x faster than JSON. Direct L3 cache line access.',
      ];
    } else if (cmd.includes('check-fips203')) {
      response = [
        '[PQC] NIST FIPS 203 ML-KEM-768 & FIPS 204 ML-DSA-65 Test Suite',
        '[OK]  Key exchange encapsulation latency: 0.038ms',
        '[OK]  Decapsulation latency: 0.042ms',
        '[OK]  Side-channel resistance: Constant-time arithmetic verified.',
      ];
    } else if (cmd === 'help') {
      response = [
        'Available sovereign-audit-cli commands:',
        '  sovereign-audit verify --node <NODE> --sequence <RANGE> --strict',
        '  sovereign-audit audit-chain --root <HASH> --deep',
        '  sovereign-audit bench-wire --flatbuffers',
        '  sovereign-audit check-fips203 --node <NODE>',
        '  clear',
      ];
    } else if (cmd === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else {
      response = [
        `Command not recognized: '${cmd}'. Type 'help' for available commands.`,
      ];
    }

    setCliHistory((prev) => [...prev, { cmd, output: response }]);
    setCliInput('');
  };

  // Pillar 4: Partition Automata State Machine
  const [automataState, setAutomataState] = useState<
    'NOMINAL' | 'DEGRADED' | 'QUARANTINE_SHARD' | 'ANTI_ENTROPY' | 'SYNCED'
  >('NOMINAL');

  const automataSteps: Array<{
    id: typeof automataState;
    title: string;
    desc: string;
    duration: string;
  }> = [
    {
      id: 'NOMINAL',
      title: '1. NOMINAL STATE',
      desc: 'Sub-millisecond UDP heartbeats broadcast across 250 Anycast nodes. Unanimous DAG root progression.',
      duration: 'p99 RTT < 1.2ms',
    },
    {
      id: 'DEGRADED',
      title: '2. 50ms FAILURE TIMEOUT',
      desc: 'Heartbeats drop past 50ms (e.g. Transpacific fiber latency cut). Node is automatically flagged as DEGRADED.',
      duration: 'Threshold: 50ms',
    },
    {
      id: 'QUARANTINE_SHARD',
      title: '3. REGIONAL SHARD QUARANTINE',
      desc: 'Synchronous global commits halt. Network fractures into autonomous regional shards (APAC-South, AMER-East) sustaining 45M TX/S locally.',
      duration: '0 Frame Drops',
    },
    {
      id: 'ANTI_ENTROPY',
      title: '4. MERKLE ANTI-ENTROPY',
      desc: 'Reconciliation exchange transmits only divergent Merkle tree sub-branches rather than entire ledger history.',
      duration: 'Sub-tree Diffing',
    },
    {
      id: 'SYNCED',
      title: '5. GLOBAL MERKLE SYNC',
      desc: 'Divergent branches merged deterministically. ML-KEM signatures verified. 100% bit-for-bit historical reproducibility restored.',
      duration: 'Invariant Verified',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-xl bg-[#090e1b] border border-cyan-500/40 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-700/60 text-cyan-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono-code">
                Wire Speed Protocols &amp; Concrete Ingress/Egress Drivers
              </h3>
              <p className="text-xs text-slate-400">
                Zero-Copy FlatBuffers · C++20 Lock-Free IPC Ring · eBPF AF_XDP Network Bypass · sovereign-audit-cli · DAG Partition Automata
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 text-xs font-mono-code font-bold text-cyan-300">
            WIRE STATUS: 0-COPY ACTIVE (12ns)
          </div>
        </div>
      </div>

      {/* 4 Pillars Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 font-mono-code text-xs">
        {[
          {
            id: 1 as const,
            title: '1. FlatBuffers Wire Schema',
            subtitle: 'Zero-Copy Cache Layout',
          },
          {
            id: 2 as const,
            title: '2. C++20 & eBPF Ingress Drivers',
            subtitle: 'Lock-Free Direct3D & XDP',
          },
          {
            id: 3 as const,
            title: '3. sovereign-audit-cli (Rust)',
            subtitle: 'Deterministic Verifier',
          },
          {
            id: 4 as const,
            title: '4. Partition Automata Engine',
            subtitle: 'Self-Healing Consensus',
          },
        ].map((p) => {
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillar(p.id)}
              className={`p-3.5 rounded-xl text-left transition-all border ${
                isActive
                  ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold text-white text-xs">{p.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{p.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Pillar 1: Zero-Copy Binary Telemetry (FlatBuffers) */}
      {activePillar === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono-code text-xs">
            {/* FlatBuffers Schema Specification */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Binary className="w-4 h-4 text-cyan-400" />
                  <span>sovereign_matrix.fbs (Zero-Copy FlatBuffers Schema)</span>
                </h4>
                <span className="text-[11px] text-emerald-400">Memory-Aligned (64-bit)</span>
              </div>

              <pre className="p-4 rounded-lg bg-black/90 border border-slate-800 text-slate-300 text-xs overflow-x-auto leading-relaxed selection:bg-cyan-900 selection:text-white">
{`// sovereign_matrix.fbs
namespace Sovereign.Matrix;

enum IntentTier : byte { 
  Primitive = 0, 
  Tactical = 1, 
  Strategic = 2, 
  Meta = 3 
}

// Inline struct: 0 heap allocations, exact cache line alignment
struct HUDState {
  health: uint16;       // Offset +0x00 (2 bytes)
  stamina: uint16;      // Offset +0x02 (2 bytes)
  threat_level: uint8;  // Offset +0x04 (1 byte)
  intent: IntentTier;   // Offset +0x05 (1 byte)
  ammo: uint16;         // Offset +0x06 (2 bytes)
}

table FeedEvent {
  sequence_id: uint64;          // Offset +0x00 (8 bytes)
  timestamp_ns: uint64;         // Offset +0x08 (8 bytes)
  city_node: string;            // Offset +0x10 (vtable offset)
  frame_fnv1a: uint32;          // Offset +0x14 (4 bytes)
  hud: HUDState;                // Offset +0x18 (8 bytes inline)
  action_mnemonic: string;      // Offset +0x20 (vtable offset)
  rl_reward: float32;           // Offset +0x24 (4 bytes IEEE 754)
  mlkem_signature: [ubyte];     // Offset +0x28 (3309 bytes FIPS 204 ML-DSA-65)
}

root_type FeedEvent;`}
              </pre>

              {/* Wire Benchmark Comparison Card */}
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-white font-bold text-xs">
                  Hardware Latency &amp; Memory Allocation Benchmark
                </span>
                <div className="space-y-2 text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Standard JSON Parsing (v1-v4):</span>
                      <span className="text-rose-400 font-bold">1,240 ns (48 heap allocs)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-rose-500 h-1.5 rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Protocol Buffers (.proto):</span>
                      <span className="text-amber-400 font-bold">185 ns (6 heap allocs)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-amber-400 h-1.5 rounded-full w-[15%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400 mb-1">
                      <span>Sovereign FlatBuffers (Zero-Copy):</span>
                      <span className="text-cyan-400 font-bold">12 ns (0 heap allocs · L3 hit)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-cyan-400 h-1.5 rounded-full w-[1%]" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 pt-1">
                  ✓ 103.3x Speedup achieved. Execution drones read telemetry directly from shared CXL cache lines without heap allocations.
                </p>
              </div>
            </div>

            {/* Zero-Copy Binary Memory Inspector */}
            <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Binary Frame Memory Offset Table</span>
              </h4>
              <p className="text-slate-400 text-[11px]">
                Direct byte-aligned memory offsets for Sequence #1020 (Elden Ring @ Tokyo)
              </p>

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto">
                {[
                  { offset: '0x00', field: 'sequence_id', type: 'uint64', val: '1020', size: '8B' },
                  { offset: '0x08', field: 'timestamp_ns', type: 'uint64', val: '1791827231937000000', size: '8B' },
                  { offset: '0x10', field: 'city_node_ptr', type: 'uoffset', val: '"Tokyo"', size: '4B' },
                  { offset: '0x14', field: 'frame_fnv1a', type: 'uint32', val: '0x2FE70A4E', size: '4B' },
                  { offset: '0x18', field: 'hud.health', type: 'uint16', val: '88 (88%)', size: '2B' },
                  { offset: '0x1A', field: 'hud.stamina', type: 'uint16', val: '94', size: '2B' },
                  { offset: '0x1C', field: 'hud.threat_level', type: 'uint8', val: '99 / 100', size: '1B' },
                  { offset: '0x1D', field: 'hud.intent', type: 'uint8', val: 'Tactical (1)', size: '1B' },
                  { offset: '0x1E', field: 'hud.ammo', type: 'uint16', val: '0', size: '2B' },
                  { offset: '0x20', field: 'action_ptr', type: 'uoffset', val: '"ROLL_FORWARD_RIGHT"', size: '4B' },
                  { offset: '0x24', field: 'rl_reward', type: 'float32', val: '+3.40 (IEEE 754)', size: '4B' },
                  { offset: '0x28', field: 'mlkem_signature', type: 'byte[3309]', val: 'SIG_MLKEM_9941CA...', size: '3309B' },
                ].map((row, idx) => {
                  const isSelected = activeOffsetRow === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveOffsetRow(idx)}
                      className={`p-2 rounded text-[11px] cursor-pointer transition-colors border ${
                        isSelected
                          ? 'bg-cyan-950 border-cyan-500/80 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span className="text-cyan-400">{row.offset}</span>
                        <span className="text-slate-400">{row.size}</span>
                      </div>
                      <div className="text-white font-semibold">{row.field}</div>
                      <div className="text-slate-400 truncate text-[10px] mt-0.5">
                        {row.type} &rarr; <span className="text-amber-300">{row.val}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 2: Physical Ingress/Egress Driver Implementations */}
      {activePillar === 2 && (
        <div className="space-y-6 font-mono-code text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lock-Free Ring Buffer Simulator */}
            <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Lock-Free C++20 Shared Memory Ring Buffer</span>
                </h4>
                <span className="text-emerald-400 text-[11px]">std::atomic (Acquire/Release)</span>
              </div>

              <p className="text-slate-400 text-xs">
                Wait-free telemetry transfer between Direct3D Present hook and Kinematic Execution Drone using 64-byte cache-line aligned slots.
              </p>

              {/* Interactive Ring Simulator */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400">Head Pointer: </span>
                    <span className="text-cyan-400 font-bold">Slot #{ringHead}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Tail Pointer: </span>
                    <span className="text-emerald-400 font-bold">Slot #{ringTail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Occupancy: </span>
                    <span className="text-amber-400 font-bold">
                      {Math.abs(ringHead - ringTail)} / 64 slots
                    </span>
                  </div>
                </div>

                {/* Ring Slot visualization */}
                <div className="grid grid-cols-16 gap-1 p-2 bg-black/80 rounded-lg border border-slate-800">
                  {Array.from({ length: 64 }).map((_, idx) => {
                    const isHead = idx === ringHead;
                    const isTail = idx === ringTail;
                    const isOccupied =
                      ringHead >= ringTail
                        ? idx >= ringTail && idx < ringHead
                        : idx >= ringTail || idx < ringHead;

                    return (
                      <div
                        key={idx}
                        title={`Slot ${idx} ${isHead ? '(HEAD)' : ''} ${isTail ? '(TAIL)' : ''}`}
                        className={`h-4 rounded-xs transition-colors ${
                          isHead
                            ? 'bg-cyan-400 ring-2 ring-white'
                            : isTail
                            ? 'bg-emerald-400'
                            : isOccupied
                            ? 'bg-amber-500/70'
                            : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Simulator controls */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <button
                    onClick={handlePublishRing}
                    className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Publish Frame (D3D Hook)
                  </button>
                  <button
                    onClick={handleConsumeRing}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Consume Intent (Drone)
                  </button>
                  <button
                    onClick={handleResetRing}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  >
                    Reset Ring
                  </button>
                </div>
              </div>

              {/* Code snippet */}
              <pre className="p-3 rounded-lg bg-black/90 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
{`// sovereign_ipc_ring.hpp (C++20)
struct alignas(64) RingSlot {
  std::atomic<bool> is_ready{false};
  uint8_t payload[4096];
};
alignas(64) std::atomic<size_t> head{0};
alignas(64) std::atomic<size_t> tail{0};
// memory_order_acquire / release guarantees zero-mutex locking`}
              </pre>
            </div>

            {/* Linux eBPF / AF_XDP Network Bypass */}
            <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Linux eBPF / AF_XDP Network Bypass (Rust / C)</span>
                </h4>
                <span className="text-purple-400 text-[11px]">SEC(&quot;xdp&quot;) Ingress</span>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed">
                Attached directly to Mellanox ConnectX-7 NIC driver. Inspects incoming UDP packets at hardware line rate and redirects matrix payloads straight to userspace memory via an <code className="text-cyan-400">AF_XDP</code> socket, completely bypassing the Linux kernel TCP/IP stack (<code className="text-slate-400">sk_buff</code>).
              </p>

              <pre className="p-4 rounded-lg bg-black/90 border border-slate-800 text-purple-300 text-[11px] overflow-x-auto leading-relaxed selection:bg-purple-900 selection:text-white">
{`// sovereign_xdp_ingress.rs (Aya eBPF)
#[xdp]
pub fn sovereign_ingress(ctx: XdpContext) -> u32 {
    let data_start = ctx.data();
    let data_end = ctx.data_end();

    // Fast-path UDP Header Inspection
    let udp_hdr = unsafe { &*(data_start + 34 as *const UdpHdr) };
    
    // Magic UDP Port 4433 redirects straight to AF_XDP userspace
    if u16::from_be(udp_hdr.dest) == 4433 {
        return xdp_action::XDP_REDIRECT; // Zero-copy packet pass
    }

    xdp_action::XDP_PASS
}`}
              </pre>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 text-[11px]">
                <div className="text-slate-400">Driver Ingress Metrics:</div>
                <div className="flex justify-between text-slate-300">
                  <span>Throughput:</span>
                  <span className="text-emerald-400 font-bold">14,800,000 PPS</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Kernel Overhead:</span>
                  <span className="text-cyan-400 font-bold">0.00 ns (sk_buff bypassed)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 3: Verification & Formal Replay Tooling (sovereign-audit-cli) */}
      {activePillar === 3 && (
        <div className="space-y-4 font-mono-code text-xs">
          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>sovereign-audit-cli (Rust Native Verification Tooling)</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  Proves the <span className="text-cyan-300">(= replayed live) ✓ VERIFIED</span> invariant by recomputing FNV-1a digests and verifying ML-KEM lattice keys.
                </p>
              </div>

              {/* Quick runnable actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleRunCli('sovereign-audit verify --node TOK --sequence 1018..1022 --strict')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  Verify Tokyo #1018-#1022
                </button>
                <button
                  onClick={() => handleRunCli('sovereign-audit bench-wire --flatbuffers')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  Run FlatBuffers Benchmark
                </button>
                <button
                  onClick={() => handleRunCli('sovereign-audit audit-chain --root 0x882A7C4F --deep')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  Audit Global Merkle Spine
                </button>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="rounded-xl bg-black border border-slate-800 p-4 space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-bold text-slate-400">sovereign-audit-cli / session: tok-node-prod</span>
                </div>
                <span className="text-cyan-400">RUST x86_64 ML-KEM-768</span>
              </div>

              {/* Terminal History */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                {cliHistory.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center gap-2 text-cyan-300">
                      <span className="text-emerald-400 font-bold">$</span>
                      <span className="font-bold">{item.cmd}</span>
                    </div>
                    <div className="space-y-0.5 text-slate-300 text-[11px] pl-4 border-l border-slate-800">
                      {item.output.map((line, lIdx) => (
                        <div
                          key={lIdx}
                          className={
                            line.startsWith('[OK]')
                              ? 'text-emerald-400'
                              : line.startsWith('[RES]')
                              ? 'text-cyan-300 font-bold'
                              : line.startsWith('[BENCH]')
                              ? 'text-amber-300 font-bold'
                              : 'text-slate-300'
                          }
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Terminal Input Line */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCli();
                }}
                className="flex items-center gap-2 pt-2 border-t border-slate-900"
              >
                <span className="text-emerald-400 font-bold">$</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Type 'help', 'sovereign-audit verify --node TOK', etc..."
                  className="flex-1 bg-transparent text-slate-200 focus:outline-none text-xs font-mono-code placeholder-slate-600"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pillar 4: Self-Healing Chaos Controller & Partition Automata */}
      {activePillar === 4 && (
        <div className="space-y-6 font-mono-code text-xs">
          <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>DAG Consensus State Machine &amp; Partition Automata</span>
                </h4>
                <p className="text-slate-400 text-xs">
                  Automated state transitions handling 50ms failure timeouts, regional shard quarantine, and Merkle anti-entropy reconciliation
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">ACTIVE AUTOMATA STATE:</span>
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  {automataState}
                </span>
              </div>
            </div>

            {/* Automata Transition Steps */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {automataSteps.map((step, idx) => {
                const isSelected = automataState === step.id;
                return (
                  <div
                    key={step.id}
                    onClick={() => setAutomataState(step.id)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border space-y-2 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-md shadow-cyan-950 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-white flex items-center justify-between">
                        <span>{step.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-bold border-t border-slate-800 pt-1">
                      {step.duration}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed State Explanation */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-white font-bold text-xs">
                State Transition Details: {automataState}
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {automataState === 'NOMINAL' &&
                  'All 250 Anycast nodes synchronize within 1.2ms. BFT supermajority validates transactions continuously.'}
                {automataState === 'DEGRADED' &&
                  'Heartbeat threshold of 50ms exceeded on Tokyo ↔ Virginia transpacific link. Gossip matrix flags peer as DEGRADED.'}
                {automataState === 'QUARANTINE_SHARD' &&
                  'Global block commit paused to prevent transpacific stall. Regional DAG shards (APAC, AMER, EMEA) continue processing locally at 45M TX/S.'}
                {automataState === 'ANTI_ENTROPY' &&
                  'Upon network link restoration, nodes exchange divergent Merkle sub-tree hashes rather than sending entire transaction blocks.'}
                {automataState === 'SYNCED' &&
                  'Reconciliation complete. 0 state drift detected. FNV-1a digests validated bit-for-bit across all 250 cities.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
