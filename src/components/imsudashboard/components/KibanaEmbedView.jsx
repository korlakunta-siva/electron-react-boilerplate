import React, { Component } from "react";

export default class Iframe extends Component {
  iframe_src = () => {
    let iframe_src =
      this.props.url +
      "/" +
      this.props.element_location +
      this.props.element_type +
      "/" +
      this.props.element_id;
    if (this.props.embed) {
      iframe_src += "?embed=true&";
    } else {
      iframe_src += "?";
    }
    iframe_src += "_g=(refreshInterval%3A(";
    iframe_src += this.props.refreshInterval + ")%2Ctime%3A(";
    iframe_src += this.props.time + "))";
    //return this.props.src;
    console.log(iframe_src);
    return iframe_src;
  };

  iframe_src_noembed = () => {
    let iframe_src =
      this.props.url +
      "/" +
      this.props.element_location +
      this.props.element_type +
      "/" +
      this.props.element_id;

    iframe_src += "?";

    iframe_src += "_g=(refreshInterval%3A(";
    iframe_src += this.props.refreshInterval + ")%2Ctime%3A(";
    iframe_src += this.props.time + "))";
    //return this.props.src;
    console.log(iframe_src);
    return iframe_src;
  };

  //<a  style="display:inline-block" href="https://hdpr07en03.mayo.edu:5603/app/kibana#/dashboard/98e4a9f0-d3d8-11e9-a63a-e397836c63a0?_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A300000)%2Ctime%3A(from%3Anow-24h%2Cmode%3Aquick%2Cto%3Anow))" target="_kibana" >(K)</a>

  handleRefresh = refreshInterval => {
    console.log("Refresh Called", refreshInterval);
  };

  dataLinkButton = datalink => {
    if (datalink) {
      return (
        <button
          className="badge badge-primary  badge-sm float-right"
          onClick={() => window.open(datalink, "_kibana")}
        >
          Data Link
        </button>
      );
    }
  };

  render() {
    // https://hdpr07en03.mayo.edu:5603/app/kibana#/dashboard/7f3b5300-d784-11e9-bb3e-11be430d96a3?embed=true&_g=(refreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-4h%2Cmode%3Aquick%2Cto%3Anow))"

    const isDataLink = this.props.auth_data_link;
    console.log("iframe rendered", this.props);
    return (
      <React.Fragment>
        <div>
          <button
            className="badge badge-primary badge-sm float-left"
            onClick={() => window.open(this.iframe_src_noembed(), "_kibana")}
          >
            Open in Kibana
          </button>
          {this.dataLinkButton(this.props.datalink)}
          <span className="badge badge-secondary badge-sm float-right">
            {this.props.url}
          </span>
        </div>
        <iframe
          id={this.props.element_id}
          title={this.props.element_id}
          src={this.iframe_src()}
          height={this.props.height}
          width={this.props.width}
          onLoad={() => {
            console.log("myframe is loaded" + this.props.element_id);
            //document.getElementById("#navDrawerMenu").className = "d-none";
            //document.getElementsByClassName("header-global-wrapper").className = "d-none";
          }}
        />
      </React.Fragment>
    );
  }
}
