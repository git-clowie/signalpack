import { OPENROUTER_GEMMA_MODEL_FALLBACKS, RuntimeAiSettings } from './settings';
import { createTrace, completeTrace, ModelCallResult } from './utils';

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: any;
};

interface ModelCallOptions {
  jsonMode?: boolean;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function uniqueModels(models: string[]) {
  return models.filter((model, index) => model && models.indexOf(model) === index);
}

function extractTextContent(content: any): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part?.type === 'text') return part.text;
        if (part?.type === 'image_url') return '[Image evidence attached. Ask the user for a typed visual summary if this model cannot inspect images.]';
        return '';
      })
      .filter(Boolean)
      .join('\n');
  }
  return String(content || '');
}

export async function callOpenRouter(
  settings: RuntimeAiSettings,
  messages: ChatMessage[],
  options: ModelCallOptions = { jsonMode: true },
): Promise<ModelCallResult> {
  if (!settings.openRouterApiKey.trim()) {
    throw new Error('Missing OpenRouter API key. Add it in Settings > AI Engine Routing.');
  }

  const modelsToTry = uniqueModels([
    settings.openRouterModel,
    ...OPENROUTER_GEMMA_MODEL_FALLBACKS,
  ]);
  const failures: string[] = [];

  const request = (model: string) => {
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: 0.1,
    };

    if (options.jsonMode !== false) {
      body.response_format = { type: 'json_object' };
    }

    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.openRouterApiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://signalpack.local',
        'X-Title': 'SignalPack',
      },
      body: JSON.stringify(body),
    });
  };

  for (const model of modelsToTry) {
    const trace = createTrace({ ...settings, openRouterModel: model }, 'openrouter');
    let response = await request(model);
    if (response.status === 429) {
      await wait(900);
      response = await request(model);
    }

    if (response.ok) {
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '{}';
      const notes = model !== settings.openRouterModel
        ? [`Primary model unavailable; routed to ${model}.`]
        : undefined;

      return {
        text,
        trace: completeTrace(trace, {
          request_id: data?.id,
          usage: data?.usage,
          notes,
        }),
      };
    }

    const detail = await response.text().catch(() => '');
    failures.push(`${model} -> ${response.status}: ${detail.slice(0, 180)}`);

    if (response.status === 401 || response.status === 403) {
      break;
    }
  }

  throw new Error(`OpenRouter Gemma routing failed. ${failures.join(' | ')}`);
}
