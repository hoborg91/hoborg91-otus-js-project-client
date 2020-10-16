import { Badge, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Hidden, TextField } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { IComment } from '../contracts/conversation';
import { IExploredDocument } from '../contracts/document';
import DocumentComment from './DocumentComment';
import { Comment, Input } from '@material-ui/icons';

interface IExploredDocumentProps {
    document: IExploredDocument, 
    depth?: number,
    addComment: (author: string, text: string) => any, 
}

export default class ExploredDocument extends Component<
    IExploredDocumentProps,
    {
        openAddComment: boolean,
        commentAuthor: string,
        commentText: string,
    }
> {
    private get _depth() {
        return this.props.depth || 0;
    }

    private get _caption() {
        return this.props.document.caption || null;
    }

    private get _linksToThis() {
        return this.props.document.linksToThis || ([] as string[]);
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

    constructor(props: IExploredDocumentProps) {
        super(props);
        this.state = {
            openAddComment: false,
            commentAuthor: '',
            commentText: '',
        };
    }

    private _cancelAddComment = () => {
        this.setState({
            openAddComment: false,
        });
    }

    private _addComment = () => {
        // console.log('add comment');
        // console.log(this.state.commentAuthor);
        this.props.addComment(this.state.commentAuthor, this.state.commentText);
        this.setState({
            openAddComment: false,
            commentText: '',
        });
    }

    render = () => <React.Fragment>
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
                    {this._conversation.map((c, i) => <DocumentComment comment={c} key={i}/>)}
                    <Button onClick={() => this.setState({ openAddComment: true })}>Add comment</Button>
                    <Dialog 
                        open={this.state.openAddComment} 
                        onClose={this._cancelAddComment} 
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">Add comment</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="author_nickname"
                                label="Nickname"
                                type="text"
                                fullWidth
                                value={this.state.commentAuthor}
                                onChange={(e) => this.setState({ commentAuthor: e.target.value })}
                            />
                            <TextField
                                id="outlined-multiline-static"
                                label="Comment"
                                multiline
                                rows={4}
                                value={this.state.commentText}
                                variant="outlined"
                                onChange={(e) => this.setState({ commentText: e.target.value })}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this._cancelAddComment} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this._addComment} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Hidden>
            {this._linksToThis.length + this._conversation.length > 0 &&
            <Hidden smUp>
                <Grid item xs={12}>
                    {this._linksToThis.length > 0 && 
                    <Badge badgeContent={this._linksToThis.length} color="primary">
                        <Input />
                    </Badge>}
                    {this._conversation.length > 0 && 
                    <Badge badgeContent={this._conversation.length} color="primary">
                        <Comment />
                    </Badge>}
                </Grid>
            </Hidden>}
        </Grid>
        {this.props.document.exploredParts?.map((p, i) => 
            <ExploredDocument 
                document={p} 
                depth={this._depth + 1} 
                key={i} 
                addComment={this.props.addComment}
            />
        )}
    </React.Fragment>;
}