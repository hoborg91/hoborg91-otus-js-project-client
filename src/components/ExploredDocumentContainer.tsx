import { Button, CircularProgress } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { IDocumentVersionInfo, IExploredDocument } from '../contracts/document';
import { DocumentVersionsDialog } from './DocumentVersionsDialog';
import ExploredDocument from './ExploredDocument';

interface IExploredDocumentContainerProps {
    match: any, 
    open: (docId: string) => any,
    document: IExploredDocument, 
    nowLoading: boolean,
    addComment: (author: string, text: string) => any,
}

export default class ExploredDocumentContainer extends Component<
    IExploredDocumentContainerProps,
    {
        openVersionsDialog: boolean
    }
> {
    private get _otherVersions(): IDocumentVersionInfo[] {
        return this.props.document.otherVersions === null || this.props.document.otherVersions === undefined
            ? []
            : this.props.document.otherVersions;
    }

    constructor(props: IExploredDocumentContainerProps) {
        super(props);
        this.state = {
            openVersionsDialog: false,
        };
    }

    componentDidMount = () => {
        if (true
            && this.props.match?.params?.documentId 
            && this.props.open 
            && (this.props.document === null || this.props.document === undefined ||
             this.props.match.params.documentId !== this.props.document.userFriendlyId)
        ) {
            this.props.open(this.props.match.params.documentId as string);
        }
    }

    private _onVersionSelected = (version: IDocumentVersionInfo | null) => {
        this.setState({ openVersionsDialog: false });
        if (version) {
            this.props.open(version.userFriendlyId);
        }
    }

    render = () => {
        if (this.props.nowLoading)
            return <CircularProgress />;
        if (this.props.document === null || this.props.document === undefined)
            return <div>There is no such document.</div>;
        return <div>
            {this._otherVersions.length > 0 &&
            <div>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => this.setState({ openVersionsDialog: true })}
                >
                    {this._otherVersions.length} others version(s)
                </Button>
                <DocumentVersionsDialog 
                    open={this.state.openVersionsDialog} 
                    onClose={this._onVersionSelected}
                    versions={this._otherVersions}
                    for={this.props.document.caption} />
            </div>
            }
            <ExploredDocument document={this.props.document} addComment={this.props.addComment} />
        </div>;
    };
}