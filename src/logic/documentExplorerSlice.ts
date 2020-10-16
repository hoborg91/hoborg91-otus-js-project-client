import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IExploredDocument } from '../contracts/document';
import { getRecentDocuments, remember } from './documentLocalStorage';
//import documents from './documents.json';

// const searchDocumentByCaption = createAsyncThunk(
//     'documentExplorer/searchDocumentByCaption',
//     async (captionToSearch, thunkAPI) => {
//       const response = await userAPI.fetchById(userId)
//       return response.data;
//     }
// );

const urlApi = (query: string) => `http://localhost/document?${query}`;

let recentCaptionToSearch : string | null = null;

interface ISearchDocumentByCaptionResponse {
    captionToSearch: string,
    message: string | null,
    documents: IExploredDocument[],
}

export const searchDocumentByCaption = createAsyncThunk(
    'documentExplorer/searchDocumentByCaption',
    async (captionToSearch: string, thunkAPI) => {
        recentCaptionToSearch = captionToSearch;
        //console.log(`thunk documentExplorer/searchDocumentByCaption ${captionToSearch}...`);
        const response = await fetch(urlApi(`captionToSearch=${captionToSearch}`));
        const documentsResponse = await response.json() as ISearchDocumentByCaptionResponse;
        return documentsResponse;
    }
);

export const getDocumentById = createAsyncThunk(
    'documentExplorer/getDocumentById',
    async (documentId: string, thunkAPI) => {
        //console.log(`thunk documentExplorer/getDocumentById ${documentId}...`);
        const response = await fetch(urlApi(`id=${documentId}`));
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
        // search: (state, action: { payload: string }) => {
        //     const searchString = action.payload.toLowerCase();
        //     state.titleToSearch = searchString;
        //     state.suggestedDocuments = documents
        //         .filter(d => d.caption.toLowerCase().indexOf(searchString) >= 0);
        // },
        beginLoad: (state) => {
            state.nowLoading = true;
        },
        // open: (state, action: { payload: string }) => {
        //     const docId = action.payload;
        //     //console.log('store.open ' + docId);
        //     const docs = documents.filter(d => d.userFriendlyId === docId);
        //     state.currentDocument = docs.length === 1
        //         ? docs[0]
        //         : null;
        //     //console.log(state.currentDocument);
        // }
    },
    extraReducers: {
        [searchDocumentByCaption.fulfilled.type]: (state, action: { payload: ISearchDocumentByCaptionResponse }) => {
            //console.log('searchDocumentByCaption.fulfilled');
            //const documents = action.payload;
            //console.log(documents.length);
            if (action.payload.captionToSearch === recentCaptionToSearch) {
                state.nowSearching = false;
                state.suggestedDocuments = action.payload.documents;
            }
        },
        [searchDocumentByCaption.rejected.type]: (state) => {
            state.nowSearching = false;
        },
        [getDocumentById.fulfilled.type]: (state, action: { payload: IExploredDocument }) => {
            //console.log('getDocumentById.fulfilled');
            const document = action.payload;
            //console.log(document);
            state.nowLoading = false;
            state.currentDocument = document === null || document === undefined
                ? null
                : document;
            remember(document);
            state.recentDocuments = getRecentDocuments();
        },
        [getDocumentById.rejected.type]: (state) => {
            state.nowLoading = false;
        }
    }
});

export const { beginSearch, beginLoad } = documentExplorerSlice.actions;

export default documentExplorerSlice.reducer;
