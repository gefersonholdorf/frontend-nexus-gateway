import { useQuery } from "@tanstack/react-query";
import type {
  DocumentType,
  DocumentCategory,
  DocumentPeriodicity,
} from "@/types/documents/settings";
import {
  mockDelay,
  mockDocumentTypes,
  mockDocumentCategories,
  mockDocumentPeriodicities,
} from "./settings.mock";

export const documentsSettingsKeys = {
  all: ["documents", "settings"] as const,
  types: () => [...documentsSettingsKeys.all, "types"] as const,
  categories: () => [...documentsSettingsKeys.all, "categories"] as const,
  periodicities: () => [...documentsSettingsKeys.all, "periodicities"] as const,
};

export function useDocumentTypes() {
  return useQuery({
    queryKey: documentsSettingsKeys.types(),
    queryFn: async (): Promise<DocumentType[]> => {
      await mockDelay(); // TODO: substituir por api.get("/documents/settings/types")
      return mockDocumentTypes;
    },
  });
}

export function useDocumentCategories() {
  return useQuery({
    queryKey: documentsSettingsKeys.categories(),
    queryFn: async (): Promise<DocumentCategory[]> => {
      await mockDelay();
      return mockDocumentCategories;
    },
  });
}

export function useDocumentPeriodicities() {
  return useQuery({
    queryKey: documentsSettingsKeys.periodicities(),
    queryFn: async (): Promise<DocumentPeriodicity[]> => {
      await mockDelay();
      return mockDocumentPeriodicities;
    },
  });
}