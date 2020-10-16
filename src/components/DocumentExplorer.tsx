import { Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { IDocumentInfo, IDocumentVersionInfo } from '../contracts/document';
import { Description } from '@material-ui/icons';
import { DocumentVersionsDialog } from './DocumentVersionsDialog';

const styles = {
    button: {
        margin: 10,
        maxWidth: "500px"
    },
};

export default class DocumentExplorer extends Component<{ 
    suggestedDocuments: IDocumentInfo[], 
    recentDocuments: IDocumentInfo[], 
    nowSearching: boolean,
    search: (title: string) => any, 
    open: (docId: string) => any,
}> {
    render = () => <div>
        <DocumentFilter search={this.props.search} />
        {this.props.nowSearching && <CircularProgress />}
        <DocList 
            documents={this.props.suggestedDocuments}
            open={this.props.open} />
        {this.props.recentDocuments.length > 0 && <h3>Recent documents</h3>}
        <DocList
            documents={this.props.recentDocuments}
            open={this.props.open} />
    </div>;
}

class DocumentFilter extends Component<
    { search: (title: string) => any, }, 
    { title: string, }
> {
    constructor(props: { search: (title: string) => any, }) {
        super(props);
        this.state = { title: '', };
    }

    private _timer: NodeJS.Timeout | null = null;

    private _onChange = (event: any) => {
        if (this._timer)
            clearTimeout(this._timer);
        const title = event.target.value;
        this.setState({ title });
        this._timer = setTimeout(() => {
            this.props.search(title);
        }, 400);
    }

    render = () => <TextField 
        label="Enter document title" 
        onChange={this._onChange} 
        value={this.state.title} />;
}

interface IDocumentListProps {
    documents: IDocumentInfo[], 
    classes?: any,
    open: (docId: string) => any,
}

class DocumentList extends Component<
    IDocumentListProps,
    {
        openVersionsDialog: string | null,
    }
> {
    constructor(props: IDocumentListProps) {
        super(props);
        this.state = {
            openVersionsDialog: null,
        };
    }

    private _onVersionSelected = (version: IDocumentVersionInfo | null) => {
        this.setState({ openVersionsDialog: null });
        if (version) {
            //console.log(`view.open ${version.userFriendlyId}`);
            this.props.open(version.userFriendlyId);
        }
    };
    
    render = () => <div>{ this.props.documents.map((d, i) => 
        <Card key={i} className={this.props.classes?.button || ''}>
            <CardContent>
            <Typography variant="h5" component="h2">
                <Description /> {d.caption}
            </Typography>
            </CardContent>
            <CardActions>
                <Link to={d.userFriendlyId || ''}>Go to the document</Link>
                {d.otherVersions && d.otherVersions.length > 0
                    ? <div>
                        <Button 
                            color="primary" 
                            size="small"
                            onClick={() => this.setState({ openVersionsDialog: d.userFriendlyId || null })}
                        >
                            {d.otherVersions.length} others version(s)
                        </Button>
                        <DocumentVersionsDialog 
                            open={this.state.openVersionsDialog === d.userFriendlyId} 
                            onClose={this._onVersionSelected}
                            versions={d.otherVersions}
                            for={d.caption} />
                    </div>
                    : <React.Fragment></React.Fragment>
                }
            </CardActions>
        </Card>)}
    </div>;
}

const DocList = withStyles(styles)(DocumentList);
