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

  // Auditoria (V2 real) — usada tanto por `/audit` quanto por `/core/audit`.
  audit: {
    all: () => ["audit"] as const,
    list: (params: AuditQueryParams) => ["audit", params] as const,
  },

  hubServices: {
    all: () => ["hub-services"] as const,
    detail: (id: number) => ["hub-services", id] as const,
  },

  // Módulo "Gestão de Documentos" (novo, independente do legado "Documentos
  // ISO" em src/pages/documents + src/api/documents).
  docCategorias: {
    all: () => ["doc-categorias"] as const,
    detail: (id: number) => ["doc-categorias", id] as const,
  },

  docAreas: {
    all: () => ["doc-areas"] as const,
    detail: (id: number) => ["doc-areas", id] as const,
  },

  docFluxos: {
    all: () => ["doc-fluxos"] as const,
    detail: (id: number) => ["doc-fluxos", id] as const,
  },

  docConfiguracoes: {
    all: () => ["doc-configuracoes"] as const,
  },

  docRoles: {
    all: () => ["doc-roles"] as const,
  },

  docUsuarios: {
    all: () => ["doc-usuarios"] as const,
  },

  documentos: {
    all: () => ["documentos"] as const,
    list: (params: DocumentoQueryParams) => ["documentos", "list", params] as const,
    detail: (id: number) => ["documentos", id] as const,
  },

  docRevisoes: {
    list: (documentoId: number) => ["documentos", documentoId, "revisoes"] as const,
    detail: (documentoId: number, revisaoId: number) =>
      ["documentos", documentoId, "revisoes", revisaoId] as const,
  },

  docVersoes: {
    list: (documentoId: number, revisaoId?: number) =>
      ["documentos", documentoId, "versoes", { revisaoId }] as const,
    detail: (documentoId: number, versaoId: number) =>
      ["documentos", documentoId, "versoes", versaoId] as const,
  },

  docAprovacoes: {
    list: (documentoId: number, revisaoId: number, rodada?: number) =>
      ["documentos", documentoId, "revisoes", revisaoId, "aprovacoes", { rodada }] as const,
    pendentes: (params: AprovacoesPendentesQueryParams) =>
      ["doc-aprovacoes-pendentes", params] as const,
  },
} as const;

export interface DocumentoQueryParams {
  categoria?: number;
  area?: number;
  status?: string;
  role?: number;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface AprovacoesPendentesQueryParams {
  page?: number;
  pageSize?: number;
}
