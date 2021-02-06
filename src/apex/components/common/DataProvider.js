import React, { Component } from "react";
import PropTypes from "prop-types";

class DataProvider extends Component {
    static propTypes = {
        endpoint: PropTypes.string.isRequired,
        render: PropTypes.func.isRequired
    };

    state = {
        data: [],
        loaded: false,
        placeholder: "Provider Loading..."
    };

    componentDidMount() {
        console.log(this.props.endpoint)
        //For claims retrieval, following line is necessary
        //fetch(encodeURI(this.props.endpoint))
        fetch(this.props.endpoint)
            .then(response => {
                if (response.status !== 200) {
                    return this.setState({ placeholder: "Something went wrong in getting data" });
                }
                return response.json();
            })
            .then(data => { console.log(data); let dframe = data['frame0']; let myObj = JSON.parse(dframe); data = myObj['rows']; this.setState({ data: data, loaded: true });  });
    }

    render() {
        const { data, loaded, placeholder } = this.state;
        return loaded ? this.props.render(data) : <p>{placeholder}</p>;
    }
}

export default DataProvider;