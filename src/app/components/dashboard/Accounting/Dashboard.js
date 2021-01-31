import React, { Component } from "react";
//import PlaidLinkButton from "react-plaid-link-button";
import { PlaidLink  } from 'react-plaid-link';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getLinkToken } from "../../../redux/actions/accountActions";
import { getAccounts, addAccount } from "../../../redux/actions/accountActions";

import Accounts from "./Accounts";
import Spinner from "./Spinner";
import jwtDecode from "jwt-decode";

class Dashboard extends Component {

  componentDidMount() {
    this.props.getLinkToken();
    this.props.getAccounts();
  }

  // Logout
  // onLogoutClick = e => {
  //   e.preventDefault();
  //   this.props.logoutUser();
  // };

  // Add account
  handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata
    };

    this.props.addAccount(plaidData);
  };

  // Add account
  handleOnLoad = () => {

    console.log('Link on load called');
  };


  // Logout
  // onLogoutClick = e => {
  //   e.preventDefault();
  //   this.props.logoutUser();
  // };


  render() {
    //const { user } = this.props.auth;

    //console.log(this.props.auth);


    console.log("In Dashboard.")
    const accessToken = localStorage.getItem("accessToken");

    const decodedToken = jwtDecode(accessToken);
    console.log(decodedToken);



    const { linkToken } = this.props.plaid;



    const  user =  {
      id: decodedToken.user_id,
      avatar: '',
      email: decodedToken.email,
      name: decodedToken.username,
      username: decodedToken.username,
      role: '',
    }

    const { accounts, accountsLoading } = this.props.plaid;
    let environment = "";
    if ((linkToken.length) > 0 ) {
     environment = linkToken.substring(5,15);
    }

    let dashboardContent;
    console.log("Link Token using in Dashboard " + linkToken);

    if (accounts === null && accountsLoading) {
      dashboardContent = <Spinner />;
    } else if (accounts != null && accounts.length > 0) {
      // User has accounts linked
      dashboardContent = (
      <div>
          {/* <p className="grey-text text-darken-1">
            Hey there, {user.username} {' '} { environment }           <button
            onClick={this.onLogoutClick}
            className="btn-flat waves-effect"
          >
            <i className="material-icons left">keyboard_backspace</i> Log Out
          </button>
          </p> */}
        <Accounts user={user} accounts={accounts} linkToken={linkToken} />
      </div>);
    } else {
      // User has no accounts linked
      dashboardContent = (
        <div className="row">
          <div className="col s12 center-align">
            <h4>
              <b>Welcome,</b> <span> {user.username} {' '} { environment } </span>
            </h4>
            <p className="flow-text grey-text text-darken-1">
              To get started, link your first bank account below
            </p>

            {/* buttonProps={{
                  className:
                    "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn"
                }}

                                onScriptLoad={() => this.setState({ loaded: true })}

                                */}

            <div>
              { linkToken ? (
              <PlaidLink
                  token = { linkToken }
                  onLoad = { this.handleOnLoad }
                  onSuccess = { this.handleOnSuccess }
                  onExit = { function(err, metadata) {
                    // The user exited the Link flow.
                    if (err != null) {
                      // The user encountered a Plaid API error prior to exiting.
                      console.log(err);
                      console.log("plaid link error");
                    };

                    console.log("plaid link exited");
                    // metadata contains information about the institution
                    // that the user selected and the most recent API request IDs.
                    // Storing this information can be helpful for support.
                  } }
                  onEvent = { function(eventName, metadata) {
                    // Optionally capture Link flow events, streamed through
                    // this callback as your users connect an Item to Plaid.
                    // For example:
                    // eventName = "TRANSITION_VIEW"
                    // metadata  = {
                    //   link_session_id: "123-abc",
                    //   mfa_type:        "questions",
                    //   timestamp:       "2017-09-14T14:42:19.350Z",
                    //   view_name:       "MFA",
                    // }
                    console.log("plaid link event: " + eventName);
                  }
                }

              >
                Link Account
              </PlaidLink> ) : ""
          }
            </div>
            {/* <button
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable red accent-3 main-btn"
            >
              Logout
            </button> */}
          </div>
        </div>
      );
    }

    return <div className="container">{dashboardContent}</div>;
  }
}

Dashboard.propTypes = {
  getLinkToken: PropTypes.func.isRequired,
  getAccounts: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  auth: PropTypes.object,
  plaid: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  plaid: state.plaid
});

export default connect(
  mapStateToProps,
  { getLinkToken, getAccounts, addAccount }
)(Dashboard);
