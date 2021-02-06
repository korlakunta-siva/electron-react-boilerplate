// src/Login.js

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import OktaSignInWidget from './OktaSignInWidget';
import { withOktaAuth } from '@okta/okta-react';

export default withOktaAuth(class Login extends Component {
  constructor(props) {
    super(props);
    //this.onSuccess = this.onSuccess.bind(this);
    //this.onError = this.onError.bind(this);
    this.state = {
      authenticated: null
    };
    console.log('Before check authentication', this.props.auth);
    //this.checkAuthentication();
  }

  async checkAuthentication() {

    console.log('In check authentication - 1', this.props );
    const authenticated = this.props.authState.isAuthenticated;
    
    console.log('Authinfo', authenticated);
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate() {
    console.log('Before check authentication - 0');
    this.checkAuthentication();
  }

  onSuccess = (res) => {
    if (res.status === 'SUCCESS') {
        console.log('In Login -> Success', res);
        console.log('In Login -> Success Props', this.props);
      return this.props.authService.redirect({
        sessionToken: res.session.token
      });

      console.log('In Login -> Success Token', res.session.token);
   } else {
    // The user can be in another authentication state that requires further action.
    // For more information about these states, see:
    //   https://github.com/okta/okta-signin-widget#rendereloptions-success-error
    }
  }

  onError = (err) => {
    console.log('There was error logging in', err);
  }

  render() {
    console.log('In Login -> Render');
    //if (this.state.authenticated === null) return null;
    console.log('In Login -> Render2');
    return this.state.authenticated ?
      <Redirect to={{ pathname: '/' }}/> :
      <OktaSignInWidget
        baseUrl={this.props.baseUrl}
        onSuccess={this.onSuccess}
        onError={this.onError}/>;
  }
});