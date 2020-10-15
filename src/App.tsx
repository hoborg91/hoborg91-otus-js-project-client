import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import DocumentExplorer from './components/DocumentExplorer';
import ExploredDocument from './components/ExploredDocument';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { IDocument, IDocumentInfo } from './contracts/document';
import { beginLoad, beginSearch, getDocumentById, searchDocumentByCaption } from './logic/documentExplorerSlice';

interface IAppProps_State {
    nowSearching: boolean;
    suggestedDocuments: IDocumentInfo[];
    recentDocuments: IDocumentInfo[];
    nowLoading: boolean;
    currentDocument: IDocument;
}

interface IAppProps_Router {
    match: { params: any };
}

interface IAppProps_Dispatch {
    search: (title: string) => any;
    open: (docId: string) => any;
}

class App extends Component<IAppProps_State & IAppProps_Router & IAppProps_Dispatch> {
    render = () => <Router>
        <Switch>
            <Route path="/:documentId" render={(props) => (
                <ExploredDocument 
                    {...props} 
                    document={this.props.currentDocument}
                    open={this.props.open}
                    nowLoading={this.props.nowLoading} />
            )} />
            <Route path="/">
                <DocumentExplorer 
                    nowSearching={this.props.nowSearching}
                    suggestedDocuments={this.props.suggestedDocuments} 
                    search={this.props.search}
                    recentDocuments={this.props.recentDocuments} />
            </Route>
        </Switch>
    </Router>
}

function mapStateToProps(state: any, ownProps: any): IAppProps_State {
    //console.log(ownProps);
    return {
        nowSearching: state.nowSearching,
        suggestedDocuments: state.suggestedDocuments,
        recentDocuments: state.recentDocuments,
        nowLoading: state.nowLoading,
        currentDocument: state.currentDocument,
    };
}

function mapDispatchToProps(dispatch: any, ownProps: any): IAppProps_Dispatch {
    //console.log(ownProps);
    return {
      // dispatching plain actions
      search: (title: string) => {
          dispatch(beginSearch());
          dispatch(searchDocumentByCaption(title));
      },// dispatch(search(title)),
      open: (docId: string) => {
          dispatch(beginLoad());
          dispatch(getDocumentById(docId));
      },// dispatch(open(docId)),
    }
  }

export default connect(mapStateToProps, mapDispatchToProps)(App);

// class App extends Component<any> {
//     render = () => {
//         //console.log(this.props.match);
//     return <div>
//         App! {this.props.what}
//     </div>;
//     }
// }

// const mapStateToProps = (state: any, ownProps: any) => {
//     console.log(ownProps);
//     return {
//     what: 'idontknow',
// }};

// const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
//     //toggleTodo: id => dispatch(toggleTodo(id))
// });
  
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(App);