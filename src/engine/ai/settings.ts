export const DEFAULT_OPENROUTER_MODEL = 'google/gemma-4-31b-it:free@preset/signalpack';
export const LOCAL_GEMMA_MODEL_ID = 'google/gemma-4-E2B';
export const LOCAL_GEMMA_MODEL_URL = 'https://huggingface.co/google/gemma-4-E2B';
export const DEMO_OPENROUTER_API_KEY = import.meta.env.VITE_SIGNALPACK_DEMO_OPENROUTER_KEY || '';

export type RuntimeAiProvider = 'openrouter';

export interface RuntimeAiSettings {
  provider: RuntimeAiProvider;
  openRouterApiKey: string;
  openRouterModel: string;
}

export const AI_STORAGE_KEYS = {
  provider: 'signalpack_ai_provider',
  openRouterApiKey: 'signalpack_openrouter_api_key',
  openRouterModel: 'signalpack_openrouter_model',
} as const;

function readStorage(key: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) || fallback;
}

export function getRuntimeAiSettings(): RuntimeAiSettings {
  return {
    provider: 'openrouter',
    openRouterApiKey: readStorage(AI_STORAGE_KEYS.openRouterApiKey, DEMO_OPENROUTER_API_KEY),
    openRouterModel: readStorage(AI_STORAGE_KEYS.openRouterModel, DEFAULT_OPENROUTER_MODEL),
  };
}
