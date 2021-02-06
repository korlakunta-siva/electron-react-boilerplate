import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Container } from 'reactstrap';
// import Container from '@material-ui/core/Container';
import NavBarMS from './NavBarMS';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import 'bootstrap/dist/css/bootstrap.css';
import withAuthProvider, { AuthComponentProps } from './AuthProvider';


import Docubrowser from './Docubrowser';
import ApexMonitoring from './ApexMonitoring';
import Prognotes from './Prognotes';
import Apexclaims from './ApexClaims';


class App extends Component<AuthComponentProps> {
  render() {
    let error = null;
    if (this.props.error) {
      error = <ErrorMessage
        message={this.props.error.message}
        debug={this.props.error.debug} />;
    }

    return (
      <Router>
        <div style={{width: "100%"}}>
          <NavBarMS
            isAuthenticated={this.props.isAuthenticated}
            authButtonMethod={this.props.isAuthenticated ? this.props.logout : this.props.login}
            user={this.props.user} />

          <div>
            <Docubrowser />
            {/* {this.props.isAuthenticated ?

              <Container className="themed-container" fluid={true}>
                {error}
                <Route exact path="/"
                  render={(props) =>
                    <Welcome {...props}
                      isAuthenticated={this.props.isAuthenticated}
                      user={this.props.user}
                      authButtonMethod={this.props.login} />
                  } />

                <Route path="/docubrowser" component={Docubrowser} />
                <Route path="/monitoring" component={ApexMonitoring} />
                <Route path="/prognotes" component={Prognotes} />
                <Route path="/claims" component={Apexclaims} />

              </Container>
              :

              <Container>
                {error}
                {/* <Route path="/prognotes" component={Prognotes} />
                <Route path="/claims" component={Apexclaims} /> */}

              </Container>
            } */}
          </div>



        </div>
      </Router>
    );
  }
}

export default withAuthProvider(App);
