import { useMutation, useQueryClient } from "@tanstack/react-query";
import { documentsSettingsKeys } from "./use-document-settings";
import {
  mockDelay,
  mockDocumentTypes,
  mockDocumentCategories,
  mockDocumentPeriodicities,
} from "./settings.mock";
import type { SettingsEntityKind } from "@/types/documents/settings";

const keyByKind = {
  type: documentsSettingsKeys.types,
  category: documentsSettingsKeys.categories,
  periodicity: documentsSettingsKeys.periodicities,
} as const;

// "banco em memória" apenas para desenvolvimento
const storeByKind = {
  type: mockDocumentTypes,
  category: mockDocumentCategories,
  periodicity: mockDocumentPeriodicities,
} as const;

export interface SettingsEntityPayload {
  name: string;
  description?: string | null;
  active: boolean;
  months?: number;
}

export function useSaveSettingsEntity(kind: SettingsEntityKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id?: number; payload: SettingsEntityPayload }) => {
      await mockDelay(400);
      const store = storeByKind[kind] as Array<Record<string, unknown>>;
      const now = new Date().toISOString();

      if (params.id) {
        // update
        const index = store.findIndex((item) => item.id === params.id);
        if (index >= 0) {
          store[index] = { ...store[index], ...params.payload, updatedAt: now };
          return store[index];
        }
      }

      // create
      const nextId =
        store.reduce((max, item) => Math.max(max, Number(item.id)), 0) + 1;
      const created = {
        id: nextId,
        description: null,
        ...params.payload,
        createdAt: now,
        updatedAt: now,
      };
      store.push(created);
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keyByKind[kind]() });
    },
  });
}

export function useDeleteSettingsEntity(kind: SettingsEntityKind) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await mockDelay(400);
      const store = storeByKind[kind] as Array<{ id: number }>;
      const index = store.findIndex((item) => item.id === id);
      if (index >= 0) store.splice(index, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keyByKind[kind]() });
    },
  });
}