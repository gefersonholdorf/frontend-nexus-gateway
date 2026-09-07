export interface AuditQueryParams {
  cd_user?: number;
  ds_action?: "CREATE" | "UPDATE" | "DELETE";
  ds_entity?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Filtros da auditoria MOCKADA do módulo Core (`/core/audit`).
 *
 * Não confundir com `AuditQueryParams`/`queryKeys.audit`, que é o hook V2 real
 * (`src/modules/audit/hooks/use-fetch-audit.ts`, `GET /audit`). São duas
 * fontes de dados independentes — ver docs/architecture/core-module-roadmap.md.
 */
export interface CoreAuditQueryParams {
  ds_user?: string;
  ds_action?: string;
  ds_module?: string;
  from?: string;
  to?: string;
}

export const queryKeys = {
  me: () => ["me"] as const,

  users: {
    all: () => ["users"] as const,
    detail: (id: number) => ["users", id] as const,
  },

  roles: {
    all: () => ["roles"] as const,
    detail: (id: number) => ["roles", id] as const,
  },

  permissions: {
    all: () => ["permissions"] as const,
  },

  modules: {
    all: () => ["modules"] as const,
    detail: (id: number) => ["modules", id] as const,
  },

  integrations: {
    all: () => ["integrations"] as const,
    detail: (id: number) => ["integrations", id] as const,
  },

  audit: {
    all: () => ["audit"] as const,
    list: (params: AuditQueryParams) => ["audit", params] as const,
  },

  // Auditoria mockada do módulo Core — chave própria, não compartilha cache com `audit` (V2 real).
  coreAudit: {
    all: () => ["core-audit"] as const,
    list: (params: CoreAuditQueryParams) => ["core-audit", params] as const,
  },
} as const;