import { Button, Card, CardActions, CardContent, CircularProgress, Paper, TextField, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { Component } from 'react';
import { Link } from 'react-router-dom';
import { IDocumentInfo } from '../contracts/document';
import { Description } from '@material-ui/icons';

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
}> {
    render = () => <div>
        <DocumentFilter search={this.props.search} />
        {this.props.nowSearching && <CircularProgress />}
        <DocList 
            suggestedDocuments={this.props.suggestedDocuments} />
        {this.props.recentDocuments.length > 0 && <h3>Recent documents</h3>}
        <DocList
            suggestedDocuments={this.props.recentDocuments} />
    </div>;
}

class DocumentFilter extends Component<{ search: (title: string) => any, }, { title: string, }> {
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

    render = () => <div>
        <TextField label="Enter document title" onChange={this._onChange} value={this.state.title} />
    </div>;
}

class DocumentList extends Component<{ suggestedDocuments: IDocumentInfo[], classes?: any }> {
    // render = () => <div>{ this.props.suggestedDocuments.map((d, i) => 
    //     <Paper key={i} elevation={3}>
    //         <Description />
    //         <Link to={d.userFriendlyId || ''}>{d.caption}</Link>
    //     </Paper>)}
    // </div>;

    render = () => <div>{ this.props.suggestedDocuments.map((d, i) => 
        <Card key={i} className={this.props.classes?.button || ''}>
            <CardContent>
            <Typography variant="h5" component="h2">
                <Description /> {d.caption}
            </Typography>
            </CardContent>
            <CardActions>
                <Link to={d.userFriendlyId || ''}>Go to the document</Link>
                <Button color="primary" size="small">Learn More</Button>
            </CardActions>
        </Card>)}
    </div>;
}

const DocList = withStyles(styles)(DocumentList);
