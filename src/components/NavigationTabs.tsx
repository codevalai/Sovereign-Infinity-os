import React from 'react';
import { Radio, Brain, Shield, Globe, Award, Binary } from 'lucide-react';

export type MainTab = 'FEED' | 'COGNITION' | 'MISSION_CONTROL' | 'OMNI_MATRIX' | 'WIRE_DRIVERS' | 'ZENITH_SCORECARD';

interface NavigationTabsProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
  eventCount: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  eventCount,
}) => {
  const tabs = [
    {
      id: 'FEED' as MainTab,
      label: 'Gameplay News Feed',
      icon: Radio,
      badge: `${eventCount} Events`,
    },
    {
      id: 'COGNITION' as MainTab,
      label: 'Game Cognition (7 Layers)',
      icon: Brain,
      badge: '7 Layers Active',
    },
    {
      id: 'MISSION_CONTROL' as MainTab,
      label: 'Tier 100 Mission Control',
      icon: Shield,
      badge: '5-City BFT Mesh',
    },
    {
      id: 'OMNI_MATRIX' as MainTab,
      label: 'v5.0 Omni-Matrix (250 Cities)',
      icon: Globe,
      badge: '100k Swarm',
    },
    {
      id: 'WIRE_DRIVERS' as MainTab,
      label: 'Wire Speed & Drivers (IPC / eBPF / CLI)',
      icon: Binary,
      badge: 'Zero-Copy 12ns',
    },
    {
      id: 'ZENITH_SCORECARD' as MainTab,
      label: 'Phase Zenith Scorecard & Legal',
      icon: Award,
      badge: '11/10 Realism',
    },
  ];

  return (
    <div className="border-b border-slate-800 bg-[#060a15] px-4">
      <nav className="flex items-center space-x-1 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? 'bg-slate-800/90 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-950'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono-code ${
                  isActive
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                    : 'bg-slate-800/60 text-slate-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
