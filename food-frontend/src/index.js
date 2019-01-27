import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import './index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './Redux/Reducers';
import { fetchGithubData } from './Redux/Actions';
import InitialStore from './Redux/Store/InitialStore';
require("typeface-open-sans");
require("typeface-roboto")


const store = createStore(rootReducer, InitialStore, applyMiddleware(thunk));

console.log(store)

//store.dispatch(fetchGithubData());

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

