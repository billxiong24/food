import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../Reducers/RootReducer';
import thunk from 'redux-thunk';

const initStore = require('./InitialStore');

export default function configureStore() {
  return createStore(
    rootReducer,
    initStore,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
}