import type {
  DocumentType,
  DocumentCategory,
  DocumentPeriodicity,
} from "@/types/documents/settings";

export const mockDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockDocumentTypes: DocumentType[] = [
  {
    id: 1,
    name: "Política",
    description: "Diretrizes de alto nível aprovadas pela Alta Gestão.",
    active: true,
    createdAt: "2026-01-10T09:00:00.000Z",
    updatedAt: "2026-05-22T14:30:00.000Z",
  },
  {
    id: 2,
    name: "Procedimento",
    description: "Passo a passo operacional para execução de processos.",
    active: true,
    createdAt: "2026-01-10T09:05:00.000Z",
    updatedAt: "2026-03-18T11:20:00.000Z",
  },
  {
    id: 3,
    name: "Norma",
    description: "Regras internas de conformidade e boas práticas.",
    active: true,
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-02-01T08:00:00.000Z",
  },
  {
    id: 4,
    name: "Registro",
    description: "Evidência de execução de uma atividade.",
    active: true,
    createdAt: "2026-02-14T10:15:00.000Z",
    updatedAt: "2026-06-02T16:45:00.000Z",
  },
  {
    id: 5,
    name: "Formulário",
    description: "Modelo padronizado para coleta de informações.",
    active: false,
    createdAt: "2026-03-05T13:40:00.000Z",
    updatedAt: "2026-07-11T09:10:00.000Z",
  },
];

export const mockDocumentCategories: DocumentCategory[] = [
  {
    id: 1,
    name: "SGSI",
    description: "Sistema de Gestão de Segurança da Informação (ISO 27001).",
    active: true,
    createdAt: "2026-01-08T09:00:00.000Z",
    updatedAt: "2026-04-19T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Recursos Humanos",
    description: "Documentos relacionados a pessoas e cultura.",
    active: true,
    createdAt: "2026-01-08T09:10:00.000Z",
    updatedAt: "2026-01-08T09:10:00.000Z",
  },
  {
    id: 3,
    name: "Financeiro",
    description: "Políticas e procedimentos financeiros.",
    active: true,
    createdAt: "2026-01-20T14:00:00.000Z",
    updatedAt: "2026-05-30T08:25:00.000Z",
  },
  {
    id: 4,
    name: "Jurídico",
    description: "Contratos, compliance e regulamentações.",
    active: true,
    createdAt: "2026-02-11T11:30:00.000Z",
    updatedAt: "2026-02-11T11:30:00.000Z",
  },
  {
    id: 5,
    name: "Infraestrutura",
    description: "Documentação técnica de TI e DevOps.",
    active: false,
    createdAt: "2026-03-22T15:50:00.000Z",
    updatedAt: "2026-06-15T13:05:00.000Z",
  },
];

export const mockDocumentPeriodicities: DocumentPeriodicity[] = [
  {
    id: 1,
    name: "Anual",
    description: "Revisão a cada 12 meses.",
    months: 12,
    active: true,
    createdAt: "2026-01-05T08:00:00.000Z",
    updatedAt: "2026-01-05T08:00:00.000Z",
  },
  {
    id: 2,
    name: "Semestral",
    description: "Revisão a cada 6 meses.",
    months: 6,
    active: true,
    createdAt: "2026-01-05T08:05:00.000Z",
    updatedAt: "2026-04-10T09:30:00.000Z",
  },
  {
    id: 3,
    name: "Trimestral",
    description: "Revisão a cada 3 meses.",
    months: 3,
    active: true,
    createdAt: "2026-01-05T08:10:00.000Z",
    updatedAt: "2026-01-05T08:10:00.000Z",
  },
  {
    id: 4,
    name: "Bienal",
    description: "Revisão a cada 24 meses.",
    months: 24,
    active: false,
    createdAt: "2026-02-18T10:00:00.000Z",
    updatedAt: "2026-07-01T12:00:00.000Z",
  },
];