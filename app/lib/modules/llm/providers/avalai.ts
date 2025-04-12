import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { LanguageModelV1 } from 'ai';
import type { IProviderSetting } from '~/types/model';
import { createOpenAI } from '@ai-sdk/openai';

export default class AvalAIProvider extends BaseProvider {
  name = 'AvalAI';
  getApiKeyLink = 'https://chat.avalai.ir/platform/api-keys';

  config = {
    apiTokenKey: 'AVALAI_API_KEY',
    baseUrlKey: 'AVALAI_API_BASE_URL',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'anthropic.claude-3-7-sonnet-20250219-v1:0',
      label: 'Claude 3.7 Sonnet',
      provider: 'AvalAI',
      maxTokenAllowed: 8000,
    },
    {
      name: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      label: 'Claude 3.5 Sonnet',
      provider: 'AvalAI',
      maxTokenAllowed: 8000,
    },
  ];

  async getDynamicModels(
    _apiKeys?: Record<string, string>,
    _settings?: IProviderSetting,
    _serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    return this.staticModels;
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;
    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'AVALAI_API_BASE_URL',
      defaultApiTokenKey: 'AVALAI_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    if (!baseUrl) {
      throw new Error(`Missing base URL for ${this.name} provider`);
    }

    const avalAIOpenAI = createOpenAI({
      apiKey,
      baseURL: baseUrl,
    });

    return avalAIOpenAI(model);
  }
}
