import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../Reducers/RootReducer';
import thunk from 'redux-thunk';
import initStore from 'InitialStore.js';

export default function configureStore() {
  console.log(initStore);
  return createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
  );
}