import React, { useState, useMemo } from 'react';
import { Card, Button } from '@/src/components/ui';
import { 
  ArrowLeft, 
  Flame, 
  Droplets, 
  Zap, 
  ShieldAlert, 
  AlertCircle,
  Activity,
  ChevronRight,
  Wind,
  WifiOff,
  Search,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SafetyGuideScreen({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 'flood',
      icon: <Droplets className="w-6 h-6" />,
      title: 'Water / Flooding',
      points: [
        'Move to higher ground. Avoid basements and low-lying ground.',
        'Never walk, swim, or drive through moving water.',
        'If trapped in building: Stay internal, move high, signal for help.',
        'Stay away from bridges over fast-moving water (risk of structural failure).'
      ],
      color: 'blue',
      glow: 'glow-blue',
      tags: ['tsunami', 'flash', 'drowning', 'water', 'flood']
    },
    {
      id: 'fire',
      icon: <Flame className="w-6 h-6" />,
      title: 'Fire / Smoke',
      points: [
        'STAY LOW: Crawl under smoke to maintain visibility and oxygen.',
        'Feel doors with back of hand before opening. If hot, use secondary exit.',
        'STOP - DROP - ROLL if clothing catches fire.',
        'Once outside, STAY OUT. Never re-enter for belongings.'
      ],
      color: 'warning',
      glow: 'shadow-[0_0_15px_rgba(138,84,0,0.3)]',
      tags: ['burn', 'smoke', 'wildfire', 'blaze', 'fire', 'flames']
    },
    {
      id: 'earthquake',
      icon: <Activity className="w-6 h-6" />,
      title: 'Earthquake',
      points: [
        'DROP, COVER, and HOLD ON under a sturdy desk or table.',
        'Stay away from windows, glass, and exterior walls.',
        'If outside, move to an open area away from buildings, trees, and power lines.',
        'Expect aftershocks. Be ready to take cover again.'
      ],
      color: 'blue',
      glow: 'glow-blue',
      tags: ['tremor', 'seismic', 'shaking', 'quake', 'earthquake']
    },
    {
      id: 'electrical',
      icon: <Zap className="w-6 h-6" />,
      title: 'Grid / Electric',
      points: [
        'Assume all downed wires are ENERGIZED. Stay back 10 meters.',
        'If wire falls on car: STAY INSIDE until power is cut.',
        'Shuffle walk (small steps, feet touching) to exit a high-voltage zone.',
        'Do not touch anyone who is in contact with a power source.'
      ],
      color: 'slate',
      glow: 'shadow-[0_0_15px_rgba(92,107,130,0.3)]',
      tags: ['power', 'electrocution', 'outage', 'wire', 'grid', 'electric']
    },
    {
      id: 'hazardous',
      icon: <ShieldAlert className="w-6 h-6" />,
      title: 'Hazardous Materials',
      points: [
        'Stay upwind and uphill from the incident.',
        'If indoors and instructed to shelter, close all windows, doors, and vents.',
        'Turn off AC/Heating systems that pull air from outside.',
        'If exposed, remove contaminated clothing and wash with soap and water.'
      ],
      color: 'critical',
      glow: 'glow-critical',
      tags: ['chemical', 'spill', 'toxin', 'poison', 'gas', 'hazmat', 'hazardous']
    },
    {
      id: 'gas',
      icon: <Flame className="w-6 h-6" />,
      title: 'Gas Leak',
      points: [
        'Extinguish all open flames. DO NOT use electrical switches, appliances, or mobile phones near the leak.',
        'Evacuate the building immediately, leaving doors open to ventilate.',
        'Turn off the main gas supply valve if it is safe and you know how.',
        'Call emergency services or the utility company only after reaching a safe, outside distance.'
      ],
      color: 'warning',
      glow: 'shadow-[0_0_15px_rgba(138,84,0,0.3)]',
      tags: ['gas', 'leak', 'smell', 'combustible', 'explosion']
    },
    {
      id: 'weather',
      icon: <Wind className="w-6 h-6" />,
      title: 'Severe Weather / Storms',
      points: [
        'Seek shelter immediately in a sturdy building.',
        'For tornadoes, go to the lowest floor, away from windows and exterior walls.',
        'Avoid large span roofs (e.g., gymnasiums, auditoriums).',
        'Protect your head and neck with your arms or heavy blankets.'
      ],
      color: 'slate',
      glow: 'shadow-[0_0_15px_rgba(92,107,130,0.3)]',
      tags: ['hurricane', 'tornado', 'cyclone', 'lightning', 'storm', 'weather']
    },
    {
      id: 'threat',
      icon: <ShieldAlert className="w-6 h-6" />,
      title: 'Active Threat',
      points: [
        'RUN: Have an escape route and plan in mind. Leave belongings behind.',
        "HIDE: Hide in an area out of the attacker's view. Block entry and lock doors.",
        'Silence your phone completely (including vibration).',
        'FIGHT: As an absolute last resort and only when your life is in imminent danger.'
      ],
      color: 'critical',
      glow: 'glow-critical',
      tags: ['shooter', 'attacker', 'terrorist', 'active', 'threat', 'violence']
    },
    {
      id: 'cyber',
      icon: <WifiOff className="w-6 h-6" />,
      title: 'Cyber Attack / Breach',
      points: [
        'Disconnect compromised devices from the local network and internet immediately to prevent lateral spread.',
        'Do not power off devices unless instructed by IT; this preserves volatile memory for forensics.',
        'Disconnect backup drives and block remote access to cloud backups.',
        'Notify IT or Incident Response Team via an out-of-band communication channel (e.g., cell phones).'
      ],
      color: 'blue',
      glow: 'glow-blue',
      tags: ['hack', 'ransomware', 'cyber', 'breach', 'virus', 'malware']
    },
    {
      id: 'lost',
      icon: <MapPin className="w-6 h-6" />,
      title: 'Lost / Stranded',
      points: [
        'S.T.O.P: Stop, Think, Observe, Plan. Do not panic and do not keep moving aimlessly.',
        'Stay put. It reduces the search area and conserves your energy.',
        'Make yourself visible and audible. Use a whistle, mirror, or brightly colored clothing.',
        'Build a shelter and insulate yourself from the ground. Prioritize warmth and water over food.'
      ],
      color: 'slate',
      glow: 'shadow-[0_0_15px_rgba(92,107,130,0.3)]',
      tags: ['wilderness', 'lost', 'stranded', 'survival', 'hiking', 'woods', 'desert']
    },
    {
      id: 'medical',
      icon: <Activity className="w-6 h-6" />,
      title: 'First Response',
      points: [
        'Check for danger before approaching casualty.',
        'Control severe bleeding with direct pressure.',
        'If unconscious but breathing: Recovery position.',
        'Keep patient warm and calm while awaiting professional EMS.'
      ],
      color: 'success',
      glow: 'shadow-[0_0_15px_rgba(19,121,91,0.3)]',
      tags: ['cpr', 'bleeding', 'injury', 'trauma', 'first', 'aid', 'medical']
    }
  ];

  const filteredGuides = useMemo(() => {
    if (!searchQuery.trim()) return guides;
    const query = searchQuery.toLowerCase();
    return guides.filter(guide => 
      guide.title.toLowerCase().includes(query) || 
      guide.tags.some(tag => tag.includes(query)) ||
      guide.points.some(point => point.toLowerCase().includes(query))
    );
  }, [searchQuery, guides]);

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-6xl flex-col bg-cloud px-4 pb-6 pt-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <button onClick={onBack} className="flex items-center gap-2 rounded-xl border border-mist/40 bg-surface/50 px-3 py-2 text-slate transition-colors hover:border-cyan-brand/40 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Home</span>
        </button>
        <div className="min-w-0 text-right">
          <h1 className="truncate text-xl font-bold tracking-tight text-white">Safety Guide</h1>
          <p className="text-[9px] text-slate font-mono uppercase tracking-widest">Offline emergency basics</p>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate" />
        </div>
        <input
          type="text"
          placeholder="Search protocols..."
          className="w-full bg-surface/80 border border-mist hover:border-cyan-brand/50 focus:border-cyan-brand focus:outline-none text-white text-xs font-mono uppercase tracking-widest rounded-xl py-3 pl-10 pr-4 transition-colors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {/* Urgent Warning */}
        {!searchQuery && (
          <div className="relative group overflow-hidden rounded-2xl glow-critical mb-2">
            <div className="absolute inset-0 bg-critical/10 animate-pulse-slow"></div>
            <Card className="p-5 border-critical bg-surface/80 backdrop-blur-sm flex items-start gap-4 relative z-10 rounded-2xl border-2">
              <div className="w-10 h-10 rounded-full bg-critical/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <ShieldAlert className="w-6 h-6 text-critical" />
              </div>
              <div>
                <p className="text-xs font-black text-critical uppercase tracking-[0.1em] mb-1">Emergency Override</p>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  If lives are in immediate peril, <span className="text-critical font-bold underline">DIAL 112 / 911</span>. 
                  Do not rely on software during active life-threat events.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Directory Header */}
        {!searchQuery && (
          <h2 className="text-[10px] font-bold text-slate uppercase tracking-widest px-1 py-1 flex items-center gap-2">
            <span className="w-1 h-3 bg-blue rounded-full"></span>
            Incident Response Protocols
          </h2>
        )}
        {searchQuery && (
          <h2 className="text-[10px] font-bold text-slate uppercase tracking-widest px-1 py-1 flex items-center gap-2">
            <span className="w-1 h-3 bg-cyan-brand rounded-full"></span>
            Search Results ({filteredGuides.length})
          </h2>
        )}

        {/* Tactical Cards */}
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredGuides.map((guide) => (
            <motion.div
              layout
              key={guide.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card 
                className={`overflow-hidden transition-all duration-300 rounded-xl border-mist/30 ${
                  activeCategory === guide.id ? `bg-surface border-${guide.color}/50 ${guide.glow}` : 'bg-surface/40 hover:bg-surface/60 border'
                }`}
              >
                <button 
                  onClick={() => setActiveCategory(activeCategory === guide.id ? null : guide.id)}
                  className="w-full p-4 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      activeCategory === guide.id ? `bg-${guide.color} text-white shadow-lg` : `bg-${guide.color}/10 text-${guide.color}`
                    }`}>
                      {guide.icon}
                    </div>
                    <div>
                      <h3 className={`text-sm font-bold uppercase tracking-widest transition-colors ${activeCategory === guide.id ? 'text-white' : 'text-slate'}`}>
                        {guide.title}
                      </h3>
                      {!activeCategory && (
                        <p className="text-[9px] text-slate/60 font-mono uppercase tracking-widest mt-0.5">
                          {guide.points.length} Action Points
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-slate transition-transform duration-300 ${activeCategory === guide.id ? 'rotate-90 text-white' : 'group-hover:translate-x-1'}`} />
                </button>

                <AnimatePresence>
                  {activeCategory === guide.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="px-5 pb-5 pt-1 space-y-4 text-slate">
                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-mist to-transparent mb-4"></div>
                        {guide.points.map((point, idx) => (
                          <div key={idx} className="flex gap-4 group/point">
                            <div className="flex flex-col items-center pt-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full bg-${guide.color} group-hover/point:scale-150 transition-transform`}></div>
                              <div className="w-[1px] h-full bg-mist/50 mt-1"></div>
                            </div>
                            <p className="text-xs text-white/80 leading-relaxed font-medium pb-2">
                              {point}
                            </p>
                          </div>
                        ))}
                        <div className={`mt-4 p-3 rounded-lg bg-${guide.color}/5 border border-${guide.color}/10 flex items-center gap-3`}>
                          <AlertCircle className={`w-4 h-4 text-${guide.color}`} />
                          <span className={`text-[10px] italic font-bold text-${guide.color}/80 uppercase tracking-widest`}>
                            Verify safety before deployment
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
          {filteredGuides.length === 0 && (
            <div className="py-8 text-center border border-mist/30 rounded-xl bg-surface/30">
               <ShieldAlert className="w-8 h-8 text-slate mx-auto mb-3" />
               <p className="text-xs font-mono uppercase text-slate tracking-widest">No matching protocols found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-4 py-4 rounded-xl border border-mist/30 bg-surface/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue/10 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-blue" />
          </div>
          <p className="text-[9px] text-slate font-mono uppercase leading-tight">
            Sync Status: <span className="text-success">Live</span><br/>
            Ref: SP-FIELD-2026
          </p>
        </div>
        <button onClick={onBack} className="text-[9px] font-bold text-blue uppercase tracking-widest border-b border-blue/30 pb-0.5 hover:text-white hover:border-white transition-all">
          Home Base
        </button>
      </div>
    </div>
  );
}
