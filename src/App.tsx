/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopStatusBar } from './components/TopStatusBar';
import { NavigationTabs, MainTab } from './components/NavigationTabs';
import { GameplayFeedTab } from './components/GameplayFeedTab';
import { GameCognitionTab } from './components/GameCognitionTab';
import { MissionControlTab } from './components/MissionControlTab';
import { OmniMatrixTab } from './components/OmniMatrixTab';
import { WireProtocolsDriversTab } from './components/WireProtocolsDriversTab';
import { ZenithComplianceTab } from './components/ZenithComplianceTab';
import { EventSnapshotModal } from './components/EventSnapshotModal';
import {
  INITIAL_SOVEREIGN_EVENTS,
  INITIAL_BYZANTINE_NODES,
  INITIAL_MESH_LINKS,
  generateDeterministicEvent,
} from './data/initialData';
import { SovereignEvent, ByzantineNode, MeshLink, SwarmLoad } from './types';

export default function App() {
  const [events, setEvents] = useState<SovereignEvent[]>(INITIAL_SOVEREIGN_EVENTS);
  const [isLiveRunning, setIsLiveRunning] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<MainTab>('FEED');
  const [selectedEventForModal, setSelectedEventForModal] = useState<SovereignEvent | null>(null);

  const [nodes, setNodes] = useState<ByzantineNode[]>(INITIAL_BYZANTINE_NODES);
  const [links, setLinks] = useState<MeshLink[]>(INITIAL_MESH_LINKS);
  const [activeChaosType, setActiveChaosType] = useState<string | null>(null);

  const [swarmLoad, setSwarmLoad] = useState<SwarmLoad>({
    ceo: 24,
    worker: 73,
    auditor: 43,
    crypto: 35,
  });

  // Emit a new deterministic event
  const handleEmitEvent = () => {
    const highestSeq = events.length > 0 ? events[0].sequenceNumber : 1015;
    const newEvent = generateDeterministicEvent(highestSeq);
    setEvents((prev) => [newEvent, ...prev]);

    // Micro fluctuations in swarm load
    setSwarmLoad({
      ceo: Math.min(95, Math.max(15, 24 + Math.floor(Math.random() * 8 - 4))),
      worker: Math.min(95, Math.max(40, 73 + Math.floor(Math.random() * 16 - 8))),
      auditor: Math.min(95, Math.max(20, 43 + Math.floor(Math.random() * 10 - 5))),
      crypto: Math.min(95, Math.max(20, 35 + Math.floor(Math.random() * 8 - 4))),
    });
  };

  // Live background agent event runner (interval)
  useEffect(() => {
    if (!isLiveRunning) return;

    const interval = setInterval(() => {
      handleEmitEvent();
    }, 4500);

    return () => clearInterval(interval);
  }, [isLiveRunning, events]);

  // Chaos injection handler
  const handleTriggerChaos = (type: 'LATENCY' | 'PARTITION' | 'CORRUPTION' | 'ACL_TAMPER' | 'HEAL') => {
    setActiveChaosType(type === 'HEAL' ? null : type);

    if (type === 'LATENCY') {
      setLinks((prev) =>
        prev.map((l) =>
          (l.source === 'TOK' && l.target === 'VIR') || (l.source === 'VIR' && l.target === 'TOK')
            ? { ...l, rttMs: 252.1, jitterMs: 14.8, status: 'CHAOS_INJECTED' }
            : l
        )
      );
      setNodes((prev) =>
        prev.map((n) => (n.code === 'TOK' ? { ...n, rttMs: 1.82, status: 'DEGRADED' } : n))
      );
    } else if (type === 'PARTITION') {
      setNodes((prev) =>
        prev.map((n) =>
          n.code === 'ZUR' || n.code === 'REY'
            ? { ...n, status: 'PARTITIONED', bftVote: 'PARTITIONED' }
            : n
        )
      );
      setLinks((prev) =>
        prev.map((l) =>
          l.source === 'ZUR' || l.target === 'ZUR' || l.source === 'REY' || l.target === 'REY'
            ? { ...l, packetLoss: 100, status: 'SEVERED' }
            : l
        )
      );
    } else if (type === 'CORRUPTION') {
      setNodes((prev) =>
        prev.map((n) =>
          n.code === 'SIN' ? { ...n, status: 'CORRUPTED', lastBlockFNV: '0xDEADBEEF' } : n
        )
      );
    } else if (type === 'ACL_TAMPER') {
      // Swarm auditor alerts
      setSwarmLoad((prev) => ({ ...prev, auditor: 98, crypto: 89 }));
    } else if (type === 'HEAL') {
      setNodes(INITIAL_BYZANTINE_NODES);
      setLinks(INITIAL_MESH_LINKS);
      setSwarmLoad({ ceo: 24, worker: 73, auditor: 43, crypto: 35 });
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-900 selection:text-white">
      {/* Top Kernel Status Bar */}
      <TopStatusBar
        isLiveRunning={isLiveRunning}
        onToggleLive={() => setIsLiveRunning(!isLiveRunning)}
        onEmitEvent={handleEmitEvent}
        swarmLoad={swarmLoad}
        nodes={nodes}
        onOpenReplayModal={() => {
          if (events.length > 0) {
            setSelectedEventForModal(events[0]);
          }
        }}
      />

      {/* Main Navigation Tabs */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        eventCount={events.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'FEED' && (
          <GameplayFeedTab
            events={events}
            onSelectEvent={(ev) => setSelectedEventForModal(ev)}
          />
        )}

        {activeTab === 'COGNITION' && <GameCognitionTab />}

        {activeTab === 'MISSION_CONTROL' && (
          <MissionControlTab
            nodes={nodes}
            links={links}
            onTriggerChaos={handleTriggerChaos}
            activeChaosType={activeChaosType}
          />
        )}

        {activeTab === 'OMNI_MATRIX' && <OmniMatrixTab />}

        {activeTab === 'WIRE_DRIVERS' && <WireProtocolsDriversTab />}

        {activeTab === 'ZENITH_SCORECARD' && <ZenithComplianceTab />}
      </main>

      {/* Replay & Snapshot Inspection Modal */}
      {selectedEventForModal && (
        <EventSnapshotModal
          event={selectedEventForModal}
          onClose={() => setSelectedEventForModal(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04060d] py-4 px-6 text-center text-xs font-mono-code text-slate-500">
        SOVEREIGN INFINITY v4.8 / v5.0 · NIST PQC ML-KEM-768 · MERKLE AUDIT SPINE · (= replayed live) ✓ VERIFIED DETERMINISTIC
      </footer>
    </div>
  );
}
