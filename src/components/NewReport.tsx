import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from '@/src/components/ui';
import { Camera, ArrowRight, X, Mic, Square, Trash2, Loader2, Zap } from 'lucide-react';
import { DraftReport } from '@/src/types';
import { getCurrentLocation } from '../engine/location';
import { compressImage } from '../engine/media';
import { useSettings } from '../SettingsContext';
import { AudioVisualizer } from './AudioVisualizer';

export function NewReportScreen({
  onNext,
  initialFastSend = false,
}: {
  onNext: (data: Partial<DraftReport>) => void;
  initialFastSend?: boolean;
}) {
  const { fastSendMode } = useSettings();
  const shouldFastSend = initialFastSend || fastSendMode;
  const [text, setText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [captureError, setCaptureError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    let mounted = true;
    getCurrentLocation().then(loc => {
      if (mounted && loc) setLocation(loc);
    });
    return () => { mounted = false; };
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsCompressing(true);
        const compressedBase64 = await compressImage(file);
        setPreviewImage(compressedBase64);
      } catch (error) {
        console.error("Error compressing image:", error);
        setCaptureError('Could not process that image. Try a smaller photo or continue with text/audio.');
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      setCaptureError('');
      if (!navigator.mediaDevices?.getUserMedia) {
        setCaptureError('Voice capture is not available in this browser. Add a short text note instead.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone', error);
      setCaptureError('Microphone access was blocked. You can still send a text note or photo.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const clearAudio = () => {
    setAudioUrl(null);
    setAudioBase64(null);
  };

  const handleContinue = () => {
    let finalPayloadText = text;
    if (location) {
       finalPayloadText += `\n[Auto-Captured GPS: ${location.lat}, ${location.lng}]`;
    }
    onNext({ text: finalPayloadText, image: previewImage || undefined, audio: audioBase64 || undefined, location, fastSend: shouldFastSend });
  };

  const isValid = text.trim().length > 0 || previewImage !== null || audioBase64 !== null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full max-w-2xl mx-auto px-4 pb-6 pt-4">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Quick Capture</h1>
          <p className="text-slate font-mono uppercase tracking-widest text-xs">Photo, voice, or message</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {location && (
            <div className="bg-cyan-brand/10 border border-cyan-brand/20 text-cyan-brand text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center">
               <div className="w-1.5 h-1.5 bg-cyan-brand rounded-full mr-2 animate-pulse"></div>
               GPS Locked
            </div>
          )}
          {shouldFastSend && (
            <div className="bg-critical/10 border border-critical/30 text-critical text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Fast Send
            </div>
          )}
        </div>
      </div>

      {captureError && (
        <div className="mb-4 rounded-xl border border-warning/30 bg-warning/5 px-3 py-2 text-xs leading-relaxed text-warning">
          {captureError}
        </div>
      )}

      <div className="space-y-4 flex-1 overflow-y-auto">
        <Card className="p-1 border-mist/50 bg-cloud overflow-hidden">
          {!previewImage ? (
            <div 
              className={`border-2 border-dashed border-mist/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${isCompressing ? 'bg-mist/10' : 'cursor-pointer hover:bg-mist/10 hover:border-blue/50 group'}`}
              onClick={() => !isCompressing && fileInputRef.current?.click()}
            >
              {isCompressing ? (
                <>
                  <div className="w-14 h-14 bg-blue/10 rounded-full flex items-center justify-center text-blue mb-4">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>
                  <span className="text-sm font-bold text-white block mb-1 tracking-wide">Processing Image...</span>
                  <span className="text-xs text-slate uppercase tracking-widest font-mono">Compressing locally</span>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 bg-blue/10 rounded-full flex items-center justify-center text-blue mb-4 group-hover:scale-110 group-hover:bg-blue/20 transition-all">
                    <Camera className="w-7 h-7" />
                  </div>
                  <span className="text-sm font-bold text-white block mb-1 tracking-wide">Capture Photo</span>
                  <span className="text-xs text-slate uppercase tracking-widest font-mono">Tap or click to browse</span>
                </>
              )}
            </div>
          ) : (
            <div className="relative group">
              <img src={previewImage} alt="Incident preview" className="w-full h-48 md:h-64 object-cover object-center rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-3 right-3 w-10 h-10 bg-black/60 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-critical transition-colors shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </Card>

        {/* Audio Recording Section */}
        <Card className="p-5 border-mist/50 bg-surface shadow-md">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate mb-3 block">Audio Evidence</label>
          {!audioUrl ? (
            isRecording ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center justify-between px-6 gap-2 h-14 bg-critical/10 text-critical font-bold rounded-2xl border border-critical/30">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-critical rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                    <span className="tracking-widest">REC</span>
                  </div>
                  <AudioVisualizer />
                </div>
                <Button variant="danger" size="md" onClick={stopRecording} className="h-14 px-6 font-bold uppercase tracking-widest text-xs shadow-lg shadow-critical/20">
                  <Square className="w-4 h-4 mr-2" /> Stop
                </Button>
              </div>
            ) : (
              <button 
                onClick={startRecording} 
                className="w-full border-2 border-dashed border-mist/30 text-cyan-brand h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-cyan-brand/5 hover:border-cyan-brand/50 transition-all font-bold uppercase tracking-widest text-xs"
              >
                <Mic className="w-5 h-5 mr-1" /> Add Voice Note
              </button>
            )
          ) : (
            <div className="flex items-center gap-3 bg-cloud/50 p-2 rounded-2xl border border-mist/30">
              <audio src={audioUrl} controls className="flex-1 h-10 custom-audio" />
              <button onClick={clearAudio} className="w-10 h-10 flex items-center justify-center rounded-lg text-slate hover:text-critical hover:bg-critical/10 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </Card>

        <div className="flex flex-col mt-4">
          <label className="text-[10px] uppercase font-bold tracking-widest text-slate mb-2 px-1 block">Context Notes</label>
          <textarea
            className="w-full bg-surface shadow-inner rounded-2xl border border-mist/50 p-4 text-white placeholder-slate/40 focus:outline-none focus:border-cyan-brand/60 focus:ring-1 focus:ring-cyan-brand/50 resize-none h-32 font-medium transition-all"
            placeholder="Describe what happened, any visible danger, people at risk..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="pt-4 mt-auto border-t border-mist/50">
        <Button 
          size="lg" 
          fullWidth 
          disabled={!isValid} 
          onClick={handleContinue}
        >
        Send to Gemma 4 <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
