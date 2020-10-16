import { IDocument, IDocumentVersionInfo } from "../contracts/document"

const localStorageKey = `DocumentsApp/recentDocuments`;
const recentCount = 3;

export interface IRecentDocumentInfo {
    userFriendlyId?: string;
    caption?: string;
    otherVersions?: IDocumentVersionInfo[];
    when: Date;
}

export const remember = (document: IDocument) => {
    if (document.userFriendlyId === undefined)
        return;
    const recent = getRecentDocuments();
    let exists = false;
    recent
        .filter(r => r.userFriendlyId === document.userFriendlyId)
        .forEach(r => {
            exists = true;
            r.when = new Date();
        });
    if (!exists)
        recent.push({ ...document, when: new Date() });
    recent.sort((a, b) => (new Date(b.when).getTime() - new Date(a.when).getTime()));
    localStorage.setItem(
        localStorageKey, 
        JSON.stringify(recent.filter((_, i) => i < recentCount))
    );
}

export const getRecentDocuments = () => {
    try {
        const recentStr = localStorage.getItem(localStorageKey);
        if (recentStr === null)
            return [];
        const recent = JSON.parse(recentStr) as IRecentDocumentInfo[];
        return recent.filter((_, i) => i < recentCount);
    } catch(e) {
        console.log(e);
        localStorage.removeItem(localStorageKey);
        return [];
    }
}