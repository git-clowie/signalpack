export const DEFAULT_OPENROUTER_MODEL = 'google/gemma-4-31b-it:free@preset/signalpack';
export const OPENROUTER_GEMMA_MODEL_FALLBACKS = [
  DEFAULT_OPENROUTER_MODEL,
  'google/gemma-4-26b-a4b-it:free@preset/signalpack',
  'google/gemma-4-31b-it@preset/signalpack',
  'google/gemma-4-26b-a4b-it@preset/signalpack',
  '@preset/signalpack',
] as const;
export const LOCAL_GEMMA_MODEL_ID = 'google/gemma-4-E2B';
export const LOCAL_GEMMA_MODEL_URL = 'https://huggingface.co/google/gemma-4-E2B';
export const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
export const DEFAULT_OLLAMA_MODEL = 'gemma4:e2b';
export const DEMO_OPENROUTER_API_KEY = import.meta.env.VITE_SIGNALPACK_DEMO_OPENROUTER_KEY || '';

export type RuntimeAiProvider = 'openrouter' | 'ollama';

export interface RuntimeAiSettings {
  provider: RuntimeAiProvider;
  openRouterApiKey: string;
  openRouterModel: string;
  ollamaUrl: string;
  ollamaModel: string;
}

export const AI_STORAGE_KEYS = {
  provider: 'signalpack_ai_provider',
  openRouterApiKey: 'signalpack_openrouter_api_key',
  openRouterModel: 'signalpack_openrouter_model',
  ollamaUrl: 'signalpack_ollama_url',
  ollamaModel: 'signalpack_ollama_model',
} as const;

function readStorage(key: string, fallback = '') {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) || fallback;
}

export function getRuntimeAiSettings(): RuntimeAiSettings {
  const provider = readStorage(AI_STORAGE_KEYS.provider, 'openrouter');

  return {
    provider: provider === 'ollama' ? 'ollama' : 'openrouter',
    openRouterApiKey: readStorage(AI_STORAGE_KEYS.openRouterApiKey, DEMO_OPENROUTER_API_KEY),
    openRouterModel: readStorage(AI_STORAGE_KEYS.openRouterModel, DEFAULT_OPENROUTER_MODEL),
    ollamaUrl: readStorage(AI_STORAGE_KEYS.ollamaUrl, DEFAULT_OLLAMA_URL),
    ollamaModel: readStorage(AI_STORAGE_KEYS.ollamaModel, DEFAULT_OLLAMA_MODEL),
  };
}
