import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import './Root.css';
import RouterComponent from './Components/RouterComponent';
import { CookiesProvider } from 'react-cookie';

const Root = ({ store }) => (
  <CookiesProvider>
    <Provider store={store}>
      <div className="App">
        <RouterComponent></RouterComponent>
      </div>
    </Provider>
  </CookiesProvider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root