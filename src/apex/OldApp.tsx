// src/App.js


import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppWithRouterAccess from './AppWithRouterAccess';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';

class App extends Component<AuthComponentProps> {
  render() {
    return (
      <Router basename="/" >
        <AppWithRouterAccess/>
      </Router>
    );
  }
}

//export default App;
export default withAuthProvider(App);