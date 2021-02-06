// src/AppWithRouterAccess.jsx

import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import Home from './Home';
import Login from './Login';
import Protected from './Protected';
import Profile from './Profile';
import Messages from './Messages';
import Docubrowser from './Docubrowser';
import ApexMonitoring from './ApexMonitoring';
import Prognotes from './Prognotes';
import Apexclaims from './ApexClaims';

export default withRouter(class AppWithRouterAccess extends Component {
  constructor(props) {
    super(props);
    console.log('setting up withRouter ');
    //this.onAuthRequired = this.onAuthRequired.bind(this);
    
  }

  onAuthRequired = () => {
      console.log('This is in onAuthReq');
    this.props.history.push('/login')
  }
  
  //                  redirectUri='http://localhost:3000/implicit/callback'
  render() {
    return (
        <Security issuer='https://apexheartcare.okta.com/oauth2/default'
                  clientId='0oad16p8oaHewFPbh4x6'
                  redirectUri= 'https://react.korlakunta.com/implicit/callback'
                  onAuthRequired={this.onAuthRequired}
                  pkce={true} >
          <Route path='/' exact={true} component={Home} />
          <SecureRoute path='/protected' component={Protected} />
          <SecureRoute path='/profile' component={Profile} />
          <SecureRoute path='/docubrowser' component={Docubrowser} />
          <SecureRoute path='/monitoring' component={ApexMonitoring} />
          <SecureRoute path='/prognotes' component={Prognotes} />
          <SecureRoute path='/claims' component={Apexclaims} />
          <Route path='/messages' component={Messages} />
          <Route path='/login' render={() => <Login baseUrl='https://apexheartcare.okta.com' />} />
          <Route path='/implicit/callback' component={LoginCallback} />
        </Security>
    );
  }
}); 