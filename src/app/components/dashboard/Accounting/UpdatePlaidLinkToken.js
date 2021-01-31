import React, { Component } from "react";
import { PlaidLink } from "react-plaid-link";

// eslint-disable-next-line react/require-render-return
export class PlaidLinkToken extends Component {



  // Log event noting account token is updated.
  handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata,
    };
    console.log("Received Public Token in Update Token: " + token, metadata);

    //this.props.addAccount(plaidData);
  };

  handleOnLoad = () => {
    console.log("Received Hand On Load in Update Token: ");
  };

  // Register User

  async render() {


    return (
      <div>
        <h1>HI</h1>
        {this.props.updateToken ? (
          <PlaidLink
            token={this.props.updateToken}
            onLoad={this.handleOnLoad}
            onSuccess={this.handleOnSuccess}
            onExit={function(err, metadata) {
              // The user exited the Link flow.
              if (err != null) {
                // The user encountered a Plaid API error prior to exiting.
                console.log(err);
                console.log("plaid link error");
              }

              console.log("plaid link exited");
              // metadata contains information about the institution
              // that the user selected and the most recent API request IDs.
              // Storing this information can be helpful for support.
            }}
            onEvent={function(eventName, metadata) {
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
            }}
          >
            Update Account Token
          </PlaidLink>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default PlaidLinkToken;
