import { IComment } from "./conversation";

export interface IDocumentInfo {
    userFriendlyId?: string;
    caption?: string;
    otherVersions?: IDocumentVersionInfo[];
}

export interface IDocumentVersionInfo {
    userFriendlyId: string;
    caption?: string;
    language?: string;
    description?: string;
}

export interface IDocument extends IDocumentInfo {
    text?: string;
    parts?: IDocument[];
}

export interface IExploredDocument extends IDocument {
    linksToThis?: string[];
    notes?: string[];
    conversation?: IComment[];
    exploredParts?: IExploredDocument[];
}
