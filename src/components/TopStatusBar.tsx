import React from 'react';
import { Play, Pause, Zap, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { SwarmLoad, ByzantineNode } from '../types';

interface TopStatusBarProps {
  isLiveRunning: boolean;
  onToggleLive: () => void;
  onEmitEvent: () => void;
  swarmLoad: SwarmLoad;
  nodes: ByzantineNode[];
  onOpenReplayModal: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  isLiveRunning,
  onToggleLive,
  onEmitEvent,
  swarmLoad,
  nodes,
  onOpenReplayModal,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#080d1a] px-4 py-3 select-none">
      {/* Top micro status ticker */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code pb-2 mb-2 border-b border-slate-800/60 text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-semibold tracking-wide">
            KERNEL: SOVEREIGN INFINITY v4.8 [OMEGA TIER 100 MAXIMUM]
          </span>
          <span className="text-slate-600">|</span>
          <button
            onClick={onOpenReplayModal}
            className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
            title="Inspect deterministic replay invariant verification"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>INVARIANT: (= replayed live) ✓ VERIFIED</span>
          </button>
        </div>

        {/* 5 City BFT Node Badges */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 mr-1">BFT NODES:</span>
          {nodes.slice(0, 5).map((node) => {
            const isGood = node.status === 'ONLINE';
            const isDegraded = node.status === 'DEGRADED';
            return (
              <span
                key={node.code}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono-code font-bold flex items-center gap-1 border ${
                  isGood
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                    : isDegraded
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                    : 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGood ? 'bg-emerald-400' : isDegraded ? 'bg-amber-400' : 'bg-rose-500'
                  }`}
                />
                {node.code}
              </span>
            );
          })}
        </div>
      </div>

      {/* Main Bar: Brand, Action Controls & Swarm Gauges */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-950">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SOVEREIGN INFINITY
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 font-mono-code">
                  gameplay.feed
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Merkle Audit Spine · Deterministic Replay · 7-Component Game Cognition Layer
            </p>
          </div>
        </div>

        {/* 7-Agent Swarm Real-time Gauges */}
        <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono-code">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            7-AGENT SWARM:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">CEO ORCHESTRATOR</span>
            <span className="text-cyan-400 font-bold">({swarmLoad.ceo}%)</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">WORKER ENGINE</span>
            <span className="text-emerald-400 font-bold">({swarmLoad.worker}%)</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">AUDITOR ALETHEIA</span>
            <span className="text-amber-400 font-bold">({swarmLoad.auditor}%)</span>
          </div>
          <span className="text-slate-700">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-300">CHIEF CRYPTO</span>
            <span className="text-purple-400 font-bold">({swarmLoad.crypto}%)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all border ${
              isLiveRunning
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70 shadow-sm shadow-emerald-900/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isLiveRunning ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>LIVE AGENT RUNNING</span>
                <Pause className="w-3.5 h-3.5 text-emerald-400 ml-1" />
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-slate-400" />
                <span>AGENT PAUSED</span>
              </>
            )}
          </button>

          <button
            onClick={onEmitEvent}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm shadow-cyan-900/50 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Emit Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
