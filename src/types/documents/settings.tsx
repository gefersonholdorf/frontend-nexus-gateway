// Entidade base comum às configurações administrativas do módulo
export interface SettingsEntity {
    id: number;
    name: string;
    description: string | null;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Tipos de Documento (ex.: Política, Procedimento, Registro)
export interface DocumentType extends SettingsEntity { }

// Categorias (ex.: SGSI, RH, Financeiro)
export interface DocumentCategory extends SettingsEntity { }

// Periodicidades de revisão (ex.: Anual = 12 meses)
export interface DocumentPeriodicity extends SettingsEntity {
    months: number; // intervalo em meses até a próxima revisão
}

// Discrimina qual entidade estamos editando (dirige o form/mutations)
export type SettingsEntityKind = "type" | "category" | "periodicity";