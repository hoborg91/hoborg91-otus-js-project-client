import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './logic/store';

// import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

// const Root = ({ store }: { store: any}) => (
//   <Provider store={store}>
//     <Router>
//       <Route path="/:filter?" component={App} />
//     </Router>
//   </Provider>
// );

//ReactDOM.render(<Root store={store} />, document.getElementById('root'));

ReactDOM.render(
  //<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  //</React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
