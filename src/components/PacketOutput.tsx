import React, { useState } from 'react';
import { Card, Button, Badge } from '@/src/components/ui';
import { CrisisPacket } from '@/src/types';
import { ShieldAlert, Copy, Check, Globe, MessageSquare, Smartphone, Download, Mail, Printer, MapPin, RadioTower } from 'lucide-react';
import Markdown from 'react-markdown';
import { downloadAsFile, nativeShare, sendEmail, shareToWhatsApp } from '@/src/utils/export';
import { PacketAITrace } from './PacketAITrace';

export function PacketOutputScreen({ packet, onDone }: { packet?: CrisisPacket; onDone: () => void }) {
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ro'>('en');

  if (!packet) return null;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(language === 'en' ? packet.share_message_short : (packet.share_message_short_local || packet.share_message_short));
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const isCritical = packet.severity === 'critical';
  const actions = language === 'en' ? packet.immediate_actions : (packet.immediate_actions_local || packet.immediate_actions);
  const shareMsg = language === 'en' ? packet.share_message_short : (packet.share_message_short_local || packet.share_message_short);
  const markdownReport = language === 'en' ? packet.structured_report_markdown : (packet.structured_report_markdown_local || packet.structured_report_markdown);
  const displayPacketId = packet.packet_id || packet.id || 'local-pending';

  const googleMapsLink = (packet.lat && packet.lng) ? `https://www.google.com/maps/search/?api=1&query=${packet.lat},${packet.lng}` : null;
  const sosMsg = `SOS! I am at ${packet.location_text}. ${packet.share_message_short} Location: ${googleMapsLink || 'Unknown'}`;

  const handleNativeShare = async () => {
    await nativeShare('SignalPack Emergency Report', shareMsg);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownloadMarkdown = () => {
     downloadAsFile(`SignalPack_Report_${Date.now()}.md`, markdownReport);
  };

  const handleDownloadJSON = () => {
     downloadAsFile(`SignalPack_Report_${Date.now()}.json`, JSON.stringify(packet, null, 2), 'application/json');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col bg-cloud px-4 pb-10 md:px-6 md:pt-6 lg:px-8">
      
      {/* Report Container */}
      <div className="mx-auto w-full max-w-4xl flex-1 overflow-hidden bg-surface print:bg-white print:text-black md:rounded-b-3xl md:border md:border-mist/50 md:shadow-2xl">
      
        {/* Header / Severity (Print friendly) */}
        <div className={`sticky top-0 z-10 px-5 py-5 border-b print:border-b-2 print:border-black ${isCritical ? 'bg-critical text-white border-critical' : packet.severity === 'high' ? 'bg-warning text-white border-warning' : 'bg-surface text-white border-mist'}`}>
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <ShieldAlert className="w-6 h-6" />
                 <span className="font-bold font-display uppercase tracking-widest text-lg">{packet.severity} SEVERITY REPORT</span>
              </div>
              {isCritical && (
                 <Badge className="bg-white text-critical border-none print:hidden">Call 112</Badge>
              )}
           </div>
        </div>

        <div className="px-5 py-8 space-y-8 flex-1 print:p-0 print:py-4">
           
           <div className="flex justify-between items-start print:hidden">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                  <span className={`w-2 h-8 ${isCritical ? 'bg-critical' : 'bg-blue'}`}></span>
                  CRISIS PACKET
                </h1>
                <p className="text-slate font-mono text-xs uppercase tracking-widest ml-4">ID: {displayPacketId} • {new Date().toISOString().split('T')[0]}</p>
              </div>
              <button 
                 onClick={() => setLanguage(l => l === 'en' ? 'ro' : 'en')}
                 className="flex items-center text-[10px] font-bold text-slate bg-mist/30 px-3 py-2 rounded-lg uppercase tracking-widest hover:bg-mist transition-colors"
              >
                 <Globe className="w-4 h-4 mr-1.5" />
                 {language === 'en' ? `EN / ${navigator.language?.split('-')[0].toUpperCase() || 'LOCAL'}` : `${navigator.language?.split('-')[0].toUpperCase() || 'LOCAL'} / EN`}
              </button>
           </div>

           {/* Summary Section */}
           <section className="print:mt-6">
              <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3 print:text-black">Incident Overview</h2>
              <Card className="p-5 border-mist/50 bg-cloud shadow-inner rounded-2xl print:border-black print:border-2 print:bg-white print:shadow-none">
                 <div className="flex justify-between items-start gap-4 mb-3">
                   <p className="text-white font-medium text-lg print:text-black">"{packet.location_text || 'Unknown Location'}"</p>
                   {googleMapsLink && (
                     <a href={googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex-none p-2 bg-blue/10 text-blue hover:bg-blue/20 rounded-xl transition-colors border border-blue/20 print:hidden">
                       <MapPin className="w-5 h-5" />
                     </a>
                   )}
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 pt-4 border-t border-mist/30 print:border-black/50">
                   <div>
                     <p className="text-[10px] text-slate uppercase tracking-widest mb-1 print:text-gray-600">Incident Type</p>
                     <p className="text-blue font-mono font-bold uppercase print:text-black">{(packet.incident_type || 'unclassified').replace('_', ' ')}</p>
                   </div>
                   <div>
                     <p className="text-[10px] text-slate uppercase tracking-widest mb-1 print:text-gray-600">Persons at Risk</p>
                     <p className="text-white font-mono font-bold uppercase print:text-black">{packet.people_at_risk_count}</p>
                   </div>
                 </div>
                 {packet.lat && packet.lng && (
                   <div className="mt-4 pt-4 border-t border-mist/30 print:hidden relative h-32 rounded-xl overflow-hidden bg-surface group">
                     {/* Simulated Map Background */}
                     <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #3B82F6 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          {/* Pulsing rings */}
                          <div className={`absolute -inset-4 rounded-full ${isCritical ? 'bg-critical/20' : 'bg-blue/20'} animate-ping opacity-75`}></div>
                          <div className={`absolute -inset-2 rounded-full ${isCritical ? 'bg-critical/30' : 'bg-blue/30'} animate-pulse`}></div>
                          {/* Center blip */}
                          <div className={`w-3 h-3 rounded-full ${isCritical ? 'bg-critical shadow-[0_0_15px_rgba(239,68,68,1)]' : 'bg-blue shadow-[0_0_15px_rgba(59,130,246,1)]'} relative z-10`}></div>
                        </div>
                     </div>
                     <a href={googleMapsLink || '#'} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-sm">
                       <span className="text-white font-bold tracking-widest text-xs uppercase flex items-center gap-2">
                         <MapPin className="w-4 h-4" /> Open in Maps
                       </span>
                     </a>
                     <div className="absolute bottom-2 left-2 text-[8px] font-mono uppercase tracking-widest text-slate bg-black/50 px-1.5 py-0.5 rounded">
                       {packet.lat.toFixed(4)}, {packet.lng.toFixed(4)}
                     </div>
                   </div>
                 )}
              </Card>
           </section>

           <PacketAITrace packet={packet} />

           {/* Immediate Actions */}
           <section>
              <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3 print:text-black">{language === 'en' ? 'Immediate Actions' : 'Acțiuni Imediate'}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:grid-cols-1">
                 {actions.map((action, idx) => (
                    <Card key={idx} className={`flex items-start gap-3 p-4 bg-cloud rounded-2xl border ${isCritical ? 'border-critical/30 sm:border-l-critical' : 'border-blue/30 sm:border-l-blue'} print:border-black print:rounded-none`}>
                       <span className={`${isCritical ? 'text-critical' : 'text-blue'} font-mono text-lg leading-none print:text-black`}>0{idx + 1}</span>
                       <p className="text-sm font-medium text-white print:text-black">{action}</p>
                    </Card>
                 ))}
              </div>
           </section>

           {/* Structured Details */}
           <section>
              <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3 print:text-black">{language === 'en' ? 'Detailed Report' : 'Raport Detaliat'}</h2>
              <Card className="p-5 border-mist/50 bg-cloud rounded-2xl print:border-black print:border-2 print:bg-white print:shadow-none">
                 <div className="prose prose-sm prose-invert max-w-none print:prose-p:text-black print:prose-headings:text-black">
                    <div className="markdown-body font-sans text-white/90 space-y-4 print:text-black print:space-y-2">
                       <Markdown>{markdownReport}</Markdown>
                    </div>
                 </div>
              </Card>
           </section>

           {/* Share & Export Capabilities - hidden on print */}
           <section className="print:hidden">
              <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue rounded-full"></span> 
                Distribute / Share
              </h2>
              
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => shareToWhatsApp(shareMsg)} className="flex items-center justify-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition group">
                       <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.06-.173-.299-.018-.461.13-.611.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                       <span className="text-[#25D366] text-xs font-bold tracking-widest uppercase">WhatsApp</span>
                    </button>
                    <button onClick={() => sendEmail('Emergency Incident Report', shareMsg + '\n\n' + markdownReport)} className="flex items-center justify-center gap-3 p-4 rounded-xl bg-blue/10 border border-blue/30 hover:bg-blue/20 transition group">
                       <Mail className="w-5 h-5 text-blue group-hover:scale-110 transition-transform" />
                       <span className="text-blue text-xs font-bold tracking-widest uppercase">Email</span>
                    </button>
                    {navigator.share && (
                       <button onClick={handleNativeShare} className="col-span-2 flex items-center justify-center gap-3 p-4 rounded-xl bg-surface border border-mist hover:bg-mist/30 transition group">
                          <Smartphone className="w-5 h-5 text-slate group-hover:text-white transition-colors" />
                          <span className="text-slate group-hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">More Options</span>
                       </button>
                    )}
                 </div>

                 <button onClick={() => shareToWhatsApp(sosMsg)} className="w-full h-16 flex items-center justify-center gap-3 p-5 rounded-2xl bg-critical text-white hover:bg-critical/90 transition shadow-lg glow-critical active:scale-[0.98] group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                    <RadioTower className="w-6 h-6 animate-pulse-slow" /> 
                    <span className="text-sm font-black tracking-[0.2em] uppercase relative z-10 drop-shadow-md">Broadcast SOS Pulse</span>
                 </button>

                 <Card className="flex flex-col bg-cloud border border-mist/50 mt-4 rounded-xl overflow-hidden focus-within:border-blue/50 transition-colors">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-mist/30 bg-surface/50">
                       <span className="text-[10px] text-slate font-mono uppercase tracking-widest flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Quick Share Text
                       </span>
                       <button onClick={handleCopyMessage} className="text-blue hover:text-blue/80 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-blue/10 rounded">
                          {copiedMsg ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedMsg ? 'Copied!' : 'Copy'}
                       </button>
                    </div>
                    <div className="p-4 text-xs font-mono text-white/80 leading-relaxed select-all">
                       {shareMsg}
                    </div>
                 </Card>
              </div>
           </section>

           {/* Export Hub - hidden on print */}
           <section className="print:hidden mt-8 pt-8 border-t border-mist/50">
               <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-4 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-slate rounded-full"></span> 
                 Export Assets
               </h2>
               <div className="flex flex-wrap gap-3">
                  <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-mist/60 bg-surface hover:bg-mist/30 text-[10px] font-bold uppercase tracking-widest text-white transition group">
                     <Printer className="w-4 h-4 text-slate group-hover:text-white transition-colors" /> Save PDF
                  </button>
                  <button onClick={handleDownloadMarkdown} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-mist/60 bg-surface hover:bg-mist/30 text-[10px] font-bold uppercase tracking-widest text-white transition group">
                     <Download className="w-4 h-4 text-slate group-hover:text-white transition-colors" /> Export .MD
                  </button>
                  <button onClick={handleDownloadJSON} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-mist/60 bg-surface hover:bg-mist/30 text-[10px] font-bold uppercase tracking-widest text-white transition group">
                     <Download className="w-4 h-4 text-slate group-hover:text-white transition-colors" /> JSON Dump
                  </button>
               </div>
           </section>

        </div>
      </div>

      <div className="mx-auto mt-auto w-full max-w-4xl px-5 pt-6 print:hidden">
         <Button fullWidth onClick={onDone} variant="outline" className="h-12 border-mist/60 text-slate hover:text-white uppercase tracking-widest font-bold text-xs bg-surface/50">
            Create Another Report
         </Button>
      </div>

    </div>
  );
}
