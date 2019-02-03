import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import './Root.css';
import RouterComponent from './Components/RouterComponent';

const Root = ({ store }) => (
  <Provider store={store}>
    <div className="App">
      <RouterComponent></RouterComponent>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root