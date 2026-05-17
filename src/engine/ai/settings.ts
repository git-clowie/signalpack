export const DEFAULT_OPENROUTER_MODEL = 'google/gemma-4-26b-a4b-it';

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
    openRouterApiKey: readStorage(AI_STORAGE_KEYS.openRouterApiKey, ''),
    openRouterModel: readStorage(AI_STORAGE_KEYS.openRouterModel, DEFAULT_OPENROUTER_MODEL),
  };
}
