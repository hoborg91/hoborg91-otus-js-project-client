import { Avatar, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { IComment } from '../contracts/conversation';

export default class DocumentComment extends Component<{ comment: IComment }> {
    private get _author() {
        return this.props.comment.author;
    }

    private get _authorIntials() {
        const nameParts = this._author
            .split(' ')
            .map(p => p.trim())
            .filter(p => p.length > 0)
        ;
        return (
            nameParts.length === 2
            ? nameParts
            : nameParts.slice(0, 1)
        ).map(i => i.substr(0, 1).toUpperCase());
    }

    private get _text() {
        return this.props.comment.text;
    }

    render = () => <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
            <Avatar>{this._authorIntials.concat()}</Avatar>
        </Grid>
        <Grid item xs>
            <Typography style={{ wordWrap: 'break-word', }}>{this._text}</Typography>
        </Grid>
    </Grid>;
}