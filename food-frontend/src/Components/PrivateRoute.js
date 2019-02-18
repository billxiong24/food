import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { withCookies } from 'react-cookie';

const styles = {

};

class PrivateRoute extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, cookies, block, altPath, component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          (cookies.user && !block) ? (
            <Component {...props} />
          ) : (
              <Redirect
                to={{
                  pathname: altPath ? altPath : "/login",
                }}
              />
            )
        }
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cookies: ownProps.cookies.cookies,
  }
}

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(withCookies(connect(mapStateToProps, null, null, {pure:false})(PrivateRoute)));
