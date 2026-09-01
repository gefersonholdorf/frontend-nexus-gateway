export interface AuditQueryParams {
  cd_user?: number;
  ds_action?: "CREATE" | "UPDATE" | "DELETE";
  ds_entity?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
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
} as const;