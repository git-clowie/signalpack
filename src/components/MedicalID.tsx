import React, { useState } from 'react';
import { Card, Button } from '@/src/components/ui';
import { ArrowLeft, Save, FileText, AlertTriangle, Droplets, Phone } from 'lucide-react';
import { useAppStore } from '../engine/state/useAppStore';

export function MedicalIDScreen({ onBack }: { onBack: () => void }) {
  const { medicalProfile, setMedicalProfile } = useAppStore();
  const [profile, setProfile] = useState(medicalProfile);

  const handleSave = () => {
    setMedicalProfile(profile);
    onBack();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto px-4 pb-6 pt-4 relative bg-cloud">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-mist/30 text-slate hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">Emergency Profile <span className="text-[10px] bg-critical/20 text-critical px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Optional</span></h1>
      </div>

      <p className="text-sm text-slate mb-6">
        This optional context can be attached to Crisis Packets when it helps others understand risk faster.
      </p>

      <div className="space-y-4 overflow-y-auto pb-24">
        <Card className="p-4 bg-surface/50 border-mist/30">
          <div className="flex items-center gap-3 mb-4 text-critical">
            <Droplets className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Blood Type</h2>
          </div>
          <input 
            className="w-full bg-cloud/50 border border-mist/30 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-brand transition-colors text-sm"
            placeholder="e.g. O Negative, A Positive" 
            value={profile.bloodType}
            onChange={(e) => setProfile(p => ({ ...p, bloodType: e.target.value }))}
          />
        </Card>

        <Card className="p-4 bg-surface/50 border-mist/30">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Allergies</h2>
          </div>
          <input 
            className="w-full bg-cloud/50 border border-mist/30 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-brand transition-colors text-sm"
            placeholder="e.g. Penicillin, Peanuts, None known" 
            value={profile.allergies}
            onChange={(e) => setProfile(p => ({ ...p, allergies: e.target.value }))}
          />
        </Card>

        <Card className="p-4 bg-surface/50 border-mist/30">
          <div className="flex items-center gap-3 mb-4 text-blue">
            <FileText className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Medical Conditions</h2>
          </div>
          <textarea
            className="w-full bg-cloud/50 border border-mist/30 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-brand transition-colors text-sm"
            placeholder="e.g. Type 1 Diabetes, Asthma..."
            value={profile.conditions}
            rows={3}
            onChange={(e) => setProfile(p => ({ ...p, conditions: e.target.value }))}
          />
        </Card>

        <Card className="p-4 bg-surface/50 border-mist/30">
          <div className="flex items-center gap-3 mb-4 text-white">
            <Phone className="w-5 h-5" />
            <h2 className="text-sm font-bold uppercase tracking-widest">Emergency Contacts</h2>
          </div>
          <textarea
            className="w-full bg-cloud/50 border border-mist/30 text-white rounded-xl p-3 focus:outline-none focus:border-cyan-brand transition-colors text-sm"
            placeholder="e.g. Jane Doe (Wife) - 555-0199"
            value={profile.emergencyContacts}
            rows={2}
            onChange={(e) => setProfile(p => ({ ...p, emergencyContacts: e.target.value }))}
          />
        </Card>
      </div>

      <div className="absolute bottom-6 left-4 right-4">
        <Button onClick={handleSave} className="w-full bg-blue text-white hover:bg-blue/80 h-12 text-sm uppercase tracking-widest font-bold">
          <Save className="w-4 h-4 mr-2" />
          Save & Return
        </Button>
      </div>
    </div>
  );
}
