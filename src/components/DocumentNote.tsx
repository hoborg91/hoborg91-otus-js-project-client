import { Paper } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';

export default class DocumentNote extends Component<{ noteText: string }> {
    private get _noteText() {
        return this.props.noteText;
    }

    render = () => <Paper style={{ wordWrap: 'break-word', }}>
        {this._noteText}
    </Paper>;
}