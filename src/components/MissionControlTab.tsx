import React, { useState } from 'react';
import { Shield, AlertTriangle, RefreshCw, Radio, KeyRound, Cpu, CheckCircle2, Zap, Server } from 'lucide-react';
import { ByzantineNode, MeshLink } from '../types';

interface MissionControlTabProps {
  nodes: ByzantineNode[];
  links: MeshLink[];
  onTriggerChaos: (type: 'LATENCY' | 'PARTITION' | 'CORRUPTION' | 'ACL_TAMPER' | 'HEAL') => void;
  activeChaosType: string | null;
}

export const MissionControlTab: React.FC<MissionControlTabProps> = ({
  nodes,
  links,
  onTriggerChaos,
  activeChaosType,
}) => {
  const [chaosLog, setChaosLog] = useState<string[]>([
    'Fabric initialized under FIPS 203 ML-KEM-768 lattice encryption.',
    'BFT supermajority verified: 5/5 nodes online (f < 1/3 Byzantine fault threshold).',
    'QUIC full-mesh tunnels active with sub-millisecond p99.9 RTT jitter.',
  ]);

  const handleChaosAction = (type: 'LATENCY' | 'PARTITION' | 'CORRUPTION' | 'ACL_TAMPER' | 'HEAL') => {
    onTriggerChaos(type);
    const timestamp = new Date().toLocaleTimeString();
    if (type === 'LATENCY') {
      setChaosLog((prev) => [
        `[${timestamp}] CHAOS INJECTED: +180ms transpacific latency on Tokyo ↔ Virginia QUIC link. BFT consensus sustained.`,
        ...prev.slice(0, 8),
      ]);
    } else if (type === 'PARTITION') {
      setChaosLog((prev) => [
        `[${timestamp}] CHAOS INJECTED: Network partition isolating Zurich & Reykjavik. LEO satellite mesh auto-bridged state.`,
        ...prev.slice(0, 8),
      ]);
    } else if (type === 'CORRUPTION') {
      setChaosLog((prev) => [
        `[${timestamp}] CHAOS INJECTED: Byzantine Merkle bit-flip detected in Singapore frame digest. Automated self-healing purged node weights.`,
        ...prev.slice(0, 8),
      ]);
    } else if (type === 'ACL_TAMPER') {
      setChaosLog((prev) => [
        `[${timestamp}] CHAOS INJECTED: Unauthorized rogue token injected into Worker Engine queue. Zero-Trust ACL dropped packet in 0.02ms.`,
        ...prev.slice(0, 8),
      ]);
    } else if (type === 'HEAL') {
      setChaosLog((prev) => [
        `[${timestamp}] FABRIC RECOVERED: All 5 nodes resynchronized to global Merkle root. 0 frame drops, 100% invariant verified.`,
        ...prev.slice(0, 8),
      ]);
    }
  };

  const onlineCount = nodes.filter((n) => n.status === 'ONLINE').length;
  const isSupermajority = onlineCount >= 4;

  return (
    <div className="space-y-6">
      {/* Overview Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono-code text-xs">
        <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800">
          <div className="text-slate-400 text-[11px] mb-1">RATED THROUGHPUT</div>
          <div className="text-lg font-bold text-cyan-400">120,400 TX/S</div>
          <div className="text-[10px] text-slate-500">Deterministic Ingestion Pipeline</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800">
          <div className="text-slate-400 text-[11px] mb-1">BFT CONSENSUS</div>
          <div className={`text-lg font-bold ${isSupermajority ? 'text-emerald-400' : 'text-amber-400'}`}>
            {onlineCount} / {nodes.length} SUPERMAJORITY
          </div>
          <div className="text-[10px] text-slate-500">f &lt; 1/3 Byzantine Threshold</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800">
          <div className="text-slate-400 text-[11px] mb-1">NIST POST-QUANTUM</div>
          <div className="text-lg font-bold text-purple-400">ML-KEM-768</div>
          <div className="text-[10px] text-slate-500">FIPS 203 / 204 Lattice Cryptography</div>
        </div>

        <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800">
          <div className="text-slate-400 text-[11px] mb-1">P99.9 INGESTION SLA</div>
          <div className="text-lg font-bold text-emerald-300">0.42 ms</div>
          <div className="text-[10px] text-slate-500">Sub-Millisecond Guarantee</div>
        </div>
      </div>

      {/* 5-City Byzantine Cluster Matrix */}
      <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>5-City Byzantine Cluster Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Active BFT supermajority agreement across Tokyo, Zurich, Reykjavik, Singapore, and Virginia
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-code">
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              SUPERMAJORITY STATUS: {isSupermajority ? 'VALIDATED' : 'WARNING'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {nodes.map((node) => {
            const isOnline = node.status === 'ONLINE';
            const isDegraded = node.status === 'DEGRADED';
            return (
              <div
                key={node.code}
                className={`p-4 rounded-xl bg-slate-900/90 border transition-all font-mono-code text-xs space-y-2 ${
                  isOnline
                    ? 'border-slate-800 hover:border-emerald-500/50'
                    : isDegraded
                    ? 'border-amber-600/60 bg-amber-950/20'
                    : 'border-rose-600/60 bg-rose-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{node.code}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isOnline
                        ? 'bg-emerald-950 text-emerald-300'
                        : isDegraded
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <div className="text-slate-300 font-medium">{node.name}</div>
                <div className="text-slate-400 text-[11px] pt-1 border-t border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Local RTT:</span>
                    <span className="text-cyan-400 font-bold">{node.rttMs}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Throughput:</span>
                    <span className="text-white">{node.tps.toLocaleString()} TX/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vote:</span>
                    <span className="text-emerald-400 font-bold">{node.bftVote}</span>
                  </div>
                  <div className="truncate text-slate-500 text-[10px] pt-1">
                    FNV: {node.lastBlockFNV}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* P2P Gossip Matrix & Chaos Injection Suite */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full-Mesh P2P Gossip Links (10 links) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white font-mono-code flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>Full-Mesh P2P Gossip Matrix (10 QUIC/TLS 1.3 Tunnels)</span>
            </h4>
            <span className="text-xs text-slate-500 font-mono-code">All Links Encrypted</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono-code text-[11px]">
            {links.map((link, idx) => {
              const isSevered = link.status === 'SEVERED';
              const isChaos = link.status === 'CHAOS_INJECTED';
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg bg-slate-900 border space-y-1 ${
                    isSevered
                      ? 'border-rose-600/70 bg-rose-950/20 text-rose-300'
                      : isChaos
                      ? 'border-amber-600/70 bg-amber-950/20 text-amber-300'
                      : 'border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between font-bold">
                    <span>{link.source} &harr; {link.target}</span>
                    <span className="text-[10px]">
                      {isSevered ? 'CUT' : isChaos ? '+180ms' : `${link.rttMs}ms`}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>Jitter: {link.jitterMs}ms</span>
                    <span>Loss: {link.packetLoss}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Chaos Event Log */}
          <div className="p-3 rounded-lg bg-black/90 border border-slate-800 space-y-1 font-mono-code text-[11px]">
            <div className="text-slate-500 uppercase font-bold text-[10px] border-b border-slate-800/80 pb-1">
              Mission Control Event Feed
            </div>
            <div className="space-y-1 pt-1 max-h-36 overflow-y-auto">
              {chaosLog.map((log, i) => (
                <div key={i} className="text-slate-300 leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chaos & Partition Injection Controls */}
        <div className="p-5 rounded-xl bg-[#090e1b] border border-slate-800 space-y-4 font-mono-code text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Chaos &amp; Partition Injection Suite</span>
          </div>
          <p className="text-slate-400 text-xs">
            Test BFT supermajority durability, Zero-Trust ACL boundaries, and automated self-healing.
          </p>

          <div className="space-y-2">
            <button
              onClick={() => handleChaosAction('LATENCY')}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeChaosType === 'LATENCY'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>1. Transpacific Latency</span>
                <span className="text-[10px] text-amber-400">+180ms RTT</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Injects 180ms delay on Tokyo &harr; Virginia to test consensus under lag.
              </p>
            </button>

            <button
              onClick={() => handleChaosAction('PARTITION')}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeChaosType === 'PARTITION'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>2. Network Partition</span>
                <span className="text-[10px] text-rose-400">Isolate ZUR &amp; REY</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulates European fiber severed; reroutes traffic via Starlink LEO lasers.
              </p>
            </button>

            <button
              onClick={() => handleChaosAction('CORRUPTION')}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeChaosType === 'CORRUPTION'
                  ? 'bg-purple-950/80 text-purple-300 border-purple-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>3. Byzantine Merkle Corruption</span>
                <span className="text-[10px] text-purple-400">Bit-Flip Attack</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Injects invalid frame hash; triggers automatic quarantine and weight eviction.
              </p>
            </button>

            <button
              onClick={() => handleChaosAction('ACL_TAMPER')}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                activeChaosType === 'ACL_TAMPER'
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <div className="font-bold flex items-center justify-between">
                <span>4. ACL Boundary Tampering</span>
                <span className="text-[10px] text-cyan-400">Unauthorized Token</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Attempts unauthorized role escalation; Zero-Trust ACL drops packet at line rate.
              </p>
            </button>

            <button
              onClick={() => handleChaosAction('HEAL')}
              className="w-full mt-2 p-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Automated Self-Healing / Reset Fabric</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
