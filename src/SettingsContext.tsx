import React, { createContext, useContext, useState, useEffect } from 'react';
import { LogoShape } from './components/Logo';
import {
  AI_STORAGE_KEYS,
  DEMO_OPENROUTER_API_KEY,
  DEFAULT_OPENROUTER_MODEL,
  DEFAULT_OLLAMA_MODEL,
  DEFAULT_OLLAMA_URL,
  RuntimeAiProvider,
} from './engine/ai/settings';

interface SettingsContextType {
  logoShape: LogoShape;
  setLogoShape: (shape: LogoShape) => void;
  mapStyle: 'tactical' | 'satellite' | 'streets';
  setMapStyle: (style: 'tactical' | 'satellite' | 'streets') => void;
  fastSendMode: boolean;
  setFastSendMode: (fast: boolean) => void;
  aiProvider: RuntimeAiProvider;
  setAiProvider: (provider: RuntimeAiProvider) => void;
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  openRouterModel: string;
  setOpenRouterModel: (model: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  ollamaModel: string;
  setOllamaModel: (model: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [logoShape, setLogoShapeState] = useState<LogoShape>('Flare');
  const [mapStyle, setMapStyleState] = useState<'tactical' | 'satellite' | 'streets'>('tactical');
  const [fastSendMode, setFastSendModeState] = useState(false);
  const [aiProvider, setAiProviderState] = useState<RuntimeAiProvider>('openrouter');
  const [openRouterApiKey, setOpenRouterApiKeyState] = useState(DEMO_OPENROUTER_API_KEY);
  const [openRouterModel, setOpenRouterModelState] = useState(DEFAULT_OPENROUTER_MODEL);
  const [ollamaUrl, setOllamaUrlState] = useState(DEFAULT_OLLAMA_URL);
  const [ollamaModel, setOllamaModelState] = useState(DEFAULT_OLLAMA_MODEL);

  useEffect(() => {
    const savedShape = localStorage.getItem('signalpack_logo_shape') as LogoShape;
    if (savedShape && ['Flare', 'S', 'Shield', 'Hexagon', 'Wave'].includes(savedShape)) {
      setLogoShapeState(savedShape);
    }
    const savedMap = localStorage.getItem('signalpack_map_style') as 'tactical' | 'satellite' | 'streets';
    if (savedMap && ['tactical', 'satellite', 'streets'].includes(savedMap)) {
      setMapStyleState(savedMap);
    }
    const savedFast = localStorage.getItem('signalpack_fast_send');
    if (savedFast !== null) {
      setFastSendModeState(savedFast === 'true');
    }
    const savedProvider = localStorage.getItem(AI_STORAGE_KEYS.provider);
    setAiProviderState(savedProvider === 'ollama' ? 'ollama' : 'openrouter');
    setOpenRouterApiKeyState(localStorage.getItem(AI_STORAGE_KEYS.openRouterApiKey) || DEMO_OPENROUTER_API_KEY);
    setOpenRouterModelState(localStorage.getItem(AI_STORAGE_KEYS.openRouterModel) || DEFAULT_OPENROUTER_MODEL);
    setOllamaUrlState(localStorage.getItem(AI_STORAGE_KEYS.ollamaUrl) || DEFAULT_OLLAMA_URL);
    setOllamaModelState(localStorage.getItem(AI_STORAGE_KEYS.ollamaModel) || DEFAULT_OLLAMA_MODEL);
  }, []);

  const setLogoShape = (shape: LogoShape) => {
    setLogoShapeState(shape);
    localStorage.setItem('signalpack_logo_shape', shape);
  };

  const setMapStyle = (style: 'tactical' | 'satellite' | 'streets') => {
    setMapStyleState(style);
    localStorage.setItem('signalpack_map_style', style);
  };

  const setFastSendMode = (fast: boolean) => {
    setFastSendModeState(fast);
    localStorage.setItem('signalpack_fast_send', String(fast));
  };

  const setAiProvider = (provider: RuntimeAiProvider = 'openrouter') => {
    setAiProviderState(provider);
    localStorage.setItem(AI_STORAGE_KEYS.provider, provider);
  };

  const setOpenRouterApiKey = (key: string) => {
    const normalizedKey = key.trim();
    if (normalizedKey) {
      setOpenRouterApiKeyState(normalizedKey);
      localStorage.setItem(AI_STORAGE_KEYS.openRouterApiKey, normalizedKey);
      return;
    }

    localStorage.removeItem(AI_STORAGE_KEYS.openRouterApiKey);
    setOpenRouterApiKeyState(DEMO_OPENROUTER_API_KEY);
  };

  const setOpenRouterModel = (model: string) => {
    setOpenRouterModelState(model);
    localStorage.setItem(AI_STORAGE_KEYS.openRouterModel, model || DEFAULT_OPENROUTER_MODEL);
  };

  const setOllamaUrl = (url: string) => {
    const nextUrl = url.trim() || DEFAULT_OLLAMA_URL;
    setOllamaUrlState(nextUrl);
    localStorage.setItem(AI_STORAGE_KEYS.ollamaUrl, nextUrl);
  };

  const setOllamaModel = (model: string) => {
    const nextModel = model.trim() || DEFAULT_OLLAMA_MODEL;
    setOllamaModelState(nextModel);
    localStorage.setItem(AI_STORAGE_KEYS.ollamaModel, nextModel);
  };

  useEffect(() => {
    // Dynamic favicon generation
    const getFaviconSvg = (shape: LogoShape) => {
      let iconContent = '';
      if (shape === 'Flare') {
        iconContent = '<circle cx="208" cy="328" r="100" fill="#1D4ED8"/><circle cx="208" cy="328" r="58" fill="#22D3EE"/><circle cx="208" cy="328" r="28" fill="white"/><path d="M208 64c116 0 210 94 210 210H286c0-43-35-78-78-78V64Z" fill="#3B82F6"/><path d="M315 274h112c0-45-12-88-35-126" fill="none" stroke="#F59E0B" stroke-width="30" stroke-linecap="round"/><path d="M215 310 406 120" stroke="#0F1115" stroke-width="56" stroke-linecap="round"/><path d="M224 302 410 116" stroke="#22D3EE" stroke-width="22" stroke-linecap="round"/><path d="M100 292a136 136 0 0 1 136-136" fill="none" stroke="#22D3EE" stroke-width="16" stroke-linecap="round"/><path d="M70 265a186 186 0 0 1 186-186" fill="none" stroke="#2563EB" stroke-width="9" stroke-linecap="round"/>';
      } else if (shape === 'S') {
        iconContent = '<text x="50%" y="50%" font-family="sans-serif" font-weight="bold" font-size="280" fill="white" text-anchor="middle" dominant-baseline="central">S</text>';
      } else if (shape === 'Shield') {
        iconContent = '<path d="M426 277c0 106-74 160-162 191a21 21 0 0 1-14 0C162 437 85 383 85 277V128a21 21 0 0 1 21-21c42 0 95-25 132-57a24 24 0 0 1 32 0c37 32 90 57 132 57a21 21 0 0 1 21 21z" fill="none" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>';
      } else if (shape === 'Hexagon') {
        iconContent = '<path d="M448 341V171a42 42 0 0 0-21-36l-149-85a42 42 0 0 0-42 0l-149 85A42 42 0 0 0 64 171v170a42 42 0 0 0 21 36l149 85a42 42 0 0 0 42 0l149-85a42 42 0 0 0 21-36z" fill="none" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>';
      } else if (shape === 'Wave') {
        iconContent = '<polyline points="469 256 384 256 320 448 192 64 128 256 42 256" fill="none" stroke="white" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>';
      }

      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="#070B14"/>${iconContent}</svg>`;
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
    };

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = getFaviconSvg(logoShape);
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.type = "image/svg+xml";
      newLink.href = getFaviconSvg(logoShape);
      document.head.appendChild(newLink);
    }
  }, [logoShape]);

  return (
    <SettingsContext.Provider value={{
      logoShape,
      setLogoShape,
      mapStyle,
      setMapStyle,
      fastSendMode,
      setFastSendMode,
      aiProvider,
      setAiProvider,
      openRouterApiKey,
      setOpenRouterApiKey,
      openRouterModel,
      setOpenRouterModel,
      ollamaUrl,
      setOllamaUrl,
      ollamaModel,
      setOllamaModel,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
