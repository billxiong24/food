import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const styles = {

};

class PrivateRoute extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { classes, users, block, altPath, component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          (users.id !== null && !block) ? (
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

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(connect(mapStateToProps, null, null, {pure:false})(PrivateRoute));