import { models, type LLMModel } from 'react-native-executorch';

type LLMKey = keyof typeof models.llm;

type CatalogMeta = {
  name: string;
  maker?: string;
  description: string;
};

const META: Record<LLMKey, CatalogMeta> = {
  LFM2_5_1_2B: {
    name: 'LFM 2.5 1.2B',
    maker: 'Liquid AI',
    description: 'General-purpose hybrid model for reasoning, instruction following, and fast multi-turn chat.',
  },
  LFM2_5_350M: {
    name: 'LFM 2.5 350M',
    maker: 'Liquid AI',
    description: 'Ultra-compact model with a small memory footprint and fast first-token response.',
  },
  LFM2_5_VL_450M: {
    name: 'LFM 2.5 VL 450M',
    maker: 'Liquid AI',
    description: 'Lightweight vision-language model for image description and visual questions.',
  },
  LFM2_5_VL_1_6B: {
    name: 'LFM 2.5 VL 1.6B',
    maker: 'Liquid AI',
    description: 'Higher-capacity vision-language model for detailed image and document understanding.',
  },
  BIELIK_V3_1_5B: {
    name: 'Bielik v3 1.5B',
    maker: 'SpeakLeash',
    description: 'Bilingual Polish and English model for chat and translation.',
  },
  LLAMA3_2_1B: {
    name: 'Llama 3.2 1B',
    maker: 'Meta',
    description: 'Lightweight multilingual instruction model for summaries and short assistant tasks.',
  },
  LLAMA3_2_3B: {
    name: 'Llama 3.2 3B',
    maker: 'Meta',
    description: 'Multilingual instruction model with stronger multi-turn reasoning than the 1B version.',
  },
  SMOLLM2_135M: {
    name: 'SmolLM2 135M',
    maker: 'Hugging Face',
    description: 'Micro-sized model for instant responses on low-power devices.',
  },
  SMOLLM2_360M: {
    name: 'SmolLM2 360M',
    maker: 'Hugging Face',
    description: 'Compact instruction model that balances speed and conversational coherence.',
  },
  SMOLLM2_1_7B: {
    name: 'SmolLM2 1.7B',
    maker: 'Hugging Face',
    description: 'Small model with solid reasoning, creative writing, and general knowledge answers.',
  },
  HAMMER2_1_0_5B: {
    name: 'Hammer 2.1 0.5B',
    description: 'Function-calling model for fast tool use and structured JSON output.',
  },
  HAMMER2_1_1_5B: {
    name: 'Hammer 2.1 1.5B',
    description: 'Function-calling model for multi-tool workflows and structured JSON output.',
  },
  HAMMER2_1_3B: {
    name: 'Hammer 2.1 3B',
    description: 'Function-calling model with the highest tool selection precision in the Hammer family.',
  },
  PHI4_MINI: {
    name: 'Phi-4 Mini 3.8B',
    maker: 'Microsoft',
    description: 'Dense reasoning model for math, code, and structured analytical tasks.',
  },
  QWEN2_5_0_5B: {
    name: 'Qwen 2.5 0.5B',
    maker: 'Alibaba',
    description: 'Ultra-light multilingual model for near-instant replies and basic instructions.',
  },
  QWEN2_5_1_5B: {
    name: 'Qwen 2.5 1.5B',
    maker: 'Alibaba',
    description: 'Multilingual instruction model for chat, summaries, and translation.',
  },
  QWEN2_5_3B: {
    name: 'Qwen 2.5 3B',
    maker: 'Alibaba',
    description: 'Multilingual model with strong reasoning, coding, and math for longer dialogue.',
  },
  QWEN3_0_6B: {
    name: 'Qwen 3 0.6B',
    maker: 'Alibaba',
    description: 'Compact next-generation model with low latency for everyday chat.',
  },
  QWEN3_1_7B: {
    name: 'Qwen 3 1.7B',
    maker: 'Alibaba',
    description: 'Next-generation model balancing reasoning, coding, and conversation.',
  },
  QWEN3_4B: {
    name: 'Qwen 3 4B',
    maker: 'Alibaba',
    description: 'High-capacity model for multi-step reasoning, coding, and world knowledge.',
  },
  GEMMA4_E2B: {
    name: 'Gemma 4 E2B',
    maker: 'Google',
    description: 'Instruction-following model tuned for efficient on-device generation.',
  },
};

export type CatalogEntry = {
  id: LLMKey;
  name: string;
  maker?: string;
  description: string;
  variant: string;
  vision: boolean;
  config: LLMModel;
};

function buildEntry(id: LLMKey): CatalogEntry {
  const family = models.llm[id] as unknown as Record<string, LLMModel>;
  const config = family.DEFAULT!;
  const variant = Object.keys(family).find((key) => key !== 'DEFAULT' && family[key] === config);

  return {
    id,
    ...META[id],
    variant: variant ?? 'DEFAULT',
    vision: config.modalities?.includes('image') ?? false,
    config,
  };
}

export const CATALOG: readonly CatalogEntry[] = (Object.keys(META) as LLMKey[]).map(buildEntry);

export function findEntry(id: string | null): CatalogEntry | undefined {
  return id ? CATALOG.find((entry) => entry.id === id) : undefined;
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
  return `${Math.max(1, Math.round(bytes / 1e6))} MB`;
}
