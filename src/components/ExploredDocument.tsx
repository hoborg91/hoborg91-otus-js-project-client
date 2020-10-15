import { Badge, Button, Chip, CircularProgress, Grid, Hidden } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { IComment } from '../contracts/conversation';
import { IExploredDocument } from '../contracts/document';
import DocumentComment from './DocumentComment';
import { Comment, Input, Note } from '@material-ui/icons';
import DocumentNote from './DocumentNote';

export default class ExploredDocument extends Component<{ 
    match?: any, 
    open?: (docId: string) => any,
    document: IExploredDocument, 
    depth?: number, 
    nowLoading?: boolean,
}> {
    private get _depth() {
        return this.props.depth || 0;
    }

    private get _caption() {
        return this.props.document.caption || null;
    }

    private get _linksToThis() {
        return this.props.document.linksToThis || ([] as string[]);
    }

    private get _notes() {
        return this.props.document.notes || ([] as string[]);
    }

    private get _conversation() {
        return this.props.document.conversation || ([] as IComment[]);
    }

    private _header = (caption: string | null) => {
        switch (this._depth) {
            case null: return <h1>{caption}</h1>;
            case undefined: return <h1>{caption}</h1>;
            case 0: return <h1>{caption}</h1>;
            case 1: return <h2>{caption}</h2>;
            case 2: return <h3>{caption}</h3>;
            case 3: return <h4>{caption}</h4>;
            case 4: return <h5>{caption}</h5>;
            default: return <h6>{caption}</h6>;
        }
    }

    componentDidMount = () => {
        if (true
            && this.props.match?.params?.documentId 
            && this.props.open 
            && (this.props.document === null || this.props.document === undefined ||
             this.props.match.params.documentId !== this.props.document.userFriendlyId)
        ) {
            console.log('doc.open ' + this.props.match.params.documentId)
            this.props.open(this.props.match.params.documentId as string);
        }
    }

    render = () => {
        if (this.props.nowLoading)
            return <CircularProgress />;
        if (this.props.document === null || this.props.document === undefined)
            return <div>There is no such document.</div>;
        return <React.Fragment>
            <Grid container spacing={3}>
                <Hidden xsDown>
                    <Grid item sm={2}>
                        <div>{this._linksToThis.map((l, i) => <Chip label={l} variant="outlined" size="small" key={i} />)}</div>
                    </Grid>
                </Hidden>
                <Grid item sm={5}>
                    {this._header(this._caption)}
                    {this.props.document.text && this.props.document.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
                </Grid>
                <Hidden xsDown>
                    <Grid item sm={5}>
                        {this._notes.map((n, i) => <DocumentNote noteText={n} key={i} />)}
                        {this._conversation.map((c, i) => <DocumentComment comment={c} key={i}/>)}
                        <Button>Add comment</Button>
                        <Button>Add note</Button>
                    </Grid>
                </Hidden>
                {this._linksToThis.length + this._conversation.length + this._notes.length > 0 &&
                <Hidden smUp>
                    <Grid item xs={12}>
                        {this._linksToThis.length > 0 && 
                        <Badge badgeContent={this._linksToThis.length} color="primary">
                            <Input />
                        </Badge>}
                        {this._notes.length > 0 && 
                        <Badge badgeContent={this._notes.length} color="primary">
                            <Note />
                        </Badge>}
                        {this._conversation.length > 0 && 
                        <Badge badgeContent={this._conversation.length} color="primary">
                            <Comment />
                        </Badge>}
                    </Grid>
                </Hidden>}
            </Grid>
            {this.props.document.exploredParts?.map((p, i) => 
                <ExploredDocument document={p} depth={this._depth + 1} key={i} />
            )}
        </React.Fragment>;
    };
}