import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, DraftReport, CrisisPacket, MedicalProfile } from '../../types';

interface AppStore {
  // Navigation State
  currentState: AppState;
  setAppState: (state: AppState) => void;

  // Report Draft State
  draft: DraftReport;
  updateDraft: (data: Partial<DraftReport>) => void;
  resetDraft: () => void;

  // Settings State
  isLocalMode: boolean;
  setIsLocalMode: (isLocal: boolean) => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;

  // Medical Profile
  medicalProfile: MedicalProfile;
  setMedicalProfile: (profile: Partial<MedicalProfile>) => void;
}

const initialDraft: DraftReport = { stage: 'home' };
const initialMedicalProfile: MedicalProfile = {
  bloodType: '',
  allergies: '',
  conditions: '',
  medications: '',
  emergencyContacts: ''
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Navigation
      currentState: 'home',
      setAppState: (state) => set({ currentState: state }),

      // Draft
      draft: initialDraft,
      updateDraft: (data) => set((state) => ({ draft: { ...state.draft, ...data } })),
      resetDraft: () => set({ draft: initialDraft, currentState: 'home' }),

      // Settings
      isLocalMode: false,
      setIsLocalMode: (isLocalMode) => set({ isLocalMode }),
      showTutorial: false,
      setShowTutorial: (showTutorial) => set({ showTutorial }),
      isMenuOpen: false,
      setIsMenuOpen: (isMenuOpen) => set({ isMenuOpen }),

      // Medical Profile
      medicalProfile: initialMedicalProfile,
      setMedicalProfile: (profile) => set((state) => ({ medicalProfile: { ...state.medicalProfile, ...profile } })),
    }),
    {
      name: 'signalpack-storage',
      partialize: (state) => ({ 
        medicalProfile: state.medicalProfile,
        isLocalMode: state.isLocalMode
      }),
    }
  )
);
