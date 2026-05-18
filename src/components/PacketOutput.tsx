import React, { useState } from 'react';
import { Card, Button, Badge } from '@/src/components/ui';
import { CrisisPacket } from '@/src/types';
import { ShieldAlert, Copy, Check, Globe, MessageSquare, Smartphone, Download, Mail, Printer, MapPin, RadioTower, ArrowLeft, Maximize2, PlusCircle } from 'lucide-react';
import Markdown from 'react-markdown';
import { copyText, downloadAsFile, nativeShare, sendEmail, shareToWhatsApp } from '@/src/utils/export';
import { PacketAITrace } from './PacketAITrace';

export function PacketOutputScreen({
  packet,
  evidenceImage,
  evidenceAudio,
  onDone,
  onNewReport,
}: {
  packet?: CrisisPacket;
  evidenceImage?: string;
  evidenceAudio?: string;
  onDone: () => void;
  onNewReport?: () => void;
}) {
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ro'>('en');

  if (!packet) return null;

  const handleCopyMessage = async () => {
    await copyText(language === 'en' ? packet.share_message_short : (packet.share_message_short_local || packet.share_message_short));
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const isCritical = packet.severity === 'critical';
  const actions = language === 'en' ? packet.immediate_actions : (packet.immediate_actions_local || packet.immediate_actions);
  const safeActions = Array.isArray(actions) && actions.length > 0 ? actions : ['Review the incident details and call emergency services if anyone is in immediate danger.'];
  const shareMsg = (language === 'en' ? packet.share_message_short : (packet.share_message_short_local || packet.share_message_short)) || 'SignalPack Crisis Packet generated. Review before sharing.';
  const markdownReport = (language === 'en' ? packet.structured_report_markdown : (packet.structured_report_markdown_local || packet.structured_report_markdown)) || '# SignalPack Crisis Packet\n\nReview packet details before sharing.';
  const displayPacketId = packet.packet_id || packet.id || 'local-pending';
  const hasEvidence = !!evidenceImage || !!evidenceAudio || !!packet.evidence?.text_summary;
  const shouldCallNow = isCritical || safeActions.some((action) => /112|911|emergency services now|call emergency/i.test(action));
  const emergencyDecision = shouldCallNow
    ? (language === 'ro'
      ? 'Sunați la 112 acum dacă cineva este rănit, blocat, nu poate pleca în siguranță sau pericolul crește.'
      : 'Call 112/911 now if anyone is injured, trapped, unable to leave safely, or the danger is escalating.')
    : (language === 'ro'
      ? 'Dacă toată lumea este în siguranță, monitorizați și apelați 112 doar dacă pericolul crește.'
      : 'If everyone is safe, monitor and call 112/911 only if danger escalates.');

  const googleMapsLink = (packet.lat && packet.lng) ? `https://www.google.com/maps/search/?api=1&query=${packet.lat},${packet.lng}` : null;
  const sosMsg = `SOS! I am at ${packet.location_text}. ${packet.share_message_short} Location: ${googleMapsLink || 'Unknown'}`;
  const emailBody = buildEmailBody({
    packet,
    displayPacketId,
    shareMsg,
    markdownReport,
    actions: safeActions,
    googleMapsLink,
    hasEvidence,
  });
  const htmlReport = buildHtmlReport({
    packet,
    displayPacketId,
    shareMsg,
    markdownReport,
    actions: safeActions,
    googleMapsLink,
    evidenceImage,
    evidenceAudio,
  });

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

  const handleDownloadHTML = () => {
    downloadAsFile(`SignalPack_Report_${Date.now()}.html`, htmlReport, 'text/html');
  };

  const handleFullscreen = async () => {
    const target = document.getElementById('signalpack-packet-report') || document.documentElement;
    if (!document.fullscreenElement && target.requestFullscreen) {
      await target.requestFullscreen().catch(() => {});
      return;
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col bg-cloud px-4 pb-8 pt-4 md:px-6 md:pt-6 lg:px-8">
      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-mist/40 bg-surface/65 p-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-brand">Crisis Packet</p>
          <h1 className="mt-1 truncate text-lg font-bold text-white sm:text-xl">Review before sharing</h1>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex sm:shrink-0">
          <button
            type="button"
            onClick={onDone}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-mist/50 bg-cloud/70 px-3 text-[10px] font-bold uppercase tracking-widest text-slate transition-colors hover:border-cyan-brand/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <button
            type="button"
            onClick={onNewReport || onDone}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue/30 bg-blue/10 px-3 text-[10px] font-bold uppercase tracking-widest text-blue transition-colors hover:bg-blue/15"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New</span>
          </button>
          <button
            type="button"
            onClick={handleFullscreen}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-mist/50 bg-cloud/70 px-3 text-[10px] font-bold uppercase tracking-widest text-slate transition-colors hover:border-cyan-brand/40 hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
            <span className="hidden sm:inline">Full</span>
          </button>
        </div>
      </div>
      
      {/* Report Container */}
      <div id="signalpack-packet-report" className="mx-auto w-full max-w-4xl flex-1 overflow-hidden bg-surface print:bg-white print:text-black md:rounded-3xl md:border md:border-mist/50 md:shadow-2xl">
      
        {/* Header / Severity (Print friendly) */}
        <div className={`sticky top-0 z-10 border-b px-4 py-4 print:border-b-2 print:border-black sm:px-5 sm:py-5 ${isCritical ? 'bg-critical text-white border-critical' : packet.severity === 'high' ? 'bg-warning text-white border-warning' : 'bg-surface text-white border-mist'}`}>
           <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                 <ShieldAlert className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" />
                 <span className="min-w-0 text-sm font-bold uppercase tracking-widest sm:text-lg">{packet.severity} severity report</span>
              </div>
              {isCritical && (
                 <Badge className="shrink-0 border-none bg-white text-critical print:hidden">Call 112</Badge>
              )}
           </div>
        </div>

        <div className="px-5 py-8 space-y-8 flex-1 print:p-0 print:py-4">
           
           <div className="flex min-w-0 items-start justify-between gap-3 print:hidden">
              <div className="min-w-0">
                <h1 className="mb-1 flex min-w-0 items-center gap-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  <span className={`w-2 h-8 ${isCritical ? 'bg-critical' : 'bg-blue'}`}></span>
                  CRISIS PACKET
                </h1>
                <p className="ml-4 truncate font-mono text-[10px] uppercase tracking-widest text-slate sm:text-xs">ID: {displayPacketId} • {new Date().toISOString().split('T')[0]}</p>
                <p className="ml-4 mt-1 truncate font-mono text-[9px] uppercase tracking-widest text-slate/80 sm:text-[10px]">
                  App v{packet.app_version || '1.0.0'} • Schema v{packet.packet_schema_version || '1.0'}
                </p>
              </div>
              <button 
                 onClick={() => setLanguage(l => l === 'en' ? 'ro' : 'en')}
                 className="flex items-center text-[10px] font-bold text-slate bg-mist/30 px-3 py-2 rounded-lg uppercase tracking-widest hover:bg-mist transition-colors"
              >
                 <Globe className="w-4 h-4 mr-1.5" />
                 {language === 'en' ? 'EN / RO' : 'RO / EN'}
              </button>
           </div>

           {hasEvidence && (
             <section>
                <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3 print:text-black">Evidence</h2>
                <Card className="overflow-hidden border-mist/50 bg-cloud rounded-2xl print:border-black print:border-2 print:bg-white print:shadow-none">
                  {evidenceImage && (
                    <img
                      src={evidenceImage}
                      alt="Incident evidence"
                      className="h-56 w-full object-cover object-center sm:h-64 print:h-48"
                    />
                  )}
                  <div className="space-y-3 p-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl border border-mist/35 bg-surface/60 px-3 py-2 print:border-black print:bg-white">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-slate print:text-gray-600">Photo</p>
                        <p className="mt-1 text-xs font-bold text-white print:text-black">{evidenceImage || packet.evidence?.image_present ? 'Attached' : 'Not attached'}</p>
                      </div>
                      <div className="rounded-xl border border-mist/35 bg-surface/60 px-3 py-2 print:border-black print:bg-white">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-slate print:text-gray-600">Audio</p>
                        <p className="mt-1 text-xs font-bold text-white print:text-black">{evidenceAudio || packet.evidence?.audio_present ? 'Attached' : 'Not attached'}</p>
                      </div>
                      <div className="rounded-xl border border-mist/35 bg-surface/60 px-3 py-2 print:border-black print:bg-white">
                        <p className="text-[9px] font-mono uppercase tracking-widest text-slate print:text-gray-600">Review</p>
                        <p className="mt-1 text-xs font-bold text-white print:text-black">{packet.review_required ? 'Required' : 'Ready'}</p>
                      </div>
                    </div>
                    {packet.evidence?.text_summary && (
                      <p className="rounded-xl border border-mist/35 bg-surface/60 px-3 py-2 text-xs leading-relaxed text-slate print:border-black print:bg-white print:text-black">
                        {packet.evidence.text_summary}
                      </p>
                    )}
                    {evidenceAudio && (
                      <audio src={evidenceAudio} controls className="h-10 w-full print:hidden" />
                    )}
                  </div>
                </Card>
             </section>
           )}

           <section>
              <h2 className="text-[10px] text-slate uppercase font-bold tracking-widest mb-3 print:text-black">Status</h2>
              <Card className="border-mist/50 bg-cloud p-4 rounded-2xl print:border-black print:border-2 print:bg-white print:shadow-none">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate print:text-gray-600">Packet state</p>
                    <p className="mt-1 text-sm font-bold text-white print:text-black">Open / review required</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate print:text-gray-600">112 decision</p>
                    <p className="mt-1 text-sm font-semibold leading-snug text-white/90 print:text-black">{emergencyDecision}</p>
                  </div>
                  <Badge className={`w-fit border-none ${shouldCallNow ? 'bg-critical text-white' : 'bg-blue/15 text-blue'}`}>
                    {shouldCallNow ? 'Urgent' : 'Monitor'}
                  </Badge>
                </div>
              </Card>
           </section>

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
                 {safeActions.map((action, idx) => (
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
                    <button onClick={() => sendEmail(`SignalPack ${packet.severity.toUpperCase()} Crisis Packet`, emailBody)} className="flex items-center justify-center gap-3 p-4 rounded-xl bg-blue/10 border border-blue/30 hover:bg-blue/20 transition group">
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
                  <button onClick={handleDownloadHTML} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-mist/60 bg-surface hover:bg-mist/30 text-[10px] font-bold uppercase tracking-widest text-white transition group">
                     <Download className="w-4 h-4 text-slate group-hover:text-white transition-colors" /> Export .HTML
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

      <div className="mx-auto w-full max-w-4xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 print:hidden">
         <Button fullWidth onClick={onDone} variant="outline" className="h-12 border-mist/60 text-slate hover:text-white uppercase tracking-widest font-bold text-xs bg-surface/50">
            Back to Dashboard
         </Button>
      </div>

    </div>
  );
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function markdownToSimpleHtml(markdown: string) {
  return escapeHtml(markdown)
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .split(/\n{2,}/)
    .map((block) => block.startsWith('<h') ? block : `<p>${block.replace(/\n/g, '<br />')}</p>`)
    .join('');
}

function buildEmailBody({
  packet,
  displayPacketId,
  shareMsg,
  markdownReport,
  actions,
  googleMapsLink,
  hasEvidence,
}: {
  packet: CrisisPacket;
  displayPacketId: string;
  shareMsg: string;
  markdownReport: string;
  actions: string[];
  googleMapsLink: string | null;
  hasEvidence: boolean;
}) {
  return [
    'SIGNALPACK CRISIS PACKET',
    '',
    `Severity: ${packet.severity?.toUpperCase?.() || 'UNKNOWN'}`,
    `Incident: ${(packet.incident_type || 'unclassified').replace('_', ' ')}`,
    `Location: ${packet.location_text || 'Unknown'}`,
    `People at risk: ${packet.people_at_risk_count ?? 'Unknown'}`,
    `Packet ID: ${displayPacketId}`,
    `App version: ${packet.app_version || '1.0.0'}`,
    `Schema version: ${packet.packet_schema_version || '1.0'}`,
    googleMapsLink ? `Map: ${googleMapsLink}` : '',
    '',
    'Quick share message:',
    shareMsg,
    '',
    'Immediate actions:',
    ...actions.map((action, index) => `${index + 1}. ${action}`),
    '',
    hasEvidence ? 'Evidence: photo/audio/context was captured in SignalPack. Use the HTML/PDF export to preserve visual evidence.' : 'Evidence: no media evidence attached.',
    '',
    'Detailed report:',
    markdownReport,
    '',
    'AI trace:',
    `Provider: ${packet.model_provider || 'unknown'}`,
    `Model: ${packet.model_name || 'unknown'}`,
    `Fallback used: ${packet.fallback_used ? 'yes' : 'no'}`,
    '',
    'Generated by SignalPack',
    'https://pixek.xyz/signalpack',
  ].filter(Boolean).join('\n');
}

function buildHtmlReport({
  packet,
  displayPacketId,
  shareMsg,
  markdownReport,
  actions,
  googleMapsLink,
  evidenceImage,
  evidenceAudio,
}: {
  packet: CrisisPacket;
  displayPacketId: string;
  shareMsg: string;
  markdownReport: string;
  actions: string[];
  googleMapsLink: string | null;
  evidenceImage?: string;
  evidenceAudio?: string;
}) {
  const severity = escapeHtml(packet.severity?.toUpperCase?.() || 'UNKNOWN');
  const incidentType = escapeHtml((packet.incident_type || 'unclassified').replace('_', ' '));
  const actionsHtml = actions.map((action, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(action)}</li>`).join('');
  const sourcesHtml = (packet.safety_sources || []).map((source) => `<a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SignalPack Crisis Packet ${escapeHtml(displayPacketId)}</title>
  <style>
    :root { color-scheme: dark; --bg:#040404; --surface:#0A0D12; --panel:#101622; --cyan:#00E6FF; --blue:#2563FF; --orange:#FF9A1F; --text:#F2F2F1; --slate:#8A8F98; --critical:#EF4444; }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--bg); color:var(--text); font-family: Arial, sans-serif; line-height:1.5; }
    main { max-width: 900px; margin: 0 auto; padding: 32px 20px 48px; }
    header { border:1px solid rgba(0,230,255,.25); background:linear-gradient(135deg,#101622,#040404); border-radius:22px; padding:24px; box-shadow:0 24px 70px rgba(0,0,0,.45); }
    .eyebrow, .meta, h2 { font-family: "Arial Narrow", Arial, sans-serif; letter-spacing:.18em; text-transform:uppercase; }
    .eyebrow { color:var(--cyan); font-size:12px; font-weight:700; }
    h1 { margin:10px 0 8px; font-size:34px; line-height:1.05; }
    h2 { margin:30px 0 12px; color:var(--slate); font-size:12px; }
    .severity { display:inline-flex; margin-top:14px; border-radius:999px; padding:8px 12px; background:rgba(239,68,68,.12); color:#ff9090; border:1px solid rgba(239,68,68,.35); font-weight:700; letter-spacing:.12em; text-transform:uppercase; font-size:12px; }
    .grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }
    .card { border:1px solid rgba(138,143,152,.28); background:rgba(16,22,34,.76); border-radius:16px; padding:16px; }
    .meta { color:var(--slate); font-size:11px; overflow-wrap:anywhere; }
    .value { margin-top:4px; font-weight:700; color:var(--text); }
    .share { color:var(--text); font-size:18px; font-weight:700; }
    img.evidence { width:100%; max-height:420px; object-fit:cover; border-radius:18px; border:1px solid rgba(138,143,152,.3); }
    ol { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
    li { border:1px solid rgba(255,154,31,.35); border-radius:14px; padding:13px 14px; background:rgba(255,154,31,.07); }
    li span { color:var(--orange); font-family:monospace; font-weight:700; margin-right:10px; }
    .report { color:#e8e8e6; }
    .report h1, .report h2 { color:var(--text); letter-spacing:0; text-transform:none; font-family:Arial,sans-serif; }
    .sources { display:flex; flex-wrap:wrap; gap:8px; }
    .sources a { color:var(--cyan); text-decoration:none; border:1px solid rgba(0,230,255,.25); background:rgba(0,230,255,.08); border-radius:999px; padding:6px 10px; font-size:12px; }
    footer { margin-top:32px; color:var(--slate); font-size:12px; }
    @media print { body { background:white; color:black; } main { max-width:none; padding:0; } header,.card,li { box-shadow:none; background:white; color:black; border-color:#111; } .severity { color:#111; border-color:#111; background:white; } .meta,h2,.eyebrow,footer { color:#555; } .sources a { color:#111; border-color:#111; background:white; } }
  </style>
</head>
<body>
  <main>
    <header>
      <div class="eyebrow">SignalPack Crisis Packet</div>
      <h1>${severity} Severity Report</h1>
      <div class="meta">Packet ${escapeHtml(displayPacketId)} · App v${escapeHtml(packet.app_version || '1.0.0')} · Schema v${escapeHtml(packet.packet_schema_version || '1.0')}</div>
      <div class="severity">${severity}</div>
    </header>

    ${(evidenceImage || evidenceAudio || packet.evidence?.text_summary) ? `
    <h2>Evidence</h2>
    <section class="card">
      ${evidenceImage ? `<img class="evidence" src="${evidenceImage}" alt="Incident evidence" />` : ''}
      <p class="meta">Photo: ${evidenceImage || packet.evidence?.image_present ? 'attached' : 'not attached'} · Audio: ${evidenceAudio || packet.evidence?.audio_present ? 'attached' : 'not attached'} · Review: ${packet.review_required ? 'required' : 'ready'}</p>
      ${packet.evidence?.text_summary ? `<p>${escapeHtml(packet.evidence.text_summary)}</p>` : ''}
    </section>` : ''}

    <h2>Incident Overview</h2>
    <section class="grid">
      <div class="card"><div class="meta">Location</div><div class="value">${escapeHtml(packet.location_text || 'Unknown')}</div></div>
      <div class="card"><div class="meta">Incident Type</div><div class="value">${incidentType}</div></div>
      <div class="card"><div class="meta">People at Risk</div><div class="value">${escapeHtml(packet.people_at_risk_count ?? 'Unknown')}</div></div>
      ${googleMapsLink ? `<div class="card"><div class="meta">Map</div><div class="value"><a href="${escapeHtml(googleMapsLink)}">${escapeHtml(googleMapsLink)}</a></div></div>` : ''}
    </section>

    <h2>Quick Share Message</h2>
    <section class="card share">${escapeHtml(shareMsg)}</section>

    <h2>Immediate Actions</h2>
    <ol>${actionsHtml}</ol>

    <h2>Detailed Report</h2>
    <section class="card report">${markdownToSimpleHtml(markdownReport)}</section>

    <h2>AI Trace</h2>
    <section class="grid">
      <div class="card"><div class="meta">Provider</div><div class="value">${escapeHtml(packet.model_provider || 'unknown')}</div></div>
      <div class="card"><div class="meta">Model</div><div class="value">${escapeHtml(packet.model_name || 'unknown')}</div></div>
      <div class="card"><div class="meta">Fallback Used</div><div class="value">${packet.fallback_used ? 'Yes' : 'No'}</div></div>
    </section>

    ${sourcesHtml ? `<h2>Safety Sources</h2><section class="sources">${sourcesHtml}</section>` : ''}

    <footer>Generated by SignalPack · https://pixek.xyz/signalpack · Review before sharing.</footer>
  </main>
</body>
</html>`;
}
