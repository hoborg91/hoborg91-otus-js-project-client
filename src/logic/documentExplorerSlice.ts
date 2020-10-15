import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IExploredDocument } from '../contracts/document';
import { getRecentDocuments, remember } from './documentLocalStorage';
import documents from './documents.json';

// const searchDocumentByCaption = createAsyncThunk(
//     'documentExplorer/searchDocumentByCaption',
//     async (captionToSearch, thunkAPI) => {
//       const response = await userAPI.fetchById(userId)
//       return response.data;
//     }
// );

const urlApi = (relativePath: string) => `http://94.130.77.196:3000/${relativePath}`;

export const searchDocumentByCaption = createAsyncThunk(
    'documentExplorer/searchDocumentByCaption',
    async (captionToSearch: string, thunkAPI) => {
        console.log(`thunk documentExplorer/searchDocumentByCaption ${captionToSearch}...`);
        const response = await fetch(urlApi(`document?captionToSearch=${captionToSearch}`));
        const documents = await response.json() as IExploredDocument[];
        return documents;
    }
);

export const getDocumentById = createAsyncThunk(
    'documentExplorer/getDocumentById',
    async (documentId: string, thunkAPI) => {
        console.log(`thunk documentExplorer/getDocumentById ${documentId}...`);
        
        const response = await fetch(urlApi(`document?id=${documentId}`));
        const document = await response.json() as IExploredDocument;
        return document;
    }
);

export const documentExplorerSlice = createSlice({
    name: 'documentExplorer',
    initialState: {
        nowSearching: false,
        titleToSearch: '',
        suggestedDocuments: [] as IExploredDocument[],
        recentDocuments: getRecentDocuments(),
        nowLoading: false,
        currentDocument: null as (IExploredDocument | null),
    },
    reducers: {
        beginSearch: (state) => {
            state.nowSearching = true;
        },
        search: (state, action) => {
            const searchString = (action.payload as string).toLowerCase();
            state.titleToSearch = searchString;
            state.suggestedDocuments = documents
                .filter(d => d.caption.toLowerCase().indexOf(searchString) >= 0);
        },
        beginLoad: (state) => {
            state.nowLoading = true;
        },
        open: (state, action) => {
            const docId = action.payload as string;
            console.log('store.open ' + docId);
            const docs = documents.filter(d => d.userFriendlyId === docId);
            state.currentDocument = docs.length === 1
                ? docs[0]
                : null;
            console.log(state.currentDocument);
        }
    },
    extraReducers: {
        [searchDocumentByCaption.fulfilled.type]: (state, action) => {
            console.log('searchDocumentByCaption.fulfilled');
            const documents = action.payload as IExploredDocument[];
            console.log(documents.length);
            state.nowSearching = false;
            state.suggestedDocuments = documents;
        },
        [getDocumentById.fulfilled.type]: (state, action) => {
            console.log('getDocumentById.fulfilled');
            const document = action.payload as IExploredDocument;
            console.log(document);
            state.nowLoading = false;
            state.currentDocument = document === null || document === undefined
                ? null
                : document;
            remember(document);
            state.recentDocuments = getRecentDocuments();
        }
    }
});

export const { beginSearch, search, beginLoad, open } = documentExplorerSlice.actions;

export default documentExplorerSlice.reducer;
