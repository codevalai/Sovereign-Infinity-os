import React, { useState, useMemo } from 'react';
import { Search, Flame, ShieldAlert, Sparkles, Terminal, Cpu, Network, CheckCircle2, ArrowRight } from 'lucide-react';
import { SovereignEvent, FeedMode, GameTitle } from '../types';

interface GameplayFeedTabProps {
  events: SovereignEvent[];
  onSelectEvent: (event: SovereignEvent) => void;
}

export const GameplayFeedTab: React.FC<GameplayFeedTabProps> = ({ events, onSelectEvent }) => {
  const [feedMode, setFeedMode] = useState<FeedMode>('v4');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('ALL');
  const [highlightsOnly, setHighlightsOnly] = useState(false);

  const gameOptions: string[] = ['ALL', 'GTA6', 'Minecraft', 'Forza', 'Cyberpunk', 'Elden Ring', 'Doom'];

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (selectedGame !== 'ALL' && ev.payload.game !== selectedGame) {
        return false;
      }
      if (highlightsOnly && !ev.payload.highlight) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesIntent = ev.payload.intent.toLowerCase().includes(q);
        const matchesAction = ev.payload.action.toLowerCase().includes(q);
        const matchesCity = ev.payload.cityNode.toLowerCase().includes(q);
        const matchesGame = ev.payload.game.toLowerCase().includes(q);
        const matchesSeq = ev.sequenceNumber.toString().includes(q);
        if (!matchesIntent && !matchesAction && !matchesCity && !matchesGame && !matchesSeq) {
          return false;
        }
      }
      return true;
    });
  }, [events, selectedGame, highlightsOnly, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Feed Mode Selector & Controls */}
      <div className="p-4 rounded-xl bg-[#090e1b] border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Feed Mode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold font-mono-code uppercase mr-1">
              Feed Architecture Mode:
            </span>
            {[
              { id: 'v1' as FeedMode, label: 'v1: Basic Stream', desc: 'High-density terminal execution logs' },
              { id: 'v2' as FeedMode, label: 'v2: Highlight Engine', desc: 'High-reward gameplay moment highlights' },
              { id: 'v3' as FeedMode, label: 'v3: Swarm Coordination', desc: 'Cross-agent role tracing' },
              { id: 'v4' as FeedMode, label: 'v4: Full Sovereign Global', desc: 'Multi-city Byzantine signatures & Merkle' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setFeedMode(mode.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold font-mono-code transition-all border ${
                  feedMode === mode.id
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-950'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={mode.desc}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Highlights Only Toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={highlightsOnly}
              onChange={(e) => setHighlightsOnly(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Highlights Only</span>
            </span>
          </label>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
          {/* Game filter buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-slate-500 font-mono-code mr-1">GAME:</span>
            {gameOptions.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-2.5 py-1 rounded text-xs font-mono-code transition-all whitespace-nowrap ${
                  selectedGame === game
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          {/* Search Input & Counter */}
          <div className="flex items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter intent, action, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono-code"
              />
            </div>
            <span className="text-xs text-slate-500 font-mono-code whitespace-nowrap">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Mode v1: High-Density Terminal Stream */}
      {feedMode === 'v1' && (
        <div className="rounded-xl bg-black border border-slate-800 p-3 font-mono-code text-xs space-y-1">
          <div className="text-slate-500 pb-2 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
            <span>SEQ | TIMESTAMP | GAME/NODE | ROLE | INTENT / ACTION | REWARD | FRAME DIGEST | SIG</span>
            <span className="text-cyan-400">RAW TELEMETRY BUFFER</span>
          </div>
          <div className="divide-y divide-slate-900 max-h-[700px] overflow-y-auto">
            {filteredEvents.map((ev) => (
              <div
                key={ev.eventId}
                onClick={() => onSelectEvent(ev)}
                className="py-1.5 px-2 hover:bg-slate-900/60 cursor-pointer flex flex-wrap items-center justify-between gap-2 text-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">#{ev.sequenceNumber}</span>
                  <span className="text-slate-500">[{new Date(ev.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-amber-300 font-semibold">{ev.payload.game}</span>
                  <span className="text-slate-400">@{ev.payload.cityNode}</span>
                  <span className="text-purple-400">[{ev.issuer}]</span>
                  <span className="text-white font-medium">{ev.payload.intent}</span>
                  <span className="text-slate-500">&rarr;</span>
                  <span className="text-slate-400">{ev.payload.action}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-emerald-400 font-bold">+{ev.payload.reward.toFixed(2)}</span>
                  <span className="text-cyan-300">{ev.payload.frameDigest}</span>
                  <span className="text-slate-600 truncate max-w-[120px]">{ev.signature}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode v2: Highlight Engine */}
      {feedMode === 'v2' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.eventId}
              onClick={() => onSelectEvent(ev)}
              className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code font-bold text-cyan-400">
                    #{ev.sequenceNumber}
                  </span>
                  <span className="text-xs font-bold text-white">{ev.payload.game}</span>
                  <span className="text-xs text-slate-400 font-mono-code">@{ev.payload.cityNode}</span>
                </div>
                <span className="text-xs font-bold font-mono-code text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  +{ev.payload.reward.toFixed(2)} RL
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <div className="text-xs font-bold font-mono-code text-amber-300">
                  {ev.payload.intent}
                </div>
                <p className="text-xs text-slate-300 mt-1 italic">
                  &ldquo;{ev.payload.highlightReason}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono-code pt-1">
                <span>Threat: {ev.payload.threatLevel}/100</span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode v3: Swarm Coordination Tracing */}
      {feedMode === 'v3' && (
        <div className="space-y-3">
          {filteredEvents.map((ev) => (
            <div
              key={ev.eventId}
              className="p-4 rounded-xl bg-[#090e1a] border border-slate-800 space-y-3 font-mono-code text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">#{ev.sequenceNumber}</span>
                  <span className="text-white font-bold">{ev.payload.game}</span>
                  <span className="text-slate-400">Node: {ev.payload.cityNode}</span>
                </div>
                <span className="text-emerald-400 font-bold">Reward: +{ev.payload.reward.toFixed(2)}</span>
              </div>

              {/* Swarm State Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-cyan-400 font-bold">1. CEO ORCHESTRATOR</span>
                  <p className="text-slate-400 mt-1">Intent Dispatched:</p>
                  <p className="text-slate-200 truncate">{ev.payload.intent}</p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-emerald-400 font-bold">2. WORKER ENGINE</span>
                  <p className="text-slate-400 mt-1">Controller Action:</p>
                  <p className="text-slate-200 truncate">{ev.payload.action}</p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-amber-400 font-bold">3. AUDITOR ALETHEIA</span>
                  <p className="text-slate-400 mt-1">FNV-1a Digest:</p>
                  <p className="text-slate-200">{ev.payload.frameDigest}</p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-purple-400 font-bold">4. CHIEF CRYPTO</span>
                  <p className="text-slate-400 mt-1">Lattice Signature:</p>
                  <p className="text-purple-300 truncate">{ev.signature}</p>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onSelectEvent(ev)}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px]"
                >
                  <span>Inspect Complete Merkle Proof</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode v4: Full Sovereign Global (Matches Exact Prompt Format) */}
      {feedMode === 'v4' && (
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const hud = ev.payload.hudState;
            return (
              <div
                key={ev.eventId}
                className="p-5 rounded-xl bg-[#080d19] border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-4 shadow-lg shadow-black/40"
              >
                {/* Event Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/70 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white tracking-tight">
                      {ev.payload.game}
                    </span>
                    <span className="text-slate-400 text-xs font-mono-code">
                      {ev.payload.cityNode}
                    </span>
                    <span className="text-cyan-400 font-mono-code font-bold text-sm">
                      #{ev.sequenceNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono-code text-[11px]">
                    {ev.payload.highlight && (
                      <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        HIGHLIGHT MOMENT
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      MERKLE ANCHORED
                    </span>
                  </div>
                </div>

                {/* Intent & Action Header */}
                <div className="space-y-1">
                  <div className="text-cyan-300 font-mono-code font-bold text-sm tracking-wide">
                    {ev.payload.intent}
                  </div>
                  <div className="text-amber-300 font-mono-code text-xs">
                    {ev.payload.action}
                  </div>
                  {ev.payload.highlightReason && (
                    <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                      {ev.payload.highlightReason}
                    </p>
                  )}
                </div>

                {/* HUD State Metrics Bar (Exact Format From Prompt) */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono-code bg-[#0b1222] p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
                  {hud.health !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">HP:</span>
                      <span className="font-bold text-rose-400">{hud.health}%</span>
                    </div>
                  )}

                  {hud.ammo !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">AMMO:</span>
                      <span className="font-bold text-amber-400">{hud.ammo}</span>
                    </div>
                  )}

                  {hud.stamina !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">STM:</span>
                      <span className="font-bold text-cyan-400">{hud.stamina}</span>
                    </div>
                  )}

                  {hud.speed !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">SPEED:</span>
                      <span className="font-bold text-emerald-400">{hud.speed} km/h</span>
                    </div>
                  )}

                  {hud.wantedLevel !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">WANTED:</span>
                      <span className="font-bold text-amber-400">
                        {'★'.repeat(hud.wantedLevel)}
                      </span>
                    </div>
                  )}

                  {hud.level !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-500">LVL:</span>
                      <span className="font-bold text-purple-400">{hud.level}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">THREAT:</span>
                    <span className="font-bold text-orange-400">{ev.payload.threatLevel}/100</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">RL REWARD:</span>
                    <span className="font-bold text-emerald-400">+{ev.payload.reward.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">FRAME FNV:</span>
                    <span className="font-bold text-cyan-300">{ev.payload.frameDigest}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">DRIVER:</span>
                    <span className="font-bold text-slate-200">
                      {ev.payload.driverHook.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Issuer, Signature & Inspector Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono-code pt-1">
                  <div className="text-slate-400 text-[11px] truncate">
                    <span className="text-slate-300">ISSUER: {ev.issuer}</span>
                    <span className="mx-2 text-slate-600">•</span>
                    <span className="text-purple-400 font-bold">{ev.signature}</span>
                  </div>

                  <button
                    onClick={() => onSelectEvent(ev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors border border-slate-700 shrink-0 cursor-pointer"
                  >
                    <span>Inspect Snapshot &amp; Merkle Spine</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="p-12 text-center rounded-xl bg-[#090e1b] border border-slate-800 space-y-3">
          <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No events match filter criteria</h4>
          <p className="text-xs text-slate-500">
            Clear the search bar or game filter to resume observing telemetry frames.
          </p>
        </div>
      )}
    </div>
  );
};
