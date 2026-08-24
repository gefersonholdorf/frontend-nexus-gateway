export interface RevisionDocumentSummary {
    id: number;
    code: string;
    title: string;
    category?: string | null;
    currentVersion: string;
    status: string;
    editUrl?: string | null;
}

export interface RevisionUser {
    id: number;
    name: string;
    avatarUrl?: string | null;
    role?: string | null;
}

export interface OpenDocumentRevision {
    id: number;
    documentId: number;
    versionId: number;
    version: string;
    revisionCode: string;
    status: string;
    responsible: RevisionUser;
    createdAt: string;
    updatedAt: string;
    description?: string | null;
    reason?: string | null;
    expectedCompletionDate?: string | null;
}