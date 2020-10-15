import { Grid, Hidden, Paper } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { IDocument } from '../contracts/document';

export default class Document extends Component<{ document: IDocument, depth?: number, }> {
    private get _depth() {
        return this.props.depth || 0;
    }

    private _header = (caption: string) => {
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

    render = () => <div>
        <Grid container spacing={3}>
            <Hidden xsDown>
                <Grid item sm={2}>
                    <Paper>sm=4</Paper>
                </Grid>
            </Hidden>
            <Hidden xsDown>
                <Grid item sm={5}>
                    <Paper>sm=4</Paper>
                </Grid>
            </Hidden>
            <Hidden xsDown>
                <Grid item sm={5}>
                    <Paper>sm=4</Paper>
                </Grid>
            </Hidden>
        </Grid>
        {this.props.document.caption && this._header(this.props.document.caption)}
        {this.props.document.text && this.props.document.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}
        {this.props.document.parts?.map((p, i) => <Document document={p} depth={this._depth + 1} key={i} />)}
    </div>;
}
