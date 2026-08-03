"use client";

import useSWR from "swr";
import { api } from "@/lib/api";
import { AIModelsResponse, AIProvider } from "@/lib/types";

export function useAIModels(provider: AIProvider) {
  const { data, error, mutate, isValidating } = useSWR<AIModelsResponse>(
    provider ? `/api/ai/models?provider=${provider}` : null,
    () => api.listAIModels(provider),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 30000, // cache 30s
    }
  );

  return {
    models: data?.models || [],
    isAvailable: data?.is_available ?? false,
    isLoading: !data && !error,
    isError: !!error,
    error: error,
    mutate,
    isValidating,
  };
}
